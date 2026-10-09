"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type NavbarProps = {
  onOpenGuide: () => void;
};

export function Navbar({ onOpenGuide }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-transparent pt-2">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/80 border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
            <img src="/eye_open_v2.jpg" alt="จับยามสามตา Logo" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <span className="text-lg font-serif font-semibold text-white tracking-tight drop-shadow-md">จับยามสามตา</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm font-serif font-medium text-slate-200">
          <Link href="/" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all">หน้าแรก</Link>
          <Link href="#calculator" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all">คำนวณผล</Link>
          <button
            onClick={onOpenGuide}
            className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer font-serif"
          >
            คู่มือการใช้
          </button>
          {token && (
            <button
              onClick={logout}
              className="ml-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all font-serif flex items-center gap-1.5 text-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              ออกจากระบบ
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-2 text-slate-200 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-[#0f0c29] border-b-2 border-amber-500/50 shadow-[0_10px_25px_rgba(0,0,0,0.5)] py-4 px-6 flex flex-col gap-4 animate-[slideUp_0.2s_ease-out]">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-serif font-medium text-slate-200 hover:text-white py-2 border-b border-amber-500/30"
          >
            หน้าแรก
          </Link>
          <Link 
            href="#calculator" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-serif font-medium text-slate-200 hover:text-white py-2 border-b border-amber-500/30"
          >
            คำนวณผล
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGuide();
            }}
            className="text-base font-serif font-medium text-slate-200 hover:text-white py-2 text-left"
          >
            คู่มือการใช้
          </button>
          {token && (
            <button
              onClick={handleLogout}
              className="text-base font-serif font-medium text-red-400 hover:text-red-300 py-3 text-left flex items-center gap-2 border-t border-amber-500/30 mt-2"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
