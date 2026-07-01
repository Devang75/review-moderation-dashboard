interface HeaderProps {
  onAddClick: () => void;
}

export default function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-10 border-b border-white/8 pb-6 flex-wrap gap-6">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-brand-primary to-brand-accent w-[42px] h-[42px] rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-[0_4px_15px_rgba(139,92,246,0.4)]">
          R
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          Review Moderation Dashboard
        </h1>
      </div>
      <button
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 bg-gradient-to-br from-brand-primary to-[#7c3aed] text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] border-none outline-none"
        onClick={onAddClick}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
        Add Review
      </button>
    </header>
  );
}
