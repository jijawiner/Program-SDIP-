# 🎯 GitHub Issues Plan for SDIP Project

## 📌 Issue Categories

### 🔴 Priority: High (ต้องทำก่อน)
### 🟡 Priority: Medium (ทำตาม)
### 🟢 Priority: Low (ทำเมื่อว่าง)

---

## 🔴 Phase 1: Core System Setup

### Issue #1: Setup Firebase Integration
**Priority:** 🔴 High
**Labels:** `enhancement`, `backend`, `firebase`

**Description:**
เชื่อมต่อ Firebase Realtime Database กับระบบ SDIP

**Tasks:**
- [ ] ตั้งค่า Firebase Project
- [ ] เพิ่ม Firebase SDK ใน Code.gs
- [ ] สร้าง Database Schema
- [ ] ทดสอบ Read/Write Operations
- [ ] Sync ข้อมูลระหว่าง Google Sheets และ Firebase

**Firebase URL:** `https://x-85fc7-default-rtdb.asia-southeast1.firebasedatabase.app`

---

### Issue #2: Fix Google Sheets Data Access
**Priority:** 🔴 High
**Labels:** `bug`, `backend`, `data`

**Description:**
ตรวจสอบและแก้ไขการดึงข้อมูลจาก Google Sheets

**Tasks:**
- [ ] ตรวจสอบ Spreadsheet ID: `1ymkYf1GTYFoW69r9kzQltw4ynh1CMSuAaVWnUrFgsOs`
- [ ] ทดสอบ Permission การเข้าถึง Sheets
- [ ] แก้ไขฟังก์ชัน `getSheet()` ให้รองรับทุก Sheets
- [ ] เพิ่ม Error Handling
- [ ] เขียน Unit Tests

---

### Issue #3: Implement CRUD Operations for Work Items
**Priority:** 🔴 High
**Labels:** `feature`, `backend`, `crud`

**Description:**
สร้างระบบ CRUD สำหรับจัดการงานค้าง/งานคืน

**Tasks:**
- [ ] Create: เพิ่มงานค้างใหม่
- [ ] Read: ดึงข้อมูลงานค้าง (มีแล้ว)
- [ ] Update: แก้ไขสถานะงาน
- [ ] Delete: ลบงานที่เสร็จแล้ว
- [ ] Bulk Operations: อัปเดตหลายรายการพร้อมกัน

**Files to modify:**
- `Code.gs` (Backend functions)

---

### Issue #4: Complete Scan Return Feature
**Priority:** 🔴 High
**Labels:** `feature`, `frontend`, `backend`

**Description:**
ทำฟีเจอร์สแกนรับคืนชิ้นงานให้เสร็จสมบูรณ์

**Tasks:**
- [ ] สร้างหน้า Scan Return UI
- [ ] เชื่อม Barcode Scanner (Camera/External)
- [ ] บันทึกข้อมูลการรับคืนลง Firebase + Sheets
- [ ] แสดงประวัติการสแกน
- [ ] เพิ่มฟีเจอร์ยกเลิกการสแกน

---

## 🟡 Phase 2: Data Management

### Issue #5: Implement Data Backup System
**Priority:** 🟡 Medium
**Labels:** `enhancement`, `backend`, `data`

**Description:**
สร้างระบบ Backup ข้อมูลอัตโนมัติ

**Tasks:**
- [ ] Backup ข้อมูลจาก Google Sheets ไปยัง Firebase
- [ ] Scheduled Backup (ทุกวัน/ทุกสัปดาห์)
- [ ] Export ข้อมูลเป็น JSON
- [ ] Restore จาก Backup
- [ ] แจ้งเตือนเมื่อ Backup สำเร็จ/ล้มเหลว

---

### Issue #6: Add CSV/Excel Export Feature
**Priority:** 🟡 Medium
**Labels:** `feature`, `frontend`

**Description:**
เพิ่มฟีเจอร์ Export ข้อมูลเป็น CSV/Excel

