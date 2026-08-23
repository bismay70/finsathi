import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { ChatGroq } from "@langchain/groq";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import path from "path";
import { Env } from "../config/env.config";
import { Document } from "@langchain/core/documents";

let vectorStore: MemoryVectorStore | null = null;
let isInitializing = false;

// Initialize the Vector Store from CSV
const initVectorStore = async () => {
    if (vectorStore || isInitializing) return;
    isInitializing = true;
    try {
        console.log("Initializing Vector Store for Chatbot...");
        const csvPath = path.resolve(__dirname, "../../../dataset/BankFAQs.csv");
        const loader = new CSVLoader(csvPath);
        const rawDocs = await loader.load();

        // Format documents to combine Question and Answer in page_content
        const documents = rawDocs.map((doc: any) => {
            return new Document({
                pageContent: `Question: ${doc.metadata.source}\n${doc.pageContent}`,
                metadata: doc.metadata
            });
        });

        const embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HUGGINGFACEHUB_API_KEY || "", // Expects HF token in env
        });

        vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
        console.log("Vector Store Initialized.");
    } catch (error) {
        console.error("Error initializing vector store:", error);
    } finally {
        isInitializing = false;
    }
};

export const chatService = async (query: string): Promise<string> => {
    if (!vectorStore) {
        await initVectorStore();
    }
    if (!vectorStore) {
        return "Sorry, I am still initializing my knowledge base or there was an error. Please try again later.";
    }

    const llm = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY || "", 
        model: "mixtral-8x7b-32768",
        temperature: 0,
    });

    const template = `
    You are a Finance QNA Expert. Analyze the Query and Respond to Customer with a suitable answer.
    If you don't know the answer based on the context provided, just say "Sorry, I don't know."

    Context: {context}
    Question: {input}
    Answer:
    `;

    const prompt = PromptTemplate.fromTemplate(template);

    const documentChain = await createStuffDocumentsChain({
        llm,
        prompt,
    });

    const retriever = vectorStore.asRetriever({ k: 3 });

    const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever,
    });

    const result = await retrievalChain.invoke({
        input: query,
    });

    return result.answer;
};
