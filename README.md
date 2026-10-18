# Waqas Mehmood — Digital Marketing Portfolio & In-House SEO Platform

> **Full-Stack Growth Architecture & 25 In-House Technical SEO Diagnostic Tools**  
> Developed for **[waqasmehmood.com](https://waqasmehmood.com)**

---

## 🌟 Executive Overview
This platform bridges multi-disciplinary digital marketing execution with enterprise-grade web engineering:
1. **5 Core Digital Marketing Specializations**:
   - 🎨 **Graphic Design & UI/UX**: Corporate identities, vector logos, Figma wireframes.
   - 💻 **Website Development**: High-speed React 19 applications backed by PHP Laravel REST APIs.
   - 📱 **Social Media Marketing (SMM)**: Audience funnels, viral reels, and content schedules.
   - 🎯 **Google Ads (PPC)**: High-ROAS Search & Shopping campaigns with negative keyword trees.
   - 🔍 **SEO Services**: Technical SEO siloing, schema JSON-LD, and Google Map Pack 3-Pack rankings.
2. **25 In-House Free SEO Tools (4 Pillars)**:
   - **One Page SEO (10 Tools)**: Keyword Density, Heading Hierarchy (H1-H6), Image ALT, Word Counter, SERP Snippet Preview, etc.
   - **Off Page SEO (5 Tools)**: Backlink Readiness, DA & PA signals, Competitor Link Analyzer, Referring Domains, Anchor Text.
   - **Technical SEO (5 Tools)**: Core Web Vitals Speed, Broken Links, XML Sitemap Parser, Robots.txt Tester, Schema JSON-LD Validator.
   - **Local SEO (5 Tools)**: Local Rank Checker, Google Business Profile (GBP), Local Citations, NAP Consistency, Local SEO Audit.
3. **Owner-Only Portfolio Administration**:
   - Public visitors experience a 100% read-only interface.
   - Protected **Owner Portal** accessible only by Waqas Mehmood via private PIN key to add, manage, and delete portfolio case studies.
4. **Direct Client Inquiry Pipeline**:
   - Direct Email & WhatsApp messaging.
   - Integrated contact form submitting directly to SQLite database with lead notifications.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Tailwind CSS 4, Vite, Lucide Icons |
| **Backend API** | PHP 8.3, Laravel 11/13, RESTful API Controllers |
| **Database** | SQLite (Self-contained, zero-configuration) |
| **Hosting & Automation** | Windows / Linux Compatible, One-click Dev Runner (`run_dev.bat`) |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+ & npm
- PHP 8.2+
- Git & GitHub CLI

### Starting Development Servers
Double-click `run_dev.bat` or run each service in separate terminals:

```bash
# 1. Start Laravel Backend (Port 8000)
cd backend
php artisan serve --port=8000

# 2. Start React Frontend (Port 5173)
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔐 Owner Management Access
- Navigate to the footer and click **Owner Portal**.
- Enter master authentication key: `waqas2026` *(Configurable in `backend/.env` via `ADMIN_SECRET_KEY`)*.
- Owner mode reveals project creation and deletion controls.

---

## 📄 License & Attribution
© 2026 **Waqas Mehmood**. All rights reserved.  
Website: [waqasmehmood.com](https://waqasmehmood.com)
