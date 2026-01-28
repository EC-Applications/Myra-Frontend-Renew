"use client";
import DOMPurify from "isomorphic-dompurify";
export const sanitizeHtml = (html: string): string => {
  const clean = DOMPurify.sanitize(html);
  return clean;
};
