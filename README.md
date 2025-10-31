# 🏢 SDIP - Smart Delivery Insight Platform

> ระบบตรวจสอบงานค้างและจัดการชิ้นงาน - ไปรษณีย์ไทย

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-In_Development-yellow.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Team](#team)
- [Documentation](#documentation)

---

## 🎯 Overview

**SDIP (Smart Delivery Insight Platform)** คือระบบบริหารจัดการงานค้างและงานคืนสำหรับพนักงานจัดส่งไปรษณีย์ไทย ช่วยให้สามารถติดตามสถานะงาน บันทึกข้อมูล และวิเคราะห์ประสิทธิภาพการทำงานได้แบบ Real-time

### ✨ Highlights

- 📊 Dashboard แสดงข้อมูลงานแบบ Real-time
- 🔐 ระบบล็อกอิน/ล็อกเอาท์ พร้อม Role-Based Access Control
- 📱 Responsive Design รองรับทุกอุปกรณ์
- 📤 สแกนรับคืนชิ้นงาน (Barcode Scanner)
- 📈 กราฟและรายงานสถิติ
- 🔄 Sync ข้อมูลระหว่าง Google Sheets และ Firebase

---

## 🚀 Features

### ✅ ทำงานได้แล้ว

- [x] ระบบล็อกอิน/ล็อกเอาท์ (Auto-login + Manual)
- [x] Dashboard แสดงข้อมูลงาน (ส่งเงิน, เตรียม, บันทึก, งานค้าง, งานคืน)
- [x] แยก Role: USER, PowerUser, Admin
- [x] กราฟ Pie Chart แสดงสัดส่วนงาน
- [x] ดูรายละเอียดงานตามประเภท (R, EMS, COD)
- [x] PowerUser Dashboard - ดูข้อมูลทีม
- [x] Drilldown ดูข้อมูลแต่ละพนักงาน

### 🚧 กำลังพัฒนา

- [ ] Firebase Integration
- [ ] Scan Return Feature (สแกนรับคืน)
- [ ] Export CSV/Excel
- [ ] Real-time Notifications
- [ ] Mobile App Version

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Responsive Design)
- **JavaScript (ES6+)** - Logic
- **Google Charts** - Data Visualization

### Backend
- **Google Apps Script (GAS)** - Server-side Logic
- **Google Sheets** - Data Storage (Master)
- **Firebase Realtime Database** - Real-time Data (Cache)

### Tools
- **GitHub** - Version Control
- **GitHub Projects** - Project Management
- **Google Cloud Platform** - Deployment

---

## 📦 Getting Started

### Prerequisites

1. Google Account
2. Access to Google Apps Script
3. Firebase Project
4. Node.js (optional, for Firebase Functions)

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/jijawiner/Program-SDIP-.git
cd Program-SDIP-
```

#### 2. Setup Google Apps Script

1. เข้า [Google Apps Script](https://script.google.com/)
2. สร้าง New Project
3. Copy โค้ดจาก `Code.gs` ไปวาง
4. เพิ่มไฟล์ HTML:
   - `Login.html`
   - `User_Dashboard.html`
   - `PowerUser_Dashboard.html`
   - `DashboardComponent.html`
   - `CSS.html`
5. Deploy as Web App

#### 3. Setup Google Sheets

1. สร้าง Google Sheets จาก Template
2. Copy Spreadsheet ID: `1ymkYf1GTYFoW69r9kzQltw4ynh1CMSuAaVWnUrFgsOs`
3. อัปเดต `CONFIG.SPREADSHEET_ID` ใน `Code.gs`

#### 4. Setup Firebase (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init database

# Deploy rules
firebase deploy --only database
```

---

## 📁 Project Structure

```
Program-SDIP-/
├── Code.gs                      # Backend (Google Apps Script)
├── Login.html                   # Login Page
├── User_Dashboard.html          # User Dashboard
├── PowerUser_Dashboard.html     # PowerUser/Admin Dashboard
├── DashboardComponent.html      # Reusable Dashboard Component
├── CSS.html                     # Shared CSS Styles
├── README.md                    # This file
├── PROJECT_ANALYSIS.md          # Project Analysis
├── GITHUB_ISSUES_PLAN.md        # GitHub Issues Plan
├── FIREBASE_SCHEMA.md           # Firebase Database Schema
└── .gitignore
```

---

## 💻 Development

### Run Locally

1. เปิด Google Apps Script Editor
2. Run `doGet()` function
3. Authorize permissions
4. Click "Deploy" → "Test deployments"
5. เปิด URL ที่ได้

### Testing

```javascript
// Test Sheet Connection
function testSheetConnection() {
  var sheet = getSheet('Requirements');
  Logger.log(sheet.getName());
}

// Test Login
function testLogin() {
  var result = checkLogin('testuser', 'testpass');
  Logger.log(result);
}
```

### Debug

```javascript
// Enable Debug Mode
const DEBUG = true;

function debugLog(message) {
  if (DEBUG) {
    console.log('[DEBUG]', message);
  }
}
```

---

## 🚀 Deployment

### Deploy to Production

```bash
# 1. Build project
# (No build needed for GAS)

# 2. Deploy Google Apps Script
# Go to: Extensions → Apps Script → Deploy → New deployment

# 3. Deploy Firebase (if using)
firebase deploy --only database,functions

# 4. Update DNS (if custom domain)
```

### Environment Variables

```javascript
// Code.gs
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SHEET_ID',
  FIREBASE_URL: 'YOUR_FIREBASE_URL',
  ENVIRONMENT: 'production' // or 'development'
};
```

---

## 👥 Team

| Role | Name | GitHub | Responsibility |
|------|------|--------|----------------|
| **PM** | คุณจักร | - | Project Management, Planning |
| **UI/UX** | คุณอลิช | - | Design, User Experience |
| **SA** | คุณจอร์น | - | System Analysis, Architecture |
| **Developer** | คุณโซเฟีย | - | Development, Testing |

---

## 📚 Documentation

- [📊 Project Analysis](./PROJECT_ANALYSIS.md)
- [📋 GitHub Issues Plan](./GITHUB_ISSUES_PLAN.md)
- [🔥 Firebase Schema](./FIREBASE_SCHEMA.md)

### API Documentation

#### `checkLogin(username, password)`
ตรวจสอบล็อกอิน

```javascript
function checkLogin(username, password) {
  // Returns: { ok: boolean, username: string, role: string }
}
```

#### `getHomePageData()`
ดึงข้อมูลหน้า Home

```javascript
function getHomePageData() {
  // Returns: { employees, backlogStats, returnStats, lastUpdated }
}
```

---

## 🔗 Links

- **GitHub Repository:** https://github.com/jijawiner/Program-SDIP-
- **GitHub Project:** https://github.com/users/jijawiner/projects/1
- **Google Sheets:** [View Sheet](https://docs.google.com/spreadsheets/d/1ymkYf1GTYFoW69r9kzQltw4ynh1CMSuAaVWnUrFgsOs/edit)
- **Firebase:** https://x-85fc7-default-rtdb.asia-southeast1.firebasedatabase.app

---

## 📝 License

Private - ไปรษณีย์ไทย Internal Use Only

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

**Project Link:** https://github.com/jijawiner/Program-SDIP-

---

## 📌 Roadmap

### Q1 2025
- [x] Initial Development
- [x] Core Features
- [ ] Firebase Integration
- [ ] Beta Testing

### Q2 2025
- [ ] Mobile App Development
- [ ] Advanced Analytics
- [ ] Performance Optimization
- [ ] Production Release

### Q3 2025
- [ ] Feature Enhancements
- [ ] API Integration
- [ ] Third-party Integrations

---

**Last Updated:** 2025-10-31
**Version:** 2.0.0
**Status:** In Development 🚧

---

<p align="center">
  Made with ❤️ by SDIP Team
</p>
