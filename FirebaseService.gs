// =================================================================
// 🔥 FIREBASE SERVICE - REALTIME DATABASE CONNECTION
// =================================================================
// Description: ระบบเชื่อมต่อ Firebase Realtime Database
// Author: Claude Code Migration Team
// Created: 2025-10-29
// =================================================================

// =================================================================
// 📂 SECTION 1: FIREBASE CONFIGURATION
// =================================================================

/**
 * Firebase Configuration
 *
 * IMPORTANT: ใช้ Secret Manager หรือ Properties Service เก็บค่าจริง
 * อย่า hardcode ใน production!
 */
const FIREBASE_CONFIG = {
  databaseURL: 'https://x-85fc7-default-rtdb.asia-southeast1.firebasedatabase.app',
  secret: 'FgpZbl8mveCB7YxzRVo9pkLMuc5T33AmmaN7u4WF'
};

// =================================================================
// 📂 SECTION 2: CORE FIREBASE FUNCTIONS
// =================================================================

/**
 * 2.1 ดึงข้อมูลจาก Firebase
 *
 * @param {string} path - เส้นทางข้อมูล เช่น 'users/john' หรือ 'workData'
 * @returns {Object|null} ข้อมูลที่ดึงมา หรือ null ถ้าไม่มี
 *
 * Example:
 * const users = firebaseGet('users');
 * const johnData = firebaseGet('users/john');
 */
function firebaseGet(path) {
  const startTime = new Date().getTime();

  try {
    console.log(`🔥 [Firebase GET] Path: ${path}`);

    // ตรวจสอบ path
    if (!path) {
      throw new Error('Path is required');
    }

    // สร้าง URL
    const url = `${FIREBASE_CONFIG.databaseURL}/${path}.json?auth=${FIREBASE_CONFIG.secret}`;

    // เรียก API
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`HTTP ${responseCode}: ${response.getContentText()}`);
    }

    const data = JSON.parse(response.getContentText());
    const duration = new Date().getTime() - startTime;

    console.log(`✅ [Firebase GET] Success in ${duration}ms`);

    return data;

  } catch (error) {
    console.error(`❌ [Firebase GET ERROR] ${path}:`, error.toString());
    return null;
  }
}

/**
 * 2.2 บันทึกข้อมูลลง Firebase (PUT - เขียนทับ)
 *
 * @param {string} path - เส้นทางข้อมูล
 * @param {Object} data - ข้อมูลที่จะบันทึก
 * @returns {boolean} true ถ้าสำเร็จ, false ถ้าล้มเหลว
 *
 * Example:
 * firebasePut('users/john', { name: 'John Doe', role: 'User' });
 */
function firebasePut(path, data) {
  const startTime = new Date().getTime();

  try {
    console.log(`🔥 [Firebase PUT] Path: ${path}`);

    if (!path) {
      throw new Error('Path is required');
    }

    const url = `${FIREBASE_CONFIG.databaseURL}/${path}.json?auth=${FIREBASE_CONFIG.secret}`;

    const response = UrlFetchApp.fetch(url, {
      method: 'put',
      contentType: 'application/json',
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`HTTP ${responseCode}: ${response.getContentText()}`);
    }

    const duration = new Date().getTime() - startTime;
    console.log(`✅ [Firebase PUT] Success in ${duration}ms`);

    return true;

  } catch (error) {
    console.error(`❌ [Firebase PUT ERROR] ${path}:`, error.toString());
    return false;
  }
}

/**
 * 2.3 อัพเดทข้อมูลใน Firebase (PATCH - แก้ไขบางส่วน)
 *
 * @param {string} path - เส้นทางข้อมูล
 * @param {Object} data - ข้อมูลที่จะอัพเดท (แก้เฉพาะ key ที่ส่งมา)
 * @returns {boolean} true ถ้าสำเร็จ
 *
 * Example:
 * firebasePatch('users/john', { lastLogin: '2024-01-01' });
 */
function firebasePatch(path, data) {
  const startTime = new Date().getTime();

  try {
    console.log(`🔥 [Firebase PATCH] Path: ${path}`);

    if (!path) {
      throw new Error('Path is required');
    }

    const url = `${FIREBASE_CONFIG.databaseURL}/${path}.json?auth=${FIREBASE_CONFIG.secret}`;

    const response = UrlFetchApp.fetch(url, {
      method: 'patch',
      contentType: 'application/json',
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`HTTP ${responseCode}: ${response.getContentText()}`);
    }

    const duration = new Date().getTime() - startTime;
    console.log(`✅ [Firebase PATCH] Success in ${duration}ms`);

    return true;

  } catch (error) {
    console.error(`❌ [Firebase PATCH ERROR] ${path}:`, error.toString());
    return false;
  }
}

