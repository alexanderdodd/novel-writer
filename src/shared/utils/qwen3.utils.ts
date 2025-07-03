import { AIMessageChunk } from "@langchain/core/messages";

export function stripThinking(chunk: AIMessageChunk): AIMessageChunk {
  if (chunk.content.toString().includes("<think>")) {
    const content = removeTextBetweenTags(chunk.content.toString(), "think");
    chunk.content = content;
  }
  return chunk;
}

function removeTextBetweenTags(text: string, tag: string): string {
  const regex = new RegExp(`<${tag}>[\\s\\S]*?<\\/${tag}>`, "g");
  return text.replace(regex, "");
}
