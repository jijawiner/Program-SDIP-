# 🔥 Firebase Realtime Database Schema Design

## 📍 Firebase URL
```
https://x-85fc7-default-rtdb.asia-southeast1.firebasedatabase.app
```

---

## 🗂️ Database Structure

```json
{
  "sdip": {
    "users": {
      "$userId": {
        "username": "string",
        "fullName": "string",
        "role": "USER | PowerUser | Admin",
        "side": "string",         // ด้านจ่าย
        "area": "string",         // เขต
        "routes": "string",       // เส้นทาง
        "phone": "string",
        "email": "string",
        "createdAt": "timestamp",
        "lastLogin": "timestamp",
        "isActive": "boolean"
      }
    },

    "work": {
      "sendMoney": {
        "$workId": {
          "userId": "string",
          "username": "string",
          "type": "COD",
          "barcode": "string",
          "amount": "number",
          "date": "timestamp",
          "status": "pending | completed",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      },

      "prepare": {
        "$workId": {
          "userId": "string",
          "username": "string",
          "type": "R | EMS | COD",
          "barcode": "string",
          "date": "timestamp",
          "isRecorded": "boolean",
          "recordedAt": "timestamp | null",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      },

      "backlog": {
        "$workId": {
          "userId": "string",
          "username": "string",
          "type": "R | EMS | COD",
          "barcode": "string",
          "details": "string",
          "scanDate": "timestamp",
          "reason": "string",
          "cod": "number",
          "lazada": "boolean",
          "daysHeld1": "number",
          "daysHeld2": "number",
          "attempts": "number",
          "status": "pending | resolved",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      },

      "returned": {
        "$workId": {
          "userId": "string",
          "username": "string",
          "type": "R | EMS | COD",
          "barcode": "string",
          "details": "string",
          "scanDate": "timestamp",
          "returnDate": "timestamp",
          "reason": "string",
          "cod": "number",
          "lazada": "boolean",
          "daysHeld1": "number",
          "daysHeld2": "number",
          "attempts": "number",
          "scannedBy": "string",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        }
      }
    },

    "statistics": {
      "daily": {
        "$date": {
          "total": {
            "sendMoney": "number",
            "prepare": "number",
            "recorded": "number",
            "backlog": "number",
            "returned": "number"
          },
          "byType": {
            "r": { "prepare": 0, "recorded": 0, "backlog": 0, "returned": 0 },
            "ems": { "prepare": 0, "recorded": 0, "backlog": 0, "returned": 0 },
            "cod": { "sendMoney": 0, "prepare": 0, "recorded": 0, "backlog": 0, "returned": 0 }
          },
          "byUser": {
            "$userId": {
              "sendMoney": 0,
              "prepare": 0,
              "recorded": 0,
              "backlog": 0,
              "returned": 0
            }
          }
        }
      },

      "monthly": {
        "$month": {
          // Same structure as daily
        }
      }
    },

    "logs": {
      "$logId": {
        "userId": "string",
        "username": "string",
        "action": "login | logout | create | update | delete | scan",
        "entity": "user | work | backlog | returned",
        "entityId": "string",
        "details": "string",
        "ipAddress": "string",
        "timestamp": "timestamp"
      }
    },

    "sessions": {
      "$sessionId": {
        "userId": "string",
        "username": "string",
        "token": "string",
        "createdAt": "timestamp",
        "expiresAt": "timestamp",
        "isActive": "boolean"
      }
    },

    "settings": {
      "general": {
        "systemName": "SDIP V2",
        "version": "2.0.0",
        "maintenanceMode": "boolean"
      },

      "backup": {
        "lastBackup": "timestamp",
        "frequency": "daily | weekly",
        "enabled": "boolean"
      },

      "notifications": {
        "enabled": "boolean",
        "channels": ["email", "line"]
      }
    }
  }
}
```

---

## 🔐 Security Rules

```json
{
  "rules": {
    "sdip": {
      "users": {
        "$userId": {
          ".read": "auth != null",
          ".write": "auth != null && (auth.uid === $userId || root.child('sdip/users/' + auth.uid + '/role').val() === 'Admin')"
        }
      },

      "work": {
        ".read": "auth != null",
        ".write": "auth != null"
      },

      "statistics": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('sdip/users/' + auth.uid + '/role').val() === 'Admin'"
      },

      "logs": {
        ".read": "auth != null && root.child('sdip/users/' + auth.uid + '/role').val() === 'Admin'",
        ".write": "auth != null"
      },

      "sessions": {
        "$sessionId": {
          ".read": "auth != null && auth.uid === data.child('userId').val()",
          ".write": "auth != null"
        }
      },

      "settings": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('sdip/users/' + auth.uid + '/role').val() === 'Admin'"
      }
    }
  }
}
```

