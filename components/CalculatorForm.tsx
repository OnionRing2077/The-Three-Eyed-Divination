"use client";

import { useState } from "react";
import { TIME_SLOTS, getSkyEyeResult } from "@/lib/sky_eye_data";

type Props = {
  onCalculate: (result: any) => void;
};

export function CalculatorForm({ onCalculate }: Props) {
  const [date, setDate] = useState("");
  const [timeSlotId, setTimeSlotId] = useState(TIME_SLOTS[0].id);
  const [category, setCategory] = useState("การงาน");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const dateObj = new Date(date);
    const dayIndex = dateObj.getDay();
    const skyEyeData = getSkyEyeResult(dayIndex, timeSlotId);

    onCalculate({
      skyEyeData,
      date,
      timeSlotId,
      category
    });
  };

  const categories = ['การเงิน', 'การงาน', 'การเดินทาง', 'การค้าขาย', 'สุขภาพ', 'ความรัก', 'คดีความ'];

  return (
    <div className="glass-card-strong p-6 md:p-8 rounded-2xl w-full h-full flex flex-col">
      <h2 className="text-xl font-serif font-semibold text-white mb-6 tracking-tight">ตั้งดวงพยากรณ์</h2>

      <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col">
        <div className="space-y-6 flex-grow">

          {/* Section: ตาฟ้า */}
          <div className="space-y-4 bg-[#1e1a4f] p-4 rounded-xl border border-amber-500/20 shadow-md">
            <h3 className="font-medium text-amber-400 border-b border-amber-500/20 pb-2 flex items-center gap-2 text-sm">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
              ตาฟ้า [วัน-เวลา]
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">วันที่ต้องการถาม</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full h-12 bg-[#0f0c29] border border-amber-500/20 rounded-xl px-4 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 outline-none transition-all text-base md:text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ช่วงเวลา</label>
                <select
                  value={timeSlotId}
                  onChange={(e) => setTimeSlotId(Number(e.target.value))}
                  className="w-full h-12 bg-[#0f0c29] border border-amber-500/20 rounded-xl px-4 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 outline-none transition-all text-base md:text-sm text-slate-100 appearance-none"
                >
                  {TIME_SLOTS.map(t => (
                    <option key={t.id} value={t.id}>ยามที่ {t.id} ({t.timeRange})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>

        <button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f0c29] rounded-xl font-serif font-semibold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 mt-auto active:scale-[0.98] shrink-0 tracking-tight text-base md:text-sm"
        >
          คำนวณผลพยากรณ์
        </button>
      </form>
    </div>
  );
}
