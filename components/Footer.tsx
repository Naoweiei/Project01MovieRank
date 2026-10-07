import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-in">
        <div>
          <div className="brand"><span className="logo-mark">M</span>MovieReelRank</div>
          <p className="muted" style={{ margin: ".6rem 0 0", maxWidth: "22rem" }}>
            ค้นหาหนัง เก็บไว้ใน Watchlist ให้ดาว และดูอันดับจากเสียงของทุกคน
          </p>
        </div>
        <nav className="footer-links" aria-label="ลิงก์ท้ายหน้า">
          <Link href="/search">ค้นหา</Link>
          <Link href="/watchlist">Watchlist ของฉัน</Link>
          <Link href="/ranking">อันดับ</Link>
        </nav>
        <p className="muted" style={{ margin: 0, fontSize: ".8rem", maxWidth: "20rem" }}>
          ข้อมูลหนังจาก TMDB (ผลิตภัณฑ์นี้ใช้ TMDB API แต่ไม่ได้รับการรับรองโดย TMDB)
        </p>
      </div>
    </footer>
  );
}
