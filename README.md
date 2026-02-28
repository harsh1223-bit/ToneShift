# 🎨 ToneShift Web

ToneShift Web is the frontend interface for ToneShift AI.  
It allows users to securely log in and rewrite professional emails using AI-powered tone transformation.

---

## 🌍 Live Application

Frontend:  
https://toneshift-web.vercel.app

Backend API:  
https://toneshift-backend.onrender.com

---

## 🛠 Tech Stack

- React (Vite)
- Fetch API
- JWT Authentication (LocalStorage)
- Vercel Deployment

---

## 🔐 Authentication Flow

1. User logs in via backend
2. Backend returns JWT
3. JWT is stored in localStorage
4. Protected requests include:

```
Authorization: Bearer <token>
```

---

## ⚙️ Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/toneshift-web.git
cd toneshift-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Environment Variable
Create a `.env` file:

```
VITE_API_URL=http://localhost:8080
```

### 4. Start Development Server
```bash
npm run dev
```

---

## 🚀 Deployment

Frontend deployed via Vercel.

Production Environment Variable:

```
VITE_API_URL=https://toneshift-backend.onrender.com
```

---

## 🧠 Architecture

Client → Vercel → Render Backend → PostgreSQL → OpenRouter API

---

## 👨‍💻 Author

Harsh Sharma  
Full-Stack Java Developer | Spring Boot | React | Cloud Deployment