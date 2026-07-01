import Review, { IReview } from '../models/review.model.js';
import ApiError from '../utils/ApiError.js';
import riskScoringService from './riskScoring.service.js';

interface ListReviewsQuery {
  page?: string;
  limit?: string;
}

interface PaginatedResult {
  data: IReview[];
  total: number;
  page: number;
  limit: number;
}

interface CreateReviewBody {
  productId: string;
  author: string;
  rating: number;
  text: string;
}

type ReviewUpdatableFields = Partial<CreateReviewBody> & {
  riskScore?: number;
  flags?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  moderatorReason?: string;
};

class ReviewService {
  async createReview(reviewBody: CreateReviewBody): Promise<IReview> {
    const { riskScore, flags } = riskScoringService.calculateRiskScore(reviewBody.text);
    const review = await Review.create({
      ...reviewBody,
      riskScore,
      flags,
    });
    return review;
  }

  async listReviews(query: ListReviewsQuery): Promise<PaginatedResult> {
    const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10) || 10));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Review.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments(),
    ]);

    return { data, total, page, limit };
  }

  async getReviewById(id: string): Promise<IReview> {
    const review = await Review.findById(id);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }
    return review;
  }

  async updateReviewById(id: string, updateBody: Partial<CreateReviewBody>): Promise<IReview> {
    const review = await this.getReviewById(id);

    const fieldsToUpdate: ReviewUpdatableFields = { ...updateBody };

    if (updateBody.text) {
      const { riskScore, flags } = riskScoringService.calculateRiskScore(updateBody.text);
      fieldsToUpdate.riskScore = riskScore;
      fieldsToUpdate.flags = flags;
    }

    Object.assign(review, fieldsToUpdate);
    await review.save();
    return review;
  }

  async deleteReviewById(id: string): Promise<IReview> {
    const review = await this.getReviewById(id);
    await review.deleteOne();
    return review;
  }

  async approveReview(id: string): Promise<IReview> {
    const review = await this.getReviewById(id);
    review.status = 'approved';
    review.moderatorReason = '';
    await review.save();
    return review;
  }

  async rejectReview(id: string, reason: string): Promise<IReview> {
    const review = await this.getReviewById(id);
    review.status = 'rejected';
    review.moderatorReason = reason;
    await review.save();
    return review;
  }

  async getFlaggedReviews(scoreGt?: string): Promise<IReview[]> {
    const minScore = parseInt(scoreGt || '60', 10) || 60;
    const reviews = await Review.find({
      riskScore: { $gte: minScore },
    }).sort({ riskScore: -1 });
    return reviews;
  }
}

export default new ReviewService();
