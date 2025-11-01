// =================================================================
// 🔥 SMART DELIVERY INSIGHT - FIREBASE EDITION
// =================================================================
// Version: 3.0.0 (Firebase)
// Last Updated: 2025-10-31
// Authors: Claude Code, คุณจักร (หัวหน้าโครงการ)
// Description: ระบบจัดการการส่งมอบด้วย Firebase Realtime Database
// =================================================================

// =================================================================
// 📂 SECTION 1: CONFIGURATION
// =================================================================

/**
 * 1.1 Firebase Configuration
 */
const FIREBASE_CONFIG = {
  url: 'https://x-85fc7-default-rtdb.asia-southeast1.firebasedatabase.app',
  secret: 'FgpZbl8mveCB7YxzRVo9pkLMuc5T33AmmaN7u4WF',
  rootKey: 'สำเนาของ 004xProgram SDIP 84180'
};

/**
 * 1.2 Session Configuration
 */
const SESSION_CONFIG = {
  expiryDays: 2,
  autoRefreshMinutes: 15
};

/**
 * 1.3 Role Configuration
 */
const ROLES = {
  USER: 'User',
  POWERUSER: 'PowerUser',
  ADMIN: 'Admin'
};

// =================================================================
// 📂 SECTION 2: FIREBASE CORE FUNCTIONS
// =================================================================

/**
 * 2.1 Firebase GET Request
 *
 * @param {string} path - Firebase path (relative to rootKey)
 * @returns {Object|null} Data from Firebase
 */
function firebaseGet(path) {
  const functionName = 'firebaseGet';

  try {
    // Build full path
    const fullPath = path ? `${FIREBASE_CONFIG.rootKey}/${path}` : FIREBASE_CONFIG.rootKey;
    const url = `${FIREBASE_CONFIG.url}/${fullPath}.json?auth=${FIREBASE_CONFIG.secret}`;

    console.log(`🔍 [${functionName}] GET: ${path || 'root'}`);

    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    const content = response.getContentText();

    if (code !== 200) {
      console.error(`❌ [${functionName}] HTTP ${code}: ${content}`);
      return null;
    }

    const data = JSON.parse(content);
    console.log(`✅ [${functionName}] Success: ${path || 'root'}`);

    return data;

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return null;
  }
}

/**
 * 2.2 Firebase PUT Request (Overwrite)
 *
 * @param {string} path - Firebase path (relative to rootKey)
 * @param {Object} data - Data to write
 * @returns {boolean} Success status
 */
