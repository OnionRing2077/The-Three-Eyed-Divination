# คู่มือการสร้างระบบ License (License System Guide)

เอกสารนี้รวบรวมแนวคิด โครงสร้าง และวิธีการทำงานของระบบ "License Key" (ผูกกับ Device ID) ที่สร้างขึ้นในโปรเจกต์นี้ เพื่อให้คุณสามารถนำไปประยุกต์ใช้หรือคัดลอกไปใช้ในโปรเจกต์ใหม่ได้ง่ายขึ้นครับ

---

## 🏗 ภาพรวมสถาปัตยกรรม (Architecture)
ระบบ License นี้ออกแบบมาเพื่อป้องกันการนำ License Key ไปใช้ซ้ำเกินจำนวนเครื่องที่อนุญาต โดยมีส่วนประกอบหลัก 3 ส่วน:
1. **Frontend (React/Expo):** จัดการ State, สร้างรหัสเครื่อง (Device ID) และบันทึก Token
2. **Backend API (Expo API Routes / Next.js API):** ตรวจสอบสิทธิ์, จัดการจำนวนเครื่อง และสร้าง JWT Token
3. **Database (MongoDB):** เก็บข้อมูล License, สถานะ และรายชื่อเครื่องที่ลงทะเบียนแล้ว

---

## 🗄 1. Database Schema (MongoDB)
ใน MongoDB จะมี Collection ที่ชื่อว่า `licenses` เพื่อเก็บข้อมูล License แต่ละชุด โดยมีหน้าตาของ Document ดังนี้:

```json
{
  "_id": ObjectId("..."),
  "key": "VIP-1234-5678",
  "isActive": true,
  "maxDevices": 1,
  "registeredDevices": [
    "550e8400-e29b-41d4-a716-446655440000"
  ]
}
```
- `key`: รหัส License ที่ลูกค้าจะนำไปกรอก
- `isActive`: สถานะการใช้งาน (true/false) เอาไว้ระงับการใช้งานได้
- `maxDevices`: จำนวนเครื่องสูงสุดที่อนุญาตให้ผูกกับ License นี้ (ค่าเริ่มต้นมักจะเป็น 1)
- `registeredDevices`: Array เก็บค่า Device ID ของเครื่องที่เคยล็อกอินและผูกกับ License นี้แล้ว

---

## ⚙️ 2. Frontend: Authentication Context
ฝั่งหน้าบ้านจะใช้ React Context (`auth-context.tsx`) ในการจัดการข้อมูลการล็อกอิน โดยมีหน้าที่หลักคือ:
1. **สร้างและจำ Device ID:** เมื่อเปิดแอปครั้งแรก จะใช้ไลบรารี `uuid` สร้างรหัสที่ไม่ซ้ำกันขึ้นมา 1 ชุด และเซฟลง `AsyncStorage` (เพื่อให้เครื่องนี้มี ID ประจำตัวไปตลอด)
2. **เก็บ JWT Token:** เมื่อล็อกอินสำเร็จ จะเก็บ Token ไว้ใน `AsyncStorage` เช่นกัน

**ตัวอย่างโค้ดโครงสร้าง (`auth-context.tsx`):**
```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid'; // ติดตั้งด้วย: npm install uuid

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      // 1. ตรวจสอบหรือสร้าง Device ID
      let storedDeviceId = await AsyncStorage.getItem('deviceId');
      if (!storedDeviceId) {
        storedDeviceId = uuidv4();
        await AsyncStorage.setItem('deviceId', storedDeviceId);
      }
      setDeviceId(storedDeviceId);

      // 2. โหลด Token เก่าถ้ามี
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) setToken(storedToken);
    };
    loadAuth();
  }, []);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem('userToken', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, deviceId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

## 🔒 3. Backend: API Route (`/api/auth`)
ฝั่ง API จะรับ `licenseKey` และ `deviceId` มาเพื่อทำการตรวจสอบสิทธิ์ และทำงานตาม Flow ดังนี้:

1. **เช็กว่า License มีอยู่จริงและเปิดใช้งานอยู่หรือไม่** (`isActive === true`)
2. **เช็ก Device ID:**
   - ถ้า `deviceId` นี้เคยลงทะเบียนไว้ใน `registeredDevices` แล้ว ➔ ล็อกอินผ่าน
   - ถ้า `deviceId` นี่ยังไม่เคยลงทะเบียน:
     - ตรวจสอบว่าโควต้าเต็มหรือยัง (`registeredDevices.length < maxDevices`)
     - ถ้า **ยังไม่เต็ม**: เพิ่ม `deviceId` นี้เข้าไปใน Database และให้ล็อกอินผ่าน
     - ถ้า **เต็มแล้ว**: ปฏิเสธการเข้าสู่ระบบ (403 Forbidden)
3. **สร้าง JWT Token:** เมื่อผ่านเงื่อนไขทั้งหมด จะใช้ `jsonwebtoken` สร้าง Token ส่งกลับไปให้ Frontend

**ตัวอย่างโค้ดโครงสร้าง (`auth+api.ts`):**
```typescript
import { connectToDatabase } from '../../lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  const { licenseKey, deviceId } = await request.json();

  if (!licenseKey || !deviceId) {
    return Response.json({ error: 'Missing data' }, { status: 400 });
  }

  const { db } = await connectToDatabase();
  const license = await db.collection('licenses').findOne({ key: licenseKey });

  if (!license) return Response.json({ error: 'Invalid license key' }, { status: 401 });
  if (!license.isActive) return Response.json({ error: 'License suspended' }, { status: 403 });

  let registeredDevices = license.registeredDevices || [];
  const maxDevices = license.maxDevices || 1;

  // ตรวจสอบ Device ID
  if (!registeredDevices.includes(deviceId)) {
    if (registeredDevices.length < maxDevices) {
      // เพิ่ม Device ใหม่
      registeredDevices.push(deviceId);
      await db.collection('licenses').updateOne(
        { _id: license._id },
        { $set: { registeredDevices } }
      );
    } else {
      // โควต้าเต็ม
      return Response.json({ error: 'Device limit reached', needsTransfer: true }, { status: 403 });
    }
  }

  // สร้าง JWT Token
  const token = jwt.sign({ key: license.key, deviceId }, JWT_SECRET);
  return Response.json({ token, message: 'Success' }, { status: 200 });
}
```

---

## 🚀 สรุปขั้นตอนนำไปใช้ในโปรเจกต์ใหม่
1. ตั้งค่าฐานข้อมูล MongoDB และสร้าง Collection `licenses`
2. นำไฟล์ `auth-context.tsx` ไปครอบ (Wrap) ตัวแอปเพื่อให้ทุกหน้าเรียกใช้ `token` และ `deviceId` ได้
3. สร้างหน้าจอ Login ให้กรอก License Key
4. ยิง API POST ไปที่ Backend โดยแนบ `{ licenseKey, deviceId }` ไปใน Body
5. นำไฟล์ Backend API (เช่น `auth+api.ts` หรือทำเป็น Node.js Express แยกต่างหาก) ไปตรวจสอบเงื่อนไข
6. ป้องกันหน้าจออื่นๆ ใน Frontend โดยเช็กว่าถ้าไม่มี `token` ให้ Redirect กลับมาที่หน้า Login
