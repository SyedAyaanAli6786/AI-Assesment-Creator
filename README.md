# VedaAI - AI Assessment Creator

An AI-powered assessment creation tool that allows teachers to create assignments, generate question papers using AI, and view the structured output with answer keys.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐            │
│  │ Zustand  │  │  Pages   │  │ Components │            │
│  │  Store   │  │          │  │            │            │
│  └────┬─────┘  └──────────┘  └────────────┘            │
│       │              ▲                                  │
│       ▼              │                                  │
│  ┌─────────┐  ┌──────┴─────┐                           │
│  │WebSocket│  │  REST API  │                           │
│  │ Client  │  │   Client   │                           │
│  └────┬─────┘  └──────┬─────┘                           │
└───────┼───────────────┼─────────────────────────────────┘
        │               │
        ▼               ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │WebSocket │  │  Routes   │  │  Workers │             │
│  │ Server   │  │Controllers│  │ (BullMQ) │             │
│  └──────────┘  └──────────┘  └────┬──────┘             │
│                                    │                    │
│  ┌──────────┐  ┌──────────┐  ┌────▼──────┐             │
│  │ MongoDB  │  │  Redis   │  │ AI Service│             │
│  │          │  │  Cache   │  │ (Gemini)  │             │
│  └──────────┘  └──────────┘  └───────────┘             │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + TypeScript | UI Framework with App Router |
| **State Mgmt** | Zustand | Lightweight state management |
| **Real-time** | WebSocket (native) | Live generation updates |
| **Backend** | Express + TypeScript | REST API server |
| **Database** | MongoDB + Mongoose | Assignment & paper storage |
| **Cache** | Redis | Response caching & job state |
| **Queue** | BullMQ | Background job processing |
| **AI** | Google Gemini 1.5 Flash | Question paper generation |
| **PDF** | jsPDF + html2canvas | PDF export functionality |

## 📋 Features

### Core Features
- ✅ **Assignment Creation** — Multi-step form with file upload, question type configuration
- ✅ **AI Question Generation** — Structured prompt → Gemini API → Parsed output
- ✅ **Real-time Updates** — WebSocket notifications during generation
- ✅ **Question Paper View** — Clean, exam-style layout with sections & answer key
- ✅ **Background Jobs** — BullMQ workers for async AI generation

### Bonus Features
- ✅ **PDF Export** — Download question paper as formatted PDF
- ✅ **Regenerate** — Re-generate question paper with same parameters
- ✅ **Difficulty Badges** — Color-coded Easy/Moderate/Hard tags
- ✅ **Redis Caching** — Cached generated papers for fast retrieval
- ✅ **Responsive Design** — Mobile-friendly layouts
- ✅ **Search & Filter** — Find assignments quickly

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Google Gemini API key

### 1. Clone the repository
```bash
git clone <repository-url>
cd AI-Assesment-Creator
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
AI-Assesment-Creator/
├── frontend/                  # Next.js Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── assignments/  # Assignment pages
│   │   │   │   ├── [id]/     # Assignment detail/output
│   │   │   │   ├── create/   # Create assignment form
│   │   │   │   └── page.tsx  # Assignments list
│   │   │   ├── globals.css   # Global styles & design tokens
│   │   │   ├── layout.tsx    # Root layout with sidebar
│   │   │   └── page.tsx      # Home (redirects to assignments)
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Sidebar/
│   │   │   ├── Header/
│   │   │   ├── AssignmentCard/
│   │   │   ├── CreateAssignment/
│   │   │   ├── EmptyState/
│   │   │   ├── GenerationProgress/
│   │   │   └── QuestionPaper/
│   │   ├── store/            # Zustand state management
│   │   └── lib/              # API client, types, WebSocket hook
│
├── backend/                   # Express Backend
│   ├── src/
│   │   ├── config/           # DB, Redis, WebSocket, Queue config
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # Express routes
│   │   ├── services/         # AI generation service
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Prompt builder
│   │   ├── workers/          # BullMQ workers
│   │   └── index.ts          # Server entry point
│
└── README.md
```

## 🔄 Data Flow

1. **User creates assignment** → Frontend form collects details
2. **API request** → POST `/api/assignments` with form data
3. **Job queued** → BullMQ adds generation job to Redis queue
4. **Worker processes** → Picks up job, builds prompt, calls Gemini API
5. **Result stored** → Generated paper saved to MongoDB, cached in Redis
6. **Frontend notified** → WebSocket sends real-time progress & completion
7. **Paper displayed** → Structured question paper with answer key rendered

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assignments` | Create assignment & start generation |
| GET | `/api/assignments` | List all assignments |
| GET | `/api/assignments/:id` | Get single assignment with paper |
| DELETE | `/api/assignments/:id` | Delete assignment |
| POST | `/api/assignments/:id/regenerate` | Regenerate question paper |
| GET | `/api/assignments/job/:jobId` | Get job status |
| GET | `/api/health` | Health check |

## 🎨 Design Approach

The UI closely follows the provided Figma designs with:
- Clean, minimalist sidebar navigation
- Card-based assignment listing with hover effects
- Multi-step form with progress indicators
- Exam-style question paper output
- Color-coded difficulty badges
- Smooth micro-animations and transitions
