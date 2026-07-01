import { z } from 'zod';

const createReviewSchema = z.object({
  body: z.object({
    productId: z.string({
      required_error: 'Product ID is required',
    }).trim().min(1, 'Product ID cannot be empty'),
    author: z.string({
      required_error: 'Author is required',
    }).trim().min(1, 'Author cannot be empty'),
    rating: z.number({
      required_error: 'Rating is required',
    }).int('Rating must be an integer').min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    text: z.string({
      required_error: 'Review text is required',
    }).trim().min(1, 'Review text cannot be empty'),
  }),
});

const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID format'),
  }),
  body: z.object({
    productId: z.string().trim().min(1).optional(),
    author: z.string().trim().min(1).optional(),
    rating: z.number().int('Rating must be an integer').min(1).max(5).optional(),
    text: z.string().trim().min(1).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

const getReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID format'),
  }),
});

const listReviewsSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
  }),
});

const approveReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID format'),
  }),
});

const rejectReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid review ID format'),
  }),
  body: z.object({
    reason: z.string({
      required_error: 'Reason is required for rejection',
    }).trim().min(1, 'Reason cannot be empty'),
  }),
});

const getFlaggedReviewsSchema = z.object({
  query: z.object({
    scoreGt: z.string().optional(),
  }),
});

export {
  createReviewSchema,
  updateReviewSchema,
  getReviewSchema,
  listReviewsSchema,
  approveReviewSchema,
  rejectReviewSchema,
  getFlaggedReviewsSchema,
};
