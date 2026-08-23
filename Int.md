# Project Interview & Integration Notes: Challenges, Hurdles, and Solutions

This document outlines the major challenges, hurdles, and solutions encountered while building the **FinSathi: Unified Finance Platform**.

## 1. Architectural & System Design (LLD)

### Challenge: ATM Terminal Implementation
**Hurdle:** The user asked if the ATM UI was built using strict Object-Oriented Low-Level Design (LLD) patterns (like the State Pattern, separate classes for `CardReader`, `CashDispenser`, `Keypad`, etc.).
**Current State:** The ATM terminal UI is currently implemented as a functional React component (`client/src/pages/atm/index.tsx`) relying heavily on React Hooks (`useState`) for managing the different screens ("idle", "pin", "menu", "amount", "processing", "receipt"). It does not use strict OOP LLD class patterns because React favors functional composition over class-based inheritance.
**Solution/Next Steps:** While functional components are standard for React, we could refactor the backend `atm.service.ts` to reflect a more robust OOP design pattern (e.g., using a State Machine for transaction workflows) if we wanted to showcase strict system design principles.

## 2. Real-Time Data Synchronization

### Challenge: WebSocket Integration for Real-Time Banking
**Hurdle:** Making sure that an ATM withdrawal immediately reflects in the user's dashboard across multiple devices.
**Solution:** Implemented `Socket.IO` on the Node.js backend with Redis pub/sub. When a transaction succeeds, the server emits a `transaction_update` event. The React frontend listens for this event and instantly invalidates RTK Query cache tags, causing the dashboard to refetch the latest balance without requiring a page reload.

## 3. Advanced Feature Integrations & AI

### Challenge: Making the App More "Interesting" Beyond Expense Tracking
**Hurdle:** The project started feeling like a standard expense tracker. We needed to add something more cutting-edge to revive its "charm".
**Solution:** The introduction of AI via OCR receipt scanning is a start. However, to truly make it advanced, we can integrate **LangGraph** or **MCP (Model Context Protocol)**.

#### Ideas for LangGraph / MCP Integration:
- **LangGraph (Stateful AI Workflows):** We can build a LangGraph agent that acts as a "Financial Advisor Agent". Instead of just a single LLM prompt, LangGraph allows for multi-actor, stateful workflows. 
  - **Use Case:** A user asks, "How can I save for a house?" The LangGraph agent loops through checking the user's current savings (via an API tool), analyzing expense patterns, suggesting budget cuts, and then drafting a 12-month savings plan.
- **MCP (Model Context Protocol):** We can expose the FinSathi backend APIs as an MCP Server. This would allow an external AI assistant (like Claude Desktop) to connect securely to the user's FinSathi account. 
  - **Use Case:** The user could open Claude on their desktop and say "Summarize my FinSathi ATM transactions from this week." Claude would use the MCP protocol to fetch the real-time data securely and present it, making FinSathi an interoperable, AI-ready platform.

## 4. Security & Authentication

### Challenge: Secure PIN Handling for ATM
**Hurdle:** Mimicking PCI compliance for ATM PIN entries in a web environment.
**Solution:** Kept the PIN logic out of standard JWT tokens. The PIN is transmitted over HTTPS, verified against a hashed version in the database (using bcrypt), and never exposed in plaintext.

## 5. UI/UX & State Management

### Challenge: Managing Complex UI States in ATM
**Hurdle:** The ATM has many distinct states (insert card, PIN, menu, amount, processing, receipt) that need to flow seamlessly.
**Solution:** Handled this efficiently using a union type state machine in React (`type AtmState = "idle" | "pin" | "menu" | "amount" | "processing" | "receipt";`). This ensures the UI never enters an invalid combination of states.

---

**Conclusion so far:** The project has solid foundations, but pivoting towards Agentic AI (using LangGraph for a robotic financial advisor) or MCP (making the finance platform a tool for local LLMs) will definitely bring the "charm" and complexity back to the platform.

## 6. Fraud Detection using LLM and RAG

**Project Overview:**
This project aims to detect potential financial fraud by analyzing textual financial statements. It leverages advanced Artificial Intelligence techniques, specifically Large Language Models (LLM) and Retrieval-Augmented Generation (RAG), to identify anomalies and patterns indicative of fraudulent behavior within financial data.

**Features:**
- **Synthetic Data Generation:** Creates a dataset of both fraudulent and non-fraudulent financial statements for training and evaluation purposes.
- **Text Preprocessing:** Includes robust text cleaning steps (removing non-ASCII characters, punctuation, numbers, converting to lowercase, tokenization, and stop-word removal) to prepare financial texts for AI models.
- **Vector Store Creation (ChromaDB):** Embeds the cleaned financial statements into a vector database (ChromaDB) using `HuggingFaceEmbeddings`. This allows for efficient retrieval of semantically similar documents.
- **Large Language Model (LLM) Integration:** Utilizes a powerful LLM (`HuggingFaceH4/zephyr-7b-beta`) loaded with 4-bit quantization for efficient GPU memory usage. This LLM is capable of understanding and generating human-like text to analyze financial context.
- **Retrieval-Augmented Generation (RAG):** Combines the LLM with the vector store to perform intelligent fraud detection. When a query (financial statement) is provided, the RAG system first retrieves the most relevant financial statements from the ChromaDB (context) and then uses the LLM to analyze this context and the query to determine if the statement indicates fraud.
- **Prompt Engineering:** Employs a custom `PromptTemplate` to guide the LLM, instructing it to act as a "Fraud Detection Expert" and provide clear predictions (fraud/non-fraud) with explanations based on the retrieved context.
- **Query Answering:** The system can take a financial statement as a query and output a concise assessment of its fraud status, along with an explanation, making it a valuable tool for auditors, regulators, and financial institutions.

## 7. Market News Sentiment Analysis using Generative AI

**Project Overview:**
This part of the notebook focuses on building a Generative AI-based system to analyze market news and determine sentiment for a specific company or the overall stock exchange.

**Purpose:** 
To create a system that can analyze market news about a company or stock exchange and provide sentiment analysis and insights based on the news.

**Key Features:**
- **News Fetching:** Utilizes the NewsAPI to retrieve the latest financial news for a specified query (e.g., 'Microsoft News June 2024') within a given date range.
- **Data Pre-processing:** Fetched news articles are converted into a Pandas DataFrame, and then pre-processed to clean up data (e.g., converting `publishedAt` to datetime, handling missing authors) and extract relevant information (like author and title).
- **Prompt Building:** The pre-processed news titles are used to construct a detailed prompt for an LLM, asking it to act as a financial analyst and provide insights into the potential impact on financial industry sentiment.
- **LLM Integration (Falcon 7B):** An open-source LLM (`Falcon 7B`) is used to invoke the constructed prompt, generating a summary and sentiment analysis of the news articles.
