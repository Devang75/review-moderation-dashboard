export interface IReview {
  _id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  flags: string[];
  moderatorReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult {
  data: IReview[];
  total: number;
  page: number;
  limit: number;
}

export interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export interface ReviewFormValues {
  productId: string;
  author: string;
  rating: number | '';
  text: string;
}

export interface RejectFormValues {
  reason: string;
}
