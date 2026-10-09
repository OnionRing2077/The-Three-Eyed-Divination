import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';

export async function POST(request: Request) {
  try {
    const { licenseKey, deviceId } = await request.json();

    if (!licenseKey || !deviceId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const license = await db.collection('licenses').findOne({ key: licenseKey });

    if (!license) return NextResponse.json({ error: 'Invalid license key' }, { status: 401 });
    if (!license.isActive) return NextResponse.json({ error: 'License suspended' }, { status: 403 });

    let registeredDevices = license.registeredDevices || [];
    const maxDevices = license.maxDevices || 3;

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
        return NextResponse.json({ error: 'Device limit reached', needsTransfer: true }, { status: 403 });
      }
    }

    // สร้าง JWT Token
    const token = jwt.sign({ key: license.key, deviceId }, JWT_SECRET, { expiresIn: '30d' });
    return NextResponse.json({ token, message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
