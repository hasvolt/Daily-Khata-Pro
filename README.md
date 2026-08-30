# 📊 Daily Khata: Pro

> **Universal Professional Daily Income & Expense Ledger with 6-Fund Rule Allocation, Work Deliverables, Daily Life Timeline Tracker & Privacy Passcode Vault.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-hasvolt%2FDaily--Khata--Pro-10B981?style=for-the-badge&logo=github)](https://github.com/hasvolt/Daily-Khata-Pro)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**Daily Khata: Pro** is a modern, privacy-first, 100% client-side financial management and productivity application designed for freelancers, agency owners, contractors, small business owners, and individuals. 

It implements the proven **6-Fund Money Allocation Rule** (Needs, Emergency, Investment, Growth, Entertainment, Giving) to automatically distribute income streams into disciplined financial buckets while keeping track of project deliverables, daily work logs, and life habits in one seamless dashboard.

---

## ✨ Key Features

### 💰 1. Smart 6-Fund Allocation Engine
- **Automated Distribution**: Automatically splits incoming earnings across 6 custom-weighted funds:
  - 🏠 **Personal & Household Needs** (Default: 40%)
  - 🛡️ **Emergency Fund** (Default: 15%)
  - 📈 **Wealth & Long-Term Investment** (Default: 15%)
  - 💡 **Skill Learning & Business Growth** (Default: 10%)
  - 🍿 **Entertainment & Lifestyle** (Default: 10%)
  - 🤲 **Charity & Community Giving** (Default: 10%)
- **Custom Percentages**: Customize allocation percentages with real-time validation ensuring a strict 100% total balance.
- **Deposit / Transfer System**: Directly allocate funds or transfer balances between specific fund buckets with complete audit trails.

### 🛡️ 2. Privacy & Passcode Security Vault
- **4–6 Digit App PIN Lock**: Protect financial transactions, income stats, and personal journals.
- **Auto-Lock on Leave**: Automatically engages the lock screen when switching browser tabs, minimizing the app, or locking the device.
- **Security Question Recovery**: Secure PIN reset workflow with customizable recovery questions and hints without losing your local ledger data.
- **100% Offline & Client-Side**: All data stays strictly in your browser (`localStorage`). Zero cloud databases, zero server telemetry.

### 💼 3. Work Deliverables & Project Tracker
- Log client milestones, electrical/technical projects, freelancing jobs, and business tasks.
- Track client names, payment status (Paid, Pending, Partial), deliverable links, priorities, and deadlines.
- Filter by status, category, and date range.

### 📖 4. Daily Life Timeline & Journal
- Log daily routines, reflection notes, mood ratings, habit achievements, and health checkpoints.
- Tagged entries with color-coded tags and chronological timeline visualization.

### 🎯 5. Goal Target Tracker
- Set short-term and long-term financial targets (e.g., Equipment purchase, Vehicle fund, Higher studies).
- Visual progress bars, milestone calculations, target deadlines, and one-tap goal deposits.

### 📊 6. Analytics, Search & Reporting
- Real-time balance calculations, cash flow visual charts, category breakdowns, and month-over-month summaries.
- Instant search across all transaction descriptions, notes, and tags.
- One-click **JSON Backup & Restore** for full device portability.
- Direct **CSV / Excel Spreadsheet Export** and printable transaction receipts/invoices.

### 🎨 7. Theming & Multilingual Support
- **7 Built-in Themes**: Modern Blue, Emerald Green, Royal Violet, Amber Sunset, Rose Gold, Midnight Onyx, and Pure Day/Light mode.
- **Bilingual Interface**: Seamless instant toggle between **English** and **हिन्दी (Hindi)** across all UI elements, modals, and charts.
- **PWA Ready**: Installable on Android, iOS, Windows, and macOS as a standalone native-like application with offline support.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Motion (Framer Motion)](https://motion.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Confetti & FX**| [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Storage** | Client-Side `localStorage` with JSON serialization |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) and npm/yarn/bun installed:
- [Node.js](https://nodejs.org/) (v18.0.0+)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### 1. Clone the Repository
```bash
git clone https://github.com/hasvolt/Daily-Khata-Pro.git
cd Daily-Khata-Pro
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
The compiled static assets will be in the `dist/` directory, ready to deploy to GitHub Pages, Vercel, Netlify, Cloud Run, or any static host.

---

## 📁 Project Structure

```text
Daily-Khata-Pro/
├── public/                 # Static assets, PWA icons, manifest
├── src/
│   ├── components/         # UI sub-components & modular dialogs
│   │   ├── Header.tsx              # Navigation header, search & quick actions
│   │   ├── BottomNav.tsx           # Mobile-responsive bottom navigation
│   │   ├── FundGrid.tsx            # 6-Fund allocation visualization
│   │   ├── TransactionForm.tsx     # Add income/expense ledger entry
│   │   ├── TransactionHistory.tsx  # Filterable transaction audit list
│   │   ├── LockScreen.tsx          # Numeric PIN lock screen & recovery
│   │   ├── SecurityLockModal.tsx   # Security PIN & question setup modal
│   │   ├── SettingsModal.tsx       # System preferences, themes, data backup
│   │   ├── WorkLogView.tsx         # Client project & deliverables manager
│   │   ├── DailyLifeTimeline.tsx   # Daily journal & habit tracker
│   │   ├── GoalsView.tsx           # Financial goals manager & progress
│   │   └── ...
│   ├── data/
│   │   ├── defaults.ts     # Initial seed data & default fund distributions
│   │   └── translations.ts # Hindi & English localization dictionary
│   ├── utils/
│   │   └── khataCalculations.ts # Fund balancing & ledger math utilities
│   ├── types.ts            # Global TypeScript interfaces & type definitions
│   ├── App.tsx             # Root application orchestrator & state manager
│   ├── main.tsx            # React application entry point
│   └── index.css           # Global Tailwind CSS imports
├── index.html              # HTML5 entry template & PWA meta tags
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & plugin configuration
```

---

## 🔒 Privacy & Data Security Guarantee

- **No Remote Servers**: Your transactions, income details, diary entries, and project records remain 100% within your local browser storage (`localStorage`).
- **No Third-Party Analytics**: Zero tracking scripts, cookies, or telemetry.
- **Portability**: You have full ownership of your data — easily export your entire ledger to an encrypted/unencrypted JSON backup or Excel CSV at any time.

---

## 👨‍💻 Author & Credits

- **Creator & Developer**: [Md Zafeer Hasan (Yazdaan)](https://github.com/hasvolt)
- **Brand**: [Hasvolt](https://github.com/hasvolt)
- **Repository**: [https://github.com/hasvolt/Daily-Khata-Pro](https://github.com/hasvolt/Daily-Khata-Pro)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for personal and commercial projects.
