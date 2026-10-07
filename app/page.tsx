"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchRanking } from "@/lib/fetchRanking";
import type { Ranked } from "@/lib/ranking";
import { TmdbMovie, useMovies } from "@/lib/useMovies";
import { useUser } from "@/lib/useUser";
import FeaturedHero from "@/components/FeaturedHero";
import MovieRow, { RowItem } from "@/components/MovieRow";
import Reveal from "@/components/Reveal";

// การ์ดหนังจาก TMDB: กดแล้วไปหน้าค้นหาด้วยชื่อเรื่องนั้น เพื่อเพิ่มเข้า Watchlist ได้ทันที
const toItems = (list: TmdbMovie[]): RowItem[] =>
  list.map((m) => ({
    id: m.id, title: m.title, poster: m.poster, sub: m.year, genres: m.genres,
    badge: m.rating > 0 ? `★ ${m.rating.toFixed(1)}` : undefined,
    href: `/search?q=${encodeURIComponent(m.title)}`,
  }));

const steps = [
  { no: "01", title: "ค้นหา", text: "พิมพ์ชื่อหนัง ระบบดึงข้อมูลและโปสเตอร์จาก TMDB ให้ทันที" },
  { no: "02", title: "เก็บและให้ดาว", text: "เพิ่มเข้า Watchlist ของคุณ แล้วให้ดาว 1-5 เมื่อดูจบ" },
  { no: "03", title: "ดูอันดับ", text: "คะแนนของทุกคนถูกรวมและเรียงเป็นอันดับหนังที่ชอบที่สุด" },
];

export default function Home() {
  const trending = useMovies("trending");
  const nowPlaying = useMovies("now_playing");
  const topRated = useMovies("top_rated");
  const { user } = useUser();
  const [ranked, setRanked] = useState<Ranked[]>([]);
  const [rLoading, setRLoading] = useState(true);

  useEffect(() => {
    fetchRanking().then((r) => setRanked(r.slice(0, 10))).finally(() => setRLoading(false));
  }, []);

  const community: RowItem[] = ranked.map((m, i) => ({
    id: m.id, title: m.title, poster: m.poster, sub: `${m.count} โหวต`,
    badge: `#${i + 1} · ★ ${m.avg.toFixed(1)}`, href: "/ranking", cta: "ดูอันดับ",
  }));

  return (
    <main>
      <FeaturedHero items={trending.items} loading={trending.loading} />
      <div className="wrap" style={{ paddingTop: "1rem" }}>
        <MovieRow title="อันดับจากผู้ใช้ MovieRank" items={community} loading={rLoading} moreHref="/ranking"
          emptyText="ยังไม่มีใครให้คะแนน เป็นคนแรกที่ให้ดาวหนังสักเรื่องได้เลย" />
        <MovieRow title="กำลังฮิตตอนนี้" items={toItems(trending.items)} loading={trending.loading} />
        <MovieRow title="กำลังฉายในโรง" items={toItems(nowPlaying.items)} loading={nowPlaying.loading} />
        <MovieRow title="คะแนนสูงสุดตลอดกาล" items={toItems(topRated.items)} loading={topRated.loading} />

        <section className="row">
          <div className="row-head"><h2>ใช้งานง่ายใน 3 ขั้นตอน</h2></div>
          <div className="steps">
            {steps.map((s, i) => (
              <Reveal key={s.no} delay={i * 120}>
                <div className="panel step">
                  <span className="step-no">{s.no}</span>
                  <h3>{s.title}</h3>
                  <p className="muted" style={{ margin: ".4rem 0 0" }}>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <section className="cta">
            <h2>{user ? "กลับไปดู Watchlist ของคุณ" : "เริ่มสร้าง Watchlist ของคุณวันนี้"}</h2>
            <p className="muted" style={{ margin: ".4rem 0 1.2rem" }}>
              {user ? "จัดการหนังที่อยากดู และให้ดาวเรื่องที่ดูจบแล้ว" : "สมัคร เก็บหนังที่อยากดู และมีส่วนร่วมกำหนดอันดับ"}
            </p>
            <Link href={user ? "/watchlist" : "/login"} className="btn btn-primary">{user ? "ไปที่ Watchlist" : "สมัครสมาชิก"}</Link>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
