<div align="center">
  <h1>Vora (Lumière Salon Pro)</h1>
  <p>An AI-powered, multi-tenant SaaS management platform tailored for luxury salons and experience-based businesses.</p>
</div>

---

## 🚀 Key Features & Functionalities

### 1. 🤖 AI-Powered Marketing & Chatbot Assistant
* **AI Chat Assistant:** Interactive customer service chatbot powered by Google Gemini API (`@google/genai`) to handle bookings, inquiries, and support.
* **AI Marketing Suite:** Automated campaign generation, review response writing, and intelligent customer segmentation.

### 2. 📅 Comprehensive Appointment Scheduling
* Interactive calendar for scheduling, rescheduling, and tracking bookings.
* Real-time availability verification, staff assignment, and status monitoring.

### 3. 👥 Customer Relationship Management (CRM)
* Detailed client profiles containing visit histories, detailed preferences, packages owned, and membership logs.
* Advanced search, filtering, and customer notes.

### 4. 📦 Inventory & Stock Control
* Track salon products, retail goods, usage, and shelf stock.
* Low-stock warnings and purchase tracking.

### 5. 💳 Billing, Memberships, & Packages
* Multi-tier subscription memberships and custom service packages.
* Invoicing, payment status tracking, and plan upgrades/downgrades.

### 6. 📊 Business Intelligence & Reporting
* Visual analytics dashboard utilizing `recharts` for key performance indicators (KPIs).
* Income graphs, popular service tracking, client acquisition metrics, and staff utilization.

### 7. 🛡️ Multi-Tenant Architecture & RBAC
* Secure multi-tenant database configuration to keep salon tenant data isolated.
* Role-based access control (RBAC) to enforce feature restrictions depending on user permissions.

---

## 🛠️ Technology Stack
* **Frontend:** React 19, TypeScript, Tailwind CSS, Vite, Lucide React (Icons), Recharts (Analytics)
* **Backend:** Django (Python), Django REST Framework
* **AI Integration:** Google Gemini SDK (`@google/genai`)
* **Database:** PostgreSQL (with Multi-tenant schemas)

---

## 💻 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* Python 3.10+ (for Django backend)

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aswinsaipalakonda/Vora.git
   cd Vora
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
   * Create a `.env.local` file in the root directory.
   * Add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
   * *Note:* The development URL is configured by default in `env.production` to `http://localhost:5000/api`.
4. **Run the application:**
   ```bash
   npm run dev
   ```

---

## 🤝 Team Workflow & Guidelines
For details on branching, commit conventions, local testing, and pull requests, please read the [Team Collaboration Guide](file.md).
