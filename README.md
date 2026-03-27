# MetricsAnalytics: AI-First Observability Platform

Welcome to **MetricsAnalytics**, a next-generation infrastructure monitoring dashboard where **Artificial Intelligence is the core experience**, not just an add-on. 

While traditional dashboards require you to hunt through dozens of charts to find the root cause of an issue, MetricsAnalytics empowers you to simply **ask**.

---

## 🤖 The Heart of the System: AI Assistant

The primary focus of this project is the **Integrated AI Chat Bot**. It serves as an intelligent layer between you and your infrastructure data (metrics, logs, alerts, and services).

### 🚀 Key AI Features

#### 1. Context-Aware Intelligence
The AI knows what you are looking at. Whether you are in the "Logs" section or the "Metrics" overview, the assistant automatically adjusts its context (`currentMode`) to provide relevant answers without you needing to explain the background.

#### 2. Tool-Augmented Generation (TAG)
Unlike basic LLMs, our AI doesn't just "talk"—it **acts**. When you ask a question like *"What is the current health of the database service?"*, the AI backend:
- Identifies the need for real-time data.
- **Executes internal tools** to fetch live metrics or logs.
- Synthesizes the data into a human-readable explanation.
- **UI Visibility**: Every tool execution is transparently displayed in the chat bubble (e.g., `used get_service_status`).

#### 3. Smart Suggestions
The AI proactively guides your investigation by offering "Smart Suggestions" based on its analysis. If it detects a spike in error rates, it might suggest: *"Show me the logs for the last 5 minutes"* or *"Which service is most affected by this latency?"*

#### 4. Dual-Experience UI
- **Quick-Access Panel**: A slide-out chat interface for rapid queries while navigating the dashboard.
- **Immersive Full-Page Chat**: A dedicated, focus-driven environment for deep-dive root cause analysis and complex data interpretation.

#### 5. Real-time Infrastructure Connectivity
The assistant is powered by high-performance models (via **Groq** or local **LM Studio**), providing near-instant responses with a live connection status indicator (`Online/Offline`).

---

## 📊 Dashboard Capabilities

The dashboard serves as the data foundation for the AI, featuring:

- **Metrics Section**: Visualized system performance (CPU, Memory, Latency) using Recharts.
- **Log Explorer**: Centralized log aggregation for fast searching.
- **Alert Center**: Real-time incident tracking and severity prioritization.
- **Service Mesh Overview**: Health status of all microservices.

---

## 🛠️ Technical Implementation

### Frontend (This Repository)
- **Framework**: React 19 (TypeScript ready)
- **State Management**: Context API for global Chat & Dashboard state.
- **UI/UX**: Custom-built modular components with a dark-themed, glassmorphism-inspired aesthetic.
- **Data Visualization**: Recharts for interactive infra metrics.
- **Rich Text**: `react-markdown` for beautifully formatted AI responses (code blocks, lists, etc.).

### AI & Backend (Integration)
- **Engine**: FastAPI (Python) serving as the bridge between the UI and LLMs.
- **LLM Support**: Optimized for **Groq Llama-3** (Cloud) and **LM Studio** (Local/Private).
- **Communication**: RESTful API with intelligent history management and tool-dispatching logic.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- [MetricsAnalytics Backend](https://github.com/your-username/backend-repo) (FastAPI) running.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/metrics-analytics-frontend.git
   cd metrics-analytics-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## 🧠 Why we built this?
In modern DevOps, "data fatigue" is real. We built MetricsAnalytics to prove that **the future of observability is conversational**. Instead of being a dashboard expert, you can now be an investigator supported by an AI that understands your entire stack.

---
*Created for the MetricsAnalytics Infrastructure Challenge.*
