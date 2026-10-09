"use client";

import { STATUS_THAI, STATUS_COLORS } from "@/lib/sky_eye_data";

type Props = {
  result: any;
};

export function ResultBoard({ result }: Props) {
  if (!result || !result.skyEyeData) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e2d6] w-full flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <p className="text-lg">กรุณาระบุข้อมูลและกด "คำนวณ" เพื่อดูผลลัพธ์</p>
      </div>
    );
  }

  const { status, meaning, detailedMeaning } = result.skyEyeData;
  const thaiName = STATUS_THAI[status as keyof typeof STATUS_THAI];
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS];

  // Map category names to icons or colors
  const catColors: Record<string, string> = {
    "การงาน": "bg-indigo-50 text-indigo-900 border-indigo-100",
    "การเงิน": "bg-emerald-50 text-emerald-900 border-emerald-100",
    "การเดินทาง": "bg-sky-50 text-sky-900 border-sky-100",
    "การค้าขาย": "bg-orange-50 text-orange-900 border-orange-100",
    "สุขภาพ": "bg-rose-50 text-rose-900 border-rose-100",
    "ความรัก": "bg-pink-50 text-pink-900 border-pink-100",
    "คดีความ": "bg-slate-50 text-slate-900 border-slate-100",
  };

  const getImageForStatus = (status: string) => {
    switch (status) {
      case 'OPEN': return '/eye_open.jpg';
      case 'HALF': return '/eye_half.jpg';
      case 'CLOSED': return '/eye_closed.jpg';
      case 'BLIND': return '/eye_blind.jpg';
      default: return '/eye_open.jpg';
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-amber-200 w-full flex flex-col h-full max-h-[800px] overflow-y-auto">
      <h2 className="text-2xl font-semibold text-[#1a2b4c] mb-6 text-center border-b border-amber-100 pb-4 shrink-0">
        ผลการทำนาย (ตาฟ้า)
      </h2>
      
      <div className="flex flex-col items-center mb-8 shrink-0">
        <span className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">สถานะปัจจุบัน</span>
        <div className="flex flex-col items-center">
          <img src={getImageForStatus(status)} alt={thaiName} className="w-24 h-24 object-contain rounded-xl mb-3 shadow-sm border border-gray-200" />
          <div className={`px-8 py-3 rounded-xl text-2xl font-bold border-2 shadow-sm ${colorClass} min-w-[200px] text-center transition-all`}>
            {thaiName}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* General Meaning Overview */}
        <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-100/50">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block"></span>
            ภาพรวม
          </h3>
          <p className="text-blue-800 leading-relaxed font-medium pl-3">
            {meaning.summary}
          </p>
          <p className="text-blue-700/90 text-sm leading-relaxed pl-3 mt-2">
            {meaning.detail}
          </p>
        </div>
        
        {/* Detailed Meaning for the specific day & slot */}
        {detailedMeaning && (
          <>
            {detailedMeaning.description && detailedMeaning.description.trim() !== "" && (
              <div className="p-5 bg-purple-50/50 rounded-xl border border-purple-100/50">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block"></span>
                  เจาะลึกเฉพาะยามนี้
                </h3>
                <p className="text-purple-800 text-sm leading-relaxed pl-3">
                  {detailedMeaning.description}
                </p>
              </div>
            )}

            {detailedMeaning.categories && Object.keys(detailedMeaning.categories).length > 0 && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(detailedMeaning.categories).map(([cat, desc]) => {
                  const colorStyle = catColors[cat] || "bg-gray-50 text-gray-900 border-gray-100";
                  return (
                    <div key={cat} className={`p-4 rounded-xl border ${colorStyle} shadow-sm`}>
                      <h4 className="font-semibold mb-1 text-sm">{cat}</h4>
                      <p className="text-sm opacity-90 leading-snug">{desc as React.ReactNode}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="p-5 bg-amber-50/80 rounded-xl border border-amber-200/80 mt-2">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block"></span>
            คำแนะนำ
          </h3>
          <p className="text-amber-900 font-medium text-sm leading-relaxed pl-3">
            {meaning.advice}
          </p>
        </div>
      </div>
    </div>
  );
}
