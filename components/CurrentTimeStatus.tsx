"use client";

import { useState, useEffect } from "react";
import { getSkyEyeResult, TIME_SLOTS, STATUS_THAI, STATUS_COLORS, DAYS_THAI } from "@/lib/sky_eye_data";
import { Clock, Briefcase, CircleDollarSign, Plane, Store, HeartPulse, Heart, Scale } from "lucide-react";
import Image from "next/image";

// Mindora-inspired status colors (softer, nature-toned) -> Updated for Dark Theme (Gold/White)
const MINDORA_STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  HALF: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  CLOSED: "bg-red-500/20 text-red-400 border-red-500/40",
  BLIND: "bg-slate-800/40 text-slate-400 border-slate-600/30",
};

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'การงาน': return <Briefcase className="w-4 h-4 text-amber-400 -rotate-45" />;
    case 'การเงิน': return <CircleDollarSign className="w-4 h-4 text-amber-400 -rotate-45" />;
    case 'การเดินทาง': return <Plane className="w-4 h-4 text-amber-400 -rotate-45" />;
    case 'การค้าขาย': return <Store className="w-4 h-4 text-amber-400 -rotate-45" />;
    case 'สุขภาพ': return <HeartPulse className="w-4 h-4 text-amber-400 -rotate-45" />;
    case 'ความรัก': return <Heart className="w-4 h-4 text-amber-400 -rotate-45" />;
    case 'คดีความ': return <Scale className="w-4 h-4 text-amber-400 -rotate-45" />;
    default: return <div className="w-1.5 h-1.5 bg-amber-400/80 rounded-full"></div>;
  }
};

