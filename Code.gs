// =================================================================
// 📋 Smart Delivery Insight - แก้ไขปัญหา Bad Value
// =================================================================

/**
 * 1. ฟังก์ชันหลักสำหรับเปิด Web App (ปรับปรุงแล้ว)
 */
function doGet() {
  try {
    // ตรวจสอบว่าไฟล์ Login.html มีอยู่หรือไม่
    console.log('🔍 ตรวจสอบไฟล์ Login.html...');
    
    // ลองสร้าง HTML Template
    const template = HtmlService.createTemplateFromFile('Login');
    
    if (!template) {
      throw new Error('ไม่พบไฟล์ Login.html');
    }
    
    console.log('✅ พบไฟล์ Login.html เรียบร้อย');
    
    return template.evaluate()
        .setTitle('Smart Delivery Insight')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        
  } catch (error) {
    console.error('❌ ข้อผิดพลาดใน doGet():', error.toString());
    
    // สร้างหน้า Error แทน
    return createErrorPage('ไม่พบไฟล์ Login.html กรุณาตรวจสอบให้แน่ใจว่าได้สร้างไฟล์แล้ว');
  }
}

/**
 * 2. ฟังก์ชันสำหรับรวมไฟล์ (ปรับปรุงให้ปลอดภัย)
 * @param {string} filename - ชื่อไฟล์ที่ต้องการ include
 * @returns {string} เนื้อหาไฟล์หรือ Error Message
 */
function include(filename) {
  try {
    // ตรวจสอบว่า filename ถูกต้องหรือไม่
    if (!filename || typeof filename !== 'string') {
      throw new Error('ชื่อไฟล์ไม่ถูกต้อง');
    }
    
    console.log(`🔍 กำลังโหลดไฟล์: ${filename}`);
    
    // ลองสร้าง HTML Output
    const output = HtmlService.createHtmlOutputFromFile(filename);
    
    if (!output) {
      throw new Error(`ไม่พบไฟล์: ${filename}`);
    }
    
    const content = output.getContent();
    console.log(`✅ โหลดไฟล์ ${filename} สำเร็จ (${content.length} characters)`);
    
    return content;
    
  } catch (error) {
    console.error(`❌ ข้อผิดพลาดใน include(${filename}):`, error.toString());
    
    // คืนค่า Error Message แทนการ throw error
    return `<!-- Error loading ${filename}: ${error.toString()} -->
            <div style="color: red; padding: 20px; border: 1px solid red; margin: 10px;">
              <h3>⚠️ ข้อผิดพลาด</h3>
              <p>ไม่สามารถโหลดไฟล์ <strong>${filename}</strong> ได้</p>
              <p>รายละเอียด: ${error.toString()}</p>
            </div>`;
  }
}

/**
 * 3. สร้างหน้า Error เมื่อมีปัญหา
 * @param {string} message - ข้อความ error
 * @returns {HtmlOutput} หน้า HTML สำหรับแสดง error
 */
