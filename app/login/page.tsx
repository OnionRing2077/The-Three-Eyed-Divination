"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Key } from 'lucide-react';

export default function LoginPage() {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, deviceId, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      router.push('/');
    }
  }, [token, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseKey, deviceId }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        router.push('/?k=' + encodeURIComponent(licenseKey));
      } else {
        if (data.needsTransfer) {
           setError('อุปกรณ์ที่ใช้งานครบกำหนดแล้ว กรุณาติดต่อแอดมิน');
        } else {
           setError(data.error || 'รหัส License ไม่ถูกต้อง');
        }
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || token) {
    return (
      <div className="fixed inset-0 h-screen w-screen bg-[#0f0c29] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-amber-400 mt-6 font-serif text-xl animate-pulse">กำลังเข้าสู่ระบบ...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#0f0c29] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Starry Elements (simplified for login) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] top-[-100px] right-[-100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] bottom-[-50px] left-[-100px]"></div>
      </div>

      <div className="bg-[#1e1a4f]/80 backdrop-blur-2xl w-full max-w-md p-8 rounded-3xl relative z-10 border border-amber-500/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0f0c29] rounded-2xl mx-auto flex items-center justify-center border border-amber-500/40 mb-4 shadow-lg">
            <Key className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2 tracking-tight">เข้าสู่ระบบ</h1>
          <p className="text-sm text-slate-400">กรุณากรอกรหัส License เพื่อใช้งานยามสามตา</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">License Key</label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Ex. VIP-XXXX-XXXX"
              className="w-full h-14 bg-[#0f0c29] border border-amber-500/30 rounded-xl px-4 text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/60 outline-none transition-all placeholder:text-slate-600 text-center tracking-widest font-mono text-lg"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !licenseKey.trim()}
            className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0f0c29] rounded-xl font-serif font-semibold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center text-lg"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-3 border-[#0f0c29]/30 border-t-[#0f0c29] rounded-full animate-spin"></div>
            ) : (
              'ตรวจสอบรหัส'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
