export function Footer() {
  return (
    <footer className="w-full mt-20 border-t-2 border-amber-500/50 bg-[#1e1a4f] py-8 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto px-4 sm:px-6 text-center text-slate-300 text-sm">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#5EB8B7]"></span>
          <span className="w-2 h-2 rounded-full bg-[#A7C7E7]"></span>
          <span className="w-2 h-2 rounded-full bg-[#E8AEB7]"></span>
        </div>
        <p className="mb-2 font-serif font-medium text-base text-slate-100">จับยามสามตา (The Three-Eyed Divination)</p>
        <p className="max-w-2xl mx-auto leading-relaxed text-xs opacity-80">
          คำทำนายจากเว็บไซต์นี้ถูกคำนวณขึ้นตามหลักวิชาโหราศาสตร์พม่าโบราณ (ยามสามตา - ตาฟ้า)
          โปรดใช้วิจารณญาณในการรับชม คำทำนายเป็นเพียงแนวทางและสถิติเท่านั้น ความสำเร็จในชีวิตขึ้นอยู่กับการกระทำของคุณเป็นหลัก
        </p>
        <p className="mt-6 text-xs opacity-60">
          © {new Date().getFullYear()} Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
