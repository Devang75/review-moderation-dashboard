import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import type { ApiErrorPayload } from '../../services/api';
import type { IReview, PaginatedResult } from '../../types';

const LIMIT = 9;

interface ReviewState {
  items: IReview[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  flaggedItems: IReview[];
  flaggedLoading: boolean;
  viewMode: 'all' | 'flagged';
}

const initialState: ReviewState = {
  items: [],
  total: 0,
  page: 1,
  limit: LIMIT,
  loading: false,
  error: null,
  flaggedItems: [],
  flaggedLoading: false,
  viewMode: 'all',
};

const toThunkError = (error: unknown): ApiErrorPayload => {
  const err = error as Error & ApiErrorPayload;
  return {
    message: err.message || 'Operation failed',
    errors: err.errors || [],
  };
};

export const fetchReviews = createAsyncThunk<PaginatedResult & { page: number }, number, { rejectValue: string }>(
  'reviews/fetchReviews',
  async (page, { rejectWithValue }) => {
    try {
      const result = await api.fetchReviews(page, LIMIT);
      return { ...result, page };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchFlaggedReviews = createAsyncThunk<IReview[], number | undefined, { rejectValue: string }>(
  'reviews/fetchFlaggedReviews',
  async (scoreGt, { rejectWithValue }) => {
    try {
      return await api.fetchFlaggedReviews(scoreGt);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createReview = createAsyncThunk<IReview, Record<string, unknown>, { rejectValue: ApiErrorPayload }>(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      return await api.createReview(reviewData);
    } catch (error) {
      return rejectWithValue(toThunkError(error));
    }
  }
);

export const updateReview = createAsyncThunk<IReview, { id: string; data: Record<string, unknown> }, { rejectValue: ApiErrorPayload }>(
  'reviews/updateReview',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await api.updateReview(id, data);
    } catch (error) {
      return rejectWithValue(toThunkError(error));
    }
  }
);

export const approveReview = createAsyncThunk<IReview, string, { rejectValue: string }>(
  'reviews/approveReview',
  async (id, { rejectWithValue }) => {
    try {
      return await api.approveReview(id);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const rejectReviewThunk = createAsyncThunk<IReview, { id: string; reason: string }, { rejectValue: string }>(
  'reviews/rejectReview',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      return await api.rejectReview(id, reason);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteReview = createAsyncThunk<string, string, { rejectValue: string }>(
  'reviews/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteReview(id);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setViewMode(state, action: PayloadAction<'all' | 'flagged'>) {
      state.viewMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchFlaggedReviews.pending, (state) => {
        state.flaggedLoading = true;
        state.error = null;
      })
      .addCase(fetchFlaggedReviews.fulfilled, (state, action) => {
        state.flaggedLoading = false;
        state.flaggedItems = action.payload;
      })
      .addCase(fetchFlaggedReviews.rejected, (state, action) => {
        state.flaggedLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(approveReview.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(rejectReviewThunk.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { setPage, clearError, setViewMode } = reviewSlice.actions;
export default reviewSlice.reducer;
