import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import path from "path";
import { Document } from "@langchain/core/documents";

let vectorStore: MemoryVectorStore | null = null;
let isInitializing = false;

// Initialize the Vector Store from CSV using Gemini Embeddings (free tier)
const initVectorStore = async () => {
    if (vectorStore || isInitializing) return;
    isInitializing = true;
    try {
        console.log("Initializing Vector Store for Chatbot (Gemini Embeddings)...");
        const csvPath = path.resolve(__dirname, "../../../dataset/BankFAQs.csv");
        const loader = new CSVLoader(csvPath);
        const rawDocs = await loader.load();

        // Format documents to combine Question and Answer in page_content
        const documents = rawDocs.map((doc: any) => {
            return new Document({
                pageContent: `Question: ${doc.metadata.source}\n${doc.pageContent}`,
                metadata: doc.metadata,
            });
        });

        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GEMINI_API_KEY || "",
            model: "text-embedding-004", // Free Gemini embedding model
        });

        vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
        console.log("Vector Store Initialized successfully with Gemini Embeddings.");
    } catch (error) {
        console.error("Error initializing vector store:", error);
        isInitializing = false; // Reset so next call can retry
    } finally {
        isInitializing = false;
    }
};

// Kick off init on service load
initVectorStore();

export const chatService = async (query: string): Promise<string> => {
    // Wait for initialization if in progress
    if (isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    if (!vectorStore) {
        // Try one more time
        await initVectorStore();
    }

    if (!vectorStore) {
        return "Sorry, I am still initializing my knowledge base. Please try again in a moment.";
    }

    try {
        const llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY || "",
            model: "mixtral-8x7b-32768",
            temperature: 0.2,
            maxRetries: 2,
        });

        const template = `You are Finsathi's AI Financial Assistant. You help users with personal finance questions, budgeting, banking, and money management.

Use the context below to answer the user's question. If the answer isn't in the context, use your general financial knowledge to give a helpful response. Keep answers concise and practical.

Context:
{context}

Question: {input}

Answer:`;

        const prompt = PromptTemplate.fromTemplate(template);

        const documentChain = await createStuffDocumentsChain({
            llm: llm as any,
            prompt: prompt as any,
        });

        const retriever = vectorStore.asRetriever({ k: 4 });

        const retrievalChain = await createRetrievalChain({
            combineDocsChain: documentChain,
            retriever,
        });

        const result = await retrievalChain.invoke({ input: query });

        return result.answer || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error: any) {
        console.error("Chat service error:", error?.message || error);
        if (error?.message?.includes("overloaded")) {
            return "I'm experiencing high traffic right now. Please try again in a moment.";
        }
        return "Sorry, I encountered an error processing your question. Please try again.";
    }
};
