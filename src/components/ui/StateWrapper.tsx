import { type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface StateWrapperProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
  skeleton?: ReactNode;
}

export function StateWrapper({
  loading,
  error,
  empty,
  emptyMessage = 'Nothing here yet.',
  onRetry,
  children,
  skeleton,
}: StateWrapperProps) {
  if (loading && skeleton) return <>{skeleton}</>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7 text-red-600" />
        </div>
        <p className="text-navy-700 font-semibold mb-1">Something went wrong</p>
        <p className="text-sm text-navy-500 mb-4 max-w-sm">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-secondary text-sm">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <AlertCircle className="h-7 w-7 text-slate-400" />
        </div>
        <p className="text-navy-700 font-semibold mb-1">No results found</p>
        <p className="text-sm text-navy-500 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
