import { generateStory } from "./src/workflow";

const fs = require("fs");
async function main() {
  const story = await generateStory("A restaurant in Mozambique");

  let storyText = `${story.outline.title}\n\n`;
  story.chapters.forEach((chapter) => {
    storyText += `${chapter.title}\n\n${chapter.text}\n\n`;
  });
  fs.writeFileSync(
    `/tmp/llmstories/${story.outline.title}-qwen314b.txt`,
    storyText
  );
}

main().catch(console.error);
