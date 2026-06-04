import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  ariaLabel: string;
  onClick: () => void;
}

export function BackButton({ ariaLabel, onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted transition-colors active:bg-border"
    >
      <ArrowLeft size={20} />
    </button>
  );
}
