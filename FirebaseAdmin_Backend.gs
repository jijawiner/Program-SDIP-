// =================================================================
// 🔥 FIREBASE ADMIN BACKEND - API Functions
// =================================================================
// Description: Backend API สำหรับ Firebase Admin Dashboard
// Author: Claude Code
// Created: 2025-10-29
// =================================================================

// =================================================================
// 📂 SECTION 1: ADMIN DASHBOARD ACCESS
// =================================================================

/**
 * 1.1 โหลดหน้า Firebase Admin Dashboard
 *
 * @returns {HtmlOutput} Firebase Admin Dashboard HTML
 */
function getFirebaseAdminDashboard() {
  const functionName = 'getFirebaseAdminDashboard';

  try {
    console.log(`🔥 [${functionName}] โหลด Firebase Admin Dashboard...`);

    const template = HtmlService.createTemplateFromFile('FirebaseAdmin_Dashboard');

    return template.evaluate()
        .setTitle('Firebase Admin Dashboard - SDIP')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return createErrorPage('ไม่สามารถโหลด Admin Dashboard ได้', error.toString());
  }
}

// =================================================================
// 📂 SECTION 2: USERS MANAGEMENT
// =================================================================

/**
 * 2.1 ดึงข้อมูล Users ทั้งหมดจาก Firebase
 *
 * @returns {Object} { status, data }
 */
