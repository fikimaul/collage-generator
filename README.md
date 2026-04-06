# 🖼️ Collage Generator (Node.js + Sharp)

A simple web-based collage generator built with **Node.js**, **Express**, and **Sharp**.

Create image collages by pasting image URLs, customizing grid layout, aspect ratio, and fit mode — then preview and download the result instantly.

---

## ✨ Features

- 📐 Custom grid (rows × columns)
- 📏 Adjustable tile width
- 🔲 Aspect ratio selection (1:1, 2:3)
- 🧠 Fit modes:
  - `contain` → keep full image (no crop, white padding)
  - `cover` → crop center
  - `fill` → stretch
- 📝 Input multiple image URLs (1 per line)
- 💾 Auto-save form (localStorage)
- 👀 Live preview
- ⬇️ Download generated collage

---

---

## 📦 Installation

```bash
npm install
node server.js
```