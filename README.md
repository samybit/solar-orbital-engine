
# Orbital Engine 🪐

A full-stack, high-fidelity 3D Solar System simulation built with the MERN stack and React Three Fiber. This project demonstrates complex state management, 3D mathematical rendering, and decoupled physical systems.

**Developed by:** Samy Barsoum

---

## ✨ Features

- **Decoupled Physics Engine:** Earth's orbital translation (Years/Months) is mathematically separated from its axial spin (Days), allowing for a true sandbox experience where time scales dynamically based on user input.
- **Independent Lunar Mechanics:** The Moon tracks its own orbital path around the moving Earth, generating accurate Lunar Cycles independent of solar time.
- **Cinematic Camera Tracking:** Custom implementation utilizing `getWorldPosition` and vector linear interpolation (lerping) to allow users to double-click and dynamically lock the camera to moving celestial bodies.
- **Persistent Custom Presets:** Connected to a MongoDB backend to save and load user-defined simulation speeds.
- **Post-Processing & Lighting:** Utilizes Three.js Bloom effects to turn standard meshes into light-emitting celestial bodies with dynamic shadows and material roughness.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Three.js, `@react-three/fiber`, `@react-three/drei`, Tailwind CSS v4, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** and **MongoDB** installed on your machine.

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/samybit/orbital-engine.git
cd orbital-engine
```

**2. Install backend dependencies:**
```bash
cd backend
npm install
```

**3. Install frontend dependencies:**
```bash
cd ../frontend
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env` file in the `/backend` directory with the following:

```plaintext
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/solar-system
```

> Update `MONGO_URI` if using MongoDB Atlas.

---

## ▶️ Running the Application

### Development Mode

Run each in a separate terminal:

```bash
# Terminal 1 — Backend
cd backend && node server.js

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### Production Build

```bash
# 1. Build the frontend
cd frontend && npm run build

# 2. Serve via Express
cd ../backend && node server.js
```

The Express server will serve the optimized frontend at `http://localhost:5000`.

---

## 🎮 Controls

| Input | Action |
|---|---|
| Left Click + Drag | Rotate Camera |
| Right Click + Drag | Pan Camera |
| Scroll Wheel | Zoom In / Out |
| Double-Click Planet | Lock Camera Focus |
| Click Empty Space | Reset Camera to Sun |
