import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { stripThinking } from "../shared/utils/qwen3.utils";
import { Outline } from "../shared/models";

export async function generateChapterOutlines(options: {
  outline: Outline;
  model: BaseChatModel;
}): Promise<Outline[]> {
  const model = options.model;
  const systemTemplate = `You are a novelist. Your role is to plot a detailed chapter overview for a story of the following title: '{title}'. You should plot out each chapter in the book, and clarify the key plot developments, character interactions, etc for each chapter of the book. The chapters as a whole should combine to form a coherent narrative. Do not write each chapter, but provide an outline of what is contained in each chapter. The chapter breakdown should follow this outline: {outline}. Respond with a valid JSON object, containing a property "outlines" which is a list of valid JSON objects, each with two fields: 'title' and 'outline' where title is the chapter title, and outline is the chapter outline. Remember, the output MUST be STRICTLY valid JSON. Follow this example for an output: {oneShot}. Create at least 20 chapters`;
  const oneShot = `{
  "outlines": [
      {"title": "Chapter 1: The Beginning",
     "outline": "Introduce the main character, their background, and the setting. Establish the initial conflict or goal of the character."},
    {"title": "Chapter 2: The Journey Begins",
     "outline": "The main character embarks on their journey, facing initial challenges and meeting key supporting characters. The stakes are raised."},
    {"title": "Chapter 3: The First Major Conflict",
     "outline": "The main character encounters a significant obstacle or antagonist. This chapter should include a turning point that tests the character's resolve."},
    {"title": "Chapter 4: Allies and Enemies",
     "outline": "The main character forms alliances with other characters while also facing betrayal or new enemies. The plot thickens as the stakes increase."},
    {"title": "Chapter 5: The Climax Approaches",
     "outline": "The main character prepares for the final confrontation. Tensions rise, and the character must make difficult choices that will affect the outcome of the story."},
    {"title": "Chapter 6: The Final Showdown",
     "outline": "The main character faces the antagonist in a climactic battle or confrontation. This chapter should resolve the main conflict and lead to the resolution."},
    {"title": "Chapter 7: Resolution and Reflection",
     "outline": "The aftermath of the final showdown is explored. The main character reflects on  their journey, the changes they have undergone, and the lessons learned. Loose ends are tied up, and the story concludes with a sense of closure."}
  ]
]`;
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
  ]);

  const partialedPrompt = await promptTemplate.partial({});
  const parser = new JsonOutputParser<{ outlines: Outline[] }>();
  const chain = partialedPrompt.pipe(model).pipe(stripThinking).pipe(parser);
  const response = await chain.invoke({
    title: options.outline.title,
    outline: options.outline.outline,
    oneShot: oneShot,
  });

  return response.outlines;
}