/**
 * 2.4 ลบข้อมูลจาก Firebase
 *
 * @param {string} path - เส้นทางข้อมูลที่จะลบ
 * @returns {boolean} true ถ้าสำเร็จ
 *
 * Example:
 * firebaseDelete('sessions/old_token_123');
 */
function firebaseDelete(path) {
  const startTime = new Date().getTime();

  try {
    console.log(`🔥 [Firebase DELETE] Path: ${path}`);

    if (!path) {
      throw new Error('Path is required');
    }

    const url = `${FIREBASE_CONFIG.databaseURL}/${path}.json?auth=${FIREBASE_CONFIG.secret}`;

    const response = UrlFetchApp.fetch(url, {
      method: 'delete',
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`HTTP ${responseCode}: ${response.getContentText()}`);
    }

    const duration = new Date().getTime() - startTime;
    console.log(`✅ [Firebase DELETE] Success in ${duration}ms`);

    return true;

  } catch (error) {
    console.error(`❌ [Firebase DELETE ERROR] ${path}:`, error.toString());
    return false;
  }
}

/**
 * 2.5 เพิ่มข้อมูลใหม่ด้วย Auto-generated Key (POST)
 *
 * @param {string} path - เส้นทางที่จะเพิ่มข้อมูล
 * @param {Object} data - ข้อมูลที่จะเพิ่ม
 * @returns {string|null} Generated key หรือ null ถ้าล้มเหลว
 *
 * Example:
 * const logId = firebasePost('logs', { action: 'login', timestamp: Date.now() });
 */
function firebasePost(path, data) {
  const startTime = new Date().getTime();

  try {
    console.log(`🔥 [Firebase POST] Path: ${path}`);

    if (!path) {
      throw new Error('Path is required');
    }

    const url = `${FIREBASE_CONFIG.databaseURL}/${path}.json?auth=${FIREBASE_CONFIG.secret}`;

    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`HTTP ${responseCode}: ${response.getContentText()}`);
    }

    const result = JSON.parse(response.getContentText());
    const duration = new Date().getTime() - startTime;

    console.log(`✅ [Firebase POST] Success in ${duration}ms - Key: ${result.name}`);

    return result.name; // Firebase returns { name: "generated-key" }

  } catch (error) {
    console.error(`❌ [Firebase POST ERROR] ${path}:`, error.toString());
    return null;
  }
}

// =================================================================
// 📂 SECTION 3: HIGH-LEVEL USER FUNCTIONS
// =================================================================

/**
 * 3.1 ดึงข้อมูลผู้ใช้ทั้งหมด
 *
 * @returns {Object} { username: { password, role, profile }, ... }
 */
function firebaseGetAllUsers() {
  console.log('👥 [Firebase] ดึงข้อมูล Users...');

  const users = firebaseGet('users');

  if (!users) {
    console.warn('⚠️ [Firebase] ไม่พบข้อมูล Users');
    return {};
  }

  console.log(`✅ [Firebase] พบ ${Object.keys(users).length} Users`);
  return users;
}

/**
 * 3.2 ดึงข้อมูลผู้ใช้ตาม Username
 *
 * @param {string} username - Username ที่ต้องการดึง
 * @returns {Object|null} { password, role, profile } หรือ null
 */
function firebaseGetUser(username) {
  console.log(`👤 [Firebase] ดึงข้อมูล User: ${username}`);

  if (!username) {
    console.error('❌ [Firebase] Username is required');
    return null;
  }

  const user = firebaseGet(`users/${username}`);

  if (!user) {
    console.warn(`⚠️ [Firebase] ไม่พบ User: ${username}`);
    return null;
  }

  return user;
}

/**
 * 3.3 สร้าง/อัพเดทข้อมูลผู้ใช้
 *
 * @param {string} username - Username
 * @param {Object} userData - { password, role, profile }
 * @returns {boolean} true ถ้าสำเร็จ
 */
function firebaseSetUser(username, userData) {
  console.log(`👤 [Firebase] บันทึกข้อมูล User: ${username}`);

  if (!username || !userData) {
    console.error('❌ [Firebase] Username และ userData จำเป็นต้องมี');
    return false;
  }

  return firebasePut(`users/${username}`, userData);
}

/**
 * 3.4 ดึงข้อมูล Work Data ของผู้ใช้
 *
 * @param {string} username - Username
 * @returns {Object|null} { sendMoney, prepare, recorded, backlog, returned }
 */
function firebaseGetWorkData(username) {
  console.log(`📊 [Firebase] ดึง Work Data: ${username}`);

  if (!username) {
    console.error('❌ [Firebase] Username is required');
    return null;
  }

  const workData = firebaseGet(`workData/${username}`);

  if (!workData) {
    console.warn(`⚠️ [Firebase] ไม่พบ Work Data: ${username}`);
    return null;
  }

  return workData;
}

