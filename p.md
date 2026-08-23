# FinSathi Project Overview & Technical Documentation

This document provides a crisp, comprehensive overview of the **FinSathi: Unified Finance Platform**. It highlights the core features, API structure, data schemas, important technical discussions, and the project's folder architecture.

---

## 1. Core Features
- **AI-Powered Receipt Scanning:** Uses Google Gemini Vision AI (with fallback to Tesseract OCR) to extract text from receipts and automatically log transactions.
- **Real-Time Data Synchronization:** Utilizes WebSockets (Socket.IO) paired with Redis Pub/Sub to instantly reflect balance changes, ATM withdrawals, and trading portfolio updates across all connected devices.
- **ATM-Style Terminal Simulator:** A dedicated UI mimicking an ATM kiosk (PIN authentication, withdrawals, deposits, transfers, and mini-statements) backed by a strict state-machine and PCI-aligned PIN encryption.
- **Trading & Portfolio Module:** Integrates algorithmic trading capabilities, simulating an equal-weight S&P 500 portfolio and comparing it against market-cap benchmarks. Incorporates Finlatics equity research.
- **Automated Financial Reports:** Node-Cron schedules generation of monthly PDF/CSV expense reports, dispatched automatically to users via Resend.
- **Agentic AI & LLMs:**
  - *Fraud Detection:* A custom RAG system (using ChromaDB & `zephyr-7b-beta`) to detect anomalies in financial statements.
  - *Market Sentiment Analysis:* Generative AI (`Falcon 7B`) system fetching news via NewsAPI to determine market sentiment.

---

## 2. API Endpoints
The backend uses a modular route architecture with a common prefix (e.g., `/api/v1`). All private endpoints pass through `firebaseAuthMiddleware`.

| Endpoint Prefix | Description | Example Routes |
| --- | --- | --- |
| `/auth` | Authentication & Registration | `POST /login`, `POST /register`, `POST /atm-login` |
| `/user` | User Profile Management | `GET /profile`, `PUT /profile` |
| `/transaction` | Income/Expense Management | `POST /`, `GET /`, `DELETE /bulk`, `POST /receipt/upload` |
| `/report` | Report Generation | `GET /monthly-summary`, `GET /export-csv` |
| `/analytics` | Dashboard Data | `GET /expenses-breakdown`, `GET /income-vs-expense` |
| `/atm` | ATM Simulator Operations | `POST /withdraw`, `POST /deposit`, `POST /transfer` |
| `/trading` | Trading Simulator | `POST /buy`, `GET /portfolio` |

---

## 3. Detailed Schemas (Zod Validations & Database)

### Transaction Schema
Defines the core shape of a financial transaction in the platform:
- `title` (String): Title of the transaction.
- `description` (String, Optional): Further details.
- `type` (Enum): `INCOME` or `EXPENSE`.
- `amount` (Number): Positive number.
- `category` (String): e.g., Food, Rent, Salary.
- `date` (Date): The transaction timestamp.
- `isRecurring` (Boolean): Defaults to false.
- `recurringInterval` (Enum): `DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY`.
- `receiptUrl` (String, Optional): Cloudinary URL of the uploaded receipt.
- `paymentMethod` (Enum): `CARD`, `BANK_TRANSFER`, `MOBILE_PAYMENT`, `AUTO_DEBIT`, `CASH`, `OTHER`.

### Authentication Schemas
- **Register:** `name` (String, max 255), `email` (Valid Email), `password` (String, min 4).
- **Login:** `email` (Valid Email), `password` (String, min 4).

---

## 4. Important Technical Discussions & Hurdles
1. **ATM UI - Functional vs. OOP:** The ATM terminal was initially questioned for lacking strict OOP/LLD classes (like `CardReader`, `CashDispenser`). Because it was built in React, functional composition and hooks (`useState`) were favored, using a union-type state machine to manage UI transitions cleanly.
2. **Horizontal Scaling of WebSockets:** Ensuring real-time sync across multiple backend Node.js instances required introducing Redis. By using the `socket.io-redis` adapter, instances publish and subscribe to a shared Redis broker, ensuring users get `transaction_update` events regardless of which Node server they are connected to.
3. **OCR Engine Trade-offs:** Tesseract OCR (free, fast, local) vs. Google Cloud Vision (paid, highly accurate). The system design allows defaulting to Tesseract and falling back to Google Vision for low-confidence receipt scans.
4. **Trading Integration:** Bridging AlgoCash's equal-weight S&P 500 algorithm with the user's dashboard. A Python-based backtesting pipeline tracks cash balances and executed orders, converting them into normalized transaction events that the FinSathi platform can ingest and display.
5. **Agentic AI & MCP Integration:** Moving beyond traditional CRUD, the platform integrates LangGraph for stateful financial advising and Model Context Protocol (MCP) to allow local LLMs (like Claude Desktop) to query the user's ATM transactions.

---

## 5. Folder & File Structure

### `/backend` (Node.js, Express, Firebase Admin, Redis)
- **`src/`**
  - `controllers/` - Express route handlers containing business logic bindings.
  - `cron/` - Node-cron job definitions (e.g., automated monthly reports).
  - `mailers/` - Email templates and Resend integration logic.
  - `middlewares/` - Auth (`firebaseAuthMiddleware`), error handling, and request validation.
  - `routes/` - Express router definitions (Auth, User, Transaction, ATM, etc.).
  - `services/` - Core business logic, OCR wrappers, database querying, and AI integrations.
  - `socket.ts` - WebSocket initialization and Redis pub/sub configuration.
  - `validators/` - Zod schema definitions (`transaction.validator.ts`, `auth.validator.ts`) for strict request payload typing.
  - `index.ts` - Main server entry point (Server initialization, CORS, routing).
- **`.env`** - Secrets, Firebase Keys, Database URIs.

### `/client` (React 19, Vite, Tailwind CSS, Redux)
- **`src/`**
  - `components/` - Reusable UI elements (Shadcn UI, Radix primitives, custom charts).
  - `pages/` - Core views (Dashboard, Overview, ATM Terminal).
  - `hooks/` - Custom React hooks for data fetching and state management.
  - `store/` - Redux Toolkit slices (global state for user session, active accounts).
  - `routes/` - React Router configuration (Protected vs. Public routes).
  - `lib/` - Utility functions (formatting currency, Tailwind `cn` helper).
  - `App.tsx` & `main.tsx` - Frontend application entry point and providers.
- **`tailwind.config.js`** - UI styling theme definitions.
