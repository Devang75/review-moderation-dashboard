import type { IReview } from '../types';

interface ReviewDetailModalProps {
  isOpen: boolean;
  review: IReview | null;
  onClose: () => void;
}

export default function ReviewDetailModal({ isOpen, review, onClose }: ReviewDetailModalProps) {
  if (!isOpen || !review) return null;

  const getStatusColor = () => {
    switch (review.status) {
      case 'approved': return 'text-emerald-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#070a12]/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-bg-modal border border-white/8 rounded-[20px] w-full max-w-[600px] p-8 shadow-2xl relative animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Review Details</h2>
          <button className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-white transition-colors duration-200 p-1 flex items-center justify-center" onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Product ID</span><span className="text-white">{review.productId}</span></div>
            <div><span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Author</span><span className="text-white">{review.author}</span></div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Rating</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="18" height="18" fill={star <= review.rating ? '#f59e0b' : 'none'} viewBox="0 0 24 24" stroke={star <= review.rating ? '#f59e0b' : '#4b5563'} strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Review Text</span>
            <p className="text-white bg-white/3 rounded-lg p-4 border border-white/8 whitespace-pre-wrap">{review.text}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</span><span className={`font-semibold ${getStatusColor()}`}>{review.status}</span></div>
            <div><span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Risk Score</span><span className={`font-semibold ${review.riskScore >= 60 ? 'text-red-400' : 'text-gray-300'}`}>{review.riskScore} / 100</span></div>
          </div>

          {review.flags.length > 0 && (
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Flags</span>
              <ul className="space-y-1">
                {review.flags.map((flag, i) => (
                  <li key={i} className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-1.5 border border-red-500/20">⚠ {flag}</li>
                ))}
              </ul>
            </div>
          )}

          {review.moderatorReason && (
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Moderator Reason</span>
              <p className="text-yellow-400 bg-yellow-500/10 rounded-lg px-3 py-2 border border-yellow-500/20">{review.moderatorReason}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div><span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Created At</span><span className="text-gray-300 text-sm">{new Date(review.createdAt).toLocaleString()}</span></div>
            <div><span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Updated At</span><span className="text-gray-300 text-sm">{new Date(review.updatedAt).toLocaleString()}</span></div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 bg-white/5 text-gray-100 border border-white/8 hover:bg-white/10" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
