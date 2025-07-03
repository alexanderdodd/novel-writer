import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { stripThinking } from "../shared/utils/qwen3.utils";
import { Chapter, Outline } from "../shared/models";

export async function generateChapter(options: {
  storyOutline: Outline;
  chapterOutline: Outline;
  model: BaseChatModel;
  previousChapter?: Chapter;
}): Promise<Chapter> {
  const model = options.model;
  const systemTemplate = `You are a novelist writing a book following this outline: {storyOutline}. Your role is to write the following Chapter of the book: {chapterTitle}, following this chapter outline: {chapterOutline}. {previousChapter}. Ensure that the chapter is 2000-5000 words long. Respond with a valid JSON object, containing two fields: 'title' and 'text', where title represents the title of the chapter and text represents the prose of the chapter. Here's an example of a valid JSON response: {oneShot}. Remember, the output MUST be STRICTLY valid JSON.`;
  const oneShot = JSON.stringify({
    title: "This should be the title of the chapter",
    text: "This will be the text of the chapter, which is a continuation of the story outlined in the previous chapters. It should be rich in detail, character development, and plot progression, adhering to the chapter outline provided.",
  });
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
  ]);

  const partialedPrompt = await promptTemplate.partial({});
  const parser = new JsonOutputParser<Chapter>();
  const chain = partialedPrompt.pipe(model).pipe(stripThinking).pipe(parser);
  const response = await chain.invoke({
    storyOutline: options.storyOutline.outline,
    chapterTitle: options.chapterOutline.title,
    chapterOutline: options.chapterOutline.outline,
    oneShot: oneShot,
    previousChapter: options.previousChapter
      ? `The previous chapter was titled "${options.previousChapter.title}" and contained the following text: "${options.previousChapter.text}"`
      : "",
  });

  return response;
}
