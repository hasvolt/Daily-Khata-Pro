# 📊 Daily Khata Pro

> **Universal Professional Daily Income & Expense Ledger with 6-Fund Rule Allocation, Work Deliverables, Daily Life Timeline Tracker, Calculator Suite & Offline Privacy Vault.**

[![Live Web App](https://img.shields.io/badge/Live_App-rozfiber.com-38BDF8?style=for-the-badge&logo=google-chrome&logoColor=white)](https://rozfiber.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-hasvolt%2FDaily--Khata--Pro-10B981?style=for-the-badge&logo=github)](https://github.com/hasvolt/Daily-Khata-Pro)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**Daily Khata Pro** is a modern, privacy-first, 100% client-side financial management and productivity application designed for freelancers, agency owners, contractors, small business owners, and individuals. 

It implements the proven **6-Fund Money Allocation Rule** (Needs, Emergency, Investment, Growth, Entertainment, Giving) to automatically distribute income streams into disciplined financial buckets while keeping track of project deliverables, daily work logs, and life habits in one seamless dashboard.

---

## ✨ Key Features & Modules

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
- **Master Recovery Code & Security Questions**: Secure PIN reset workflow without losing your local ledger data.
- **100% Offline & Client-Side**: All data stays strictly in your browser (`localStorage`). Zero cloud databases, zero server telemetry.

### 💼 3. Work Deliverables & Project Tracker (`/tracker`)
- Log client milestones, electrical/technical projects, freelancing jobs, and business tasks.
- Track client names, payment status (Paid, Pending, Partial), deliverable links, priorities, and deadlines.
- Filter by status, category, and date range.

### 📖 4. Daily Life Timeline & Journal (`/notes`)
- Log daily routines, reflection notes, mood ratings, habit achievements, and health checkpoints.
- Tagged entries with color-coded tags and chronological timeline visualization.

### 🎯 5. Goal Target Tracker (`/goals`)
- Set short-term and long-term financial targets (e.g., Equipment purchase, Vehicle fund, Higher studies).
- Visual progress bars, milestone calculations, target deadlines, and one-tap goal deposits.

### 🧮 6. Calculators & Financial Suite (`/calculator`)
- **SIP & Mutual Funds Calculator**: Calculate future corpus with compounding interest and inflation adjustment.
- **Loan EMI Calculator**: Monthly breakdown of principal vs interest with amortization schedules.
- **Fixed Deposit (FD) & RD Calculator**: Maturity return calculator.
- **GST & Tax Tool**: Add or extract GST percentages instantly.
- **Rule of 72 & CAGR Calculator**: Calculate investment doubling time and compounded annual growth.

### 🛟 7. Help & Support Centre with Bug Reporter (`/support`)
- **Diagnostic Bug Reporter**: Form with automated environment/device detection to send diagnostic reports directly to `daily-Khata-Pro@gmail.com`.
- **Feature Suggestion Hub**: Submit ideas and feature requests directly.
- **Interactive FAQ Accordion**: Instant answers to common questions about offline security, backups, PIN recovery, and PWA setup.

### 📊 8. Analytics, Search & PDF Statements (`/report`)
- Real-time balance calculations, cash flow visual charts, category breakdowns, and month-over-month summaries.
- One-click **JSON Backup & Restore** for full device portability.
- Direct **A4 PDF Statement Export** and printable transaction receipts/invoices.

### 🎨 9. Theming & Multilingual Support
- **7 Built-in Themes**: Modern Blue, Emerald Green, Royal Violet, Amber Sunset, Rose Gold, Midnight Onyx, and Pure Day/Light mode.
- **Bilingual Interface**: Seamless instant toggle between **English** and **हिन्दी (Hindi)** across all UI elements, modals, and charts.
- **PWA Ready**: Installable on Android, iOS, Windows, and macOS with standalone native app appearance.

---

## 📱 Progressive Web App (PWA) Installation

When installed, the app displays with the standalone name **Daily Khata Pro**:

- **Android (Chrome / Edge / Brave)**: Tap the 3-dot menu icon in the browser and choose **"Install App"** or **"Add to Home Screen"**.
- **iOS Safari**: Tap the **Share** button (box with upward arrow) and select **"Add to Home Screen"**.
- **Windows / macOS (Chrome / Edge)**: Click the Install icon in the browser URL bar or use `Settings > Apps > Install Daily Khata Pro`.

---

## 🧭 Application Routes & Sitemap

| Route | Title | Description |
| :--- | :--- | :--- |
| `/` | **Dashboard** | Overview of balance, 6-fund cards, and quick actions |
| `/history` | **Passbook Ledger** | Full chronological transaction audit & filters |
| `/add` | **Add Transaction** | Income/expense logger with category & fund tag |
| `/tracker` | **Work Deliverables** | Client projects, tasks, and payment status |
| `/goals` | **Savings Goals** | Financial target milestones & visual progress |
| `/notes` | **Daily Timeline** | Notes, daily habit checkpoints, and reflections |
| `/report` | **Financial Reports** | Monthly analytics & printable A4 PDF statements |
| `/calculator` | **Calculators Suite** | SIP, EMI, FD, RD, GST, and CAGR calculators |
| `/support` | **Help & Support** | FAQs, diagnostic bug reports & feature suggestions |
| `/guide` | **User Manual** | Comprehensive interactive usage documentation |
| `/safety` | **Security Audit** | Verify 100% local storage privacy & safety |
| `/developer` | **Developer Profile** | Creator bio, vision, and contact details |
| `/about` | **About Daily Khata Pro** | Application background, rules, and mission |
| `/privacy` | **Privacy Policy** | 100% client-side privacy commitments |
| `/disclaimer` | **Disclaimer** | Financial guidance & utility disclaimers |
| `/terms` | **Terms of Service** | Usage terms and open-source license info |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Motion (Framer Motion)](https://motion.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
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

## 🔒 Privacy & Data Security Guarantee

- **No Remote Servers**: Your transactions, income details, diary entries, and project records remain 100% within your local browser storage (`localStorage`).
- **Zero Third-Party Analytics**: No tracking scripts, cookies, or telemetry.
- **Portability**: Full ownership of your data — easily export your entire ledger to an encrypted/unencrypted JSON backup or Excel CSV at any time.

---

## 📬 Support & Developer Contact

- **Official Support & Feedback**: [daily-Khata-Pro@gmail.com](mailto:daily-Khata-Pro@gmail.com)
- **Creator & Developer**: [Md Zafeer Hasan (Yazdaan)](https://github.com/hasvolt)
- **Brand**: [Hasvolt](https://github.com/hasvolt)
- **Repository**: [https://github.com/hasvolt/Daily-Khata-Pro](https://github.com/hasvolt/Daily-Khata-Pro)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for personal and commercial projects.

