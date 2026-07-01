import axios from 'axios';
import type { PaginatedResult, IReview } from '../types';

export interface ApiErrorPayload {
  message: string;
  errors?: { field?: string; message: string }[];
}

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/reviews`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params || '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    const body = response.data;
    return {
      ...response,
      data: body.data ?? body,
    };
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (import.meta.env.VITE_DEV) {
      console.error(`[API] Error:`, error.config?.url, error.response?.status, error.response?.data);
    }

    const payload: ApiErrorPayload = {
      message: 'Something went wrong',
      errors: [],
    };

    if (error.response) {
      const body = error.response.data;
      payload.message = body?.message || error.message || `Request failed with status ${error.response.status}`;
      payload.errors = body?.errors || [];
    } else if (error.request) {
      payload.message = 'No response from server. Please check your connection.';
    } else {
      payload.message = error.message || 'An unexpected error occurred';
    }

    const apiError = new Error(payload.message) as Error & ApiErrorPayload;
    apiError.errors = payload.errors;
    return Promise.reject(apiError);
  }
);

export async function fetchFlaggedReviews(scoreGt = 60): Promise<IReview[]> {
  const response = await API.get('/flagged', { params: { scoreGt } });
  return response.data as IReview[];
}

export async function fetchReviews(page = 1, limit = 10): Promise<PaginatedResult> {
  const response = await API.get('/', { params: { page, limit } });
  return response.data as PaginatedResult;
}

export async function createReview(reviewData: Record<string, unknown>): Promise<IReview> {
  const response = await API.post('/', reviewData);
  return response.data as IReview;
}

export async function updateReview(id: string, reviewData: Record<string, unknown>): Promise<IReview> {
  const response = await API.put(`/${id}`, reviewData);
  return response.data as IReview;
}

export async function getReview(id: string): Promise<IReview> {
  const response = await API.get(`/${id}`);
  return response.data as IReview;
}

export async function approveReview(id: string): Promise<IReview> {
  const response = await API.post(`/${id}/approve`);
  return response.data as IReview;
}

export async function rejectReview(id: string, reason: string): Promise<IReview> {
  const response = await API.post(`/${id}/reject`, { reason });
  return response.data as IReview;
}

export async function deleteReview(id: string): Promise<void> {
  const response = await API.delete(`/${id}`);
  return response.data as void;
}
