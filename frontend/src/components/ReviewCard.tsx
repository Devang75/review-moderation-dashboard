import type { IReview } from '../types';

interface ReviewCardProps {
  review: IReview;
  onView: (review: IReview) => void;
  onEdit: (review: IReview) => void;
  onApprove: (id: string) => void;
  onReject: (review: IReview) => void;
  onDelete: (id: string) => void;
}

export default function ReviewCard({ review, onView, onEdit, onApprove, onReject, onDelete }: ReviewCardProps) {
  const isHighRisk = review.riskScore >= 60;

  const getStatusBadge = () => {
    switch (review.status) {
      case 'approved': return <span className="text-[11px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full tracking-wider">Approved</span>;
      case 'rejected': return <span className="text-[11px] uppercase font-bold text-red-400 bg-red-400/10 px-3 py-1 rounded-full tracking-wider">Rejected</span>;
      default: return <span className="text-[11px] uppercase font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full tracking-wider">Pending</span>;
    }
  };

  return (
    <div
      className={`rounded-2xl p-6 flex flex-col h-full transition-all duration-300 border relative overflow-hidden ${
        isHighRisk
          ? 'bg-red-900/20 border-red-500/30'
          : 'bg-bg-card border-white/8'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{review.author}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">ID: {review.productId}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="14" height="14" fill={star <= review.rating ? '#f59e0b' : 'none'} viewBox="0 0 24 24" stroke={star <= review.rating ? '#f59e0b' : '#4b5563'} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        ))}
      </div>

      <p className="text-sm text-gray-300 mb-4 flex-grow line-clamp-3">{review.text}</p>

      <div className="flex items-center gap-2 mb-4">
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
          Risk: {review.riskScore}
        </div>
        {review.flags.length > 0 && (
          <span className="text-xs text-red-400 truncate max-w-[180px]" title={review.flags.join(', ')}>
            ⚑ {review.flags.length} flag{review.flags.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/8 mt-auto">
        <button className="inline-flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 bg-white/5 text-gray-100 border border-white/8 hover:bg-white/10 text-xs" title="View Details" onClick={() => onView(review)}>View</button>
        <button className="inline-flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 bg-white/5 text-gray-100 border border-white/8 hover:bg-white/10 text-xs" title="Edit" onClick={() => onEdit(review)}>Edit</button>
        {review.status === 'pending' && (
          <>
            <button className="inline-flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs" title="Approve" onClick={() => onApprove(review._id)}>Approve</button>
            <button className="inline-flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs" title="Reject" onClick={() => onReject(review)}>Reject</button>
          </>
        )}
        <button className="inline-flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/10 text-xs ml-auto" title="Delete" onClick={() => onDelete(review._id)}>Delete</button>
      </div>
    </div>
  );
}
