import { ChatOllama } from "@langchain/ollama";
import { generateOutline } from "./outline";

const testModel = new ChatOllama({
  model: "qwen3:8b",
  temperature: 0,
});
describe("story outline module", () => {
  test("produces a story outline", async () => {
    const outline = await generateOutline({
      storyIdea: "A restaurant in Mozambique",
      model: testModel,
    });

    expect(outline).toHaveProperty("title");
    expect(outline).toHaveProperty("outline");
  }, 100000);
});
