export function IntroSection() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 text-center flex flex-col items-center">
      <div className="relative px-4 mb-8">
        {/* Soft Glow Behind Text */}
        <div className="absolute inset-0 bg-[#5D3FD3]/15 blur-[40px] rounded-[100%] scale-125 pointer-events-none"></div>
        <p className="max-w-xl mx-auto text-slate-100 text-lg md:text-xl font-medium leading-relaxed relative z-10 drop-shadow-md tracking-wide">
          ค้นหาฤกษ์ยามและจังหวะเวลาที่เหมาะสม
          <br className="hidden sm:block" />
          ด้วยศาสตร์แห่งการพยากรณ์โบราณ
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5D3FD3]/10 border border-[#5D3FD3]/20 text-[#E6E6FA] text-xs font-medium tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5D3FD3] animate-pulse"></span>
        ศาสตร์โหราศาสตร์พม่าโบราณ
      </div>
    </section>
  );
}
