import type { Metadata, Viewport } from "next";
import { Prompt, Maitree, Geist, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({subsets:['latin'],variable:'--font-inter'});
const dmSans = DM_Sans({subsets:['latin'],variable:'--font-dm-sans'});

const promptFont = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const maitreeFont = Maitree({
  variable: "--font-maitree",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "จับยามสามตา | The Three-Eyed Divination",
  description: "คำนวณยามสามตาจากวัน เวลา หมวดเรื่อง และเพศ",
};

import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={cn("h-full", "antialiased", promptFont.variable, maitreeFont.variable, "font-sans", geist.variable, inter.variable, dmSans.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
