interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-sm text-navy-400">{message}</p>
    </div>
  );
}