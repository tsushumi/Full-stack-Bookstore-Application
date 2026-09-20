export function LoadingSpinner({ label = "Loading books..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-stone-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-14 text-center">
      <span className="text-2xl">⚠️</span>
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = "No books found." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-stone-500">
      <span className="text-3xl">📭</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
