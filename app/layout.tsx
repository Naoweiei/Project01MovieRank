import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const font = Prompt({ subsets: ["thai", "latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-thai" });

export const metadata: Metadata = {
  title: "MovieRank - อันดับหนังที่อยากดู และที่ทุกคนชอบ",
  description: "ค้นหาหนัง เก็บไว้ใน Watchlist ให้คะแนน และดูอันดับรวมจากทุกคน",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={font.variable}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
