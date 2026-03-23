# JoyVerse

JoyVerse is a web-based learning and therapy support platform featuring interactive mini‑games (word, math, memory, syllables, mirror-words, quizzes) and emotion understanding capabilities. The project includes a React frontend, an Express + MongoDB backend API, and a FastAPI service for facial expression recognition using a pretrained Transformers model.

---

## Tech Stack

**Frontend**
- React (Create React App)
- React Router
- Axios
- Chart.js, ApexCharts
- MediaPipe Face Mesh, TensorFlow.js
- react-webcam

**Backend**
- Node.js, Express
- MongoDB Atlas, Mongoose
- bcrypt / bcryptjs
- cors, dotenv

**ML Service**
- FastAPI
- Hugging Face Transformers
- PyTorch
- Pillow (PIL)

---

## Repository Structure

```
joy_verse/
├─ backend/
│  ├─ app.js
│  ├─ main.py
│  ├─ package.json
│  ├─ Routes/
│  └─ models/
├─ frontend/
│  └─ joyverse/
│     ├─ package.json
│     ├─ public/
│     └─ src/
│        ├─ index.js
│        ├─ App.js
│        ├─ pages/
│        └─ components/
└─ transformer/
   └─ facemesh/
      ├─ FacemeshTransformer.ipynb
      ├─ model/
      ├─ model2/
      └─ my-facemesh-app/
```

---

## How It Works

### Frontend
- Client-side routing is handled by `react-router-dom`.
- Main routes include login, dashboards, and multiple mini‑games.

### Backend API (Express)
- Connects to MongoDB using `MONGO_URI`.
- Exposes REST endpoints under `/api/*`.
- Runs on port `4000`.

Mounted route groups:
- `/api/auth`
- `/api/children`
- `/api/sessions`
- `/api` (quiz routes)
- `/api/wordQuestions`
- `/api/syllable-game`
- `/api/mirrorquestions`
- `/api/superadmin`
- `/api/emotion`

### Emotion Prediction Service (FastAPI)
- `POST /predict` accepts an uploaded image and returns a predicted expression label.
- Default model: `trpakov/vit-face-expression`.

---

## Environment Variables

### Backend (Express + FastAPI config)
Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MODEL_NAME=trpakov/vit-face-expression
USE_AUTH_TOKEN=false
```

---

## Setup & Run

### 1) Backend (Express API)

```bash
cd backend
npm install
npm start
```

Backend URL: `http://localhost:4000`

### 2) ML Service (FastAPI)

```bash
cd backend
pip install fastapi uvicorn transformers torch pillow
uvicorn main:app --reload --port 8000
```

ML URL: `http://localhost:8000`

### 3) Frontend (React)

```bash
cd frontend/joyverse
npm install
npm start
```

Frontend URL: `http://localhost:3000`