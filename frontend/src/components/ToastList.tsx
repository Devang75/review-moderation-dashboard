import type { Toast } from '../types';

interface ToastListProps {
  toasts: Toast[];
  onCloseToast: (id: number) => void;
}

export default function ToastList({ toasts, onCloseToast }: ToastListProps) {
  return (
    <div className="fixed bottom-8 right-8 z-[1100] flex flex-col gap-3 max-w-[380px] w-full p-4 md:p-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-bg-modal border border-white/8 rounded-xl p-4 flex items-center gap-3 shadow-2xl text-white animate-slide-in relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${toast.type === 'success' ? 'before:bg-emerald-500' : 'before:bg-red-500'}`}
          role="alert"
        >
          <div className="flex-grow text-sm">{toast.type === 'success' ? '🟢' : '🔴'} {toast.message}</div>
          <button className="bg-transparent border-none text-gray-400 cursor-pointer flex hover:text-white transition-colors duration-200" onClick={() => onCloseToast(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

