import { generateStory } from "./workflow";

describe("story generator module", () => {
  test("produces a story", async () => {
    const storyIdea = "A restaurant in Mozambique";
    const { outline, chapterOutlines, chapters } = await generateStory(
      storyIdea
    );

    console.log(outline.title);
    chapters.forEach((chapter) => {
      console.log(chapter.title);
      console.log(chapter.text);
    });
  }, 100000);
});
