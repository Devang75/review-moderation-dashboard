import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import ApiError from '../utils/ApiError.js';

const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction): void => {
  const validSchema = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!validSchema.success) {
    const errorMessages = validSchema.error.issues.map((issue) => {
      const field = issue.path.slice(1).join('.') || issue.path.join('.');
      return {
        field,
        message: issue.message,
      } as const;
    });
    return next(new ApiError(400, 'Validation Error', errorMessages));
  }

  Object.assign(req, validSchema.data);
  return next();
};

export default validate;
