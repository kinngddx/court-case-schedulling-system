# ⚖️ NyayaFlow: AI-Powered Court Management System

**NyayaFlow** is a smart legal-tech platform designed to address court case pendency in India using AI-driven prioritization and automated scheduling.

## 🚀 Key Features
* **AI Prioritization:** Automatically calculates a **Priority Score** based on case severity and filing dates.
* **Greedy Scheduling Logic:** Balances workloads across judges to ensure efficient resource allocation.
* **Dynamic Redistribution:** Features a "Leave Management" system that automatically re-allocates cases from unavailable judges to those who are active.
* **Real-time Analytics:** Visualizes case distribution and system efficiency through interactive charts.

## 🛠️ Tech Stack
* **Framework:** Next.js 16 (Turbopack)
* **Database:** Supabase (PostgreSQL) with Prisma ORM
* **Analytics:** Recharts

## 🚦 Quick Start
1.  **Clone & Install:** `git clone <repo-url>` and `npm install`.
2.  **Environment:** Set your Supabase URLs in the `.env` file.
3.  **Database:** Run `npx prisma migrate dev`.
4.  **Launch:** Run `npm run dev`.

