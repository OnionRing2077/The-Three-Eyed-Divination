"use client";

import { useEffect, useState } from 'react';
import { STATUS_THAI } from '@/lib/sky_eye_data';
import { Clock, Briefcase, CircleDollarSign, Plane, Store, HeartPulse, Heart, Scale } from 'lucide-react';

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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  isLoading?: boolean;
};

export function ResultModal({ isOpen, onClose, result, isLoading = false }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const { skyEyeData, date, timeSlotId, category: chosenCategory } = result;
  const { status, meaning, detailedMeaning } = skyEyeData;
  const thaiName = STATUS_THAI[status as keyof typeof STATUS_THAI];
  const colorClass = MINDORA_STATUS_COLORS[status] || "";

  const getImageForStatus = (status: string) => {
    switch (status) {
      case 'OPEN': return '/eye_open_v2.jpg';
      case 'HALF': return '/eye_half_v2.jpg';
      case 'CLOSED': return '/eye_closed_v2.jpg';
      case 'BLIND': return '/eye_blind_v2.jpg';
      default: return '/eye_open_v2.jpg';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f0c29]/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card-strong rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out] flex flex-col">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 h-64">
             <div className="w-16 h-16 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mb-6"></div>
             <p className="text-amber-400 font-semibold text-lg animate-pulse tracking-tight">กำลังผูกดวงจากเส้นสายแห่งกาลเวลา...</p>
             <p className="text-slate-400 text-sm mt-2">โปรดรอสักครู่ ระบบกำลังอ่านสถานะตาฟ้าของคุณ</p>
          </div>
        ) : (
          <div id="result-card">
            {/* Header */}
            <div className="sticky top-0 bg-[#0f0c29]/80 backdrop-blur-xl border-b border-white/10 z-50 px-6 md:px-8 pt-6 pb-4 rounded-t-2xl flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">ผลการทำนาย (ตาฟ้า)</h2>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                วันที่ถาม: {new Date(date).toLocaleDateString('th-TH')} • ยามที่ {timeSlotId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 transition-all absolute top-6 right-6 md:relative md:top-auto md:right-auto"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-8 py-6 space-y-5">
          {/* Top Status */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-5 glass-card rounded-xl justify-center border border-amber-500/30">
            <img src={getImageForStatus(status)} alt={thaiName} className="w-20 h-20 rounded-2xl object-contain bg-white p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] ring-1 ring-white/30" />
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-xs font-medium text-amber-400/80 uppercase tracking-widest mb-1">สถานะตาฟ้า</span>
              <div className={`px-6 py-2 rounded-xl text-xl font-serif font-bold border ${colorClass} mb-2 shadow-sm`}>
                {thaiName}
              </div>
              <p className="text-slate-300 font-serif font-semibold text-sm">{meaning.summary}</p>
            </div>
          </div>

          {/* Details */}
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

                          <h4 className="font-serif text-lg text-white mb-1.5 relative z-10 flex items-center justify-between">
                            {cat}
                          </h4>
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
                คำแนะนำโดยรวม
              </h3>
              <p className="text-slate-200 font-medium text-sm leading-relaxed pl-3 relative z-10">
                {meaning.advice}
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
      </div>
    </div>
  );
}
