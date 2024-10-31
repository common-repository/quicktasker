function parseDate(dateString: string): Date {
  return new Date(dateString);
}

function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

export { formatDate, parseDate };
