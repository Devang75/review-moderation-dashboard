import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  productId: string;
  author: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  flags: string[];
  moderatorReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'] as const,
      default: 'pending',
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    flags: {
      type: [String],
      default: [],
    },
    moderatorReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ riskScore: -1 });

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
