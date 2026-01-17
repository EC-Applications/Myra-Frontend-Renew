export const getFileIcon = (docType: string) => {
  if (docType.includes('pdf')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M7 18h10M7 14h10M7 10h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (docType.includes('image')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" />
      <polyline points="13 2 13 9 20 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

