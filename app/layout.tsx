import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const thai = Noto_Sans_Thai({ subsets: ["thai", "latin"], variable: "--font-thai" });

export const metadata: Metadata = {
  title: "MovieRank - อันดับหนังที่อยากดู และที่ทุกคนชอบ",
  description: "ค้นหาหนัง เก็บไว้ใน Watchlist ให้คะแนน และดูอันดับรวมจากทุกคน",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={thai.variable}>
      <body>
        <Navbar />
        {children}
        <footer className="wrap muted" style={{ paddingTop: 0, fontSize: ".8rem" }}>
          ข้อมูลหนังจาก TMDB (ใช้ TMDB API แต่ไม่ได้รับการรับรองโดย TMDB)
        </footer>
      </body>
    </html>
  );
}
