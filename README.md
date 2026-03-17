# Orbital Engine 🪐

A full-stack, high-fidelity 3D Solar System simulation built with the MERN stack and React Three Fiber. This project demonstrates complex state management, 3D mathematical rendering, and decoupled physical systems. 

**Developed by:** Samy Barsoum

## ✨ Features

* **Decoupled Physics Engine:** Earth's orbital translation (Years/Months) is mathematically separated from its axial spin (Days), allowing for a true sandbox experience where time scales dynamically based on user input.
* **Independent Lunar Mechanics:** The Moon tracks its own orbital path around the moving Earth, generating accurate Lunar Cycles independent of solar time.
* **Cinematic Camera Tracking:** Custom implementation utilizing `getWorldPosition` and vector linear interpolation (lerping) to allow users to double-click and dynamically lock the camera to moving celestial bodies.
* **Persistent Custom Presets:** Connected to a MongoDB backend to save and load user-defined simulation speeds.
* **Post-Processing & Lighting:** Utilizes Three.js Bloom effects to turn standard meshes into light-emitting celestial bodies with dynamic shadows and material roughness.

## 🛠 Tech Stack

* **Frontend:** React, Three.js, `@react-three/fiber`, `@react-three/drei`, Tailwind CSS v4, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
