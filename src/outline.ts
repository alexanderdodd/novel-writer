import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { AIMessageChunk } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

interface Outline {
  title: string;
  outline: string;
}
export async function generateOutline(options: {
  storyIdea: string;
  model: BaseChatModel;
}): Promise<Outline> {
  const model = options.model;
  const systemTemplate = `You are a novelist. Your role is to define a story outline for a story on the idea '{storyIdea}'. Define the major and minor subplots, the characters of the story, the settings. Provide an appropriate title for the story. You should also propose the genre of the story that you are outlining. Respond with a valid JSON object, containing two fields: 'title' and 'outline'.`;
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
  ]);

  const partialedPrompt = await promptTemplate.partial({});

  const parser = new JsonOutputParser<Outline>();

  const chain = partialedPrompt.pipe(model).pipe(stripThinking).pipe(parser);

  const response = await chain.invoke({
    storyIdea: options.storyIdea,
  });
  return response;
}

function stripThinking(chunk: AIMessageChunk): AIMessageChunk {
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
