export function IntroSection() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 text-center flex flex-col items-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5D3FD3]/10 border border-[#5D3FD3]/20 text-[#E6E6FA] text-xs font-medium mb-6 tracking-wide">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5D3FD3] animate-pulse"></span>
        ศาสตร์โหราศาสตร์พม่าโบราณ
      </div>

      <p className="max-w-xl mx-auto text-slate-300 text-base leading-relaxed">
        ค้นหาฤกษ์ยามและจังหวะเวลาที่เหมาะสม
        <br className="hidden sm:block" />
        ด้วยศาสตร์แห่งการพยากรณ์โบราณ
      </p>
    </section>
  );
}
