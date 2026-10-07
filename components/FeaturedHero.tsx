/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TmdbMovie } from "@/lib/useMovies";

// แบนเนอร์หนังเด่นเต็มความกว้าง สลับทุก 7 วินาที (หยุดเมื่อเอาเมาส์ชี้หรือโฟกัส)
export default function FeaturedHero({ items, loading }: { items: TmdbMovie[]; loading: boolean }) {
  const slides = items.filter((m) => m.backdrop).slice(0, 5);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  if (slides.length === 0) {
    if (loading) return <section className="feature skel" aria-busy="true" aria-label="กำลังโหลด" />;
    return (
      <section className="feature feature-plain">
        <div className="feature-inner">
          <div className="feature-body">
            <h1>หนังที่อยากดู และเรื่องที่ทุกคนชอบ</h1>
            <p className="muted">ค้นหาหนัง เก็บไว้ใน Watchlist ให้ดาว แล้วดูอันดับจากเสียงของทุกคน</p>
            <div className="feature-actions">
              <Link href="/search" className="btn btn-primary">ค้นหาหนัง</Link>
              <Link href="/ranking" className="btn">ดูอันดับทั้งหมด</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const m = slides[Math.min(i, slides.length - 1)];
  return (
    <section
      className="feature"
      aria-label="หนังเด่น"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
    >
      <img key={m.id} className="feature-bg" src={m.backdrop!} alt="" />
      <div className="feature-inner">
        <div key={`${m.id}-t`} className="feature-body">
          <div className="feature-meta">
            <span className="pill">กำลังฮิตตอนนี้</span>
            {m.rating > 0 && <b>★ {m.rating.toFixed(1)}</b>}
            <span>{m.year}</span>
          </div>
          <h1>{m.title}</h1>
          {m.genres.length > 0 && <div className="genres">{m.genres.map((g) => <span key={g} className="chip">{g}</span>)}</div>}
          {m.overview && <p className="clamp3">{m.overview}</p>}
          <div className="feature-actions">
            <Link href={`/search?q=${encodeURIComponent(m.title)}`} className="btn btn-primary">+ เพิ่มเข้า Watchlist</Link>
            <Link href="/ranking" className="btn">ดูอันดับทั้งหมด</Link>
          </div>
        </div>
      </div>
      <div className="thumbs">
        {slides.map((s, idx) => (
          <button key={s.id} onClick={() => setI(idx)} aria-label={`ไปที่ ${s.title}`} aria-current={idx === i}>
            <img src={s.poster!} alt="" />
          </button>
        ))}
      </div>
    </section>
  );
}