function createErrorPage(message) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Smart Delivery Insight - Error</title>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .error-container { 
          border: 2px solid #ff4444; 
          padding: 20px; 
          border-radius: 8px; 
          background: #fff5f5; 
        }
        .error-title { color: #cc0000; margin-top: 0; }
        .error-message { color: #333; }
        .help-section { 
          margin-top: 20px; 
          padding: 15px; 
          background: #f0f8ff; 
          border-radius: 5px; 
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h2 class="error-title">⚠️ เกิดข้อผิดพลาด</h2>
        <p class="error-message">${message}</p>
        
        <div class="help-section">
          <h3>🛠️ วิธีแก้ไข:</h3>
          <ol>
            <li>ตรวจสอบว่ามีไฟล์ <strong>Login.html</strong> ใน Google Apps Script</li>
            <li>ตรวจสอบชื่อไฟล์ให้ตรงกัน (case-sensitive)</li>
            <li>ตรวจสอบว่าไฟล์ HTML มีโครงสร้างที่ถูกต้อง</li>
            <li>ลองรีเฟรชหน้าเว็บใหม่</li>
          </ol>
        </div>
        
        <button onclick="location.reload()" style="
          padding: 10px 20px; 
          background: #4CAF50; 
          color: white; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer;
          margin-top: 15px;
        ">🔄 ลองใหม่</button>
      </div>
    </body>
    </html>
  `;
  
  return HtmlService.createHtmlOutput(html)
      .setTitle('Smart Delivery Insight - Error');
}

/**
 * 4. ตรวจสอบไฟล์ทั้งหมดในโปรเจค
 * @returns {object} รายการไฟล์ที่มีอยู่
 */
function checkProjectFiles() {
  try {
    const files = DriveApp.getFilesByType(MimeType.GOOGLE_APPS_SCRIPT);
    const fileList = [];
    
    while (files.hasNext()) {
      const file = files.next();
      fileList.push({
        name: file.getName(),
        id: file.getId(),
        lastModified: file.getLastUpdated()
      });
    }
    
    console.log('📁 ไฟล์ในโปรเจค:', fileList);
    return { status: 'success', files: fileList };
    
  } catch (error) {
    console.error('❌ ไม่สามารถตรวจสอบไฟล์ได้:', error.toString());
    return { status: 'error', message: error.toString() };
  }
}

/**
 * 5. ฟังก์ชันทดสอบการโหลดไฟล์แต่ละไฟล์
 * @param {string} filename - ชื่อไฟล์ที่ต้องการทดสอบ
 * @returns {object} ผลการทดสอบ
 */
function testFileLoad(filename) {
  try {
    const content = include(filename);
    
    return {
      status: 'success',
      filename: filename,
      contentLength: content.length,
      hasError: content.includes('<!-- Error loading'),
      preview: content.substring(0, 100) + '...'
    };
    
  } catch (error) {
    return {
      status: 'error',
      filename: filename,
      error: error.toString()
    };
  }
}

// =================================================================
// 🔐 ระบบล็อคอินแบบปลอดภัย (เหมือนเดิม)
// =================================================================

/**
 * 6. ระบบ Cache สำหรับข้อมูลผู้ใช้
 */
function getCachedUserData() {
  const cache = CacheService.getScriptCache();
  const CACHE_KEY = 'USER_DATABASE';
  const CACHE_DURATION = 300; // 5 นาที
  
  let userData = cache.get(CACHE_KEY);
  
  if (userData) {
    console.log('✅ ใช้ข้อมูลจาก Cache');
    return JSON.parse(userData);
  }
  
  console.log('📊 อ่านข้อมูลใหม่จาก Sheet');
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SDIP Employee Database");
    
    if (!sheet) {
      throw new Error('ไม่พบ Sheet "SDIP Employee Database"');
    }
    
    const data = sheet.getDataRange().getValues();
    const userMap = {};
    
    for (let i = 1; i < data.length; i++) {
      const username = (data[i][1] || '').toString().trim();
      if (username) {
        userMap[username] = {
          password: (data[i][2] || '').toString(),
          role: (data[i][3] || '').toString().trim(),
          rowIndex: i + 1
        };
      }
    }
    
    cache.put(CACHE_KEY, JSON.stringify(userMap), CACHE_DURATION);
    return userMap;
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการอ่านข้อมูล:', error.toString());
    return {};
  }
}

/**
 * 7. ฟังก์ชันล็อคอินแบบปรับปรุง
 */
function userLogin(formData) {
  const startTime = new Date().getTime();
  
  if (!formData || !formData.username || !formData.password) {
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
    
    const user = userData[username];
    
    if (user && user.password === password) {
      console.log('✅ ล็อคอินสำเร็จ:', username);
      
      const token = Utilities.getUuid();
      const expiration = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);
      
      const userProperties = PropertiesService.getUserProperties();
      userProperties.setProperty(token, JSON.stringify({
        username: username,
        role: user.role,
        expires: expiration,
        loginTime: new Date().toISOString()
      }));
      
      const processTime = new Date().getTime() - startTime;
      console.log(`⚡ เวลาประมวลผล: ${processTime}ms`);
      
      return { 
        status: 'success', 
        role: user.role, 
        token: token,
        processTime: processTime
      };
      
    } else {
      console.log('❌ ล็อคอินไม่สำเร็จ:', username);
      return { 
        status: 'error', 
        message: 'Username หรือ Password ไม่ถูกต้อง',
        processTime: new Date().getTime() - startTime
      };
    }
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดระหว่างล็อคอิน:', error.toString());
    return { 
      status: 'error', 
      message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง',
      processTime: new Date().getTime() - startTime
    };
  }
}

/**
 * 8. ฟังก์ชันตรวจสอบ Session
 */
function checkSessionToken(token) {
  if (!token) {
    return { status: 'invalid', reason: 'ไม่มี token' };
  }
  
  try {
    const userProperties = PropertiesService.getUserProperties();
    const sessionData = userProperties.getProperty(token);
    
    if (!sessionData) {
      return { status: 'invalid', reason: 'token ไม่ถูกต้อง' };
    }
    
    const session = JSON.parse(sessionData);
    const currentTime = new Date().getTime();
    
    if (currentTime < session.expires) {
      session.expires = currentTime + (2 * 24 * 60 * 60 * 1000);
      session.lastActivity = new Date().toISOString();
      userProperties.setProperty(token, JSON.stringify(session));
      
      return { 
        status: 'valid', 
        username: session.username, 
        role: session.role,
        loginTime: session.loginTime
      };
    } else {
      userProperties.deleteProperty(token);
      return { status: 'invalid', reason: 'Session หมดอายุ' };
    }
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดการตรวจสอบ Session:', error.toString());
    return { status: 'invalid', reason: 'ข้อผิดพลาดระบบ' };
  }
}

/**
 * 9. ฟังก์ชันออกจากระบบ
 */
function logout(token) {
  try {
    if (token) {
      const userProperties = PropertiesService.getUserProperties();
      userProperties.deleteProperty(token);
      console.log('✅ ออกจากระบบเรียบร้อย');
      return { status: 'success', message: 'ออกจากระบบเรียบร้อย' };
    }
    return { status: 'success', message: 'ไม่มี Session ให้ลบ' };
  } catch (error) {
    console.error('❌ ข้อผิดพลาดการออกจากระบบ:', error.toString());
    return { status: 'error', message: 'เกิดข้อผิดพลาด' };
  }
}

/**
 * 10. ดึงหน้า Dashboard (ปรับปรุงแล้ว)
 */
function getDashboardHtml() {
  try {
    return include('Dashboard');
  } catch (error) {
    console.error('❌ ไม่สามารถโหลด Dashboard:', error.toString());
    return createErrorPage('ไม่พบไฟล์ Dashboard.html').getContent();
  }
}
// =================================================================
// 🔄 ระบบออกจากระบบและเปลี่ยนผู้ใช้งาน
// =================================================================

/**
 * 1. ฟังก์ชันออกจากระบบแบบสมบูรณ์
 * @param {string} token - Session token ปัจจุบัน
 * @returns {object} สถานะการออกจากระบบ
 */
function logoutUser(token) {
  try {
    console.log('🚪 กำลังออกจากระบบ...');
    
    if (token) {
      // ลบ Session จาก Server
      const userProperties = PropertiesService.getUserProperties();
      userProperties.deleteProperty(token);
      console.log('✅ ลบ Session จาก Server แล้ว');
    }
    
    return { 
      status: 'success', 
      message: 'ออกจากระบบเรียบร้อย',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดการออกจากระบบ:', error.toString());
    return { 
      status: 'error', 
      message: 'เกิดข้อผิดพลาดขณะออกจากระบบ',
      error: error.toString()
    };
  }
}

/**
 * 2. ฟังก์ชันล้างข้อมูลผู้ใช้ทั้งหมด
 */
function clearAllUserData() {
  try {
    console.log('🧹 กำลังล้างข้อมูลผู้ใช้ทั้งหมด...');
    
    // ล้าง Cache
    const cache = CacheService.getScriptCache();
    cache.remove('USER_DATABASE');
    
    // ล้าง Properties (ทุก Session)
    const userProperties = PropertiesService.getUserProperties();
    const allProps = userProperties.getProperties();
    
    Object.keys(allProps).forEach(key => {
      try {
        const data = JSON.parse(allProps[key]);
        if (data.username && data.expires) {
          // นี่คือ Session Token
          userProperties.deleteProperty(key);
          console.log(`🗑️ ลบ Session: ${data.username}`);
        }
      } catch (e) {
        // ไม่ใช่ Session Token
      }
    });
    
    console.log('✅ ล้างข้อมูลทั้งหมดเรียบร้อย');
    return { status: 'success', message: 'ล้างข้อมูลทั้งหมดเรียบร้อย' };
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการล้างข้อมูล:', error.toString());
    return { status: 'error', message: error.toString() };
  }
}

/**
 * 3. ตรวจสอบ Session ทั้งหมดที่มีอยู่
 * @returns {object} รายการ Session ทั้งหมด
 */
function getAllActiveSessions() {
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
            expires: new Date(sessionData.expires).toISOString(),
            isExpired: new Date().getTime() > sessionData.expires
          });
        }
      } catch (e) {
        // ไม่ใช่ Session data
      }
    });
    
    return {
      status: 'success',
      sessions: sessions,
      count: sessions.length
    };
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการดู Session:', error.toString());
    return { status: 'error', message: error.toString() };
  }
}

/**
 * 4. ล้าง Session ที่หมดอายุทั้งหมด
 */
function cleanExpiredSessions() {
  try {
    const userProperties = PropertiesService.getUserProperties();
    const allProps = userProperties.getProperties();
    const currentTime = new Date().getTime();
    let cleanedCount = 0;
    
    Object.keys(allProps).forEach(token => {
      try {
        const sessionData = JSON.parse(allProps[token]);
        if (sessionData.expires && currentTime > sessionData.expires) {
          userProperties.deleteProperty(token);
          cleanedCount++;
          console.log(`🗑️ ลบ Session หมดอายุ: ${sessionData.username || 'Unknown'}`);
        }
      } catch (e) {
        // ไม่ใช่ Session data
      }
    });
    
    return {
      status: 'success',
      message: `ล้าง Session หมดอายุ ${cleanedCount} รายการ`,
      cleanedCount: cleanedCount
    };
    
  } catch (error) {
    console.error('❌ ข้อผิดพลาดในการล้าง Session:', error.toString());
    return { status: 'error', message: error.toString() };
  }
}
