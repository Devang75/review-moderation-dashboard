import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchReviews,
  fetchFlaggedReviews,
  createReview,
  updateReview,
  approveReview,
  rejectReviewThunk,
  deleteReview,
  setPage,
  setViewMode,
} from './store/slices/reviewSlice';
import {
  openAddModal,
  openEditModal,
  closeReviewModal,
  openDetailModal,
  closeDetailModal,
  openRejectModal,
  closeRejectModal,
  addToast,
  removeToast,
} from './store/slices/uiSlice';
import Header from './components/Header';
import ReviewCard from './components/ReviewCard';
import ReviewModal from './components/ReviewModal';
import ReviewDetailModal from './components/ReviewDetailModal';
import RejectModal from './components/RejectModal';
import Pagination from './components/Pagination';
import ToastList from './components/ToastList';
import type { IReview, ReviewFormValues, RejectFormValues } from './types';

function App() {
  const dispatch = useAppDispatch();
  const { items: reviews, total, page, limit, loading, flaggedItems, flaggedLoading, viewMode } = useAppSelector((s) => s.reviews);
  const {
    isReviewModalOpen,
    editingReview,
    detailReview,
    isDetailOpen,
    rejectReviewId,
    isRejectOpen,
    toasts,
  } = useAppSelector((s) => s.ui);

  const [scoreGt, setScoreGt] = useState(60);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (viewMode === 'all') {
      dispatch(fetchReviews(page));
    } else {
      dispatch(fetchFlaggedReviews(scoreGt));
    }
  }, [dispatch, page, viewMode, scoreGt]);

  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    dispatch(addToast({ type, message }));
    setTimeout(() => dispatch(removeToast(id)), 4000);
  };

  const reviewInitialValues: ReviewFormValues = editingReview
    ? {
        productId: editingReview.productId,
        author: editingReview.author,
        rating: editingReview.rating,
        text: editingReview.text,
      }
    : { productId: '', author: '', rating: '', text: '' };

  const handleReviewSubmit = async (values: ReviewFormValues) => {
    const payload = {
      productId: values.productId.trim(),
      author: values.author.trim(),
      rating: Number(values.rating),
      text: values.text.trim(),
    };

    if (editingReview) {
      const result = await dispatch(updateReview({ id: editingReview._id, data: payload }));
      if (updateReview.fulfilled.match(result)) {
        showToast('success', 'Review updated successfully');
        dispatch(closeReviewModal());
      } else {
        throw result.payload;
      }
    } else {
      const result = await dispatch(createReview(payload));
      if (createReview.fulfilled.match(result)) {
        showToast('success', 'Review created successfully');
        dispatch(closeReviewModal());
      } else {
        throw result.payload;
      }
    }
  };

  const handleRejectSubmit = async (values: RejectFormValues) => {
    if (!rejectReviewId) return;
    const result = await dispatch(rejectReviewThunk({ id: rejectReviewId, reason: values.reason.trim() }));
    if (rejectReviewThunk.fulfilled.match(result)) {
      showToast('success', 'Review rejected successfully');
      dispatch(closeRejectModal());
    } else {
      throw result.payload;
    }
  };

  const handleApprove = async (id: string) => {
    const result = await dispatch(approveReview(id));
    if (approveReview.fulfilled.match(result)) {
      showToast('success', 'Review approved successfully');
    } else {
      showToast('error', (result.payload as string) ?? 'Failed to approve review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    const result = await dispatch(deleteReview(id));
    if (deleteReview.fulfilled.match(result)) {
      showToast('success', 'Review deleted successfully');
    } else {
      showToast('error', (result.payload as string) ?? 'Failed to delete review');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <ToastList toasts={toasts} onCloseToast={(id: number) => dispatch(removeToast(id))} />
      <Header onAddClick={() => dispatch(openAddModal())} />

      <div className="flex items-center gap-3 mb-6 bg-bg-card rounded-xl p-1.5 border border-white/8 w-fit">
        <button
          className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 border-none ${
            viewMode === 'all'
              ? 'bg-brand-primary text-white shadow-[0_2px_8px_rgba(139,92,246,0.3)]'
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}
          onClick={() => dispatch(setViewMode('all'))}
        >
          All Reviews
        </button>
        <button
          className={`px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 border-none flex items-center gap-2 ${
            viewMode === 'flagged'
              ? 'bg-brand-primary text-white shadow-[0_2px_8px_rgba(139,92,246,0.3)]'
              : 'bg-transparent text-gray-400 hover:text-white'
          }`}
          onClick={() => dispatch(setViewMode('flagged'))}
        >
          Flagged (risk &ge;
          <input
            type="number"
            min={0}
            max={100}
            value={scoreGt}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setScoreGt(Number(e.target.value) || 0)}
            className="w-12 bg-transparent border-b border-white/30 text-white text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          )
          {flaggedItems.length > 0 && (
            <span className="text-[11px] bg-red-500 text-white px-2 py-0.5 rounded-full">{flaggedItems.length}</span>
          )}
        </button>
      </div>

      {viewMode === 'all' ? (
        loading ? (
          <div className="text-center py-20 text-gray-400 text-lg"><p>Loading reviews...</p></div>
        ) : reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {reviews.map((review: IReview) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onView={() => dispatch(openDetailModal(review))}
                  onEdit={() => dispatch(openEditModal(review))}
                  onApprove={handleApprove}
                  onReject={(r: IReview) => dispatch(openRejectModal(r._id))}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={(p: number) => dispatch(setPage(p))} />
          </>
        ) : (
          <div className="text-center py-20 px-8 bg-bg-card border border-dashed border-white/8 rounded-2xl mt-8">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2 text-white">No reviews found</h3>
            <p className="text-gray-400 text-[15px] max-w-sm mx-auto">
              Start by clicking the &quot;Add Review&quot; button above to create a new product review.
            </p>
          </div>
        )
      ) : (
        flaggedLoading ? (
          <div className="text-center py-20 text-gray-400 text-lg"><p>Loading flagged reviews...</p></div>
        ) : flaggedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {flaggedItems.map((review: IReview) => (
              <ReviewCard
                key={review._id}
                review={review}
                onView={() => dispatch(openDetailModal(review))}
                onEdit={() => dispatch(openEditModal(review))}
                onApprove={handleApprove}
                onReject={(r: IReview) => dispatch(openRejectModal(r._id))}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-8 bg-bg-card border border-dashed border-white/8 rounded-2xl mt-8">
            <div className="text-5xl mb-4">🚩</div>
            <h3 className="text-xl font-semibold mb-2 text-white">No flagged reviews</h3>
            <p className="text-gray-400 text-[15px] max-w-sm mx-auto">
              All reviews have a risk score below 60. Flagged reviews will appear here.
            </p>
          </div>
        )
      )}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => dispatch(closeReviewModal())}
        onSubmit={handleReviewSubmit}
        initialValues={reviewInitialValues}
      />

      <ReviewDetailModal isOpen={isDetailOpen} review={detailReview} onClose={() => dispatch(closeDetailModal())} />

      <RejectModal
        isOpen={isRejectOpen}
        onClose={() => dispatch(closeRejectModal())}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
}

export default App;
