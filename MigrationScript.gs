// =================================================================
// 🔄 MIGRATION SCRIPT - SHEETS → FIREBASE
// =================================================================
// Description: ย้ายข้อมูลทั้งหมดจาก Google Sheets ไป Firebase
// Author: Claude Code Migration Team
// Created: 2025-10-29
// =================================================================

// =================================================================
// 📂 SECTION 1: MIGRATE USERS
// =================================================================

/**
 * 1.1 ย้ายข้อมูลผู้ใช้ทั้งหมดจาก Sheets → Firebase
 *
 * @returns {Object} { success: number, failed: number, errors: [] }
 */
function migrateUsersToFirebase() {
  console.log('👥 [MIGRATION] เริ่มย้ายข้อมูล Users...');

  const SHEET_NAME = 'SDIP Employee Database';
  const startTime = new Date().getTime();

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`ไม่พบ Sheet "${SHEET_NAME}"`);
    }

    const data = sheet.getDataRange().getValues();
    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    // วนอ่านข้อมูล (ข้ามแถวแรกที่เป็น Header)
    for (let i = 1; i < data.length; i++) {
      const username = (data[i][1] || '').toString().trim();

      if (!username) {
        continue; // ข้ามแถวที่ไม่มี username
      }

      try {
        // สร้างข้อมูลผู้ใช้
        const userData = {
          password: (data[i][2] || '').toString(),
          role: (data[i][3] || 'User').toString().trim(),
          profile: {
            name: (data[i][0] || '').toString().trim(),
            side: (data[i][4] || '').toString().trim(),
            area: (data[i][5] || '').toString().trim(),
            routes: (data[i][6] || '').toString().trim()
          }
        };

        // บันทึกลง Firebase
        const success = firebaseSetUser(username, userData);

        if (success) {
          successCount++;
          console.log(`✅ [MIGRATION] ${i}/${data.length - 1}: ${username}`);
        } else {
          failedCount++;
          errors.push({ row: i + 1, username, error: 'Firebase write failed' });
        }

      } catch (error) {
        failedCount++;
        errors.push({ row: i + 1, username, error: error.toString() });
        console.error(`❌ [MIGRATION] Error at row ${i + 1}:`, error.toString());
      }
    }

    const duration = new Date().getTime() - startTime;

    const result = {
      success: successCount,
      failed: failedCount,
      errors: errors,
      duration: duration
    };

    console.log('✅ [MIGRATION] Users สำเร็จ:', JSON.stringify(result));

    return result;

  } catch (error) {
    console.error('❌ [MIGRATION] Fatal error:', error.toString());
    return {
      success: 0,
      failed: 0,
      errors: [{ error: error.toString() }],
      duration: 0
    };
  }
}

// =================================================================
// 📂 SECTION 2: MIGRATE WORK DATA
// =================================================================

/**
 * 2.1 ย้ายข้อมูล Work Data ทั้งหมดจาก Sheets → Firebase
 *
 * @returns {Object} { success: number, failed: number, errors: [] }
 */
function migrateWorkDataToFirebase() {
  console.log('📊 [MIGRATION] เริ่มย้ายข้อมูล Work Data...');

  const startTime = new Date().getTime();

  try {
    // 1. ดึงรายชื่อ Users ทั้งหมด
    const users = firebaseGetAllUsers();

    if (!users || Object.keys(users).length === 0) {
      throw new Error('ไม่พบข้อมูล Users ใน Firebase - กรุณาย้าย Users ก่อน');
    }

    const usernames = Object.keys(users);
    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    console.log(`📊 [MIGRATION] พบ ${usernames.length} Users - กำลังคำนวณ Work Data...`);

    // 2. วนย้ายข้อมูลแต่ละคน
    for (let i = 0; i < usernames.length; i++) {
      const username = usernames[i];

      try {
        console.log(`📊 [MIGRATION] ${i + 1}/${usernames.length}: ${username}`);

        // คำนวณ Work Data จาก Sheets
        const workData = getUserWorkOverview(username);

        if (workData) {
          // บันทึกลง Firebase
          const success = firebaseSetWorkData(username, workData);

          if (success) {
            successCount++;
            console.log(`✅ [MIGRATION] ${username} - สำเร็จ`);
          } else {
            failedCount++;
            errors.push({ username, error: 'Firebase write failed' });
          }
        } else {
          failedCount++;
          errors.push({ username, error: 'No work data found' });
        }

      } catch (error) {
        failedCount++;
        errors.push({ username, error: error.toString() });
        console.error(`❌ [MIGRATION] Error for ${username}:`, error.toString());
      }
    }

    const duration = new Date().getTime() - startTime;

    const result = {
      success: successCount,
      failed: failedCount,
      errors: errors,
      duration: duration
    };

    console.log('✅ [MIGRATION] Work Data สำเร็จ:', JSON.stringify(result));

    return result;

  } catch (error) {
    console.error('❌ [MIGRATION] Fatal error:', error.toString());
    return {
      success: 0,
      failed: 0,
      errors: [{ error: error.toString() }],
      duration: 0
    };
  }
}

// =================================================================
// 📂 SECTION 3: MASTER MIGRATION FUNCTION
// =================================================================

