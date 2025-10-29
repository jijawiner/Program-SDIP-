// =================================================================
// 🔍 FIREBASE EXPLORER - ดูโครงสร้างข้อมูลใน Firebase
// =================================================================

const FIREBASE_URL    = 'https://x-85fc7-default-rtdb.asia-southeast1.firebasedatabase.app';
const FIREBASE_SECRET = 'FgpZbl8mveCB7YxzRVo9pkLMuc5T33AmmaN7u4WF';

/**
 * ดึงข้อมูลจาก Firebase
 */
function firebaseGet(path) {
  try {
    const url = `${FIREBASE_URL}/${path}.json?auth=${FIREBASE_SECRET}`;

    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    const content = response.getContentText();

    if (code !== 200) {
      return { error: `HTTP ${code}: ${content}` };
    }

    return JSON.parse(content);

  } catch (error) {
    return { error: error.toString() };
  }
}

/**
 * ดูข้อมูลทั้งหมดใน Firebase
 */
function exploreFirebaseRoot() {
  console.log('🔍 [Explorer] กำลังดึงข้อมูลจาก Firebase Root...');

  const data = firebaseGet('');

  if (data.error) {
    console.error('❌ Error:', data.error);
    return data;
  }

  console.log('✅ [Explorer] ดึงข้อมูลสำเร็จ!');
  console.log('📊 Root Keys:', Object.keys(data || {}));

  // แสดงโครงสร้างแต่ละ Node
  for (const key of Object.keys(data || {})) {
    console.log(`\n📁 [${key}]:`);

    if (typeof data[key] === 'object' && data[key] !== null) {
      const subKeys = Object.keys(data[key]);
      console.log(`   - จำนวน items: ${subKeys.length}`);
      console.log(`   - Keys: ${subKeys.slice(0, 5).join(', ')}${subKeys.length > 5 ? '...' : ''}`);

      // แสดงตัวอย่างข้อมูล
      if (subKeys.length > 0) {
        const firstKey = subKeys[0];
        console.log(`   - ตัวอย่าง (${firstKey}):`, JSON.stringify(data[key][firstKey]).substring(0, 200));
      }
    } else {
      console.log(`   - Value:`, data[key]);
    }
  }

  return data;
}

/**
 * ดูข้อมูล Users
 */
function exploreUsers() {
  console.log('👥 [Explorer] กำลังดึงข้อมูล Users...');

  const users = firebaseGet('users');

  if (users && !users.error) {
    console.log('✅ พบ Users:', Object.keys(users).length, 'คน');

    // แสดง 3 คนแรก
    const usernames = Object.keys(users).slice(0, 3);
    for (const username of usernames) {
      console.log(`\n👤 ${username}:`, JSON.stringify(users[username], null, 2));
    }
  } else {
    console.error('❌ ไม่พบข้อมูล Users:', users.error);
  }

  return users;
}

/**
 * ดูข้อมูล Work Data
 */
function exploreWorkData() {
  console.log('📊 [Explorer] กำลังดึงข้อมูล Work Data...');

  const workData = firebaseGet('workData');

  if (workData && !workData.error) {
    console.log('✅ พบ Work Data:', Object.keys(workData).length, 'records');

    // แสดง 3 รายการแรก
    const usernames = Object.keys(workData).slice(0, 3);
    for (const username of usernames) {
      console.log(`\n📊 ${username}:`, JSON.stringify(workData[username], null, 2));
    }
  } else {
    console.error('❌ ไม่พบข้อมูล Work Data:', workData.error);
  }

  return workData;
}

/**
 * ดูข้อมูล Sessions
 */
function exploreSessions() {
  console.log('🔑 [Explorer] กำลังดึงข้อมูล Sessions...');

  const sessions = firebaseGet('sessions');

  if (sessions && !sessions.error) {
    console.log('✅ พบ Sessions:', Object.keys(sessions).length, 'sessions');

    // แสดง 3 รายการแรก
    const tokens = Object.keys(sessions).slice(0, 3);
    for (const token of tokens) {
      console.log(`\n🔑 ${token.substring(0, 20)}...:`, JSON.stringify(sessions[token], null, 2));
    }
  } else {
    console.error('❌ ไม่พบข้อมูล Sessions:', sessions.error);
  }

  return sessions;
}

/**
 * วิเคราะห์โครงสร้างข้อมูล
 */
function analyzeFirebaseStructure() {
  console.log('🔍 [Analyzer] เริ่มวิเคราะห์โครงสร้าง Firebase...\n');

  const root = firebaseGet('');

  if (root.error) {
    console.error('❌ ไม่สามารถเชื่อมต่อ Firebase:', root.error);
    return;
  }

  const report = {
    rootKeys: Object.keys(root || {}),
    structure: {}
  };

  // วิเคราะห์แต่ละ Node
  for (const key of report.rootKeys) {
    const node = root[key];

    if (typeof node === 'object' && node !== null) {
      const items = Object.keys(node);

      report.structure[key] = {
        type: 'object',
        count: items.length,
        sampleKeys: items.slice(0, 3),
        schema: {}
      };

      // วิเคราะห์ Schema จากรายการแรก
      if (items.length > 0) {
        const firstItem = node[items[0]];
        report.structure[key].schema = analyzeSchema(firstItem);
      }
    } else {
      report.structure[key] = {
        type: typeof node,
        value: node
      };
    }
  }

  console.log('📊 สรุปโครงสร้าง Firebase:');
  console.log(JSON.stringify(report, null, 2));

  // แสดง Summary
  console.log('\n📋 Summary:');
  for (const [key, info] of Object.entries(report.structure)) {
    if (info.type === 'object') {
      console.log(`  📁 ${key}: ${info.count} items`);
      console.log(`     Schema:`, JSON.stringify(info.schema, null, 6));
    } else {
      console.log(`  📄 ${key}: ${info.type} = ${info.value}`);
    }
  }

  return report;
}

/**
 * วิเคราะห์ Schema ของ Object
 */
function analyzeSchema(obj) {
  const schema = {};

  for (const [key, value] of Object.entries(obj || {})) {
    if (typeof value === 'object' && value !== null) {
      schema[key] = {
        type: 'object',
        keys: Object.keys(value)
      };
    } else {
      schema[key] = typeof value;
    }
  }

  return schema;
}

/**
 * ทดสอบการเชื่อมต่อ Firebase
 */
function testFirebaseConnection() {
  console.log('🧪 [Test] ทดสอบการเชื่อมต่อ Firebase...');

  const url = `${FIREBASE_URL}/.json?auth=${FIREBASE_SECRET}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();

    if (code === 200) {
      console.log('✅ เชื่อมต่อ Firebase สำเร็จ!');
      return true;
    } else {
      console.error(`❌ เชื่อมต่อล้มเหลว - HTTP ${code}`);
      return false;
    }

  } catch (error) {
    console.error('❌ Error:', error.toString());
    return false;
  }
}

console.log('✅ Firebase Explorer loaded successfully');
console.log('📖 Available functions:');
console.log('   - testFirebaseConnection()');
console.log('   - exploreFirebaseRoot()');
console.log('   - exploreUsers()');
console.log('   - exploreWorkData()');
console.log('   - exploreSessions()');
console.log('   - analyzeFirebaseStructure()');
