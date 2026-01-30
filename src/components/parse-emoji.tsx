// utils/helpers.ts
export const parseEmojiFromUnicode = (unicodeStr: string): string => {
  if (!unicodeStr) return "";

  // If already an emoji, return as is
  if (!/\\u/i.test(unicodeStr)) {
    return unicodeStr;
  }

  try {
    // Method 1: JSON.parse (handles surrogate pairs automatically)
    // Wrap in quotes to make it valid JSON string
    const jsonString = `"${unicodeStr}"`;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse unicode:", error);

    // Method 2: Manual parsing (fallback)
    try {
      return unicodeStr.replace(/\\u([\dA-Fa-f]{4})/gi, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
      });
    } catch (err) {
      return unicodeStr;
    }
  }
};

export const detectIconType = (iconStr: string): "icon" | "emoji" => {
  if (!iconStr) return "icon";

  // Check for \uXXXX pattern (no escaped backslash)
  if (/\\u[\dA-Fa-f]{4}/i.test(iconStr)) return "emoji";

  // Check if it's an actual emoji character
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{231A}-\u{231B}]/u;
  if (emojiRegex.test(iconStr)) return "emoji";

  // Single character that's not alphanumeric = likely emoji
  if (iconStr.length <= 2 && !/^[a-zA-Z0-9-_]+$/.test(iconStr)) {
    return "emoji";
  }

  // Default to icon (lucide icon name)
  return "icon";
};
