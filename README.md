# 🎓 Student Saathi
### One-Stop Digital Guide for Student Empowerment

🌐 **Live Demo:** [StudentSaathi](https://student-saathi.vercel.app)

Student Saathi is a full-stack platform built to simplify how students deal with ID documents, certificates, government schemes, internships, and academic resources. Instead of searching scattered government websites, students get step-by-step guides, live search, and an AI chatbot — all in one place.

## ✨ Features

### 🔐 Authentication
* Secure JWT-based authentication
* User registration and login
* Hashed passwords (bcrypt)
* Protected routes

### 🗂 Categorized Dashboard
* ID & Document Help
* Certification Help Desk
* Government Schemes Hub
* Skill & Internship Support
* APAAR ID & Academic Results
* Content pulled live from MongoDB

### 📄 Document Detail Pages
* Description, fees, processing time
* Eligibility & required documents
* Step-by-step guide
* Official links

### 🚨 Emergency Help
* Mental health helplines
* Women's safety helplines
* Cybercrime reporting
* Anti-ragging helpline

### 🔍 Live Search
* Instant keyword-based search across all documents/schemes

### 🤖 AI Chatbot
* Gemini-powered floating assistant
* Answers using both the Student Saathi database and general knowledge

## 🛠 Tech Stack

**Frontend**
* React.js
* Vite
* Tailwind CSS
* Lucide Icons

**Backend**
* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

**AI**
* Google Gemini API

## 🏗 Architecture

```
                React Frontend (Vite)
                       │
                       ▼
            Node.js + Express API
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
     MongoDB Atlas             Google Gemini API
```

## 🚀 Getting Started

**Backend**
```bash
cd Backend
npm install
```
Create a `.env` file in `Backend/` with:
```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=any-long-random-string
GEMINI_API_KEY=your-gemini-api-key
```
Then run:
```bash
npm run data:import
npm run server   # http://localhost:5000
```

**Frontend**
```bash
cd Frontend
npm install
```
Create a `.env` file in `Frontend/` with:
```
VITE_API_URL=http://localhost:5000
```
Then run:
```bash
npm run dev   # http://localhost:3000
```

> Both `Backend` and `Frontend` need their own `.env` file to run.

---

If you like this project, consider giving it a ⭐
