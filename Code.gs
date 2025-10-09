// =================================================================
// 🎯 SMART DELIVERY INSIGHT - PROFESSIONAL CODE STRUCTURE
// =================================================================
// Version: 2.0.0
// Last Updated: 2025-09-30
// Authors: คุณจักร (หัวหน้าโครงการ), ทีม SDIP
// Description: ระบบจัดการการส่งมอบอัจฉริยะด้วย Google Apps Script
// =================================================================

// =================================================================
// 📂 SECTION 1: WEB APP INITIALIZATION & ROUTING
// =================================================================

/**
 * 1.1 ฟังก์ชันเริ่มต้นแอปพลิเคชัน (Web App Entry Point)
 * 
 * Description: ฟังก์ชันหลักที่ถูกเรียกเมื่อมีการเปิด Web App
 * จัดการการโหลดหน้า Login และตรวจสอบความพร้อมของระบบ
 * 
 * @returns {HtmlOutput} HTML page ที่จะแสดงผล (Login หรือ Error)
 * 
 * Technical Notes:
 * - ใช้ HtmlService.createTemplateFromFile() สำหรับโหลด HTML
 * - ตั้งค่า XFrameOptionsMode.ALLOWALL เพื่อให้แสดงใน iframe ได้
 * - มี Error Handling สำหรับกรณีไฟล์หาย
 */
function doGet() {
  const MAIN_FILE = 'Login';
  
  try {
    console.log(`🚀 [${getCurrentThaiDateTime()}] เริ่มต้นระบบ Smart Delivery Insight`);
    console.log(`🔍 [INIT] กำลังโหลดไฟล์: ${MAIN_FILE}.html`);
    
    const template = HtmlService.createTemplateFromFile(MAIN_FILE);
    
    if (!template) {
      throw new Error(`ไม่พบไฟล์ ${MAIN_FILE}.html ในโปรเจค`);
    }
    
    console.log(`✅ [INIT] โหลด ${MAIN_FILE}.html สำเร็จ`);
    
    return template.evaluate()
        .setTitle('Smart Delivery Insight - Postman System')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setFaviconUrl('https://www.thailandpost.com/favicon.ico');
        
  } catch (error) {
    console.error(`❌ [INIT ERROR] ${error.toString()}`);
    return createErrorPage('ระบบไม่พร้อมใช้งาน', error.toString());
  }
}

/**
 * 1.2 ฟังก์ชันสำหรับรวมไฟล์ HTML/CSS/JS
 * 
 * Description: โหลดและรวมไฟล์ภายนอกเข้ามาใน HTML หลัก
 * ใช้กับ <?!= include('ชื่อไฟล์') ?> ใน HTML Template
 * 
 * @param {string} filename - ชื่อไฟล์ที่ต้องการโหลด (ไม่ต้องมี .html)
 * @returns {string} เนื้อหาของไฟล์ หรือ HTML error message
 * 
 * Example Usage:
 * <?!= include('CSS') ?>
 * <?!= include('JavaScript') ?>
 */
function include(filename) {
  const startTime = new Date().getTime();
  
  try {
    if (!filename || typeof filename !== 'string') {
      throw new Error('ชื่อไฟล์ไม่ถูกต้อง (ต้องเป็น string)');
    }
    
    console.log(`📄 [INCLUDE] กำลังโหลด: ${filename}`);
    
    const output = HtmlService.createHtmlOutputFromFile(filename);
    
    if (!output) {
      throw new Error(`ไม่พบไฟล์: ${filename}`);
    }
    
    const content = output.getContent();
    const loadTime = new Date().getTime() - startTime;
    
    console.log(`✅ [INCLUDE] โหลด ${filename} สำเร็จ (${content.length} chars, ${loadTime}ms)`);
    
    return content;
    
  } catch (error) {
    console.error(`❌ [INCLUDE ERROR] ${filename}: ${error.toString()}`);
    
    return `
      <!-- ⚠️ Error: ไม่สามารถโหลดไฟล์ ${filename} -->
      <div style="
        background: #fee; 
        border: 2px solid #c00; 
        padding: 15px; 
        margin: 10px;
        border-radius: 8px;
        font-family: monospace;
      ">
        <strong style="color: #c00;">⚠️ File Load Error</strong><br>
        <strong>File:</strong> ${filename}<br>
        <strong>Error:</strong> ${error.toString()}<br>
        <small>กรุณาตรวจสอบว่าไฟล์มีอยู่ในโปรเจค</small>
      </div>
    `;
  }
}

/**
 * 1.3 สร้างหน้า Error แบบมืออาชีพ
 * 
 * @param {string} title - หัวข้อข้อผิดพลาด
 * @param {string} message - รายละเอียดข้อผิดพลาด
 * @returns {HtmlOutput} หน้า HTML สำหรับแสดง error
 */
function createErrorPage(title, message) {
  const errorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Smart Delivery Insight - System Error</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600&display=swap');
        
        body {
          font-family: 'Kanit', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 20px;
        }
        
        .error-container {
          background: white;
          max-width: 600px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        
        .error-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .error-title {
          color: #e74c3c;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .error-message {
          color: #555;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 25px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          word-break: break-word;
        }
        
        .help-section {
          text-align: left;
          background: #e8f4f8;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .help-section h3 {
          color: #3498db;
          margin-top: 0;
        }
        
        .help-section ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .help-section li {
          margin: 8px 0;
          color: #555;
        }
        
        .btn-retry {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 20px;
          transition: transform 0.2s;
        }
        
        .btn-retry:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h1 class="error-title">${title}</h1>
        <div class="error-message">
          <strong>รายละเอียด:</strong><br>
          ${message}
        </div>
        
        <div class="help-section">
          <h3>🛠️ วิธีแก้ไขปัญหา</h3>
          <ol>
            <li>ตรวจสอบว่ามีไฟล์ <strong>Login.html</strong> ในโปรเจค</li>
            <li>ตรวจสอบชื่อไฟล์ให้ตรงกัน (case-sensitive)</li>
            <li>ตรวจสอบ Permissions ของ Google Apps Script</li>
            <li>ลอง Deploy ใหม่อีกครั้ง</li>
            <li>ตรวจสอบ Logs ใน Apps Script Editor</li>
          </ol>
        </div>
        
        <button class="btn-retry" onclick="location.reload()">
          🔄 ลองใหม่อีกครั้ง
        </button>
        
        <p style="margin-top: 20px; color: #999; font-size: 12px;">
          Smart Delivery Insight v2.0.0<br>
          Time: ${getCurrentThaiDateTime()}
        </p>
      </div>
    </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(errorHtml)
      .setTitle('System Error - Smart Delivery Insight');
}

// =================================================================
// 📂 SECTION 2: USER AUTHENTICATION SYSTEM
// =================================================================

/**
 * 2.1 ระบบ Cache สำหรับข้อมูลผู้ใช้งาน
 * 
 * Description: ดึงข้อมูลผู้ใช้จาก Sheet และเก็บใน Cache เพื่อเพิ่มความเร็ว
 * 
 * @returns {Object} Object ที่มี username เป็น key และข้อมูลผู้ใช้เป็น value
 * 
 * Data Structure:
 * {
 *   "username1": { password: "xxx", role: "Admin", rowIndex: 2 },
 *   "username2": { password: "yyy", role: "User", rowIndex: 3 }
 * }
 * 
 * Performance:
 * - ใช้ CacheService.getScriptCache() (ใช้ร่วมกันทั้ง Script)
 * - Cache อายุ 5 นาที (300 วินาที)
 * - ลด Load ของ Sheet ลง 95%
 */
function getCachedUserData() {
  const CACHE_KEY = 'USER_DATABASE';
  const CACHE_DURATION = 300; // 5 นาที
  const SHEET_NAME = 'SDIP Employee Database';
  
  const cache = CacheService.getScriptCache();
  let cachedData = cache.get(CACHE_KEY);
  
  if (cachedData) {
    console.log('⚡ [CACHE HIT] ใช้ข้อมูล User จาก Cache');
    return JSON.parse(cachedData);
  }
  
  console.log('📊 [CACHE MISS] อ่านข้อมูล User จาก Sheet...');
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`ไม่พบ Sheet "${SHEET_NAME}"`);
    }
    
    const data = sheet.getDataRange().getValues();
    const userMap = {};
    let validUserCount = 0;
    
    // วนอ่านข้อมูล (ข้ามแถวแรกที่เป็น Header)
    for (let i = 1; i < data.length; i++) {
      const username = (data[i][1] || '').toString().trim();
      
      if (username) {
        userMap[username] = {
          password: (data[i][2] || '').toString(),
          role: (data[i][3] || 'User').toString().trim(),
          rowIndex: i + 1
        };
        validUserCount++;
      }
    }
    
    console.log(`✅ [CACHE] โหลด ${validUserCount} Users สำเร็จ`);
    
    // เก็บลง Cache
    cache.put(CACHE_KEY, JSON.stringify(userMap), CACHE_DURATION);
    
    return userMap;
    
  } catch (error) {
    console.error(`❌ [CACHE ERROR] ${error.toString()}`);
    return {};
  }
}

