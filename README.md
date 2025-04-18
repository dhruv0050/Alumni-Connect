# 🎓 Mentor Mojo

**Mentor Mojo** is a platform that bridges the gap between college students and their alumni for personalized career guidance, live mentoring sessions, and more — all while ensuring privacy, safety, and career-focused features.

---

## 🚀 Features

### 👤 User Authentication
- Login/signup with session security and password management using clerk's authentication

### 👨‍🎓 Alumni Directory
- Display a searchable list of verified alumni profiles

### 🔍 Search & Filter
- Ability to search by batch, branch, job title, or location

### 📝 Profile Pages
- Editable personal and professional profiles for each alumni

### 💬 Community Feed
- Forum or bulletin board for posts, discussions, and networking

### 🏷️ Sorting & Tagging
- Sort alumni by graduation year, profession, and other criteria

### 📱 Mobile Responsive Design
- Ensure the platform is optimized for all screen sizes (desktop & mobile)

### 🔒 Privacy-Protected Chat
- In-app chat system to ensure contact details remain confidential
- Prevents misuse of personal numbers or social accounts

### 📢 Public Query Forum
- Students can post queries for free
- Alumni can voluntarily respond and help out juniors without any session booking

---

## 🚀 Features to be added in Future

### 📄 AI Resume Parser
- Upload a resume and get instant feedback on how well it fits specific job roles
- AI suggests improvements based on the job profile

### 🧑‍💼 Internal Job/Internship Alerts
- Alumni can post openings from their companies to give students insider access to opportunities

### 🔗 1-on-1 Mentoring
- Book live mentoring sessions with alumni from well-established companies
- Track mentor performance with a rating & feedback system
- Built-in reporting system for inappropriate behavior

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

## 🙋‍♀️ Made with 💙 by Team Mentor Mojo
[@dhruv0050](https://github.com/dhruv0050)
---
## 🙋‍♀️ Made with 💙 
Project created and maintained by [@dhruv0050](https://github.com/dhruv0050). Feel free to reach out with questions or feedback!
## Devang hizruboy