// api/ai.ts

export const generateAIDescriptionUri = async (
  module: 'project' | 'issue',
  title: string,
  onChunk: (text: string) => void 
) => {
  const response = await fetch("https://api.myracloud.io/api/ai/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/event-stream"
    },
    body: JSON.stringify({ module, title })
  });

  if (!response.ok) {
    throw new Error(`AI API Error: ${response.statusText}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;

    let start = buffer.indexOf("{");
    let end = buffer.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      const jsonStr = buffer.slice(start, end + 1);

      try {
        const data = JSON.parse(jsonStr);
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          onChunk(text); // ⬅️ Callback with extracted text
        }
      } catch (err) {
        // JSON incomplete, wait for more chunks
      }

      buffer = buffer.slice(end + 1);
    }
  }
};