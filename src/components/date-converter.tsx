export function formatDateToMonthDay(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short", // Dec
    day: "2-digit", // 18
  });
}
