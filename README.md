# ⚽ GoalWatch

**GoalWatch** is a modern, responsive web app that displays upcoming **English Premier League** matches in a sleek, sports-streaming-inspired interface. Designed with a Hotstar/JioCinema-style layout, it brings users a real-time, interactive, and local-time-adjusted viewing experience.

---

## 🚀 Live Demo

[🔗 View Live on vercel Hosting](https://your-app-url.web.app)

---

## 🎯 Features

- 🏟️ **Dynamic Title Bar** with a "Live Sports" feel.
- 🕹️ **Match Card Display** showing:
  - Team 1 vs Team 2
  - Match Date & Time (converted to user's local timezone)
  - Team Logos
- 🔎 **Team Filter** using dropdown or search box.
- 🔄 **API Integration**:
  - Fetches upcoming English Premier League matches from a public API.
- 🧠 **Local Time Conversion** using `Intl.DateTimeFormat`.
- 💡 **Responsive UI** for mobile, tablet, and desktop.
- 💫 **Subtle Hover & Tap Animations**.

---

## 🧩 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **API Used**:  
  [TheSportsDB – EPL Next Matches](https://api.openligadb.de/getmatchdata/bl1/2023/15)

---

## 🎨 Style Guide

| Element        | Value         |
|----------------|---------------|
| Primary Color  | `#29ABE2`     |
| Background     | `#0A192F`     |
| Accent Color   | `#A239CA`     |
| Font           | Modern sans-serif (`Inter`, `Roboto`) |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Gauhar-1/goalWatch.git
cd goalwatch

# Install dependencies
npm install

# Start the development server
npm run dev
