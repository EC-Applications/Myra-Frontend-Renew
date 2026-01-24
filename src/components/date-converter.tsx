import { formatDistanceToNow } from "date-fns";

export function formatDateToMonthDay(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short", // Dec
    day: "2-digit", // 18
  });
}



export const  formatCommentTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
};