/**
 * 3.5 บันทึก Work Data ของผู้ใช้
 *
 * @param {string} username - Username
 * @param {Object} workData - { sendMoney, prepare, recorded, backlog, returned }
 * @returns {boolean} true ถ้าสำเร็จ
 */
function firebaseSetWorkData(username, workData) {
  console.log(`📊 [Firebase] บันทึก Work Data: ${username}`);

  if (!username || !workData) {
    console.error('❌ [Firebase] Username และ workData จำเป็นต้องมี');
    return false;
  }

  return firebasePut(`workData/${username}`, workData);
}

/**
 * 3.6 บันทึก Session Token
 *
 * @param {string} token - Session Token
 * @param {Object} sessionData - { username, role, expires, loginTime }
 * @returns {boolean} true ถ้าสำเร็จ
 */
function firebaseSetSession(token, sessionData) {
  console.log(`🔑 [Firebase] บันทึก Session: ${token.substring(0, 8)}...`);

  if (!token || !sessionData) {
    console.error('❌ [Firebase] Token และ sessionData จำเป็นต้องมี');
    return false;
  }

  return firebasePut(`sessions/${token}`, sessionData);
}

/**
 * 3.7 ดึง Session Token
 *
 * @param {string} token - Session Token
 * @returns {Object|null} { username, role, expires, loginTime }
 */
function firebaseGetSession(token) {
  console.log(`🔑 [Firebase] ตรวจสอบ Session: ${token.substring(0, 8)}...`);

  if (!token) {
    console.error('❌ [Firebase] Token is required');
    return null;
  }

  const session = firebaseGet(`sessions/${token}`);

  if (!session) {
    console.warn('⚠️ [Firebase] Session ไม่ถูกต้อง หรือหมดอายุ');
    return null;
  }

  // ตรวจสอบว่า Session หมดอายุหรือไม่
  if (session.expires && session.expires < new Date().getTime()) {
    console.warn('⚠️ [Firebase] Session หมดอายุแล้ว');
    firebaseDelete(`sessions/${token}`); // ลบ Session ที่หมดอายุ
    return null;
  }

  return session;
}

/**
 * 3.8 ลบ Session Token
 *
 * @param {string} token - Session Token
 * @returns {boolean} true ถ้าสำเร็จ
 */
function firebaseDeleteSession(token) {
  console.log(`🔑 [Firebase] ลบ Session: ${token.substring(0, 8)}...`);

  if (!token) {
    console.error('❌ [Firebase] Token is required');
    return false;
  }

  return firebaseDelete(`sessions/${token}`);
}

// =================================================================
// 📂 SECTION 4: UTILITY FUNCTIONS
// =================================================================

/**
 * 4.1 ทดสอบการเชื่อมต่อ Firebase
 *
 * @returns {boolean} true ถ้าเชื่อมต่อได้
 */
function firebaseTestConnection() {
  console.log('🧪 [Firebase] ทดสอบการเชื่อมต่อ...');

  try {
    const url = `${FIREBASE_CONFIG.databaseURL}/.json?auth=${FIREBASE_CONFIG.secret}`;

    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();

    if (responseCode === 200) {
      console.log('✅ [Firebase] เชื่อมต่อสำเร็จ!');
      return true;
    } else {
      console.error(`❌ [Firebase] เชื่อมต่อล้มเหลว - HTTP ${responseCode}`);
      return false;
    }

  } catch (error) {
    console.error('❌ [Firebase] ไม่สามารถเชื่อมต่อได้:', error.toString());
    return false;
  }
}

/**
 * 4.2 ดึงข้อมูลทั้งหมดจาก Firebase (Debug)
 *
 * @returns {Object} ข้อมูลทั้งหมด
 */
function firebaseGetAll() {
  console.log('🌍 [Firebase] ดึงข้อมูลทั้งหมด (Debug Only)...');
  return firebaseGet('');
}

/**
 * 4.3 ล้างข้อมูลทั้งหมด (⚠️ ระวัง!)
 *
 * @returns {boolean} true ถ้าสำเร็จ
 */
function firebaseClearAll() {
  console.warn('⚠️ [Firebase] กำลังลบข้อมูลทั้งหมด...');

  const confirm = Browser.msgBox(
    'ยืนยันการลบข้อมูล',
    'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมดใน Firebase?',
    Browser.Buttons.YES_NO
  );

  if (confirm !== 'yes') {
    console.log('❌ [Firebase] ยกเลิกการลบข้อมูล');
    return false;
  }

  return firebaseDelete('');
}

console.log('✅ FirebaseService.gs loaded successfully');
