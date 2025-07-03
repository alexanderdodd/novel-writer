import { ChatOllama } from "@langchain/ollama";
import { generateChapterOutlines } from "./chapter-outlines-generator";
import { Outline } from "../shared/models";

const testModel = new ChatOllama({
  model: "qwen3:8b",
  temperature: 0,
  format: "json",
});

const mockStoryOutline: Outline = {
  title: "A restaurant in Mozambique",
  outline:
    "### **Major Subplots:**1. **Clara’s Struggle to Preserve Heritage vs. Modernization**   - Clara, a third-generation owner, faces pressure to modernize *Casa do Mar* to attract tourists and survive financially. However, her father’s recipes and the restaurant’s role as a cultural hub are at risk of being diluted. A conflict arises when a developer proposesreplacing the restaurant with a luxury resort, forcing Clara to fight for its preservation.2. **The Mystery of the Lost Recipe**   - Clara’s father, a revered chef, had a secret recipe for a dish called *Kamboja* (a fusion of local spices and Portuguese influences) that was never shared. When Clara discovers a hidden journal detailing the recipe, she must decode its meaning while navigating family secretsand rival chefs who want to claim the dish’s fame.3. **Community Tensions and Land Rights**   - The restaurant’s location on a disputed coastal plot sparks a minor conflict with a local fishing cooperative, which claims the land was historically theirs. Clara must mediate between the community and the city council, revealing how the restaurant’s survival is tied tobroader socio-political struggles.---### **Characters:**1. **Clara Nguvula (Protagonist)**   - A passionate, introspective woman in her late 30s, Clara balances her grief over her father’s recent death with her desire to honor his legacy. Her journey is about reconciling tradition with innovation and finding her own voice as a chef.2. **António, the Rival Chef**   - A charismatic but arrogant chef from a competing restaurant, António challenges Clara’s authenticity, claiming her father’s recipes are “watered down.” His subplot involves a personal vendetta against Clara’s family, revealing deeper family ties to the restaurant’s history.3. **Isabel, the Journalist**   - A foreign journalist investigating Mozambique’s culinary heritage, Isabel becomes Clara’s ally and love interest. Her subplot explores her own cultural identity and the ethics of documenting a community’s traditions.4. **Mama Lourdes, the Matriarch**   - Clara’s grandmother, a wise woman who runs the local market. She serves as a moral compass, urging Clara to “remember the roots” of the restaurant. Her subplot involves a secret feud with the fishing cooperative, adding layers to the land dispute.5. **The Ghost of the Father**   - Clara’s late father appears in dreams, offering cryptic advice about the lost recipe and the restaurant’s fate. This supernatural element symbolizes her unresolved guilt and the weight of legacy.---### **Minor Subplots:**- **A Love Triangle with the Fisherman**  - A local fisherman, João, falls for Isabel, creating tension as he navigates his loyalty to his community and his growing feelings for the outsider.- **The Restaurant as a Political Symbol**  - During a festival, *Casa do Mar* becomes a gathering point for activists protesting the developer’s plans, highlighting the restaurant’s role as a symbol of resistance.- **The Spice Market’s Decline**  - Clara’s struggle to source traditional spices mirrors the broader decline of local markets, as globalized supply chains threaten artisanal practices.---### **Themes:**- **Cultural Identity vs. Globalization**- **Legacy and Innovation**- **Community vs. Individual Ambition**- **The Ethics of Preservation**---**Ending:**Clara reconciles with the community by hosting a grand festival celebrating *Kamboja*, blending tradition with modern twists. The developer withdraws their plans, and *Casa do Mar* becomes a UNESCO-listed cultural site. Clara, no longer bound by her father’s shadow, opens asatellite restaurant in a nearby village, ensuring the legacy lives on. The final scene shows Clara and Isabel walking along the shore, the ocean waves echoing the restaurant’s enduring heartbeat.",
};

describe("story chapter outlines module", () => {
  test("produces chapter outlines", async () => {
    const chapters = await generateChapterOutlines({
      outline: mockStoryOutline,
      model: testModel,
    });

    console.log("Generated chapter outlines:", chapters);
    expect(chapters).toBeInstanceOf(Array);
    expect(chapters.length).toBeGreaterThan(0);

    chapters.forEach((chapter, index) => {
      expect(chapter).toHaveProperty("title");
      expect(chapter).toHaveProperty("outline");
      expect(typeof chapter.title).toBe("string");
      expect(typeof chapter.outline).toBe("string");
    });
  }, 900000);
});
