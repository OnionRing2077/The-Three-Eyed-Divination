"use client";

import { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function GuideModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      number: 1,
      title: 'ตั้งคำถามให้ชัดเจน',
      description: 'กำหนดเรื่องที่ต้องการถามให้ชัด เช่น การงาน การเงิน ความรัก การเดินทาง การค้าขาย สุขภาพ หรือคดีความ',
      icon: '❓',
    },
    {
      number: 2,
      title: 'ดูเวลา และหาว่ายามที่เท่าใด',
      description: '1 ยาม = 2 ชั่วโมง เริ่มจากยามที่ 1 (06.00-08.00) ไปจนถึงยามที่ 12 (04.00-06.00) รวม 12 ยามต่อวัน',
      icon: '🕐',
    },
    {
      number: 3,
      title: 'ดูตาฟ้า จากตาราง 7 วัน 12 ยาม',
      description: 'ตาฟ้าบอกถึงจังหวะของเวลา ดูจากวันในสัปดาห์และยามที่ถาม ว่าตรงกับสถานะ เปิด หรี่ ปิด หรือ บอด',
      icon: '☁️',
      highlight: true,
    },
    {
      number: 4,
      title: 'สรุปคำทำนาย',
      description: 'อ่านผลคำทำนายจากตาฟ้า เพื่อรับคำแนะนำสำหรับจังหวะเวลาที่คุณถาม',
      icon: '✨',
      highlight: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f0c29]/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card-strong rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f0c29]/90 backdrop-blur-xl border-b border-amber-500/20 z-50 px-6 md:px-8 pt-6 pb-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">คู่มือการใช้งาน</h2>
              <p className="text-sm text-amber-300/80 mt-1">วิธีใช้ยามสามตา (พม่า)</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/40 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-8 py-6 space-y-6">
          {/* Overview */}
          <div className="flex justify-center">
            <div className="bg-[#1e1a4f] p-4 rounded-2xl border border-amber-500/30 text-center max-w-xs w-full shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-[#0f0c29]/50 flex items-center justify-center mx-auto mb-2 border border-amber-500/40">
                <span className="text-xl">☁️</span>
              </div>
              <h4 className="font-serif font-semibold text-white text-base">ตาฟ้า</h4>
              <p className="text-xs text-amber-300/80 mt-1">ดูจังหวะเวลา<br/>วัน + ยาม</p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4 items-start">
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border ${
                  step.highlight
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-slate-300 border-white/20'
                }`}>
                  {step.number}
                </div>
                <div className={`flex-1 p-4 rounded-xl border backdrop-blur-sm ${
                  step.highlight
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{step.icon}</span>
                    <h3 className="font-serif font-semibold text-white text-sm">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed pl-6">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