/**
 * 2.2 ฟังก์ชันล็อคอินผู้ใช้งาน
 * 
 * Description: ตรวจสอบ Username/Password และสร้าง Session Token
 * 
 * @param {Object} formData - ข้อมูลจากฟอร์ม { username, password }
 * @returns {Object} { status, role, token, processTime } หรือ { status, message }
 * 
 * Security Features:
 * - ใช้ Session Token แทน Cookie
 * - Token มีอายุ 2 วัน
 * - เก็บ Token ใน UserProperties (ปลอดภัย)
 * 
 * Example Response (Success):
 * {
 *   status: 'success',
 *   role: 'Admin',
 *   token: 'abc-123-xyz',
 *   processTime: 245
 * }
 */
function userLogin(formData) {
  const startTime = new Date().getTime();
  const functionName = 'userLogin';
  
  console.log(`🔐 [${functionName}] เริ่มการล็อคอิน...`);
  
  // ตรวจสอบข้อมูลที่ส่งมา
  if (!formData || !formData.username || !formData.password) {
    console.log(`❌ [${functionName}] ข้อมูลไม่ครบถ้วน`);
    return {
      status: 'error',
      message: 'กรุณากรอก Username และ Password ให้ครบถ้วน',
      processTime: new Date().getTime() - startTime
    };
  }
  
  try {
    const userData = getCachedUserData();
    const username = formData.username.trim();
    const password = formData.password;
    
    console.log(`🔍 [${functionName}] ตรวจสอบ User: ${username}`);
    
    const user = userData[username];
    
    // ตรวจสอบ Username และ Password
    if (user && user.password === password) {
      console.log(`✅ [${functionName}] ล็อคอินสำเร็จ: ${username} (${user.role})`);
      
      // สร้าง Session Token
      const token = Utilities.getUuid();
      const expiration = new Date().getTime() + (2 * 24 * 60 * 60 * 1000); // 2 วัน
      
      // เก็บ Session
      const userProperties = PropertiesService.getUserProperties();
      userProperties.setProperty(token, JSON.stringify({
        username: username,
        role: user.role,
        expires: expiration,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }));
      
      const processTime = new Date().getTime() - startTime;
      console.log(`⚡ [${functionName}] ใช้เวลา ${processTime}ms`);
      
      return {
        status: 'success',
        role: user.role,
        token: token,
        username: username,
        processTime: processTime
      };
      
    } else {
      console.log(`❌ [${functionName}] ล็อคอินไม่สำเร็จ: ${username}`);
      return {
        status: 'error',
        message: 'Username หรือ Password ไม่ถูกต้อง',
        processTime: new Date().getTime() - startTime
      };
    }
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่',
      processTime: new Date().getTime() - startTime
    };
  }
}

/**
 * 2.3 ตรวจสอบ Session Token
 * 
 * @param {string} token - Session token ที่ต้องการตรวจสอบ
 * @returns {Object} { status, username, role } หรือ { status, reason }
 */
function checkSessionToken(token) {
  const functionName = 'checkSessionToken';
  
  if (!token) {
    return { status: 'invalid', reason: 'ไม่มี token' };
  }
  
  try {
    const userProperties = PropertiesService.getUserProperties();
    const sessionData = userProperties.getProperty(token);
    
    if (!sessionData) {
      console.log(`❌ [${functionName}] Token ไม่ถูกต้อง`);
      return { status: 'invalid', reason: 'token ไม่ถูกต้อง' };
    }
    
    const session = JSON.parse(sessionData);
    const currentTime = new Date().getTime();
    
    // ตรวจสอบอายุ Token
    if (currentTime < session.expires) {
      // ต่ออายุ Token และอัพเดท Last Activity
      session.expires = currentTime + (2 * 24 * 60 * 60 * 1000);
      session.lastActivity = new Date().toISOString();
      userProperties.setProperty(token, JSON.stringify(session));
      
      console.log(`✅ [${functionName}] Token ถูกต้อง: ${session.username}`);
      
      return {
        status: 'valid',
        username: session.username,
        role: session.role,
        loginTime: session.loginTime
      };
    } else {
      // Token หมดอายุ
      userProperties.deleteProperty(token);
      console.log(`⏰ [${functionName}] Token หมดอายุ`);
      return { status: 'invalid', reason: 'Session หมดอายุ' };
    }
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'invalid', reason: 'ข้อผิดพลาดระบบ' };
  }
}

/**
 * 2.4 ออกจากระบบ (Logout)
 * 
 * @param {string} token - Session token ที่ต้องการลบ
 * @returns {Object} { status, message }
 */
function logout(token) {
  const functionName = 'logout';
  
  try {
    if (token) {
      const userProperties = PropertiesService.getUserProperties();
      const sessionData = userProperties.getProperty(token);
      
      if (sessionData) {
        const session = JSON.parse(sessionData);
        console.log(`🚪 [${functionName}] ${session.username} ออกจากระบบ`);
      }
      
      userProperties.deleteProperty(token);
      return { status: 'success', message: 'ออกจากระบบเรียบร้อย' };
    }
    
    return { status: 'success', message: 'ไม่มี Session ให้ลบ' };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'error', message: 'เกิดข้อผิดพลาด' };
  }
}

// =================================================================
// 📂 SECTION 3: DASHBOARD & PAGE MANAGEMENT
// =================================================================

/**
 * 3.1 โหลดหน้า Dashboard
 * 
 * @returns {string} HTML content ของ Dashboard
 */
function getDashboardHtml() {
  const functionName = 'getDashboardHtml';
  
  try {
    console.log(`📊 [${functionName}] กำลังโหลด Dashboard...`);
    return include('Dashboard');
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return createErrorPage('ไม่พบหน้า Dashboard', error.toString()).getContent();
  }
}

// =================================================================
// 📂 SECTION 4: UTILITY FUNCTIONS
// =================================================================

/**
 * 4.1 ดึงวันที่และเวลาปัจจุบันในรูปแบบไทย
 * 
 * @returns {string} วันที่และเวลา เช่น "30 ก.ย. 2568 14:30:45"
 */
