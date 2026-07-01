import { Request, Response } from 'express';
import reviewService from '../services/review.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.body);
  res.status(201).json(new ApiResponse(201, review, 'Review created successfully'));
});

const listReviews = asyncHandler(async (req: Request, res: Response) => {
  const result = await reviewService.listReviews(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Reviews retrieved successfully'));
});

const getReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.getReviewById(req.params.id as string);
  res.status(200).json(new ApiResponse(200, review, 'Review retrieved successfully'));
});

const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.updateReviewById(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse(200, review, 'Review updated successfully'));
});

const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  await reviewService.deleteReviewById(req.params.id as string);
  res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'));
});

const approveReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.approveReview(req.params.id as string);
  res.status(200).json(new ApiResponse(200, review, 'Review approved successfully'));
});

const rejectReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.rejectReview(req.params.id as string, req.body.reason);
  res.status(200).json(new ApiResponse(200, review, 'Review rejected successfully'));
});

const getFlaggedReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.getFlaggedReviews(req.query.scoreGt as string | undefined);
  res.status(200).json(new ApiResponse(200, reviews, 'Flagged reviews retrieved successfully'));
});

export {
  createReview,
  listReviews,
  getReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  getFlaggedReviews,
};