**Tasks:**
- [ ] ปุ่ม Export บนตาราง Detail
- [ ] Export ข้อมูลงานค้าง
- [ ] Export ข้อมูลงานคืน
- [ ] รองรับ UTF-8 (ภาษาไทย)
- [ ] แสดง Progress Bar

**Reference:** `DashboardComponent.html:1055` (มีฟังก์ชัน `exportTableToCSV` แล้ว แต่ต้องทดสอบ)

---

### Issue #7: Add Data Import Feature
**Priority:** 🟡 Medium
**Labels:** `feature`, `backend`

**Description:**
รองรับ Import ข้อมูลจากไฟล์ภายนอก

**Tasks:**
- [ ] Upload CSV/Excel
- [ ] Validate ข้อมูล
- [ ] Import ลง Google Sheets
- [ ] แสดงผลลัพธ์ (Success/Errors)
- [ ] Rollback เมื่อเกิดข้อผิดพลาด

---

### Issue #8: Implement Activity Log System
**Priority:** 🟡 Medium
**Labels:** `feature`, `backend`

**Description:**
บันทึก Log การทำงานของผู้ใช้

**Tasks:**
- [ ] Log ทุกครั้งที่ Login/Logout
- [ ] Log การเพิ่ม/แก้ไข/ลบงาน
- [ ] Log การสแกนรับคืน
- [ ] แสดงประวัติ Log
- [ ] Filter Log ตามวันที่/ผู้ใช้

**Sheet:** `บันทึกสถานะรายวัน`

---

## 🟢 Phase 3: UI/UX Improvements

### Issue #9: Improve Mobile Responsive Design
**Priority:** 🟢 Low
**Labels:** `ui`, `mobile`, `css`

**Description:**
ปรับปรุง UI ให้รองรับ Mobile ได้ดีขึ้น

**Tasks:**
- [ ] ทดสอบบน Mobile (iOS, Android)
- [ ] แก้ไข Breakpoints (@media queries)
- [ ] ปรับขนาดปุ่ม/ฟอนต์
- [ ] Hamburger Menu สำหรับ Mobile
- [ ] Touch-friendly ทุก Element

**Files:**
- `CSS.html`
- `DashboardComponent.html`
- `PowerUser_Dashboard.html`

---

### Issue #10: Add Search and Filter Features
**Priority:** 🟢 Low
**Labels:** `feature`, `frontend`

**Description:**
เพิ่มฟีเจอร์ค้นหาและกรองข้อมูล

**Tasks:**
- [ ] Search Box ด้านบน
- [ ] Filter ตามประเภทงาน (R, EMS, COD)
- [ ] Filter ตามวันที่
- [ ] Filter ตามสถานะ
- [ ] Highlight ผลลัพธ์

---

### Issue #11: Enhance Loading States and Error Handling
**Priority:** 🟢 Low
**Labels:** `enhancement`, `frontend`

**Description:**
ปรับปรุง Loading States และ Error Messages

**Tasks:**
- [ ] Skeleton Loading แทน Spinner
- [ ] Error Messages แบบ Toast
- [ ] Retry Button เมื่อเกิด Error
- [ ] Offline Mode Detection
- [ ] Progress Indicators

---

### Issue #12: Implement Dark Mode
**Priority:** 🟢 Low
**Labels:** `enhancement`, `ui`, `optional`

**Description:**
เพิ่มโหมด Dark Mode (Optional)

**Tasks:**
- [ ] สร้าง CSS Variables สำหรับ Colors
- [ ] ปุ่มสลับ Light/Dark Mode
- [ ] บันทึก Preference ใน LocalStorage
- [ ] ทดสอบทุกหน้า
- [ ] Accessibility Check

---

## 🧪 Phase 4: Testing & Security

### Issue #13: Write Unit Tests
**Priority:** 🟡 Medium
**Labels:** `testing`, `backend`

**Description:**
เขียน Unit Tests สำหรับฟังก์ชันสำคัญ

**Tasks:**
- [ ] Test Login/Logout
- [ ] Test Data Fetching
- [ ] Test CRUD Operations
- [ ] Test Role-Based Access
- [ ] Coverage Report

---

