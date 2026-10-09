"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { IntroSection } from "@/components/IntroSection";
import { CalculatorForm } from "@/components/CalculatorForm";
import { GuideModal } from "@/components/GuideSection";
import { CurrentTimeStatus } from "@/components/CurrentTimeStatus";
import { ResultModal } from "@/components/ResultModal";
import { Footer } from "@/components/Footer";
import { AmbientBackground } from "@/components/AmbientBackground";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, isLoading, router]);

  if (isLoading || !token) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-amber-400 mt-6 font-serif text-xl animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  const handleCalculate = (data: any) => {
    setResult(data);
    setResultModalOpen(true);
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-[#A7C7E7]/30 relative overflow-hidden">
      <AmbientBackground />
      <Navbar onOpenGuide={() => setGuideOpen(true)} />
      
      <main className="container mx-auto pb-16 pt-6 md:pb-20 md:pt-8 relative z-[1]">
        <IntroSection />
        
        <div className="px-4 sm:px-6 mb-8 md:mb-12">
          <CurrentTimeStatus />
        </div>

        <section id="calculator" className="max-w-3xl mx-auto px-4 sm:px-6 mb-10 md:mb-16">
          <CalculatorForm onCalculate={handleCalculate} />
        </section>
      </main>

      <Footer />

      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      <ResultModal isOpen={resultModalOpen} onClose={() => setResultModalOpen(false)} result={result} isLoading={isCalculating} />
    </div>
  );
}
