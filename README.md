```markdown
# 🎓 Alumni Connect

**Alumni Connect** is a platform that bridges the gap between college students and their alumni for personalized career guidance, live mentoring sessions, and more — all while ensuring privacy, safety, and career-focused features.

---

## 🚀 Features

### 🔗 1-on-1 Mentoring
- Book **live mentoring sessions** with alumni from well-established companies.
- Track mentor performance with a **rating & feedback system**.
- Built-in **reporting system** for inappropriate behavior.

### 💬 Privacy-Protected Chat
- In-app **chat system** to ensure contact details remain confidential.
- Prevents misuse of personal numbers or social accounts.

### 📢 Public Query Forum
- Students can **post queries for free**.
- Alumni can voluntarily respond and help out juniors without any session booking.

### 📄 AI Resume Parser
- Upload a resume and get instant feedback on how well it fits specific job roles.
- AI suggests improvements based on the job profile.

### 🧑‍💼 Internal Job/Internship Alerts
- Alumni can post openings from their companies to give students insider access to opportunities.

---

## 🛠️ Tech Stack

| Frontend | Backend | Auth | ML Features |
| -------- | ------- | ---- | ------------ |
| React.js | Node.js + Express.js | Clerk.dev | Python (Resume Analysis) |

---

## 🧪 Getting Started

### 🧩 Prerequisites
- Node.js & npm
- MongoDB (local or cloud)
- Python (if running resume parser locally)
- Clerk Account & Publishable Key

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/dhruv0050/MentorMojo.git
cd alumni-connect

# Install frontend dependencies
cd frontend
npm install

# Set up Clerk
# Create .env file and add your Clerk Publishable Key
CLERK_PUBLISHABLE_KEY=your_publishable_key_here

# Install backend dependencies
cd ../backend
npm install

# Set up backend .env
MONGO_URI=your_mongodb_connection
PORT=5000
```

---

## 🧯 Run Locally

```bash
# Start backend server
cd backend
npm start

# In a new terminal, start frontend
cd frontend
npm start
```

---

## ✨ Future Roadmap

- [ ] Mentor availability calendar sync (Google Calendar API)
- [ ] Stripe integration for session booking (if monetized later)
- [ ] Video call integration (e.g., Jitsi/Zoom SDK)
- [ ] Resume parser improvements using OpenAI/Claude

---

## 🤝 Contributing

We welcome contributions from everyone! Feel free to fork the repo, create pull requests, or raise issues.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♀️ Made with 💙 by Team Alumni Connect
```