/**
 * 3.1 ย้ายข้อมูลทั้งหมดจาก Sheets → Firebase
 *
 * ⚠️ ใช้ฟังก์ชันนี้เพื่อย้ายข้อมูลครั้งแรก
 *
 * @returns {Object} รายงานผลการย้าย
 */
function migrateAllDataToFirebase() {
  console.log('🚀 [MIGRATION] เริ่มย้ายข้อมูลทั้งหมด...');

  const totalStartTime = new Date().getTime();

  // ขั้นตอนที่ 1: ย้าย Users
  console.log('\n=== STEP 1: MIGRATE USERS ===');
  const usersResult = migrateUsersToFirebase();

  // ขั้นตอนที่ 2: ย้าย Work Data
  console.log('\n=== STEP 2: MIGRATE WORK DATA ===');
  const workDataResult = migrateWorkDataToFirebase();

  const totalDuration = new Date().getTime() - totalStartTime;

  const summary = {
    users: usersResult,
    workData: workDataResult,
    totalDuration: totalDuration,
    completedAt: new Date().toISOString()
  };

  console.log('\n✅ [MIGRATION] เสร็จสิ้น!');
  console.log('📊 สรุปผล:', JSON.stringify(summary, null, 2));

  // แสดงผลลัพธ์
  const message = `
🎉 การย้ายข้อมูลเสร็จสิ้น!

👥 Users:
   ✅ สำเร็จ: ${usersResult.success}
   ❌ ล้มเหลว: ${usersResult.failed}
   ⏱️ ใช้เวลา: ${usersResult.duration} ms

📊 Work Data:
   ✅ สำเร็จ: ${workDataResult.success}
   ❌ ล้มเหลว: ${workDataResult.failed}
   ⏱️ ใช้เวลา: ${workDataResult.duration} ms

⏱️ รวมทั้งหมด: ${Math.round(totalDuration / 1000)} วินาที
  `;

  Browser.msgBox('Migration Complete', message, Browser.Buttons.OK);

  return summary;
}

// =================================================================
// 📂 SECTION 4: VERIFICATION FUNCTIONS
// =================================================================

/**
 * 4.1 ตรวจสอบข้อมูลใน Firebase
 *
 * @returns {Object} สรุปข้อมูลที่มีใน Firebase
 */
function verifyFirebaseData() {
  console.log('🔍 [VERIFICATION] ตรวจสอบข้อมูลใน Firebase...');

  try {
    const users = firebaseGetAllUsers();
    const userCount = users ? Object.keys(users).length : 0;

    const usernames = Object.keys(users || {});
    let workDataCount = 0;

    // นับจำนวน Work Data
    for (const username of usernames) {
      const workData = firebaseGetWorkData(username);
      if (workData) {
        workDataCount++;
      }
    }

    const summary = {
      users: userCount,
      workData: workDataCount,
      checkedAt: new Date().toISOString()
    };

    console.log('✅ [VERIFICATION] สรุป:', JSON.stringify(summary));

    const message = `
📊 สรุปข้อมูลใน Firebase:

👥 Users: ${userCount}
📊 Work Data: ${workDataCount}

${workDataCount < userCount ? '⚠️ มี User บางคนยังไม่มี Work Data' : '✅ ข้อมูลครบทุกคน'}
    `;

    Browser.msgBox('Firebase Verification', message, Browser.Buttons.OK);

    return summary;

  } catch (error) {
    console.error('❌ [VERIFICATION] Error:', error.toString());
    Browser.msgBox('Error', 'ไม่สามารถตรวจสอบข้อมูลได้: ' + error.toString(), Browser.Buttons.OK);
    return null;
  }
}

/**
 * 4.2 ทดสอบการเชื่อมต่อ Firebase
 */
function testFirebaseConnection() {
  console.log('🧪 [TEST] ทดสอบการเชื่อมต่อ Firebase...');

  const isConnected = firebaseTestConnection();

  if (isConnected) {
    Browser.msgBox('Test Result', '✅ เชื่อมต่อ Firebase สำเร็จ!', Browser.Buttons.OK);
  } else {
    Browser.msgBox('Test Result', '❌ ไม่สามารถเชื่อมต่อ Firebase ได้\n\nกรุณาตรวจสอบ:\n- FIREBASE_CONFIG ใน FirebaseService.gs\n- Internet connection\n- Firebase Database Rules', Browser.Buttons.OK);
  }

  return isConnected;
}

// =================================================================
// 📂 SECTION 5: ROLLBACK FUNCTIONS
// =================================================================

/**
 * 5.1 ลบข้อมูล Work Data ทั้งหมดจาก Firebase
 *
 * ⚠️ ระวัง! ฟังก์ชันนี้จะลบข้อมูล Work Data ทั้งหมด
 */
function clearAllWorkDataFromFirebase() {
  console.warn('⚠️ [ROLLBACK] กำลังลบ Work Data ทั้งหมด...');

  const confirm = Browser.msgBox(
    'ยืนยันการลบข้อมูล',
    'คุณแน่ใจหรือไม่ที่จะลบ Work Data ทั้งหมดใน Firebase?',
    Browser.Buttons.YES_NO
  );

  if (confirm !== 'yes') {
    console.log('❌ [ROLLBACK] ยกเลิกการลบข้อมูล');
    return false;
  }

  return firebaseDelete('workData');
}

console.log('✅ MigrationScript.gs loaded successfully');
