import * as yup from 'yup';

export const reviewValidationSchema = yup.object({
  productId: yup
    .string()
    .trim()
    .required('Product ID is required'),
  author: yup
    .string()
    .trim()
    .required('Author is required'),
  rating: yup
    .number()
    .typeError('Rating must be a number')
    .integer('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .required('Rating is required'),
  text: yup
    .string()
    .trim()
    .required('Review text is required'),
});

export const rejectValidationSchema = yup.object({
  reason: yup
    .string()
    .trim()
    .required('Reason is required for rejection'),
});