---

## 📊 Indexes (for queries)

```json
{
  "rules": {
    "sdip": {
      "work": {
        "backlog": {
          ".indexOn": ["userId", "type", "status", "createdAt"]
        },
        "returned": {
          ".indexOn": ["userId", "type", "returnDate", "createdAt"]
        },
        "prepare": {
          ".indexOn": ["userId", "type", "isRecorded", "createdAt"]
        }
      },
      "logs": {
        ".indexOn": ["userId", "action", "timestamp"]
      }
    }
  }
}
```

---

## 🔄 Data Migration Strategy

### Phase 1: Initial Setup
1. Create Firebase Project
2. Enable Realtime Database
3. Apply Security Rules
4. Create Indexes

### Phase 2: Data Import
1. Export ข้อมูลจาก Google Sheets เป็น JSON
2. Transform ข้อมูลให้ตรงกับ Schema
3. Import ลง Firebase ผ่าน Admin SDK
4. Verify ข้อมูล

### Phase 3: Sync Strategy
```
Google Sheets (Master) ←→ Firebase (Cache + Real-time)
                          ↓
                      Web App (Read/Write)
```

**Sync Options:**
- **Option A:** Firebase เป็น Primary, Sheets เป็น Backup
- **Option B:** Sheets เป็น Primary, Firebase เป็น Cache (แนะนำ)
- **Option C:** Dual Write (เขียนทั้ง 2 ที่)

---

## 📝 Example Data

### User Example
```json
{
  "userId123": {
    "username": "john",
    "fullName": "จอห์น สมิท",
    "role": "USER",
    "side": "ด้านจ่าย 1",
    "area": "กรุงเทพฯ",
    "routes": "เส้น A1-A5",
    "phone": "0812345678",
    "email": "john@example.com",
    "createdAt": 1730332800000,
    "lastLogin": 1730419200000,
    "isActive": true
  }
}
```

### Work Backlog Example
```json
{
  "workId456": {
    "userId": "userId123",
    "username": "john",
    "type": "R",
    "barcode": "R1234567890TH",
    "details": "ไม่พบผู้รับ",
    "scanDate": 1730332800000,
    "reason": "ที่อยู่ไม่ถูกต้อง",
    "cod": 0,
    "lazada": false,
    "daysHeld1": 5,
    "daysHeld2": 0,
    "attempts": 2,
    "status": "pending",
    "createdAt": 1730332800000,
    "updatedAt": 1730419200000
  }
}
```

---

## 🚀 Firebase Functions (Optional)

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Auto-calculate statistics
exports.updateStatistics = functions.database.ref('/sdip/work/{category}/{workId}')
  .onWrite(async (change, context) => {
    const { category, workId } = context.params;
    const data = change.after.val();

    if (!data) return null; // Deleted

    const today = new Date().toISOString().split('T')[0];
    const statsRef = admin.database().ref(`/sdip/statistics/daily/${today}`);

    // Update statistics...
    return statsRef.transaction((stats) => {
      // Calculate new stats
      return stats;
    });
  });

// Clean up old sessions
exports.cleanupSessions = functions.pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
    const now = Date.now();
    const sessionsRef = admin.database().ref('/sdip/sessions');

    const snapshot = await sessionsRef.once('value');
    const sessions = snapshot.val();

    const updates = {};
    Object.keys(sessions).forEach(sessionId => {
      if (sessions[sessionId].expiresAt < now) {
        updates[sessionId] = null; // Delete
      }
    });

    return sessionsRef.update(updates);
  });
```

---

## 📦 NPM Packages Needed

```json
{
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0"
  }
}
```

---

## 🧪 Testing

```javascript
// Test connection
const admin = require('firebase-admin');
admin.initializeApp({
  databaseURL: 'https://x-85fc7-default-rtdb.asia-southeast1.firebasedatabase.app'
});

// Test write
admin.database().ref('/sdip/test').set({
  message: 'Hello Firebase!',
  timestamp: Date.now()
});

// Test read
admin.database().ref('/sdip/test').once('value', (snapshot) => {
  console.log(snapshot.val());
});
```

---

**Created:** 2025-10-31
**Status:** Draft
**Next:** Implement in Code.gs
