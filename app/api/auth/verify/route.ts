import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token structure and expiration
    const decoded = jwt.verify(token, JWT_SECRET) as { key: string, deviceId: string };
    
    // Check database to ensure license still exists and is active
    const { db } = await connectToDatabase();
    const license = await db.collection('licenses').findOne({ key: decoded.key });

    if (!license) {
      return NextResponse.json({ error: 'License deleted' }, { status: 401 });
    }

    if (!license.isActive) {
      return NextResponse.json({ error: 'License suspended' }, { status: 401 });
    }

    // Optional: Also check if this deviceId is still in registeredDevices (in case admin kicked them out)
    const registeredDevices = license.registeredDevices || [];
    if (!registeredDevices.includes(decoded.deviceId)) {
      return NextResponse.json({ error: 'Device revoked' }, { status: 401 });
    }

    return NextResponse.json({ valid: true, message: 'Valid token' }, { status: 200 });

  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