function firebasePut(path, data) {
  const functionName = 'firebasePut';

  try {
    const fullPath = `${FIREBASE_CONFIG.rootKey}/${path}`;
    const url = `${FIREBASE_CONFIG.url}/${fullPath}.json?auth=${FIREBASE_CONFIG.secret}`;

    console.log(`💾 [${functionName}] PUT: ${path}`);

    const response = UrlFetchApp.fetch(url, {
      method: 'put',
      contentType: 'application/json',
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();

    if (code !== 200) {
      console.error(`❌ [${functionName}] HTTP ${code}`);
      return false;
    }

    console.log(`✅ [${functionName}] Success: ${path}`);
    return true;

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return false;
  }
}

/**
 * 2.3 Firebase PATCH Request (Update)
 *
 * @param {string} path - Firebase path (relative to rootKey)
 * @param {Object} data - Data to update
 * @returns {boolean} Success status
 */
function firebasePatch(path, data) {
  const functionName = 'firebasePatch';

  try {
    const fullPath = `${FIREBASE_CONFIG.rootKey}/${path}`;
    const url = `${FIREBASE_CONFIG.url}/${fullPath}.json?auth=${FIREBASE_CONFIG.secret}`;

    console.log(`🔄 [${functionName}] PATCH: ${path}`);

    const response = UrlFetchApp.fetch(url, {
      method: 'patch',
      contentType: 'application/json',
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();

    if (code !== 200) {
      console.error(`❌ [${functionName}] HTTP ${code}`);
      return false;
    }

    console.log(`✅ [${functionName}] Success: ${path}`);
    return true;

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return false;
  }
}

/**
 * 2.4 Firebase DELETE Request
 *
 * @param {string} path - Firebase path (relative to rootKey)
 * @returns {boolean} Success status
 */
function firebaseDelete(path) {
  const functionName = 'firebaseDelete';

  try {
    const fullPath = `${FIREBASE_CONFIG.rootKey}/${path}`;
    const url = `${FIREBASE_CONFIG.url}/${fullPath}.json?auth=${FIREBASE_CONFIG.secret}`;

    console.log(`🗑️ [${functionName}] DELETE: ${path}`);

    const response = UrlFetchApp.fetch(url, {
      method: 'delete',
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();

    if (code !== 200) {
      console.error(`❌ [${functionName}] HTTP ${code}`);
      return false;
    }

    console.log(`✅ [${functionName}] Success: ${path}`);
    return true;

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return false;
  }
}

// =================================================================
// 📂 SECTION 3: AUTHENTICATION & SESSIONS
// =================================================================

/**
 * 3.1 User Login
 *
 * @param {Object} credentials - { username, password }
 * @returns {Object} { status, token, role, message }
 */
function userLogin(credentials) {
  const functionName = 'userLogin';

  try {
    console.log(`🔐 [${functionName}] Login attempt: ${credentials.username}`);

    // Validate input
    if (!credentials || !credentials.username || !credentials.password) {
      return {
        status: 'error',
        message: 'กรุณากรอก Username และ Password'
      };
    }

    // Get user from Firebase
    const user = firebaseGet(`users/${credentials.username}`);

    if (!user) {
      console.log(`❌ [${functionName}] User not found: ${credentials.username}`);
      return {
        status: 'error',
        message: 'Username หรือ Password ไม่ถูกต้อง'
      };
    }

    // Check password (plain text comparison)
    if (user.password !== credentials.password) {
      console.log(`❌ [${functionName}] Wrong password for: ${credentials.username}`);
      return {
        status: 'error',
        message: 'Username หรือ Password ไม่ถูกต้อง'
      };
    }

    // Check user status
    if (user.status && user.status !== 'Active') {
      console.log(`❌ [${functionName}] Inactive user: ${credentials.username}`);
      return {
        status: 'error',
        message: 'บัญชีของคุณถูกระงับการใช้งาน'
      };
    }

    // Generate session token
    const token = generateToken();
    const now = new Date();
    const expires = new Date(now.getTime() + (SESSION_CONFIG.expiryDays * 24 * 60 * 60 * 1000));

    // Create session
    const session = {
      username: credentials.username,
      role: user.role || ROLES.USER,
      loginTime: now.getTime(),
      expires: expires.getTime()
    };

    // Save session to Firebase
    const saved = firebasePut(`sessions/${token}`, session);

    if (!saved) {
      return {
        status: 'error',
        message: 'ไม่สามารถสร้าง Session ได้'
      };
    }

    console.log(`✅ [${functionName}] Login success: ${credentials.username} (${user.role})`);

    return {
      status: 'success',
      token: token,
      role: user.role || ROLES.USER,
      username: credentials.username,
      message: 'เข้าสู่ระบบสำเร็จ'
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    };
  }
}

/**
 * 3.2 Check Session
 *
 * @param {string} token - Session token
 * @returns {Object} { valid, username, role, message }
 */
function checkSession(token) {
  const functionName = 'checkSession';

  try {
    if (!token) {
      return {
        valid: false,
        message: 'ไม่พบ Session Token'
      };
    }

    // Get session from Firebase
    const session = firebaseGet(`sessions/${token}`);

    if (!session) {
      return {
        valid: false,
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check expiry
    const now = new Date().getTime();
    if (session.expires && session.expires < now) {
      // Delete expired session
      firebaseDelete(`sessions/${token}`);

      return {
        valid: false,
        message: 'Session หมดอายุ'
      };
    }

    console.log(`✅ [${functionName}] Valid session: ${session.username}`);

    return {
      valid: true,
      username: session.username,
      role: session.role,
      loginTime: session.loginTime
    };

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      valid: false,
      message: 'ไม่สามารถตรวจสอบ Session ได้'
    };
  }
}

/**
 * 3.3 Logout
 *
 * @param {string} token - Session token
 * @returns {Object} { status, message }
 */
function logout(token) {
  const functionName = 'logout';

  try {
    console.log(`👋 [${functionName}] Logout: ${token ? token.substring(0, 8) : 'no token'}`);

    if (!token) {
      return {
        status: 'error',
        message: 'ไม่พบ Session Token'
      };
    }

    // Delete session from Firebase
    const deleted = firebaseDelete(`sessions/${token}`);

    if (deleted) {
      console.log(`✅ [${functionName}] Logout success`);
      return {
        status: 'success',
        message: 'ออกจากระบบสำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถออกจากระบบได้'
      };
    }

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return {
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ'
    };
  }
}

/**
 * 3.4 Generate Token
 *
 * @returns {string} Random token
 */
function generateToken() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${random}`;
}

// =================================================================
// 📂 SECTION 4: USER MANAGEMENT
// =================================================================

/**
 * 4.1 Get User Profile
 *
 * @param {string} username - Username
 * @returns {Object} { status, data, message }
 */
function getUserProfile(username) {
  const functionName = 'getUserProfile';

  try {
    console.log(`👤 [${functionName}] Get profile: ${username}`);

    if (!username) {
      return {
        status: 'error',
        message: 'Username จำเป็นต้องมี'
      };
    }

    // Get user from Firebase
    const user = firebaseGet(`users/${username}`);

    if (!user) {
      return {
        status: 'error',
        message: 'ไม่พบข้อมูลผู้ใช้'
      };
    }

    // Remove password from response
    const userProfile = { ...user };
    delete userProfile.password;

    console.log(`✅ [${functionName}] Profile found: ${username}`);

    return {
      status: 'success',
      data: userProfile
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
 * 4.2 Get All Users (Admin only)
 *
 * @param {string} token - Session token
 * @returns {Object} { status, data, message }
 */
function getAllUsers(token) {
  const functionName = 'getAllUsers';

  try {
    console.log(`👥 [${functionName}] Get all users`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check admin permission
    if (session.role !== ROLES.ADMIN && session.role !== ROLES.POWERUSER) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      };
    }

    // Get all users
    const users = firebaseGet('users');

    if (!users) {
      return {
        status: 'success',
        data: {}
      };
    }

    // Remove passwords
    const usersData = {};
    for (const [username, user] of Object.entries(users)) {
      usersData[username] = { ...user };
      delete usersData[username].password;
    }

    console.log(`✅ [${functionName}] Found ${Object.keys(usersData).length} users`);

    return {
      status: 'success',
      data: usersData
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
 * 4.3 Create User (Admin only)
 *
 * @param {string} token - Session token
 * @param {Object} userData - { username, password, role, profile }
 * @returns {Object} { status, message }
 */
function createUser(token, userData) {
  const functionName = 'createUser';

  try {
    console.log(`➕ [${functionName}] Create user: ${userData.username}`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check admin permission
    if (session.role !== ROLES.ADMIN) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์สร้างผู้ใช้'
      };
    }

    // Validate input
    if (!userData.username || !userData.password) {
      return {
        status: 'error',
        message: 'Username และ Password จำเป็นต้องมี'
      };
    }

    // Check if user exists
    const existingUser = firebaseGet(`users/${userData.username}`);
    if (existingUser) {
      return {
        status: 'error',
        message: 'Username นี้มีอยู่ในระบบแล้ว'
      };
    }

    // Create user object
    const newUser = {
      password: userData.password,
      role: userData.role || ROLES.USER,
      status: 'Active',
      profile: userData.profile || {},
      createdAt: new Date().getTime(),
      createdBy: session.username
    };

    // Save to Firebase
    const saved = firebasePut(`users/${userData.username}`, newUser);

    if (saved) {
      console.log(`✅ [${functionName}] User created: ${userData.username}`);
      return {
        status: 'success',
        message: 'สร้างผู้ใช้สำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถสร้างผู้ใช้ได้'
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
 * 4.4 Update User (Admin only)
 *
 * @param {string} token - Session token
 * @param {string} username - Username to update
 * @param {Object} userData - Data to update
 * @returns {Object} { status, message }
 */
function updateUser(token, username, userData) {
  const functionName = 'updateUser';

  try {
    console.log(`✏️ [${functionName}] Update user: ${username}`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check permission (Admin or self-update)
    if (session.role !== ROLES.ADMIN && session.username !== username) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์แก้ไขข้อมูลผู้ใช้นี้'
      };
    }

    // Get existing user
    const existingUser = firebaseGet(`users/${username}`);
    if (!existingUser) {
      return {
        status: 'error',
        message: 'ไม่พบผู้ใช้นี้ในระบบ'
      };
    }

    // Prepare update data
    const updateData = {
      ...userData,
      updatedAt: new Date().getTime(),
      updatedBy: session.username
    };

    // Don't allow non-admin to change role
    if (session.role !== ROLES.ADMIN) {
      delete updateData.role;
    }

    // Update in Firebase
    const updated = firebasePatch(`users/${username}`, updateData);

    if (updated) {
      console.log(`✅ [${functionName}] User updated: ${username}`);
      return {
        status: 'success',
        message: 'อัพเดทข้อมูลผู้ใช้สำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถอัพเดทข้อมูลผู้ใช้ได้'
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
 * 4.5 Delete User (Admin only)
 *
 * @param {string} token - Session token
 * @param {string} username - Username to delete
 * @returns {Object} { status, message }
 */
function deleteUser(token, username) {
  const functionName = 'deleteUser';

  try {
    console.log(`🗑️ [${functionName}] Delete user: ${username}`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check admin permission
    if (session.role !== ROLES.ADMIN) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์ลบผู้ใช้'
      };
    }

    // Don't allow deleting self
    if (session.username === username) {
      return {
        status: 'error',
        message: 'ไม่สามารถลบบัญชีของตัวเองได้'
      };
    }

    // Delete user
    const deletedUser = firebaseDelete(`users/${username}`);

    // Delete work data
    const deletedWork = firebaseDelete(`workData/${username}`);

    if (deletedUser) {
      console.log(`✅ [${functionName}] User deleted: ${username}`);
      return {
        status: 'success',
        message: 'ลบผู้ใช้สำเร็จ'
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถลบผู้ใช้ได้'
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
// 📂 SECTION 5: WORK DATA MANAGEMENT
// =================================================================

/**
 * 5.1 Get User Work Data
 *
 * @param {string} token - Session token
 * @param {string} username - Username (optional, default to session user)
 * @returns {Object} { status, data, message }
 */
function getUserWorkData(token, username) {
  const functionName = 'getUserWorkData';

  try {
    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Default to session user
    const targetUser = username || session.username;

    // Check permission
    if (session.role === ROLES.USER && session.username !== targetUser) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      };
    }

    console.log(`📊 [${functionName}] Get work data: ${targetUser}`);

    // Get work data from Firebase
    const workData = firebaseGet(`workData/${targetUser}`);

    if (!workData) {
      return {
        status: 'success',
        data: {
          sendMoney: { r: 0, ems: 0, cod: 0, total: 0 },
          prepare: { r: 0, ems: 0, cod: 0, total: 0 },
          recorded: { r: 0, ems: 0, cod: 0, total: 0 },
          backlog: { r: 0, ems: 0, cod: 0, total: 0 },
          returned: { r: 0, ems: 0, cod: 0, total: 0 }
        }
      };
    }

    console.log(`✅ [${functionName}] Work data found: ${targetUser}`);

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
 * 5.2 Get All Work Data (PowerUser/Admin only)
 *
 * @param {string} token - Session token
 * @returns {Object} { status, data, message }
 */
function getAllWorkData(token) {
  const functionName = 'getAllWorkData';

  try {
    console.log(`📊 [${functionName}] Get all work data`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check permission
    if (session.role !== ROLES.POWERUSER && session.role !== ROLES.ADMIN) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      };
    }

    // Get all work data
    const workData = firebaseGet('workData');

    if (!workData) {
      return {
        status: 'success',
        data: {}
      };
    }

    console.log(`✅ [${functionName}] Found work data for ${Object.keys(workData).length} users`);

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
 * 5.3 Get Team Data (PowerUser/Admin only)
 *
 * @param {string} token - Session token
 * @returns {Object} { status, data, message }
 */
function getTeamData(token) {
  const functionName = 'getTeamData';

  try {
    console.log(`👥 [${functionName}] Get team data`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check permission
    if (session.role !== ROLES.POWERUSER && session.role !== ROLES.ADMIN) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      };
    }

    // Get users and work data
    const users = firebaseGet('users');
    const workData = firebaseGet('workData');

    if (!users) {
      return {
        status: 'success',
        data: []
      };
    }

    // Combine user profiles with work data
    const teamData = [];
    for (const [username, user] of Object.entries(users)) {
      teamData.push({
        username: username,
        role: user.role,
        profile: user.profile || {},
        workData: workData && workData[username] ? workData[username] : {
          sendMoney: { r: 0, ems: 0, cod: 0, total: 0 },
          prepare: { r: 0, ems: 0, cod: 0, total: 0 },
          recorded: { r: 0, ems: 0, cod: 0, total: 0 },
          backlog: { r: 0, ems: 0, cod: 0, total: 0 },
          returned: { r: 0, ems: 0, cod: 0, total: 0 }
        }
      });
    }

    console.log(`✅ [${functionName}] Team data: ${teamData.length} members`);

    return {
      status: 'success',
      data: teamData
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
// 📂 SECTION 6: DASHBOARD MANAGEMENT
// =================================================================

/**
 * 6.1 Get Dashboard HTML
 *
 * @param {string} token - Session token
 * @returns {HtmlOutput|Object} Dashboard HTML or error
 */
function getDashboardHtml(token) {
  const functionName = 'getDashboardHtml';

  try {
    console.log(`📄 [${functionName}] Get dashboard`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return createErrorPage('Session หมดอายุ', 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
    }

    // Determine dashboard based on role
    let dashboardFile;
    switch (session.role) {
      case ROLES.ADMIN:
      case ROLES.POWERUSER:
        dashboardFile = 'PowerUser_Dashboard';
        break;
      case ROLES.USER:
      default:
        dashboardFile = 'User_Dashboard';
        break;
    }

    console.log(`✅ [${functionName}] Loading: ${dashboardFile} for ${session.username} (${session.role})`);

    const template = HtmlService.createTemplateFromFile(dashboardFile);
    template.token = token;
    template.username = session.username;
    template.role = session.role;

    return template.evaluate()
        .setTitle('SDIP Dashboard')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return createErrorPage('ไม่สามารถโหลด Dashboard ได้', error.toString());
  }
}

/**
 * 6.2 Web App Entry Point
 *
 * @param {Object} e - Event object
 * @returns {HtmlOutput} HTML page
 */
function doGet(e) {
  const functionName = 'doGet';

  try {
    console.log(`🚀 [${functionName}] Web App started`);

    // Check if token is provided
    const token = e && e.parameter && e.parameter.token;

    if (token) {
      // Return dashboard if token is valid
      return getDashboardHtml(token);
    }

    // No token, show login page
    console.log(`✅ [${functionName}] Loading Login page`);

    const template = HtmlService.createTemplateFromFile('Login');

    return template.evaluate()
        .setTitle('SDIP Login')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  } catch (error) {
    console.error(`❌ [${functionName}] Error:`, error.toString());
    return createErrorPage('ระบบไม่พร้อมใช้งาน', error.toString());
  }
}

/**
 * 6.3 Include HTML/CSS/JS Files
 *
 * @param {string} filename - File name without extension
 * @returns {string} File content
 */
function include(filename) {
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (error) {
    console.error(`❌ [include] Error loading ${filename}:`, error.toString());
    return `<!-- Error loading ${filename}: ${error.toString()} -->`;
  }
}

// =================================================================
// 📂 SECTION 7: ADMIN FUNCTIONS
// =================================================================

/**
 * 7.1 Get All Sessions (Admin only)
 *
 * @param {string} token - Session token
 * @returns {Object} { status, data, message }
 */
function adminGetAllSessions(token) {
  const functionName = 'adminGetAllSessions';

  try {
    console.log(`🔑 [${functionName}] Get all sessions`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check admin permission
    if (session.role !== ROLES.ADMIN) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      };
    }

    // Get all sessions
    const sessions = firebaseGet('sessions');

    if (!sessions) {
      return {
        status: 'success',
        data: {}
      };
    }

    console.log(`✅ [${functionName}] Found ${Object.keys(sessions).length} sessions`);

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
 * 7.2 Delete Session (Admin only)
 *
 * @param {string} token - Admin session token
 * @param {string} targetToken - Session token to delete
 * @returns {Object} { status, message }
 */
function adminDeleteSession(token, targetToken) {
  const functionName = 'adminDeleteSession';

  try {
    console.log(`🗑️ [${functionName}] Delete session`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check admin permission
    if (session.role !== ROLES.ADMIN) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์ลบ Session'
      };
    }

    // Delete session
    const deleted = firebaseDelete(`sessions/${targetToken}`);

    if (deleted) {
      console.log(`✅ [${functionName}] Session deleted`);
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
 * 7.3 Clear Expired Sessions (Admin only)
 *
 * @param {string} token - Session token
 * @returns {Object} { status, message, deleted }
 */
function adminClearExpiredSessions(token) {
  const functionName = 'adminClearExpiredSessions';

  try {
    console.log(`🗑️ [${functionName}] Clear expired sessions`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check admin permission
    if (session.role !== ROLES.ADMIN) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์ล้าง Sessions'
      };
    }

    // Get all sessions
    const sessions = firebaseGet('sessions');

    if (!sessions) {
      return {
        status: 'success',
        message: 'ไม่มี Sessions ที่ต้องลบ',
        deleted: 0
      };
    }

    // Delete expired sessions
    const now = new Date().getTime();
    let deletedCount = 0;

    for (const [sessionToken, sessionData] of Object.entries(sessions)) {
      if (sessionData.expires && sessionData.expires < now) {
        firebaseDelete(`sessions/${sessionToken}`);
        deletedCount++;
      }
    }

    console.log(`✅ [${functionName}] Deleted ${deletedCount} expired sessions`);

    return {
      status: 'success',
      message: `ลบ Sessions หมดอายุสำเร็จ: ${deletedCount} sessions`,
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

/**
 * 7.4 Get Statistics (Admin/PowerUser only)
 *
 * @param {string} token - Session token
 * @returns {Object} { status, data, message }
 */
function adminGetStatistics(token) {
  const functionName = 'adminGetStatistics';

  try {
    console.log(`📈 [${functionName}] Get statistics`);

    // Check session
    const session = checkSession(token);
    if (!session.valid) {
      return {
        status: 'error',
        message: 'Session ไม่ถูกต้อง'
      };
    }

    // Check permission
    if (session.role !== ROLES.ADMIN && session.role !== ROLES.POWERUSER) {
      return {
        status: 'error',
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      };
    }

    // Get data
    const users = firebaseGet('users') || {};
    const workData = firebaseGet('workData') || {};
    const sessions = firebaseGet('sessions') || {};

    // Count users by role
    let userCount = 0;
    let powerUserCount = 0;
    let adminCount = 0;

    for (const [username, user] of Object.entries(users)) {
      if (user.role === ROLES.ADMIN) {
        adminCount++;
      } else if (user.role === ROLES.POWERUSER) {
        powerUserCount++;
      } else {
        userCount++;
      }
    }

    // Count active sessions
    const now = new Date().getTime();
    let activeSessions = 0;

    for (const [sessionToken, sessionData] of Object.entries(sessions)) {
      if (sessionData.expires && sessionData.expires > now) {
        activeSessions++;
      }
    }

    const stats = {
      users: {
        total: Object.keys(users).length,
        admin: adminCount,
        powerUser: powerUserCount,
        user: userCount
      },
      workData: Object.keys(workData).length,
      sessions: {
        total: Object.keys(sessions).length,
        active: activeSessions
      }
    };

    console.log(`✅ [${functionName}] Statistics:`, JSON.stringify(stats));

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
// 📂 SECTION 8: UTILITY FUNCTIONS
// =================================================================

/**
 * 8.1 Create Error Page
 *
 * @param {string} title - Error title
 * @param {string} message - Error message
 * @returns {HtmlOutput} Error page
 */
function createErrorPage(title, message) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Error - SDIP</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .error-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
        }
        .error-icon {
          font-size: 80px;
          margin-bottom: 20px;
        }
        .error-title {
          color: #e74c3c;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .error-message {
          color: #555;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
          word-wrap: break-word;
        }
        .error-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 16px;
          border-radius: 25px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .error-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-title">${title}</div>
        <div class="error-message">${message}</div>
        <a href="javascript:history.back()" class="error-button">← กลับหน้าก่อนหน้า</a>
      </div>
    </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
      .setTitle('Error - SDIP')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 8.2 Get Firebase Config (for client)
 *
 * @returns {Object} Firebase config (without secret)
 */
function getFirebaseConfig() {
  return {
    url: FIREBASE_CONFIG.url,
    rootKey: FIREBASE_CONFIG.rootKey,
    autoRefreshMinutes: SESSION_CONFIG.autoRefreshMinutes
  };
}

/**
 * 8.3 Test Firebase Connection
 *
 * @returns {Object} { status, message }
 */
function testFirebaseConnection() {
  const functionName = 'testFirebaseConnection';

  try {
    console.log(`🧪 [${functionName}] Testing Firebase connection...`);

    const testData = firebaseGet('');

    if (testData !== null) {
      console.log(`✅ [${functionName}] Firebase connection OK`);
      return {
        status: 'success',
        message: 'เชื่อมต่อ Firebase สำเร็จ',
        rootKeys: Object.keys(testData || {})
      };
    } else {
      return {
        status: 'error',
        message: 'ไม่สามารถเชื่อมต่อ Firebase ได้'
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
// 🎯 END OF CODE
// =================================================================

console.log('✅ Code.gs (Firebase Edition) loaded successfully');
console.log('📊 Configuration:');
console.log(`   - Firebase URL: ${FIREBASE_CONFIG.url}`);
console.log(`   - Root Key: ${FIREBASE_CONFIG.rootKey}`);
console.log(`   - Session Expiry: ${SESSION_CONFIG.expiryDays} days`);
console.log(`   - Auto Refresh: ${SESSION_CONFIG.autoRefreshMinutes} minutes`);
