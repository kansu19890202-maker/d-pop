export function HeartIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12.1 21.35 10 19.45C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8 10.95z" />
    </svg>
  );
}

export function HeartOutlineIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12.1 20.55 10 18.65C5.4 14.56 2 11.48 2 7.7 2 4.62 4.42 2.2 7.5 2.2c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09C19.58 2.2 22 4.62 22 7.7c0 3.78-3.4 6.86-8 10.95z" />
    </svg>
  );
}

export function EyeIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CommentIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M5 16.5V6.8A1.8 1.8 0 0 1 6.8 5h10.4A1.8 1.8 0 0 1 19 6.8v7.4a1.8 1.8 0 0 1-1.8 1.8H9l-4 3.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookmarkIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6 3.5A1.5 1.5 0 0 0 4.5 5v16.2l7.5-4.2 7.5 4.2V5A1.5 1.5 0 0 0 18 3.5z" />
    </svg>
  );
}

export function BookmarkOutlineIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6.5 4.5h11A1 1 0 0 1 18.5 5.5v15l-6.5-3.6-6.5 3.6V5.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}
