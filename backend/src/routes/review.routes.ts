import express from 'express';
import {
  createReview,
  listReviews,
  getReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  getFlaggedReviews,
} from '../controllers/review.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewSchema,
  listReviewsSchema,
  approveReviewSchema,
  rejectReviewSchema,
  getFlaggedReviewsSchema,
} from '../validations/review.validation.js';

const router = express.Router();

/**
 * @openapi
 * /reviews/flagged:
 *   get:
 *     tags: [Reviews]
 *     summary: Get flagged reviews
 *     description: Retrieve reviews with a risk score above a threshold
 *     parameters:
 *       - in: query
 *         name: scoreGt
 *         schema:
 *           type: string
 *         description: Minimum risk score filter (default 60)
 *     responses:
 *       200:
 *         description: Flagged reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 */
router.route('/flagged')
  .get(validate(getFlaggedReviewsSchema), getFlaggedReviews);

/**
 * @openapi
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a new review
 *     description: Creates a product review with automatic risk scoring
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *   get:
 *     tags: [Reviews]
 *     summary: List reviews
 *     description: Retrieve paginated list of all reviews
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: Items per page (default 10)
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PaginatedReviews'
 */
router.route('/')
  .post(validate(createReviewSchema), createReview)
  .get(validate(listReviewsSchema), listReviews);

/**
 * @openapi
 * /reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get a review by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review MongoDB ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Review not found
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.route('/:id')
  .get(validate(getReviewSchema), getReview)
  .put(validate(updateReviewSchema), updateReview)
  .delete(validate(getReviewSchema), deleteReview);

/**
 * @openapi
 * /reviews/{id}/approve:
 *   post:
 *     tags: [Reviews]
 *     summary: Approve a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review approved successfully
 *       404:
 *         description: Review not found
 */
router.route('/:id/approve')
  .post(validate(approveReviewSchema), approveReview);

/**
 * @openapi
 * /reviews/{id}/reject:
 *   post:
 *     tags: [Reviews]
 *     summary: Reject a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RejectInput'
 *     responses:
 *       200:
 *         description: Review rejected successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Review not found
 */
router.route('/:id/reject')
  .post(validate(rejectReviewSchema), rejectReview);

export default router;