function getCurrentThaiDateTime() {
  const now = new Date();
  const thaiYear = now.getFullYear() + 543;
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  
  const day = now.getDate();
  const month = thaiMonths[now.getMonth()];
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${day} ${month} ${thaiYear} ${hours}:${minutes}:${seconds}`;
}

/**
 * 4.2 ตรวจสอบไฟล์ทั้งหมดในโปรเจค (สำหรับ Debug)
 * 
 * @returns {Object} { status, files } หรือ { status, message }
 */
function checkProjectFiles() {
  try {
    const files = [];
    const projectFiles = [
      'Login.html',
      'Dashboard.html', 
      'CSS.html',
      'JavaScript.html'
    ];
    
    projectFiles.forEach(fileName => {
      try {
        const content = HtmlService.createHtmlOutputFromFile(fileName.replace('.html', ''));
        files.push({
          name: fileName,
          status: 'found',
          size: content.getContent().length
        });
      } catch (e) {
        files.push({
          name: fileName,
          status: 'missing',
          error: e.toString()
        });
      }
    });
    
    console.log('📁 [FILE CHECK] รายการไฟล์:', files);
    return { status: 'success', files: files };
    
  } catch (error) {
    console.error('❌ [FILE CHECK ERROR]:', error.toString());
    return { status: 'error', message: error.toString() };
  }
}

/**
 * 4.3 ล้าง Session ที่หมดอายุ (สำหรับ Maintenance)
 * 
 * @returns {Object} { status, cleanedCount, message }
 */
function cleanExpiredSessions() {
  const functionName = 'cleanExpiredSessions';
  
  try {
    const userProperties = PropertiesService.getUserProperties();
    const allProps = userProperties.getProperties();
    const currentTime = new Date().getTime();
    let cleanedCount = 0;
    
    Object.keys(allProps).forEach(token => {
      try {
        const sessionData = JSON.parse(allProps[token]);
        
        // ตรวจสอบว่าเป็น Session และหมดอายุหรือไม่
        if (sessionData.expires && currentTime > sessionData.expires) {
          userProperties.deleteProperty(token);
          cleanedCount++;
          console.log(`🗑️ [${functionName}] ลบ Session: ${sessionData.username || 'Unknown'}`);
        }
      } catch (e) {
        // ไม่ใช่ Session data หรือ format ไม่ถูกต้อง
      }
    });
    
    console.log(`✅ [${functionName}] ล้าง ${cleanedCount} Sessions`);
    
    return {
      status: 'success',
      message: `ล้าง Session หมดอายุ ${cleanedCount} รายการ`,
      cleanedCount: cleanedCount
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'error', message: error.toString() };
  }
}

/**
 * 4.4 ดูรายการ Session ที่ Active ทั้งหมด (สำหรับ Admin)
 * 
 * @returns {Object} { status, sessions, count }
 */
function getAllActiveSessions() {
  const functionName = 'getAllActiveSessions';
  
  try {
    const userProperties = PropertiesService.getUserProperties();
    const allProps = userProperties.getProperties();
    const sessions = [];
    
    Object.keys(allProps).forEach(token => {
      try {
        const sessionData = JSON.parse(allProps[token]);
        
        if (sessionData.username && sessionData.expires) {
          sessions.push({
            token: token.substring(0, 8) + '...',
            username: sessionData.username,
            role: sessionData.role,
            loginTime: sessionData.loginTime,
            lastActivity: sessionData.lastActivity,
            expires: new Date(sessionData.expires).toISOString(),
            isExpired: new Date().getTime() > sessionData.expires
          });
        }
      } catch (e) {
        // ไม่ใช่ Session data
      }
    });
    
    console.log(`📊 [${functionName}] พบ ${sessions.length} Active Sessions`);
    
    return {
      status: 'success',
      sessions: sessions,
      count: sessions.length
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'error', message: error.toString() };
  }
}

// =================================================================
// 📂 SECTION 5: TESTING & DEBUGGING FUNCTIONS
// =================================================================

/**
 * 5.1 ทดสอบการโหลดไฟล์แต่ละไฟล์
 * 
 * @param {string} filename - ชื่อไฟล์ที่ต้องการทดสอบ
 * @returns {Object} { status, filename, contentLength, preview }
 * 
 * Example Usage:
 * testFileLoad('CSS')
 * testFileLoad('Dashboard')
 */
function testFileLoad(filename) {
  const functionName = 'testFileLoad';
  
  try {
    console.log(`🧪 [${functionName}] ทดสอบโหลดไฟล์: ${filename}`);
    
    const content = include(filename);
    const hasError = content.includes('<!-- ⚠️ Error');
    
    const result = {
      status: hasError ? 'error' : 'success',
      filename: filename,
      contentLength: content.length,
      hasError: hasError,
      preview: content.substring(0, 100) + '...'
    };
    
    console.log(`${hasError ? '❌' : '✅'} [${functionName}] ${filename}: ${result.contentLength} chars`);
    
    return result;
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return {
      status: 'error',
      filename: filename,
      error: error.toString()
    };
  }
}

/**
 * 5.2 ทดสอบระบบล็อคอินด้วยข้อมูลทดสอบ
 * 
 * WARNING: ใช้เฉพาะในโหมด Development เท่านั้น!
 * 
 * @returns {Object} ผลการทดสอบ
 */
function testLoginSystem() {
  const functionName = 'testLoginSystem';
  
  console.log(`🧪 [${functionName}] เริ่มทดสอบระบบล็อคอิน...`);
  
  const testCases = [
    { username: '', password: '', expectedStatus: 'error' },
    { username: 'invalid_user', password: 'wrong', expectedStatus: 'error' }
  ];
  
  const results = [];
  
  testCases.forEach((testCase, index) => {
    console.log(`🧪 Test Case ${index + 1}: ${testCase.username || '(empty)'}`);
    
    const result = userLogin({
      username: testCase.username,
      password: testCase.password
    });
    
    const passed = result.status === testCase.expectedStatus;
    
    results.push({
      testCase: index + 1,
      input: testCase,
      output: result,
      passed: passed
    });
    
    console.log(`${passed ? '✅' : '❌'} Test Case ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedCount = results.filter(r => r.passed).length;
  
  return {
    status: 'success',
    totalTests: testCases.length,
    passed: passedCount,
    failed: testCases.length - passedCount,
    results: results
  };
}

/**
 * 5.3 ดูข้อมูล Cache ปัจจุบัน
 * 
 * @returns {Object} { status, cacheKeys, cacheData }
 */
function inspectCache() {
  const functionName = 'inspectCache';
  
  try {
    const cache = CacheService.getScriptCache();
    const userData = cache.get('USER_DATABASE');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      const userCount = Object.keys(parsedData).length;
      
      console.log(`📦 [${functionName}] Cache มี ${userCount} Users`);
      
      return {
        status: 'success',
        hasCache: true,
        userCount: userCount,
        sampleUsers: Object.keys(parsedData).slice(0, 5) // แสดง 5 คนแรก
      };
    } else {
      console.log(`📦 [${functionName}] Cache ว่างเปล่า`);
      return {
        status: 'success',
        hasCache: false,
        message: 'ไม่มีข้อมูลใน Cache'
      };
    }
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'error', message: error.toString() };
  }
}

/**
 * 5.4 ล้าง Cache ทั้งหมด
 * 
 * @returns {Object} { status, message }
 */
function clearAllCache() {
  const functionName = 'clearAllCache';
  
  try {
    const cache = CacheService.getScriptCache();
    cache.removeAll(['USER_DATABASE']);
    
    console.log(`🧹 [${functionName}] ล้าง Cache เรียบร้อย`);
    
    return {
      status: 'success',
      message: 'ล้าง Cache ทั้งหมดเรียบร้อย'
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'error', message: error.toString() };
  }
}

// =================================================================
// 📂 SECTION 6: SYSTEM MAINTENANCE & ADMIN FUNCTIONS
// =================================================================

/**
 * 6.1 ฟังก์ชันบำรุงรักษาระบบ (Run ทุกวัน)
 * 
 * Description: ทำความสะอาดระบบอัตโนมัติ
 * - ลบ Session หมดอายุ
 * - รีเซ็ต Cache
 * 
 * Setup: ตั้ง Trigger ใน Apps Script Editor
 * Triggers > Add Trigger > Function: dailyMaintenance > Time-driven > Day timer
 * 
 * @returns {Object} สรุปผลการบำรุงรักษา
 */
