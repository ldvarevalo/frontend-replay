export const formatDate = (iso: string): string => {
  const date = new Date(iso);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