export function CurrentTimeStatus() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) return null;

  const hours = currentTime.getHours();
  const slotId = Math.floor(((hours + 18) % 24) / 2) + 1;
  const timeSlot = TIME_SLOTS.find(t => t.id === slotId);

  const resultData = getSkyEyeResult(currentTime, slotId);
  const dayName = DAYS_THAI[currentTime.getDay()];
  const thaiName = STATUS_THAI[resultData.status as keyof typeof STATUS_THAI];
  const colorClass = MINDORA_STATUS_COLORS[resultData.status] || STATUS_COLORS[resultData.status as keyof typeof STATUS_COLORS];

  const getImageForStatus = (status: string) => {
    switch (status) {
      case 'OPEN': return '/eye_open_v2.jpg';
      case 'HALF': return '/eye_half_v2.jpg';
      case 'CLOSED': return '/eye_closed_v2.jpg';
      case 'BLIND': return '/eye_blind_v2.jpg';
      default: return '/eye_open_v2.jpg';
    }
  };

  const { status, meaning, detailedMeaning } = resultData;

  return (
    <div className="glass-card-strong p-5 md:p-6 rounded-2xl w-full max-w-4xl mx-auto">
      {/* Top Section - Status & Time */}
      <div className="flex flex-col md:flex-row items-center gap-6 justify-between border-b border-amber-500/20 pb-5 mb-5">
        <div className="flex flex-col md:flex-row items-center gap-4 shrink-0 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-serif font-semibold text-lg tracking-tight">สถานะยามปัจจุบัน</h3>
            <p className="text-sm text-slate-400 mt-0.5">
              {dayName} • ยามที่ {slotId} ({timeSlot?.timeRange})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 glass-card p-2.5 pr-4 rounded-xl border border-amber-500/30">
            <img src={getImageForStatus(status)} alt={thaiName} className="w-12 h-12 rounded-xl object-contain bg-white p-1 shadow-[0_0_10px_rgba(255,255,255,0.2)] ring-1 ring-white/30" />
            <div className="flex flex-col">
              <div className={`px-3 py-1 rounded-lg text-sm font-serif font-semibold border ${colorClass} text-center mb-0.5 shadow-sm`}>
                {thaiName}
              </div>
              <span className="text-xs font-serif font-medium text-slate-300 text-center">{meaning.summary}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Section */}
      <div className="flex flex-col gap-4">
        {detailedMeaning && (
          <>
            {detailedMeaning.description && detailedMeaning.description.trim() !== "" && (
              <div className="relative p-5 rounded-2xl bg-white/5 border border-amber-500/20 overflow-hidden group hover:border-amber-400/60 transition-all shadow-md">
                <h3 className="font-serif font-semibold text-amber-400 mb-2 flex items-center gap-2 text-base relative z-10">
                  <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
                  เจาะลึกเฉพาะยามนี้
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed pl-3 relative z-10">
                  {detailedMeaning.description}
                </p>
              </div>
            )}

            {detailedMeaning.categories && Object.keys(detailedMeaning.categories).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(detailedMeaning.categories).map(([cat, desc]) => {
                  return (
                    <div key={cat} className="relative p-5 pt-12 rounded-2xl bg-[#1e1a4f] border border-amber-500/30 overflow-hidden group hover:border-amber-400/60 transition-all shadow-md">
                      {/* Decorative Gold Corner */}
                      <div className="absolute -top-8 -left-8 w-20 h-20 border border-amber-500/20 rotate-45 pointer-events-none"></div>
                      <div className="absolute top-3 left-3 w-8 h-8 border border-amber-500/40 rotate-45 pointer-events-none flex items-center justify-center bg-[#0f0c29]/50 backdrop-blur-sm">
                        {getCategoryIcon(cat)}
                      </div>

                      <h4 className="font-serif text-lg text-white mb-1.5 relative z-10">{cat}</h4>
                      <p className="text-sm text-amber-300/90 leading-relaxed relative z-10 font-medium">{desc as React.ReactNode}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Advice Section */}
        <div className="relative p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mt-1 overflow-hidden group hover:border-amber-400/60 transition-all shadow-md">
          <h3 className="font-serif font-semibold text-amber-400 mb-2 flex items-center gap-2 text-base relative z-10">
            <span className="w-1 h-4 bg-amber-400 rounded-full inline-block"></span>
            คำแนะนำ
          </h3>
          <p className="text-slate-200 font-medium text-sm leading-relaxed pl-3 relative z-10">
            {meaning.advice}
          </p>
        </div>

        {/* 4 Statuses Reference */}
        <div className="mt-4 pt-5 border-t border-white/10">
          <h3 className="font-serif font-semibold text-white mb-4 flex items-center gap-2 text-base">
            <span className="w-1 h-4 bg-amber-400 rounded-full inline-block"></span>
            ความหมายของ 4 สถานะยาม
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-[#1e1a4f] border border-amber-500/30 overflow-hidden group hover:border-amber-400/60 transition-all shadow-md">
              <Image src="/eye_open_v2.jpg" alt="ตาเปิด" width={64} height={64} className="rounded-xl mb-3 object-contain bg-white p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/30 relative z-10" />
              <span className="inline-block px-3 py-1 rounded-lg text-sm font-serif font-semibold border bg-emerald-500/20 text-emerald-400 border-emerald-500/40 mb-1.5 shadow-sm">เปิด</span>
              <span className="text-[11px] sm:text-xs text-slate-300 leading-tight">ดีที่สุด ราบรื่น สมหวัง</span>
            </div>
            <div className="relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-[#1e1a4f] border border-amber-500/30 overflow-hidden group hover:border-amber-400/60 transition-all shadow-md">
              <Image src="/eye_half_v2.jpg" alt="ตาหรี่" width={64} height={64} className="rounded-xl mb-3 object-contain bg-white p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/30 relative z-10" />
              <span className="inline-block px-3 py-1 rounded-lg text-sm font-serif font-semibold border bg-yellow-500/20 text-yellow-400 border-yellow-500/40 mb-1.5 shadow-sm">หรี่</span>
              <span className="text-[11px] sm:text-xs text-slate-300 leading-tight">ปานกลาง มีอุปสรรคบ้าง</span>
            </div>
            <div className="relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-[#1e1a4f] border border-amber-500/30 overflow-hidden group hover:border-amber-400/60 transition-all shadow-md">
              <Image src="/eye_closed_v2.jpg" alt="ตาปิด" width={64} height={64} className="rounded-xl mb-3 object-contain bg-white p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/30 relative z-10" />
              <span className="inline-block px-3 py-1 rounded-lg text-sm font-serif font-semibold border bg-red-500/20 text-red-400 border-red-500/40 mb-1.5 shadow-sm">ปิด</span>
              <span className="text-[11px] sm:text-xs text-slate-300 leading-tight">ไม่ดี ติดขัด ต้องแก้ไข</span>
            </div>
            <div className="relative flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-[#1e1a4f] border border-amber-500/30 overflow-hidden group hover:border-amber-400/60 transition-all shadow-md">
              <Image src="/eye_blind_v2.jpg" alt="ตาบอด" width={64} height={64} className="rounded-xl mb-3 object-contain bg-white p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/30 relative z-10" />
              <span className="inline-block px-3 py-1 rounded-lg text-sm font-serif font-semibold border bg-slate-800/40 text-slate-400 border-slate-600/30 mb-1.5 shadow-sm">บอด</span>
              <span className="text-[11px] sm:text-xs text-slate-400 leading-tight">แย่ที่สุด ล้มเหลว</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
