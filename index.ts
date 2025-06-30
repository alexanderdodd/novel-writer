import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";



const model = new ChatOllama({
  model: "qwen3:0.6b",
  temperature: 0
});


const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];


async function main() {
    // console.log("Starting the chat model...");
    // const stream = await model.stream(messages);

    // const reader = stream.getReader();
    // const chunks = [];
    // while (true) {
    //     const { value: chunk, done } = await reader.read();
    //     if (done) break;
    //     chunks.push(chunk.content.valueOf());
    // }
    // console.log(chunks.join(''));


    const systemTemplate = "Translate the following from English into {language}";
    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemTemplate],
        ["user", "{text}"],
    ]);

    const promptValue = await promptTemplate.invoke({
        language: "italian",
        text: "hi!",
    });

    console.log(promptValue.toChatMessages());


    const response = await model.invoke(promptValue);
    console.log(`${response.content}`);

}


main().catch(console.error);
