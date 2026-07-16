# 🌟 Finsathi: Advanced AI Finance SaaS Platform

Welcome to **Finsathi**, a professional-grade Personal Finance and Wealth Management SaaS platform. Finsathi leverages Artificial Intelligence to deliver automated OCR receipt scanning, intelligent GenAI reports, and comprehensive financial analytics.

## 📸 Platform Screenshots

<p align="center">
  <img src="client/public/ss1.png" width="49%" alt="Dashboard Screenshot" />
  <img src="client/public/ss2.png" width="49%" alt="Transactions Screenshot" />
  <img src="client/public/ss3.png" width="49%" alt="AI Scanner Screenshot" />
  <img src="client/public/ss4.png" width="49%" alt="Reports Screenshot" />
</p>

---

## 🚀 Key Features

*   **🔐 Secure Authentication**: Robust Firebase Auth integration including Email/Password and Google OAuth.
*   **🏢 Complete Transaction Management**: Seamlessly Create, Read, Update, and Delete transactions with bulk operations.
*   **📤 AI-Powered Receipt Scanning**: Upload images of receipts and instantly extract transaction data using Google Gemini Vision AI.
*   **📈 Advanced Analytics & Dashboards**: Built with custom Node.js data processing engines to aggregate Firestore collections in real-time.
*   **📊 Interactive Visualizations**: Features Beautiful Expenses Breakdown Pie Charts and Income vs. Expense Line Charts using Recharts.
*   **📅 Dynamic Filtering**: Easily filter data by custom date ranges (e.g., Last 30 Days, Year-to-Date).
*   **♻️ Recurring Transactions**: Automated transaction logging using robust Cron Jobs.
*   **📄 Automated Monthly Reports**: PDF/CSV reports automatically generated and emailed to users via Resend.
*   **📥 Seamless CSV Imports**: Bulk import legacy transaction data effortlessly.
*   **🔍 Powerful Search & Filters**: Instantly find specific transactions.
*   **🗑️ Bulk Actions & Duplication**: Optimize workflows with bulk deletes and one-click transaction duplication.
*   **🧑‍💼 Profile Customization**: Cloudinary integration for profile photo uploads.

---

## 📁 Project Structure

```text
Finsathi/
├── client/                 # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Sidebar, ui/)
│   │   ├── pages/          # Application pages (Home, Overview, DashboardPreview)
│   │   ├── routes/         # React Router configurations
│   │   ├── store/          # Redux Toolkit state management
│   │   ├── lib/            # Utilities & Tailwind helpers
│   │   └── App.tsx         # Main entry point
│   ├── public/             # Static assets (images, videos)
│   └── package.json        # Frontend dependencies
├── backend/                # Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/    # Request handlers & logic
│   │   ├── types/          # TypeScript Enums and Definitions
│   │   ├── routes/         # 18 Specialized API Route endpoints
│   │   ├── services/       # Business logic (AI receipt scanning, emails)
│   │   ├── middleware/     # Auth, Validation, & Error handling
│   │   └── index.ts        # Server entry point
│   ├── .env.example        # Environment variables template
│   └── package.json        # Backend dependencies
└── README.md               # Project documentation
```

---

## 🏗️ System Architecture

Finsathi utilizes a modern, decoupled architecture designed for scalability and performance.

```mermaid
graph TD
    Client[Client Browser] -->|REST API| Express[Express.js Server]
    
    subgraph Frontend [Frontend: React & Vite]
        UI[Shadcn UI & TailwindCSS]
        State[Redux Toolkit & Zustand]
        Router[React Router v7]
        Charts[Recharts]
    end
    
    subgraph Backend [Backend: Node.js]
        Express --> Auth[Firebase Authentication]
        Express --> Controllers[Controllers & Routing]
        Controllers --> Services[Business Logic]
        Services --> CRON[Node-Cron Tasks]
    end
    
    subgraph Database [Data Layer]
        Services -->|Firebase Admin SDK| Firestore[(Firebase Firestore)]
    end
    
    subgraph External Services [3rd Party APIs]
        Services --> Cloudinary[Cloudinary: Images]
        Services --> Resend[Resend: Emails]
        Services --> AI[Google Gemini GenAI / OCR]
    end
```

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, TypeScript, React Router DOM |
| **Styling & UI** | Tailwind CSS v4, Shadcn UI, Radix Primitives, Lucide Icons |
| **State Management** | Redux Toolkit, Redux Persist |
| **Data Visualization** | Recharts |
| **Backend Core** | Node.js, Express.js, TypeScript |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Authentication |
| **External Integrations** | Cloudinary (Media), Resend (Emails), Google GenAI SDK |

---

## 🔧 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
*   Node.js (v18+)
*   Firebase Project Credentials (Admin SDK json)
*   Cloudinary Account (for media)

### 2. Environment Setup
Create a `.env` file in the root of the `/backend` directory matching `.env.example`:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
... (other keys)
```

### 3. Installation
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```


