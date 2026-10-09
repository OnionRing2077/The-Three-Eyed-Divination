// lib/sky-eye-data.ts

export type SkyEyeStatus = 'OPEN' | 'HALF' | 'CLOSED' | 'BLIND';

export const STATUS_THAI: Record<SkyEyeStatus, string> = {
  OPEN: 'เปิด',
  HALF: 'หรี่',
  CLOSED: 'ปิด',
  BLIND: 'บอด',
};

export const STATUS_COLORS: Record<SkyEyeStatus, string> = {
  OPEN: 'bg-green-100 text-green-800 border-green-300', // สีเขียว
  HALF: 'bg-yellow-100 text-yellow-800 border-yellow-300', // สีเหลือง
  CLOSED: 'bg-red-100 text-red-800 border-red-300', // สีแดง
  BLIND: 'bg-gray-200 text-gray-800 border-gray-400', // สีเทา
};

export interface TimeSlot {
  id: number;
  timeRange: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: 1, timeRange: '06.00 - 08.00 น.' },
  { id: 2, timeRange: '08.00 - 10.00 น.' },
  { id: 3, timeRange: '10.00 - 12.00 น.' },
  { id: 4, timeRange: '12.00 - 14.00 น.' },
  { id: 5, timeRange: '14.00 - 16.00 น.' },
  { id: 6, timeRange: '16.00 - 18.00 น.' },
  { id: 7, timeRange: '18.00 - 20.00 น.' },
  { id: 8, timeRange: '20.00 - 22.00 น.' },
  { id: 9, timeRange: '22.00 - 24.00 น.' },
  { id: 10, timeRange: '24.00 - 02.00 น.' },
  { id: 11, timeRange: '02.00 - 04.00 น.' },
  { id: 12, timeRange: '04.00 - 06.00 น.' },
];

export const DAYS_THAI = [
  'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'
];

// ตารางตาฟ้า 7 วัน 12 ยาม
// อ้างอิงจากวัฏจักร: เปิด -> หรี่ -> ปิด -> บอด (วนซ้ำทุก 4 ยาม)
// Index: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export const SKY_EYE_MATRIX: Record<number, SkyEyeStatus[]> = {
  0: ['OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND'], // อาทิตย์
  1: ['HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN'], // จันทร์
  2: ['CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF'], // อังคาร
  3: ['BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED'], // พุธ
  4: ['OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND'], // พฤหัสบดี
  5: ['HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN'], // ศุกร์
  6: ['CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF', 'CLOSED', 'BLIND', 'OPEN', 'HALF'], // เสาร์
};

// คำอธิบายพื้นฐานของตาฟ้าแต่ละสถานะ
export const SKY_EYE_MEANINGS: Record<SkyEyeStatus, { summary: string; detail: string; advice: string }> = {
  OPEN: {
    summary: 'จังหวะเหมาะสม ราบรื่น',
    detail: 'เป็นสภาพที่มีกำลังสมบูรณ์ที่สุด พลังฟ้าส่งเสริมการเริ่มต้น กระแสแห่งกาลเวลาไหลไปโดยราบรื่น สิ่งที่ดำเนินอยู่ได้รับการสนับสนุน',
    advice: 'เหมาะสำหรับการตัดสินใจ สมัครงาน เปิดกิจการ เจรจาธุรกิจ โอกาสสำเร็จมีสูง ผู้ที่มีความเพียรย่อมเห็นผลเร็ว'
  },
  HALF: {
    summary: 'สำเร็จได้ แต่ต้องใช้เวลา',
    detail: 'กาลเวลายังมิได้ปิดเสียทีเดียว แต่กำลังสนับสนุนลดน้อยลง ผลสำเร็จยังมีแต่ต้องใช้เวลาและความอดทน',
    advice: 'สามารถดำเนินการได้ แต่ต้องอาศัยความพยายามมากกว่าเดิม อาจมีความล่าช้า ควรค่อยเป็นค่อยไป ไม่ควรรีบร้อน'
  },
  CLOSED: {
    summary: 'ควรชะลอ ติดขัด',
    detail: 'กระแสแห่งเวลาไม่เกื้อหนุน พลังของฟ้าปิดกั้น สิ่งที่ดำเนินอยู่มักติดขัด เกิดความล่าช้า หรือมีอุปสรรค',
    advice: 'ควรหลีกเลี่ยงการตัดสินใจเรื่องสำคัญ ไม่ควรเร่งดำเนินการ หากทำมักต้องกลับมาแก้ไขใหม่ ควรเตรียมแผนสำรอง'
  },
  BLIND: {
    summary: 'ข้อมูลไม่ชัดเจน ควรรอ',
    detail: 'กำลังของฟ้าถูกบดบัง ข้อมูลยังไม่ชัดเจน สิ่งที่เห็นอาจไม่ใช่ความจริงทั้งหมด อาจมีสิ่งปกปิดซ่อนเร้น',
    advice: 'หลีกเลี่ยงการตัดสินใจจากข้อมูลที่ไม่สมบูรณ์ อย่าด่วนสรุป ควรรอเวลาและรวบรวมหลักฐานหรือตรวจสอบข้อมูลเพิ่มเติมก่อน'
  }
};

import DETAILED_MEANINGS from './sky_eye_detailed_meanings.json';

/**
 * ฟังก์ชันสำหรับหาผลลัพธ์ของ "ตาฟ้า" โดยอ้างอิงจาก วันที่ และ เวลา
 * @param dayIndex วันในสัปดาห์ 0-6 (0 = อาทิตย์, ... 6 = เสาร์)
 * @param timeSlotId หมายเลขยาม (1-12)
 */
export function getSkyEyeResult(dayIndex: number, timeSlotId: number): { status: SkyEyeStatus; meaning: any; detailedMeaning: any } {
  const slotIndex = timeSlotId - 1; // Array index 0-11
  
  const status = SKY_EYE_MATRIX[dayIndex][slotIndex];
  const meaning = SKY_EYE_MEANINGS[status];

  // Get detailed meaning
  let detailedMeaning = null;
  const dayData = (DETAILED_MEANINGS as any)[dayIndex];
  if (dayData) {
    if (dayIndex === 0) {
      // Sunday only has 4 slots defined in text, it cycles
      detailedMeaning = dayData[slotIndex % 4];
    } else {
      detailedMeaning = dayData[slotIndex];
    }
  }

  return { status, meaning, detailedMeaning };
}