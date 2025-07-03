import { ChatOllama } from "@langchain/ollama";
import { generateOutline } from "./outline-generator/outline";
import { generateChapterOutlines } from "./chapter-outline-generator/chapter-outlines-generator";
import { generateChapter } from "./chapter-generator/chapter-generator";
import { Chapter } from "./shared/models";

const model = new ChatOllama({
  model: "qwen3:0.6b",
  temperature: 0.6,
  format: "json",
});

export async function generateStory(storyIdea: string) {
  console.log("Generating a story for the following idea:", storyIdea);

  const outline = await generateOutline({
    storyIdea,
    model,
  });

  console.log("Generated outline:", outline);

  const chapterOutlines = await generateChapterOutlines({
    outline: outline,
    model,
  });

  console.log(
    "Generated chapter outlines:",
    chapterOutlines.map((ch) => ch.title).join(", ")
  );

  const chapters: Chapter[] = [];

  for (const chapterOutline of chapterOutlines) {
    const chapter = await generateChapter({
      storyOutline: outline,
      chapterOutline: chapterOutline,
      model,
      previousChapter:
        chapters.length > 0 ? chapters[chapters.length - 1] : undefined,
    });

    console.log(`Generated chapter: ${chapter.title}`);
    console.log(`Chapter text: ${chapter.text.substring(0, 100)}...`);
    chapters.push(chapter);
  }

  return {
    outline,
    chapterOutlines,
    chapters,
  };
}
