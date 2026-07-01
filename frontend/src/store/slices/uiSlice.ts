import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IReview, Toast } from '../../types';

interface UiState {
  isReviewModalOpen: boolean;
  editingReview: IReview | null;
  detailReview: IReview | null;
  isDetailOpen: boolean;
  rejectReviewId: string | null;
  isRejectOpen: boolean;
  toasts: Toast[];
}

const initialState: UiState = {
  isReviewModalOpen: false,
  editingReview: null,
  detailReview: null,
  isDetailOpen: false,
  rejectReviewId: null,
  isRejectOpen: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddModal(state) {
      state.isReviewModalOpen = true;
      state.editingReview = null;
    },
    openEditModal(state, action: PayloadAction<IReview>) {
      state.isReviewModalOpen = true;
      state.editingReview = action.payload;
    },
    closeReviewModal(state) {
      state.isReviewModalOpen = false;
      state.editingReview = null;
    },
    openDetailModal(state, action: PayloadAction<IReview>) {
      state.detailReview = action.payload;
      state.isDetailOpen = true;
    },
    closeDetailModal(state) {
      state.detailReview = null;
      state.isDetailOpen = false;
    },
    openRejectModal(state, action: PayloadAction<string>) {
      state.rejectReviewId = action.payload;
      state.isRejectOpen = true;
    },
    closeRejectModal(state) {
      state.rejectReviewId = null;
      state.isRejectOpen = false;
    },
    addToast(state, action: PayloadAction<{ type: Toast['type']; message: string }>) {
      const toast: Toast = { id: Date.now(), ...action.payload };
      state.toasts.push(toast);
    },
    removeToast(state, action: PayloadAction<number>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  openAddModal,
  openEditModal,
  closeReviewModal,
  openDetailModal,
  closeDetailModal,
  openRejectModal,
  closeRejectModal,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
