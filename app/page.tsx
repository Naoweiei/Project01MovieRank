"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchRanking } from "@/lib/fetchRanking";
import type { Ranked } from "@/lib/ranking";
import Poster from "@/components/Poster";

export default function Home() {
  const [top, setTop] = useState<Ranked[]>([]);
  useEffect(() => { fetchRanking().then((r) => setTop(r.slice(0, 3))); }, []);

  // จัดลำดับให้อันดับ 1 อยู่ตรงกลาง
  const shown = top.length === 3 ? [top[1], top[0], top[2]] : top;

  return (
    <main className="wrap">
      <section className="hero">
        <div>
          <h1>หนังที่อยากดู<br />และเรื่องที่ทุกคนชอบ</h1>
          <p className="muted" style={{ margin: "1rem 0 1.5rem", maxWidth: "30rem" }}>
            ค้นหาหนังจากฐานข้อมูล TMDB เก็บไว้ในลิสต์ของตัวเอง ให้ดาวเรื่องที่ดูแล้ว แล้วดูว่าเรื่องไหนขึ้นอันดับหนึ่งจากเสียงของทุกคน
          </p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <Link href="/search" className="btn btn-primary">ค้นหาหนัง</Link>
            <Link href="/ranking" className="btn">ดูอันดับทั้งหมด</Link>
          </div>
        </div>
        <div>
          {top.length === 0 ? (
            <div className="panel muted">ยังไม่มีใครให้คะแนน เป็นคนแรกที่ให้ดาวหนังสักเรื่องได้เลย</div>
          ) : (
            <div className="top3">
              {shown.map((m) => (
                <div key={m.id}>
                  <Poster src={m.poster} title={m.title} />
                  <p style={{ fontWeight: 700, margin: ".4rem 0 0", fontSize: ".9rem" }}>{m.title}</p>
                  <p className="muted" style={{ margin: 0, fontSize: ".8rem" }}>★ {m.avg.toFixed(1)} · {m.count} โหวต</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
