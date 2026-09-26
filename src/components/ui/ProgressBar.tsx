interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'bg-blue-600',
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${heights[size]} bg-slate-200 rounded-full overflow-hidden`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-navy-500">
          <span>{Math.round(percentage)}%</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
    </div>
  );
}