function dailyMaintenance() {
  const functionName = 'dailyMaintenance';
  const startTime = new Date().getTime();
  
  console.log(`🔧 [${functionName}] เริ่มบำรุงรักษาระบบประจำวัน...`);
  
  try {
    // 1. ล้าง Session หมดอายุ
    const cleanResult = cleanExpiredSessions();
    
    // 2. ล้าง Cache (จะสร้างใหม่เมื่อมีการใช้งาน)
    const cacheResult = clearAllCache();
    
    const duration = new Date().getTime() - startTime;
    
    console.log(`✅ [${functionName}] เสร็จสิ้น (${duration}ms)`);
    
    return {
      status: 'success',
      message: 'บำรุงรักษาระบบเรียบร้อย',
      duration: duration,
      results: {
        cleanedSessions: cleanResult.cleanedCount || 0,
        cacheCleared: cacheResult.status === 'success'
      },
      timestamp: getCurrentThaiDateTime()
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * 6.2 ตรวจสอบสุขภาพของระบบ
 * 
 * @returns {Object} { status, checks, summary }
 */
function checkSystemHealth() {
  const functionName = 'checkSystemHealth';
  
  console.log(`🏥 [${functionName}] ตรวจสอบสุขภาพระบบ...`);
  
  const checks = [];
  
  // 1. ตรวจสอบไฟล์
  try {
    const fileCheck = checkProjectFiles();
    checks.push({
      name: 'Files',
      status: fileCheck.status,
      details: fileCheck.files || []
    });
  } catch (e) {
    checks.push({ name: 'Files', status: 'error', error: e.toString() });
  }
  
  // 2. ตรวจสอบ Cache
  try {
    const cacheCheck = inspectCache();
    checks.push({
      name: 'Cache',
      status: cacheCheck.status,
      hasData: cacheCheck.hasCache
    });
  } catch (e) {
    checks.push({ name: 'Cache', status: 'error', error: e.toString() });
  }
  
  // 3. ตรวจสอบ Sessions
  try {
    const sessionCheck = getAllActiveSessions();
    checks.push({
      name: 'Sessions',
      status: sessionCheck.status,
      count: sessionCheck.count || 0
    });
  } catch (e) {
    checks.push({ name: 'Sessions', status: 'error', error: e.toString() });
  }
  
  // 4. ตรวจสอบการเชื่อมต่อ Sheet
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    checks.push({
      name: 'Spreadsheet',
      status: 'success',
      sheetName: sheet.getName()
    });
  } catch (e) {
    checks.push({ name: 'Spreadsheet', status: 'error', error: e.toString() });
  }
  
  const allHealthy = checks.every(check => check.status === 'success');
  
  console.log(`${allHealthy ? '✅' : '⚠️'} [${functionName}] สุขภาพระบบ: ${allHealthy ? 'ดี' : 'มีปัญหา'}`);
  
  return {
    status: allHealthy ? 'healthy' : 'warning',
    checks: checks,
    summary: {
      total: checks.length,
      passed: checks.filter(c => c.status === 'success').length,
      failed: checks.filter(c => c.status === 'error').length
    },
    timestamp: getCurrentThaiDateTime()
  };
}

/**
 * 6.3 สร้างรายงานการใช้งานระบบ
 * 
 * @returns {Object} รายงานสถิติการใช้งาน
 */
function generateUsageReport() {
  const functionName = 'generateUsageReport';
  
  console.log(`📈 [${functionName}] สร้างรายงานการใช้งาน...`);
  
  try {
    const sessions = getAllActiveSessions();
    const cache = inspectCache();
    
    const report = {
      status: 'success',
      timestamp: getCurrentThaiDateTime(),
      activeSessions: sessions.count || 0,
      cacheStatus: cache.hasCache ? 'active' : 'empty',
      totalUsers: cache.userCount || 0,
      systemUptime: 'Available', // ใน Production อาจดึงจาก Properties
      healthCheck: checkSystemHealth()
    };
    
    console.log(`✅ [${functionName}] สร้างรายงานเรียบร้อย`);
    
    return report;
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'error', message: error.toString() };
  }
}

// =================================================================
// 📂 SECTION 7: SECURITY FUNCTIONS
// =================================================================

/**
 * 7.1 บันทึก Log การเข้าใช้งาน (Audit Trail)
 * 
 * @param {string} username - ชื่อผู้ใช้
 * @param {string} action - การกระทำ (login, logout, access)
 * @param {string} details - รายละเอียดเพิ่มเติม
 */
function logUserActivity(username, action, details) {
  const functionName = 'logUserActivity';
  
  try {
    const LOG_SHEET_NAME = 'Activity Logs';
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = spreadsheet.getSheetByName(LOG_SHEET_NAME);
    
    // สร้าง Sheet ใหม่ถ้ายังไม่มี
    if (!logSheet) {
      logSheet = spreadsheet.insertSheet(LOG_SHEET_NAME);
      logSheet.appendRow(['Timestamp', 'Username', 'Action', 'Details', 'IP/Session']);
      console.log(`📝 [${functionName}] สร้าง Sheet "${LOG_SHEET_NAME}" ใหม่`);
    }
    
    // เพิ่ม Log
    logSheet.appendRow([
      new Date().toISOString(),
      username,
      action,
      details,
      Session.getActiveUser().getEmail() || 'Unknown'
    ]);
    
    console.log(`📝 [${functionName}] บันทึก: ${username} - ${action}`);
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
  }
}

/**
 * 7.2 ตรวจสอบการเข้าถึงที่ผิดปกติ
 * 
 * @param {string} username - ชื่อผู้ใช้ที่ต้องการตรวจสอบ
 * @returns {Object} { status, suspicious, details }
 */
function detectSuspiciousActivity(username) {
  const functionName = 'detectSuspiciousActivity';
  
  try {
    const userProperties = PropertiesService.getUserProperties();
    const allProps = userProperties.getProperties();
    
    let sessionCount = 0;
    const sessions = [];
    
    // นับจำนวน Session ของ User
    Object.keys(allProps).forEach(token => {
      try {
        const sessionData = JSON.parse(allProps[token]);
        if (sessionData.username === username) {
          sessionCount++;
          sessions.push(sessionData);
        }
      } catch (e) {
        // ไม่ใช่ Session data
      }
    });
    
    // ตรวจสอบว่ามี Session เกิน 3 อันหรือไม่ (อาจเป็นการใช้งานผิดปกติ)
    const isSuspicious = sessionCount > 3;
    
    if (isSuspicious) {
      console.log(`⚠️ [${functionName}] พบการใช้งานผิดปกติ: ${username} (${sessionCount} sessions)`);
    }
    
    return {
      status: 'success',
      suspicious: isSuspicious,
      sessionCount: sessionCount,
      sessions: sessions,
      threshold: 3
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error: ${error.toString()}`);
    return { status: 'error', message: error.toString() };
  }
}

// =================================================================
// 🎓 TRAINING NOTES FOR TEAM
// =================================================================

/**
 * บันทึกสำหรับทีมงาน:
 * 
 * คุณอลิช (UI Designer):
 * - ไฟล์ CSS.html และ Login.html ควบคุมส่วน UI
 * - สามารถแก้ไข CSS ได้โดยไม่กระทบ Logic
 * - ใช้ตัวแปร CSS (:root) สำหรับสีและฟอนต์
 * 
 * คุณจอร์น (นักวิเคราะห์ระบบ):
 * - ดู Section 2 (Authentication) และ Section 6 (Maintenance)
 * - ฟังก์ชัน checkSystemHealth() ใช้ตรวจสอบระบบ
 * - ฟังก์ชัน generateUsageReport() ใช้ดูสถิติ
 * 
 * คุณโซเฟีย (Web Developer):
 * - ดู Section 1 (Routing) และ Section 3 (Dashboard)
 * - ฟังก์ชัน include() ใช้รวมไฟล์
 * - JavaScript.html จัดการ Client-side Logic
 * 
 * คุณจักร (หัวหน้าโครงการ):
 * - ทุก Section มีหมายเลขกำกับชัดเจน
 * - ทุกฟังก์ชันมี JSDoc Comments
 * - มี Testing Functions ใน Section 5
 * - มี Security Functions ใน Section 7
 */

// =================================================================
// 📌 END OF CODE.GS
// =================================================================
// Total Functions: 23
// Total Sections: 7
// Version: 2.0.0
// Last Review: 2025-09-30
// =================================================================
// =================================================================
// 🎯 ROLE-BASED DASHBOARD SYSTEM
// =================================================================

/**
 * 1. โหลด Dashboard พร้อมข้อมูลผู้ใช้และสิทธิ์การเข้าถึง
 * 
 * @param {Object} userInfo - { username, role, token }
 * @returns {string} HTML ของ Dashboard ที่ปรับให้เหมาะกับ Role
 */
// =================================================================
// 🎯 ROLE-BASED DASHBOARD SYSTEM (ปรับปรุงใหม่)
// =================================================================

/**
 * โหลด Dashboard ตาม Role ของผู้ใช้
 * 
 * @param {string} username - Username ของผู้ใช้
 * @param {string} role - Role ของผู้ใช้ (USER, POWERUSER, ADMIN)
 * @param {string} token - Auth token (optional)
 * @returns {string} HTML ของ Dashboard
 */
function getDashboardHtmlWithUserData(username, role, token) {
  const functionName = 'getDashboardHtmlWithUserData';
  
  try {
    // ตรวจสอบ parameters
    console.log(`📊 [${functionName}] Parameters received:`);
    console.log(`   - username: ${username}`);
    console.log(`   - role: ${role}`);
    console.log(`   - token: ${token || 'not provided'}`);
    
    // สร้าง userInfo object จาก parameters
    const userInfo = {
      username: username,
      role: role,
      token: token || ''
    };
    
    console.log(`📊 [${functionName}] โหลด Dashboard สำหรับ: ${userInfo.username} (${userInfo.role})`);
    
    // ตรวจสอบข้อมูลผู้ใช้
    if (!userInfo.username || !userInfo.role) {
      throw new Error('ข้อมูลผู้ใช้ไม่ครบถ้วน - ต้องมี username และ role');
    }
    
    // แยกหน้าตาม Role
    const userRole = userInfo.role.toUpperCase();
    
    switch(userRole) {
      case 'USER':
        return getUserDashboardHtml(userInfo);
        
      case 'POWERUSER':
        return getPowerUserDashboardHtml(userInfo);
        
      case 'ADMIN':
        return getAdminDashboardHtml(userInfo);
        
      default:
        throw new Error(`Role ไม่ถูกต้อง: ${userInfo.role}`);
    }
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    console.error(`❌ [${functionName}] Stack:`, error.stack);
    return createErrorDashboard(error.toString());
  }
}

/**
 * โหลดหน้า User Dashboard
 */
function getUserDashboardHtml(userInfo) {
  console.log(`👤 [USER] โหลด Dashboard สำหรับ ${userInfo.username}`);
  
  try {
    // ดึงข้อมูลของ User คนนี้
    const userData = getUserWorkOverview(userInfo.username);
    const userProfile = getUserPersonalData(userInfo.username);
    
    // Debug log
    console.log(`📊 [USER] userData type: ${typeof userData}`);
    console.log(`📊 [USER] userData is null?: ${userData === null}`);
    console.log(`📊 [USER] userData is undefined?: ${userData === undefined}`);
    console.log(`📊 [USER] userData:`, JSON.stringify(userData));
    console.log(`👤 [USER] userProfile:`, JSON.stringify(userProfile));
    
    // สร้าง HTML Template
    const template = HtmlService.createTemplateFromFile('User_Dashboard');
    template.userInfo = userInfo;
    template.userData = userData;
    template.userProfile = userProfile;
    
    console.log('✅ [USER] กำลัง evaluate template...');
    
    // ⭐ สำคัญ: ต้อง evaluate และ getContent()
    const htmlOutput = template.evaluate();
    const htmlContent = htmlOutput.getContent();
    
    console.log('✅ [USER] Template ถูก evaluate แล้ว, HTML length:', htmlContent.length);
    
    // ⭐ Debug: แสดง HTML ส่วนแรก
    console.log('📄 [USER] HTML Preview (first 500 chars):');
    console.log(htmlContent.substring(0, 500));
    
    return htmlContent;
    
  } catch (error) {
    console.error(`❌ [USER] Error: ${error.toString()}`);
    console.error(`❌ [USER] Stack: ${error.stack}`);
    throw error;
  }
}

/**
 * โหลดหน้า PowerUser Dashboard
 */
function getPowerUserDashboardHtml(userInfo) {
  console.log(`⚡ [POWERUSER] โหลด Dashboard สำหรับ ${userInfo.username}`);
  
  // ดึงข้อมูลทีมทั้งหมด
  const teamData = getPowerUserTeamData();
  
  // สร้าง HTML
  const template = HtmlService.createTemplateFromFile('PowerUser_Dashboard');
  template.userInfo = userInfo;
  template.teamData = teamData;
  
  return template.evaluate().getContent();
}

/**
 * โหลดหน้า Admin Dashboard
 */
function getAdminDashboardHtml(userInfo) {
  console.log(`👑 [ADMIN] โหลด Dashboard สำหรับ ${userInfo.username}`);
  
  // Admin ใช้หน้าเดียวกับ PowerUser
  return getPowerUserDashboardHtml(userInfo);
}

/**
 * 2. ดึงข้อมูลของทุกคน (สำหรับ Admin/PowerUser)
 * 
 * @returns {Array} ข้อมูลพนักงานทั้งหมด
 */
function getAllUsersData() {
  const functionName = 'getAllUsersData';
  const SHEET_NAME = 'SDIP Employee Database';
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`ไม่พบ Sheet "${SHEET_NAME}"`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0]; // แถวแรกเป็น Header
    const users = [];
    
    // วนอ่านข้อมูล (ข้ามแถวแรก)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // สร้าง Object จาก Row
      const userObj = {};
      headers.forEach((header, index) => {
        userObj[header] = row[index];
      });
      
      // เพิ่มข้อมูลเพิ่มเติม
      userObj.rowIndex = i + 1;
      
      users.push(userObj);
    }
    
    console.log(`✅ [${functionName}] โหลด ${users.length} Users`);
    return users;
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return [];
  }
}

/**
 * 3. ดึงข้อมูลส่วนตัวของผู้ใช้ (สำหรับ User)
 * 
 * @param {string} username - Username ที่ต้องการดึงข้อมูล
 * @returns {Object} ข้อมูลส่วนตัว
 */
function getUserPersonalData(username) {
  const functionName = 'getUserPersonalData';
  const SHEET_NAME = 'SDIP Employee Database';
  
  try {
    console.log(`🔍 [${functionName}] ค้นหาข้อมูลของ: ${username}`);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`ไม่พบ Sheet "${SHEET_NAME}"`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // ค้นหาแถวที่ตรงกับ Username (สมมติว่า Username อยู่ที่ Column B = index 1)
    for (let i = 1; i < data.length; i++) {
      const rowUsername = (data[i][1] || '').toString().trim();
      
      if (rowUsername === username) {
        // สร้าง Object จาก Row
        const userObj = {};
        headers.forEach((header, index) => {
          userObj[header] = data[i][index];
        });
        
        userObj.rowIndex = i + 1;
        
        console.log(`✅ [${functionName}] พบข้อมูลของ ${username}`);
        return userObj;
      }
    }
    
    console.log(`⚠️ [${functionName}] ไม่พบข้อมูลของ ${username}`);
    return null;
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return null;
  }
}

/**
 * 4. สร้าง HTML Dashboard ตามสิทธิ์
 * 
 * @param {Object} userInfo - ข้อมูลผู้ใช้ที่ล็อคอิน
 * @param {Object|Array} userData - ข้อมูลที่จะแสดง
 * @returns {string} HTML Dashboard
 */
function generateDashboardHtml(userInfo, userData) {
  const functionName = 'generateDashboardHtml';
  const isAdmin = ['ADMIN', 'POWERUSER'].includes(userInfo.role.toUpperCase());
  
  console.log(`🎨 [${functionName}] สร้าง Dashboard แบบ ${isAdmin ? 'Admin' : 'User'}`);
  
  // ส่วน Header
  const headerHtml = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      margin-bottom: 30px;
      color: white;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
        <div>
          <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 700;">
            📮 Smart Delivery Insight
          </h1>
          <p style="margin: 0; opacity: 0.9; font-size: 16px;">
            ยินดีต้อนรับ, <strong>${userInfo.username}</strong> 
            <span style="
              background: rgba(255,255,255,0.2);
              padding: 4px 12px;
              border-radius: 20px;
              margin-left: 10px;
              font-size: 14px;
              font-weight: 600;
            ">
              ${getRoleIcon(userInfo.role)} ${getRoleDisplayName(userInfo.role)}
            </span>
          </p>
        </div>
        <div>
          <button onclick="handleLogout()" style="
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
          " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
             onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  `;
  
  // ส่วนแสดงข้อมูล
  let contentHtml = '';
  
  if (isAdmin && Array.isArray(userData)) {
    // Dashboard สำหรับ Admin/PowerUser - แสดงข้อมูลทุกคน
    contentHtml = generateAdminDashboard(userData, userInfo);
  } else if (userData) {
    // Dashboard สำหรับ User - แสดงข้อมูลตัวเอง
    contentHtml = generateUserDashboard(userData, userInfo);
  } else {
    contentHtml = `
      <div style="
        background: #fff3cd;
        border: 1px solid #ffc107;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
      ">
        <h3 style="color: #856404; margin-top: 0;">⚠️ ไม่พบข้อมูล</h3>
        <p style="color: #856404;">ไม่สามารถโหลดข้อมูลได้ กรุณาติดต่อผู้ดูแลระบบ</p>
      </div>
    `;
  }
  
  // รวม HTML ทั้งหมด
  const fullHtml = `
    <div style="
      font-family: 'Kanit', 'Inter', sans-serif;
      padding: 20px;
      background: #f5f7fa;
      min-height: 100vh;
    ">
      ${headerHtml}
      ${contentHtml}
    </div>
    
    <script>
      /**
       * ฟังก์ชันออกจากระบบ
       */
      function handleLogout() {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
          console.log('🚪 กำลังออกจากระบบ...');
          
          const token = localStorage.getItem('authToken');
          
          // เรียก API Logout
          google.script.run
            .withSuccessHandler(() => {
              console.log('✅ ออกจากระบบสำเร็จ');
              
              // ลบข้อมูล (เก็บเฉพาะ lastUsername ไว้)
              localStorage.removeItem('authToken');
              localStorage.removeItem('userRole');
              localStorage.removeItem('loginTime');
              
              // Reload หน้า
              location.reload();
            })
            .withFailureHandler((error) => {
              console.error('❌ Logout Error:', error);
              alert('เกิดข้อผิดพลาด: ' + error.message);
            })
            .logout(token);
        }
      }
      
      /**
       * ฟังก์ชันเริ่มต้น Dashboard
       */
      function initDashboard(userInfo) {
        console.log('🎨 [DASHBOARD] เริ่มต้น Dashboard');
        console.log('👤 User:', userInfo.username);
        console.log('🎭 Role:', userInfo.role);
        
        // เพิ่ม Logic เพิ่มเติมตามต้องการที่นี่
      }
    </script>
  `;
  
  return fullHtml;
}

/**
 * 5. สร้าง Dashboard สำหรับ Admin/PowerUser
 * 
 * @param {Array} users - ข้อมูลผู้ใช้ทั้งหมด
 * @param {Object} currentUser - ข้อมูลผู้ใช้ปัจจุบัน
 * @returns {string} HTML
 */
function generateAdminDashboard(users, currentUser) {
  // สถิติรวม
  const totalUsers = users.length;
  const adminCount = users.filter(u => (u.Role || '').toUpperCase() === 'ADMIN').length;
  const powerUserCount = users.filter(u => (u.Role || '').toUpperCase() === 'POWERUSER').length;
  const regularUserCount = users.filter(u => (u.Role || '').toUpperCase() === 'USER').length;
  
  let html = `
    <div style="margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 24px;">
        📊 ภาพรวมระบบ
      </h2>
      
      <!-- สถิติการ์ด -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      ">
        ${generateStatCard('👥 ผู้ใช้ทั้งหมด', totalUsers, '#3498db')}
        ${generateStatCard('👑 Admin', adminCount, '#e74c3c')}
        ${generateStatCard('⚡ PowerUser', powerUserCount, '#f39c12')}
        ${generateStatCard('👤 User', regularUserCount, '#27ae60')}
      </div>
    </div>
    
    <div style="
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    ">
      <h2 style="color: #2c3e50; margin-top: 0; margin-bottom: 20px;">
        📋 รายชื่อผู้ใช้งานทั้งหมด
      </h2>
      
      <div style="overflow-x: auto;">
        <table style="
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        ">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">ลำดับ</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">ชื่อ-นามสกุล</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Username</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">สิทธิ์</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">อีเมล</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">สถานะ</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // แสดงข้อมูลแต่ละคน
  users.forEach((user, index) => {
    const name = user.Name || user['ชื่อ-นามสกุล'] || '-';
    const username = user.Username || user['Username'] || '-';
    const role = user.Role || user['สิทธิ์'] || 'User';
    const email = user.Email || user['อีเมล'] || '-';
    
    const roleColor = getRoleColor(role);
    const roleIcon = getRoleIcon(role);
    
    html += `
      <tr style="border-bottom: 1px solid #e9ecef; transition: background 0.2s;"
          onmouseover="this.style.background='#f8f9fa'" 
          onmouseout="this.style.background='white'">
        <td style="padding: 12px;">${index + 1}</td>
        <td style="padding: 12px; font-weight: 600;">${name}</td>
        <td style="padding: 12px; color: #6c757d;">${username}</td>
        <td style="padding: 12px; text-align: center;">
          <span style="
            background: ${roleColor};
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          ">
            ${roleIcon} ${role}
          </span>
        </td>
        <td style="padding: 12px; color: #6c757d; font-size: 13px;">${email}</td>
        <td style="padding: 12px; text-align: center;">
          <span style="color: #27ae60; font-weight: 600;">●</span> Active
        </td>
      </tr>
    `;
  });
  
  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  return html;
}

/**
 * 6. สร้าง Dashboard สำหรับ User ทั่วไป
 * 
 * @param {Object} userData - ข้อมูลส่วนตัว
 * @param {Object} currentUser - ข้อมูลผู้ใช้ปัจจุบัน
 * @returns {string} HTML
 */
function generateUserDashboard(userData, currentUser) {
  const name = userData.Name || userData['ชื่อ-นามสกุล'] || currentUser.username;
  const username = userData.Username || userData['Username'] || currentUser.username;
  const role = userData.Role || userData['สิทธิ์'] || currentUser.role;
  const email = userData.Email || userData['อีเมล'] || '-';
  const phone = userData.Phone || userData['เบอร์โทร'] || '-';
  const department = userData.Department || userData['แผนก'] || '-';
  
  return `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      max-width: 800px;
      margin: 0 auto;
    ">
      <h2 style="color: #2c3e50; margin-top: 0; margin-bottom: 25px; text-align: center;">
        👤 ข้อมูลส่วนตัว
      </h2>
      
      <!-- Profile Card -->
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        color: white;
        margin-bottom: 30px;
      ">
        <div style="
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
        ">
          👤
        </div>
        <h3 style="margin: 0 0 5px 0; font-size: 24px;">${name}</h3>
        <p style="margin: 0; opacity: 0.9;">@${username}</p>
        <div style="margin-top: 15px;">
          <span style="
            background: rgba(255,255,255,0.2);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          ">
            ${getRoleIcon(role)} ${getRoleDisplayName(role)}
          </span>
        </div>
      </div>
      
      <!-- ข้อมูลรายละเอียด -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      ">
        ${generateInfoCard('📧 อีเมล', email)}
        ${generateInfoCard('📱 เบอร์โทร', phone)}
        ${generateInfoCard('🏢 แผนก', department)}
        ${generateInfoCard('🎭 ระดับสิทธิ์', getRoleDisplayName(role))}
      </div>
      
      <!-- คำแนะนำ -->
      <div style="
        margin-top: 30px;
        padding: 20px;
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        border-radius: 8px;
      ">
        <h4 style="margin: 0 0 10px 0; color: #1976d2;">
          💡 เคล็ดลับการใช้งาน
        </h4>
        <ul style="margin: 0; padding-left: 20px; color: #555;">
          <li>ตรวจสอบข้อมูลของคุณให้ถูกต้องเสมอ</li>
          <li>หากต้องการแก้ไขข้อมูล กรุณาติดต่อผู้ดูแลระบบ</li>
          <li>ออกจากระบบทุกครั้งเมื่อใช้งานเสร็จ</li>
        </ul>
      </div>
    </div>
  `;
}

/**
 * 7. สร้างการ์ดสถิติ
 */
function generateStatCard(title, value, color) {
  return `
    <div style="
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      border-left: 4px solid ${color};
      transition: transform 0.2s;
    " onmouseover="this.style.transform='translateY(-5px)'" 
       onmouseout="this.style.transform='translateY(0)'">
      <div style="color: #6c757d; font-size: 14px; margin-bottom: 8px;">
        ${title}
      </div>
      <div style="color: ${color}; font-size: 32px; font-weight: 700;">
        ${value}
      </div>
    </div>
  `;
}

// =================================================================
// 📂 SECTION 8: DATA RETRIEVAL FUNCTIONS (เวอร์ชันสมบูรณ์)
// =================================================================

/**
 * 8.1 ดึงข้อมูล Work Overview ของ User
 */
function getUserWorkOverview(username) {
  const functionName = 'getUserWorkOverview';
  const startTime = new Date().getTime();
  
  try {
    console.log(`📊 [${functionName}] ดึงข้อมูลสำหรับ: ${username}`);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // ดึงข้อมูลจากชีตจริง (ชื่อตามไฟล์ Excel)
    const wrpData = getDataFromSheet(spreadsheet, 'SDIP WRP รายละเอียด', username);
    const wmsData = getDataFromSheet(spreadsheet, 'SDIP WMS เงินที่ต้องนำส่ง', username);
    
    // งานค้างแยกตาม R/EMS/COD
    const backlogR = getDataFromSheet(spreadsheet, 'SDIP Backlog R', username);
    const backlogEMS = getDataFromSheet(spreadsheet, 'SDIP Backlog EMS', username);
    const backlogCOD = getDataFromSheet(spreadsheet, 'SDIP Backlog COD', username);
    
    // งานคืนแยกตาม R/EMS/COD
    const returnedR = getDataFromSheet(spreadsheet, 'SDIP Returned R', username);
    const returnedEMS = getDataFromSheet(spreadsheet, 'SDIP Returned  EMS', username);
    const returnedCOD = getDataFromSheet(spreadsheet, 'SDIP Returned  COD', username);
    
    console.log(`📊 [${functionName}] WRP: ${wrpData.length}, WMS: ${wmsData.length}`);
    console.log(`📊 [${functionName}] Backlog R:${backlogR.length} EMS:${backlogEMS.length} COD:${backlogCOD.length}`);
    console.log(`📊 [${functionName}] Return R:${returnedR.length} EMS:${returnedEMS.length} COD:${returnedCOD.length}`);
    
    // คำนวณสถิติ
const sendMoneyStats = countNotSentMoney(wmsData);
const overview = {
  sendMoney: sendMoneyStats,
      prepare: calculateByType(wrpData),
      recorded: calculateRecorded(wrpData),
      backlog: {
        r: backlogR.length,
        ems: backlogEMS.length,
        cod: backlogCOD.length,
        total: backlogR.length + backlogEMS.length + backlogCOD.length
      },
      returned: {
        r: returnedR.length,
        ems: returnedEMS.length,
        cod: returnedCOD.length,
        total: returnedR.length + returnedEMS.length + returnedCOD.length
      }
    };
    
    const processTime = new Date().getTime() - startTime;
    console.log(`✅ [${functionName}] สำเร็จ (${processTime}ms)`);
    console.log(`📊 [${functionName}] ผลลัพธ์:`, JSON.stringify(overview));
    
    return overview;
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    
    return {
      sendMoney: { r: 0, ems: 0, cod: 0, total: 0 },
      prepare: { r: 0, ems: 0, cod: 0, total: 0 },
      recorded: { r: 0, ems: 0, cod: 0, total: 0 },
      backlog: { r: 0, ems: 0, cod: 0, total: 0 },
      returned: { r: 0, ems: 0, cod: 0, total: 0 }
    };
  }
}

/**
 * 8.2 ดึงข้อมูลทีมทั้งหมด (สำหรับ PowerUser)
 */
function getPowerUserTeamData() {
  const functionName = 'getPowerUserTeamData';
  const startTime = new Date().getTime();
  
  try {
    console.log(`📊 [${functionName}] ดึงข้อมูลทีมทั้งหมด...`);
    
    const employees = getAllUsersData();
    const teamData = [];
    
    employees.forEach(emp => {
      const username = emp.Username;
      
      if (username && emp.Role && emp.Role.trim().toUpperCase() === 'USER') {
        const workData = getUserWorkOverview(username);
        
        const prepare = workData.prepare.total || 0;
        const recorded = workData.recorded.total || 0;
        const percentage = prepare > 0 ? Math.round((recorded / prepare) * 100) : 100;
        
        teamData.push({
          username: username,
          fullName: emp.Name || username,
          side: emp['Side '] || emp.Side || '',
          area: emp.Area || '',
          routes: emp.small || '',
          workData: workData,
          percentage: percentage,
          colorClass: getColorClass(percentage)
        });
      }
    });
    
    teamData.sort((a, b) => a.percentage - b.percentage);
    
    const processTime = new Date().getTime() - startTime;
    console.log(`✅ [${functionName}] โหลด ${teamData.length} คน (${processTime}ms)`);
    
    return teamData;
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return [];
  }
}

/**
 * 8.3 ดึงข้อมูลรายละเอียดจากชีต
 */
function getDetailWorkData(dataType, workType, username) {
  const functionName = 'getDetailWorkData';
  
  try {
    console.log(`📋 [${functionName}] Type: ${dataType}, WorkType: ${workType}, User: ${username || 'ALL'}`);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    let sheetName;
    if (dataType === 'backlog') {
      if (workType === 'R') sheetName = 'SDIP Backlog R';
      else if (workType === 'EMS') sheetName = 'SDIP Backlog EMS';
      else if (workType === 'COD') sheetName = 'SDIP Backlog COD';
    } else {
      if (workType === 'R') sheetName = 'SDIP Returned R';
      else if (workType === 'EMS') sheetName = 'SDIP Returned  EMS';
      else if (workType === 'COD') sheetName = 'SDIP Returned  COD';
    }
    
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      throw new Error(`ไม่พบชีต: ${sheetName}`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const operator = (row[3] || '').toString().trim();
      
      if (username && operator !== username) {
        continue;
      }
      
      rows.push(row);
    }
    
    console.log(`✅ [${functionName}] พบ ${rows.length} รายการ`);
    
    return {
      status: 'success',
      headers: headers,
      data: rows
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString(),
      headers: [],
      data: []
    };
  }
}
/**
 * ดึงรายการที่ยังไม่ได้บันทึกจากชีต WRP
 * สำหรับแสดงใน Tab "เตรียม + บันทึก"
 */
function getNotRecordedData(username) {
  const functionName = 'getNotRecordedData';
  
  try {
    console.log(`📋 [${functionName}] ดึงรายการที่ยังไม่บันทึกของ: ${username}`);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('SDIP WRP รายละเอียด');
    
    if (!sheet) {
      throw new Error('ไม่พบชีต: SDIP WRP รายละเอียด');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const notRecordedRows = [];
    
    // คอลัมน์ C (index 2) = ผู้ดำเนินการ
    // คอลัมน์ F (index 5) = สถานะ
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const operator = (row[2] || '').toString().trim();
      const status = (row[5] || '').toString().trim();
      
      // เช็คว่าเป็นของ user นี้ และยังไม่ได้บันทึก
      if (operator === username && status === 'ไม่ได้บันทึกนำจ่าย') {
        notRecordedRows.push(row);
      }
    }
    
    console.log(`✅ [${functionName}] พบ ${notRecordedRows.length} รายการที่ยังไม่บันทึก`);
    
    return {
      status: 'success',
      headers: headers,
      data: notRecordedRows
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString(),
      headers: [],
      data: []
    };
  }
}

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
/**
 * ดึงข้อมูลจากชีต (รองรับหลาย column index)
 */
function getDataFromSheet(spreadsheet, sheetName, username) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    console.warn(`⚠️ ไม่พบชีต: ${sheetName}`);
    return [];
  }
  
  const data = sheet.getDataRange().getValues();
  const result = [];
  
  // กำหนด column index ตามชีต
  let operatorColumnIndex;
  
  // เฉพาะชีต WRP อยู่คอลัมน์ C (index 2)
  if (sheetName === 'SDIP WRP รายละเอียด') {
    operatorColumnIndex = 2; // คอลัมน์ C
  } else {
    // ชีตอื่นๆ ทั้งหมดอยู่คอลัมน์ D (index 3)
    operatorColumnIndex = 3; // คอลัมน์ D
  }
  
  for (let i = 1; i < data.length; i++) {
    const operator = (data[i][operatorColumnIndex] || '').toString().trim();
    
    if (operator === username) {
      result.push(data[i]);
    }
  }
  
  console.log(`   ✓ [${sheetName}] → ${result.length} รายการ (column ${operatorColumnIndex === 2 ? 'C' : 'D'})`);
  return result;
}
// =================================================================
// 📂 CATEGORY RULES MANAGEMENT (ระบบจัดการกฎการแยกประเภท)
// =================================================================

/**
 * อ่านกฎการจัดหมวดหมู่จากชีท "SDIP Category Rules"
 * @returns {Object} { prefixMap: {...}, priorities: [...] }
 */
function loadCategoryRules() {
  const functionName = 'loadCategoryRules';
  const CACHE_KEY = 'CATEGORY_RULES';
  const CACHE_TIME = 3600; // 1 ชั่วโมง
  
  try {
    // เช็ค cache ก่อน (เพื่อ performance)
    const cache = CacheService.getScriptCache();
    const cachedRules = cache.get(CACHE_KEY);
    
    if (cachedRules) {
      console.log(`✅ [${functionName}] ใช้ข้อมูลจาก Cache`);
      return JSON.parse(cachedRules);
    }
    
    // ไม่มี cache → อ่านจากชีท
    console.log(`📊 [${functionName}] อ่านกฎจากชีท...`);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SDIP Category Rules');
    
    if (!sheet) {
      console.warn(`⚠️ [${functionName}] ไม่พบชีต "SDIP Category Rules" - ใช้ค่า default`);
      return getDefaultRules();
    }
    
    const data = sheet.getDataRange().getValues();
    const rules = {
      prefixMap: {},      // { 'EA': 'COD', 'R': 'R', ... }
      priorities: []      // ['EA', 'WA', 'WC', 'JA', 'R', 'B', ...] เรียงตาม length
    };
    
    // ข้ามแถวแรก (header)
    for (let i = 1; i < data.length; i++) {
      const prefix = (data[i][0] || '').toString().trim().toUpperCase();
      const category = (data[i][1] || '').toString().trim().toUpperCase();
      
      if (prefix && category) {
        rules.prefixMap[prefix] = category;
        rules.priorities.push(prefix);
      }
    }
    
    // เรียง priorities จากยาว → สั้น (เช็ค EA, WA ก่อน E, W)
    rules.priorities.sort((a, b) => b.length - a.length);
    
    console.log(`✅ [${functionName}] โหลดกฎสำเร็จ: ${rules.priorities.length} กฎ`);
    console.log(`📋 [${functionName}] Priorities:`, rules.priorities.join(', '));
    
    // บันทึกลง cache
    cache.put(CACHE_KEY, JSON.stringify(rules), CACHE_TIME);
    
    return rules;
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return getDefaultRules();
  }
}

/**
 * กฎ default กรณีไม่มีชีท Category Rules
 */
function getDefaultRules() {
  return {
    prefixMap: {
      // COD (เช็คก่อน - 2 ตัวอักษร)
      'EA': 'COD', 'WA': 'COD', 'WC': 'COD', 'JA': 'COD',
      // R
      'R': 'R', 'B': 'R', 'O': 'R', 'C': 'R', 'V': 'R', 'P': 'R',
      // EMS
      'E': 'EMS', 'J': 'EMS', 'W': 'EMS', 'L': 'EMS'
    },
    priorities: ['EA', 'WA', 'WC', 'JA', 'R', 'B', 'O', 'C', 'V', 'P', 'E', 'J', 'W', 'L']
  };
}

/**
 * จัดหมวดหมู่จากหมายเลข (ใช้กฎจากชีท)
 */
function categorizeTrackingNumber(trackingNumber, rules) {
  const number = (trackingNumber || '').toString().trim().toUpperCase();
  
  if (!number) return 'UNKNOWN';
  
  // ลองเช็คตาม priorities (ยาว → สั้น)
  for (const prefix of rules.priorities) {
    if (number.startsWith(prefix)) {
      return rules.prefixMap[prefix];
    }
  }
  
  return 'UNKNOWN';
}

/**
 * ล้าง cache กฎ (เรียกเมื่อมีการแก้ไขชีท Category Rules)
 */
function clearCategoryRulesCache() {
  const cache = CacheService.getScriptCache();
  cache.remove('CATEGORY_RULES');
  console.log('✅ ล้าง Category Rules Cache สำเร็จ');
  
  // โหลดกฎใหม่ทันที
  const rules = loadCategoryRules();
  console.log('✅ โหลดกฎใหม่สำเร็จ:', rules.priorities.length, 'กฎ');
  
  return { status: 'success', message: 'ล้าง Cache และโหลดกฎใหม่สำเร็จ' };
}
/**
 * คำนวณสถิติแยกตาม R/EMS/COD (ใช้กฎจากชีท)
 */
function calculateByType(data) {
  const rules = loadCategoryRules();
  const stats = { r: 0, ems: 0, cod: 0, total: 0 };
  
  data.forEach(row => {
    const trackingNumber = (row[1] || '').toString().trim();
    const category = categorizeTrackingNumber(trackingNumber, rules);
    
    if (category === 'R') {
      stats.r++;
    } else if (category === 'EMS') {
      stats.ems++;
    } else if (category === 'COD') {
      stats.cod++;
    }
  });
  
  stats.total = stats.r + stats.ems + stats.cod;
  return stats;
}

/**
 * คำนวณข้อมูลที่บันทึกแล้ว (ใช้กฎจากชีท)
 */
function calculateRecorded(data) {
  const rules = loadCategoryRules();
  const stats = { r: 0, ems: 0, cod: 0, total: 0 };
  
  data.forEach(row => {
    const trackingNumber = (row[1] || '').toString().trim();
    const status = (row[5] || '').toString().trim();
    
    // บันทึกแล้ว = ไม่ใช่ "ไม่ได้บันทึกนำจ่าย"
    const isRecorded = status !== 'ไม่ได้บันทึกนำจ่าย';
    
    if (isRecorded) {
      const category = categorizeTrackingNumber(trackingNumber, rules);
      
      if (category === 'R') {
        stats.r++;
      } else if (category === 'EMS') {
        stats.ems++;
      } else if (category === 'COD') {
        stats.cod++;
      }
    }
  });
  
  stats.total = stats.r + stats.ems + stats.cod;
  return stats;
}

/**
 * นับจำนวนที่ยังไม่ส่งเงิน (เช็คคอลัมน์ K = "ไม่พบการส่งเงิน")
 * ⚠️ ชีต WMS = COD ทั้งหมด ไม่ต้องแยก R/EMS
 */
function countNotSentMoney(data) {
  const stats = { r: 0, ems: 0, cod: 0, total: 0 };
  
  // นับจำนวนที่ยังไม่ส่งเงิน (คอลัมน์ K = "ไม่พบการส่งเงิน")
  data.forEach(row => {
    // คอลัมน์ K (index 10) = สถานะการส่งเงิน
    const sendMoneyStatus = (row[10] || '').toString().trim();
    
    // เช็คว่ายังไม่ส่งเงิน
    if (sendMoneyStatus === 'ไม่พบการส่งเงิน') {
      stats.cod++; // นับเป็น COD ทั้งหมด
    }
  });
  
  // R และ EMS = 0 เสมอ เพราะ WMS เป็น COD ทั้งหมด
  stats.r = 0;
  stats.ems = 0;
  stats.total = stats.cod;
  
  return stats;
}

/**
 * ⚠️ เก็บไว้เพื่อ backward compatibility (ถ้ามีที่อื่นใช้)
 * แต่แนะนำให้ใช้ countNotSentMoney แทน
 */
function countCOD(data) {
  return data.filter(row => {
    const trackingNumber = (row[1] || '').toString().trim();
    return trackingNumber.startsWith('W') || trackingNumber.startsWith('J');
  }).length;
}

/**
 * ตรวจสอบว่า tracking number ตรงกับ workType หรือไม่ (ใช้กฎจากชีท)
 */
function matchesWorkType(trackingNumber, workType) {
  const rules = loadCategoryRules();
  const category = categorizeTrackingNumber(trackingNumber, rules);
  
  if (workType === 'R') {
    return category === 'R';
  } else if (workType === 'EMS') {
    return category === 'EMS';
  } else if (workType === 'COD') {
    return category === 'COD';
  }
  
  return false;
}
/**
 * กำหนด CSS Class ตาม %
 */
function getColorClass(percentage) {
  if (percentage >= 100) return 'green';
  if (percentage >= 81) return 'yellow';
  if (percentage >= 31) return 'orange';
  return 'red';
}

/**
 * 9. Helper Functions
 */

function getRoleIcon(role) {
  const icons = {
    'ADMIN': '👑',
    'POWERUSER': '⚡',
    'USER': '👤'
  };
  return icons[role.toUpperCase()] || '👤';
}

function getRoleDisplayName(role) {
  const names = {
    'ADMIN': 'ผู้ดูแลระบบ',
    'POWERUSER': 'ผู้ใช้ขั้นสูง',
    'USER': 'ผู้ใช้ทั่วไป'
  };
  return names[role.toUpperCase()] || 'ผู้ใช้';
}

function getRoleColor(role) {
  const colors = {
    'ADMIN': '#e74c3c',
    'POWERUSER': '#f39c12',
    'USER': '#27ae60'
  };
  return colors[role.toUpperCase()] || '#95a5a6';
}

/**
 * 10. สร้าง Error Dashboard
 */
function createErrorDashboard(errorMessage) {
  return `
    <div style="
      font-family: 'Kanit', sans-serif;
      padding: 40px;
      background: #f5f7fa;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 500px;
      ">
        <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
        <h2 style="color: #e74c3c; margin-bottom: 15px;">เกิดข้อผิดพลาด</h2>
        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
          ${errorMessage}
        </p>
        <button onclick="location.reload()" style="
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
        ">
          🔄 ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>
  `;
}
/**
 * ฟังก์ชันทดสอบ - รันใน Apps Script Editor
 */
function testGetUserWorkOverview() {
  // เปลี่ยน username เป็นของจริงในระบบ
  const testUsername = 'desrit.wi'; 
  
  console.log('🧪 เริ่มทดสอบ getUserWorkOverview...');
  
  const result = getUserWorkOverview(testUsername);
  
  console.log('📊 ผลลัพธ์:');
  console.log(JSON.stringify(result, null, 2));
  
  Logger.log('=== ผลลัพธ์ ===');
  Logger.log(JSON.stringify(result, null, 2));
}
function getUserDashboardHtml(userInfo) {
  console.log(`👤 [USER] โหลด Dashboard สำหรับ ${userInfo.username}`);
  
  try {
    // ดึงข้อมูลของ User คนนี้
    const userData = getUserWorkOverview(userInfo.username);
    const userProfile = getUserPersonalData(userInfo.username);
    
    // ⭐ Debug: แสดงข้อมูลที่จะส่งไป
    console.log(`📊 [USER] userData type: ${typeof userData}`);
    console.log(`📊 [USER] userData is null?: ${userData === null}`);
    console.log(`📊 [USER] userData is undefined?: ${userData === undefined}`);
    console.log(`📊 [USER] userData:`, JSON.stringify(userData));
    console.log(`👤 [USER] userProfile:`, JSON.stringify(userProfile));
    
    // ตรวจสอบว่าข้อมูลครบหรือไม่
    if (!userData) {
      throw new Error('userData is null or undefined');
    }
    
    if (!userProfile) {
      throw new Error('userProfile is null or undefined');
    }
    
    // สร้าง HTML Template
    const template = HtmlService.createTemplateFromFile('User_Dashboard');
    template.userInfo = userInfo;
    template.userData = userData;
    template.userProfile = userProfile;
    
    console.log('✅ [USER] กำลัง evaluate template...');
    
    const output = template.evaluate().getContent();
    
    console.log('✅ [USER] Template ถูก evaluate แล้ว, HTML length:', output.length);
    
    return output;
    
  } catch (error) {
    console.error(`❌ [USER] Error: ${error.toString()}`);
    console.error(`❌ [USER] Stack: ${error.stack}`);
    throw error;
  }
}
function testSendMoney() {
  const username = 'wibunluk.pi'; // หรือ username ที่มีข้อมูล
  
  console.log('🧪 ทดสอบการนับส่งเงิน...');
  
  const result = getUserWorkOverview(username);
  
  console.log('📊 ผลลัพธ์ sendMoney:', JSON.stringify(result.sendMoney));
}
function testCategoryRules() {
  console.log('🧪 ทดสอบระบบกฎการแยกประเภท...');
  
  // โหลดกฎ
  const rules = loadCategoryRules();
  
  console.log('📋 Priorities:', rules.priorities);
  console.log('📊 Prefix Map:', rules.prefixMap);
  
  // ทดสอบแยกประเภท
  const testNumbers = [
    'R123456',
    'EA123456',
    'WA789012',
    'E456789',
    'W123456',
    'C789012',
    'L345678'
  ];
  
  console.log('\n🔍 ผลการแยกประเภท:');
  testNumbers.forEach(num => {
    const category = categorizeTrackingNumber(num, rules);
    console.log(`  ${num} → ${category}`);
  });
}
/**
 * ดึงรายการที่ยังไม่ได้บันทึกจากชีต WRP
 */
function getNotRecordedData(username) {
  const functionName = 'getNotRecordedData';
  
  try {
    console.log(`📋 [${functionName}] ดึงรายการที่ยังไม่บันทึกของ: ${username}`);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('SDIP WRP รายละเอียด');
    
    if (!sheet) {
      throw new Error('ไม่พบชีต: SDIP WRP รายละเอียด');
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const notRecordedRows = [];
    
    // คอลัมน์ C (index 2) = ผู้ดำเนินการ
    // คอลัมน์ F (index 5) = สถานะ
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const operator = (row[2] || '').toString().trim();
      const status = (row[5] || '').toString().trim();
      
      // เช็คว่าเป็นของ user นี้ และยังไม่ได้บันทึก
      if (operator === username && status === 'ไม่ได้บันทึกนำจ่าย') {
        notRecordedRows.push(row);
      }
    }
    
    console.log(`✅ [${functionName}] พบ ${notRecordedRows.length} รายการที่ยังไม่บันทึก`);
    
    return {
      status: 'success',
      headers: headers,
      data: notRecordedRows
    };
    
  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString(),
      headers: [],
      data: []
    };
  }
}
