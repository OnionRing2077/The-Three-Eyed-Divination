import { Eye } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--gold)]/30 bg-[color:var(--cream)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--gold)] bg-white text-[color:var(--purple)] shadow-sm">
            <Eye className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-serif text-xl tracking-wide text-[color:var(--navy)] sm:text-2xl">
              จับยามสามตา
            </p>
            <p className="text-xs text-[color:var(--navy)]/70">
              ดูฤกษ์ยามจากตาฟ้า ตาดิน และตามนุษย์
            </p>
          </div>
        </div>
        <nav className="hidden text-sm text-[color:var(--navy)]/80 sm:block">
          <a href="#calculator" className="transition-colors hover:text-[color:var(--purple)]">
            คำนวณยาม
          </a>
        </nav>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[color:var(--gold)] to-transparent" />
    </header>
  );
}
