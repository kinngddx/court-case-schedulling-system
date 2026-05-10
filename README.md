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


COURT CASE SYSTEM


- ✅ ML-based case prioritization (Random Forest)
- ✅ Automated judge scheduling (Greedy algorithm)
- ✅ Judge leave simulator (What-if analysis)
- ✅ Real-time analytics dashboard
- ✅ Interactive timeline calendar
- ✅ Workload balancing
- ✅ Expertise-based assignment



## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List all cases |
| POST | `/api/cases` | Create case (calls ML) |
| GET | `/api/judges` | List judges + workload |
| POST | `/api/schedule` | Run scheduling algorithm |
| POST | `/api/judges/:id/leave` | Mark judge unavailable |
| GET | `/api/hearings` | List all hearings |
| POST | `/predict` (ML) | Predict case priority |

---

## 🧪 Testing the System

### 1. Add Sample Cases
```bash
npm run seed  # Creates 50 cases, 3 judges
```

### 2. Test Scheduling
- Go to http://localhost:3000/schedule
- Click "Auto-Rebalance" button
- See cases distributed to judges

### 3. Test Leave Simulator
- Click "Mark Leave" on any judge
- Cases disappear from timeline
- Click "Auto-Rebalance"
- Cases redistribute to available judges

### 4. Test Case Submission
- Go to http://localhost:3000/submit-case
- Fill form with high severity (5) + undertrial
- Submit → Check predicted priority (should be 90+)

---

## 📝 Future Improvements

- [ ] Add authentication (NextAuth.js)
- [ ] Real-time updates (WebSockets)
- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)
- [ ] Redis caching
- [ ] Time slot booking
- [ ] Email notifications
- [ ] Lawyer conflict detection

---

## 🐛 Debug Commands

```bash
# Check database connection
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# View logs
npm run dev  # Check terminal output

# Test ML service
curl http://localhost:8000
```

---
if not working
```bash
# Delete old database data
npx prisma migrate reset

# Reinstall everything
npm install
cd ml-service
pip install -r requirements.txt
python train.py
cd ..

# Reseed
npm run seed

# Run
npm run dev
# (separate terminal) cd ml-service && venv\Scripts\activate && uvicorn main:app --reload
```

---



## 📄 License

Educational project - Not for commercial use

---

## 👤 Author
Umang Chandra  