function adminGetAllUsers() {
  const functionName = 'adminGetAllUsers';

  try {
    console.log(`👥 [${functionName}] ดึงข้อมูล Users...`);

    const users = firebaseGetAllUsers();

    if (!users) {
      return {
        status: 'error',
        message: 'ไม่พบข้อมูล Users ใน Firebase'
      };
    }

    console.log(`✅ [${functionName}] พบ ${Object.keys(users).length} Users`);

    return {
      status: 'success',
      data: users
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * 2.2 บันทึก/อัพเดท User ใน Firebase
 *
 * @param {string} username - Username
 * @param {Object} userData - ข้อมูล User { password, role, profile }
 * @returns {Object} { status, message }
 */
function adminSaveUser(username, userData) {
  const functionName = 'adminSaveUser';

  try {
    console.log(`💾 [${functionName}] บันทึก User: ${username}`);

    if (!username || !userData) {
      return {
        status: 'error',
        message: 'Username และ userData จำเป็นต้องมี'
      };
    }

    const success = firebaseSetUser(username, userData);

    if (success) {
      console.log(`✅ [${functionName}] บันทึก ${username} สำเร็จ`);

      // ล้าง Cache
      CacheService.getScriptCache().remove('USER_DATABASE');

      return {
        status: 'success',
        message: 'บันทึก User สำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถบันทึก User ได้'
      };
    }

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * 2.3 ลบ User จาก Firebase
 *
 * @param {string} username - Username ที่ต้องการลบ
 * @returns {Object} { status, message }
 */
function adminDeleteUser(username) {
  const functionName = 'adminDeleteUser';

  try {
    console.log(`🗑️ [${functionName}] ลบ User: ${username}`);

    if (!username) {
      return {
        status: 'error',
        message: 'Username จำเป็นต้องมี'
      };
    }

    const success = firebaseDelete(`users/${username}`);

    if (success) {
      console.log(`✅ [${functionName}] ลบ ${username} สำเร็จ`);

      // ล้าง Cache
      CacheService.getScriptCache().remove('USER_DATABASE');

      // ลบ Work Data ด้วย
      firebaseDelete(`workData/${username}`);

      return {
        status: 'success',
        message: 'ลบ User สำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถลบ User ได้'
      };
    }

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// =================================================================
// 📂 SECTION 3: WORK DATA MANAGEMENT
// =================================================================

/**
 * 3.1 ดึงข้อมูล Work Data ทั้งหมดจาก Firebase
 *
 * @returns {Object} { status, data }
 */
function adminGetAllWorkData() {
  const functionName = 'adminGetAllWorkData';

  try {
    console.log(`📊 [${functionName}] ดึงข้อมูล Work Data...`);

    const workData = firebaseGet('workData');

    if (!workData) {
      return {
        status: 'success',
        data: {}
      };
    }

    console.log(`✅ [${functionName}] พบ ${Object.keys(workData).length} Work Data records`);

    return {
      status: 'success',
      data: workData
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * 3.2 ลบ Work Data ของ User
 *
 * @param {string} username - Username
 * @returns {Object} { status, message }
 */
function adminDeleteWorkData(username) {
  const functionName = 'adminDeleteWorkData';

  try {
    console.log(`🗑️ [${functionName}] ลบ Work Data: ${username}`);

    if (!username) {
      return {
        status: 'error',
        message: 'Username จำเป็นต้องมี'
      };
    }

    const success = firebaseDelete(`workData/${username}`);

    if (success) {
      console.log(`✅ [${functionName}] ลบ Work Data ของ ${username} สำเร็จ`);

      return {
        status: 'success',
        message: 'ลบ Work Data สำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถลบ Work Data ได้'
      };
    }

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// =================================================================
// 📂 SECTION 4: SESSIONS MANAGEMENT
// =================================================================

/**
 * 4.1 ดึงข้อมูล Sessions ทั้งหมดจาก Firebase
 *
 * @returns {Object} { status, data }
 */
function adminGetAllSessions() {
  const functionName = 'adminGetAllSessions';

  try {
    console.log(`🔑 [${functionName}] ดึงข้อมูล Sessions...`);

    const sessions = firebaseGet('sessions');

    if (!sessions) {
      return {
        status: 'success',
        data: {}
      };
    }

    console.log(`✅ [${functionName}] พบ ${Object.keys(sessions).length} Sessions`);

    return {
      status: 'success',
      data: sessions
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * 4.2 ลบ Session
 *
 * @param {string} token - Session Token
 * @returns {Object} { status, message }
 */
function adminDeleteSession(token) {
  const functionName = 'adminDeleteSession';

  try {
    console.log(`🗑️ [${functionName}] ลบ Session: ${token.substring(0, 8)}...`);

    if (!token) {
      return {
        status: 'error',
        message: 'Token จำเป็นต้องมี'
      };
    }

    const success = firebaseDeleteSession(token);

    if (success) {
      console.log(`✅ [${functionName}] ลบ Session สำเร็จ`);

      return {
        status: 'success',
        message: 'ลบ Session สำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถลบ Session ได้'
      };
    }

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

/**
 * 4.3 ลบ Sessions ที่หมดอายุทั้งหมด
 *
 * @returns {Object} { status, message, deleted }
 */
function adminClearExpiredSessions() {
  const functionName = 'adminClearExpiredSessions';

  try {
    console.log(`🗑️ [${functionName}] ลบ Sessions ที่หมดอายุ...`);

    const sessions = firebaseGet('sessions');

    if (!sessions) {
      return {
        status: 'success',
        message: 'ไม่มี Sessions ที่ต้องลบ',
        deleted: 0
      };
    }

    const now = new Date().getTime();
    let deletedCount = 0;

    for (const [token, session] of Object.entries(sessions)) {
      if (session.expires && session.expires < now) {
        firebaseDeleteSession(token);
        deletedCount++;
      }
    }

    console.log(`✅ [${functionName}] ลบ Sessions หมดอายุสำเร็จ: ${deletedCount}`);

    return {
      status: 'success',
      message: 'ลบ Sessions หมดอายุสำเร็จ',
      deleted: deletedCount
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString(),
      deleted: 0
    };
  }
}

// =================================================================
// 📂 SECTION 5: STATISTICS
// =================================================================

/**
 * 5.1 ดึงสถิติทั้งหมด
 *
 * @returns {Object} { status, data }
 */
function adminGetStatistics() {
  const functionName = 'adminGetStatistics';

  try {
    console.log(`📈 [${functionName}] ดึงสถิติ...`);

    // ดึงข้อมูลทั้งหมด
    const users = firebaseGet('users') || {};
    const workData = firebaseGet('workData') || {};
    const sessions = firebaseGet('sessions') || {};

    // นับจำนวน Admins
    let adminCount = 0;
    for (const [username, user] of Object.entries(users)) {
      if (user.role === 'Admin' || user.role === 'PowerUser') {
        adminCount++;
      }
    }

    // นับจำนวน Active Sessions
    const now = new Date().getTime();
    let activeSessions = 0;
    for (const [token, session] of Object.entries(sessions)) {
      if (session.expires && session.expires > now) {
        activeSessions++;
      }
    }

    const stats = {
      users: Object.keys(users).length,
      workData: Object.keys(workData).length,
      sessions: activeSessions,
      admins: adminCount
    };

    console.log(`✅ [${functionName}] สถิติ:`, JSON.stringify(stats));

    return {
      status: 'success',
      data: stats
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

// =================================================================
// 📂 SECTION 6: BATCH OPERATIONS
// =================================================================

/**
 * 6.1 Sync Work Data ทั้งหมดจาก Sheets → Firebase
 *
 * @returns {Object} { status, message, synced }
 */
function adminSyncAllWorkData() {
  const functionName = 'adminSyncAllWorkData';

  try {
    console.log(`🔄 [${functionName}] Sync Work Data ทั้งหมด...`);

    const users = firebaseGetAllUsers();

    if (!users || Object.keys(users).length === 0) {
      return {
        status: 'error',
        message: 'ไม่พบข้อมูล Users'
      };
    }

    let syncedCount = 0;
    const usernames = Object.keys(users);

    for (const username of usernames) {
      try {
        // คำนวณ Work Data จาก Sheets
        const workData = getUserWorkOverview(username);

        if (workData) {
          firebaseSetWorkData(username, workData);
          syncedCount++;
          console.log(`✅ [${functionName}] Sync ${username} สำเร็จ`);
        }
      } catch (error) {
        console.error(`❌ [${functionName}] Sync ${username} ล้มเหลว:`, error.toString());
      }
    }

    console.log(`✅ [${functionName}] Sync สำเร็จ: ${syncedCount}/${usernames.length}`);

    return {
      status: 'success',
      message: `Sync Work Data สำเร็จ: ${syncedCount}/${usernames.length}`,
      synced: syncedCount
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: error.toString(),
      synced: 0
    };
  }
}

console.log('✅ FirebaseAdmin_Backend.gs loaded successfully');
