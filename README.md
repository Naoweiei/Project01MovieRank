MovieRank

เว็บไซต์: (https://project01movierank.vercel.app/)
GitHub: (https://github.com/Naoweiei/Project01MovieRank)
บัญชีทดสอบ: reelrank.test1@gmail.com / 123456 หรือสมัครใหม่ได้ที่หน้าเข้าสู่ระบบ

สมาชิก
นาย กรชวัล โสจันทร์ 6804101301
นาย กรณิศ นุ่นรอด 6804101302
นาย ธนากร ทัญญเจริญ 6804101342
นาย ภาทัช ประสาทสรรค์ 6804101404
นาย เตชพล จันทรวิจิตร 6804101328
เทคโนโลยี
Next.js + TypeScript + Tailwind CSS, Supabase (Auth + PostgreSQL), TMDB API, deploy บน Vercel

วิธีติดตั้ง

ต้องมี Node.js 20 ขึ้นไป, บัญชี Supabase และบัญชี TMDB

สร้างโปรเจกต์ Next.js npx create-next-app@latest movie-watchlist
ติดตั้งแพ็กเกจ npm install @supabase/supabase-js
สร้างโปรเจกต์ Supabase แล้วรัน supabase/schema.sql ใน SQL Editor และปิด "Confirm email" ที่ Authentication > Sign In / Providers > Email
สร้างไฟล์ .env.local (ดูตัวอย่างที่ .env.example)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
TMDB_TOKEN=... (API Read Access Token จาก themoviedb.org)
npm run dev แล้วเปิด http://localhost:3000

วิธีใช้งาน
สมัครสมาชิกและเข้าสู่ระบบ
ค้นหาหนังที่หน้า "ค้นหา" แล้วกดเพิ่มใน Watchlist หรือกดดาวเพื่อให้คะแนน
จัดการรายการที่หน้า "Watchlist ของฉัน"
ดูอันดับรวมของทุกคนที่หน้า "อันดับ" (คำนวณแบบ weighted rating ใน lib/ranking.ts)
โครงสร้างหลัก
app/ หน้าเว็บและ API route (app/api/search เรียก TMDB ฝั่ง server เพื่อซ่อน token)
components/ MovieCard, Stars, Poster, Navbar
lib/ Supabase client และสูตรคำนวณอันดับ
supabase/schema.sql ตารางและสิทธิ์การเข้าถึงข้อมูล
แหล่งที่มา

ข้อมูลหนังจาก TMDB (ไม่ได้รับการรับรองโดย TMDB), ฟอนต์ Prompt จาก Google Fonts, ใช้ AI (Claude) ช่วยร่างโค้ด สมาชิกทุกคนตรวจสอบและอธิบายได้