### Issue #14: Security Audit
**Priority:** 🔴 High
**Labels:** `security`, `backend`

**Description:**
ตรวจสอบความปลอดภัยของระบบ

**Tasks:**
- [ ] ตรวจสอบ SQL Injection (ถ้ามี)
- [ ] ป้องกัน XSS Attacks
- [ ] Validate Input ทุกที่
- [ ] เข้ารหัส Password (ถ้ามีการเก็บ)
- [ ] Rate Limiting

**Note:** ตรวจสอบ `Code.gs:checkLogin()` - ควรใช้ Password Hashing

---

### Issue #15: Performance Testing
**Priority:** 🟡 Medium
**Labels:** `testing`, `performance`

**Description:**
ทดสอบประสิทธิภาพระบบ

**Tasks:**
- [ ] Load Testing (จำนวนผู้ใช้พร้อมกัน)
- [ ] Database Query Optimization
- [ ] Lazy Loading สำหรับตาราง
- [ ] Cache ข้อมูลที่ดึงบ่อย
- [ ] Monitor Response Time

---

### Issue #16: User Acceptance Testing (UAT)
**Priority:** 🔴 High
**Labels:** `testing`, `uat`

**Description:**
ทดสอบกับผู้ใช้จริง

**Tasks:**
- [ ] สร้าง Test Scenarios
- [ ] ให้ทีมทดสอบ (จักร, อลิช, จอร์น, โซเฟีย)
- [ ] รวบรวม Feedback
- [ ] แก้ไข Bugs ที่พบ
- [ ] Re-test

---

## 🚀 Phase 5: Deployment & Monitoring

### Issue #17: Deploy to Production
**Priority:** 🔴 High
**Labels:** `deployment`, `production`

**Description:**
Deploy ระบบขึ้น Production

**Tasks:**
- [ ] สร้าง Production Branch
- [ ] Deploy Google Apps Script
- [ ] ตั้งค่า Firebase Production
- [ ] Migrate ข้อมูลจริง
- [ ] Smoke Testing

---

### Issue #18: Setup Monitoring and Alerts
**Priority:** 🟡 Medium
**Labels:** `monitoring`, `devops`

**Description:**
ติดตามการทำงานของระบบ

**Tasks:**
- [ ] Google Analytics
- [ ] Error Tracking (Sentry/Rollbar)
- [ ] Performance Monitoring
- [ ] Alert เมื่อมี Error
- [ ] Dashboard สำหรับ Admin

---

### Issue #19: User Training and Documentation
**Priority:** 🟡 Medium
**Labels:** `documentation`, `training`

**Description:**
สร้างเอกสารและฝึกอบรมผู้ใช้

**Tasks:**
- [ ] User Manual (ภาษาไทย)
- [ ] Video Tutorial
- [ ] FAQ
- [ ] Admin Guide
- [ ] Developer Documentation

---

### Issue #20: Collect Feedback and Iterate
**Priority:** 🟢 Low
**Labels:** `feedback`, `enhancement`

**Description:**
รวบรวม Feedback และปรับปรุงระบบ

**Tasks:**
- [ ] สร้าง Feedback Form
- [ ] Weekly Review Meeting
- [ ] Prioritize New Features
- [ ] Bug Fix Iterations
- [ ] Release Notes

---

## 📊 Summary

- **Total Issues:** 20
- **Phase 1 (Core):** 4 issues 🔴
- **Phase 2 (Data):** 4 issues 🟡
- **Phase 3 (UI/UX):** 4 issues 🟢
- **Phase 4 (Testing):** 4 issues 🟡🔴
- **Phase 5 (Deploy):** 4 issues 🔴🟡🟢

---

## 🎯 Next Steps

1. สร้าง GitHub Issues ตามแผนนี้
2. Add to Project Board (Todo/In Progress/Done)
3. Assign Issues ให้ทีม
4. ตั้ง Milestones
5. เริ่มทำตาม Priority

---

**Created:** 2025-10-31
**Project:** SDIP V2
**GitHub:** https://github.com/jijawiner/Program-SDIP-
