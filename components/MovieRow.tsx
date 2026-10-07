/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRef } from "react";

export type RowItem = {
  id: string; title: string; poster: string | null; href: string;
  sub?: string; badge?: string; genres?: string[]; cta?: string;
};

type Props = { title: string; items: RowItem[]; loading?: boolean; moreHref?: string; emptyText?: string };

// แถวโปสเตอร์เลื่อนแนวนอน: ลากด้วยนิ้ว/เมาส์ หรือกดลูกศรบนเดสก์ท็อป ชี้การ์ดจะเห็นรายละเอียด
export default function MovieRow({ title, items, loading, moreHref, emptyText }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  const head = (
    <div className="row-head">
      <h2>{title}</h2>
      {moreHref && <Link href={moreHref} className="muted">ดูทั้งหมด →</Link>}
    </div>
  );

  if (loading)
    return (
      <section className="row" aria-label={title} aria-busy="true">
        {head}
        <div className="row-track">
          {Array.from({ length: 8 }).map((_, k) => <div key={k} className="row-card"><div className="skel skel-poster" /></div>)}
        </div>
      </section>
    );

  if (items.length === 0)
    return emptyText ? <section className="row" aria-label={title}>{head}<div className="panel muted">{emptyText}</div></section> : null;

  return (
    <section className="row" aria-label={title}>
      {head}
      <div className="row-wrap">
        <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="เลื่อนไปทางซ้าย">‹</button>
        <div className="row-track" ref={ref}>
          {items.map((it) => (
            <Link key={it.id} href={it.href} className="row-card">
              <div className="row-poster">
                {it.poster ? <img src={it.poster} alt={`โปสเตอร์ ${it.title}`} loading="lazy" /> : <div className="poster">ไม่มีโปสเตอร์</div>}
                {it.badge && <span className="badge">{it.badge}</span>}
                <div className="row-overlay">
                  {it.genres && it.genres.length > 0 && <div className="row-genres">{it.genres.map((g) => <span key={g}>{g}</span>)}</div>}
                  <span className="row-cta">{it.cta ?? "+ เพิ่มเข้า Watchlist"}</span>
                </div>
              </div>
              <p className="row-title">{it.title}</p>
              {it.sub && <p className="row-sub muted">{it.sub}</p>}
            </Link>
          ))}
        </div>
        <button className="row-arrow right" onClick={() => scroll(1)} aria-label="เลื่อนไปทางขวา">›</button>
      </div>
    </section>
  );
}
