"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import MovieCard, { Entry, Movie } from "@/components/MovieCard";

export default function SearchPage() {
  const { user } = useUser();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // โหลดรายการของผู้ใช้ เพื่อให้การ์ดแสดงสถานะที่บันทึกไว้แล้ว
  useEffect(() => {
    if (!user) { setEntries({}); return; }
    supabase.from("watchlist").select("item_id, status, rating").eq("user_id", user.id).then(({ data }) => {
      const map: Record<string, Entry> = {};
      (data ?? []).forEach((r) => (map[r.item_id] = { status: r.status, rating: r.rating }));
      setEntries(map);
    });
  }, [user]);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true); setMsg("");
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setLoading(false); setSearched(true);
    if (!res.ok) return setMsg("ค้นหาไม่สำเร็จ ตรวจสอบ TMDB_TOKEN ในไฟล์ .env.local");
    setResults(data.results ?? []);
  }

  // บันทึก: items (ข้อมูลหนัง) -> watchlist (ของผู้ใช้คนนี้)
  async function save(m: Movie, patch: Partial<Entry>) {
    if (!user) return setMsg("กรุณาเข้าสู่ระบบก่อนบันทึก");
    const cur = entries[m.id];
    const next: Entry = { status: patch.status ?? cur?.status ?? "want", rating: patch.rating ?? cur?.rating ?? null };
    await supabase.from("items").upsert({ id: m.id, title: m.title, year: m.year, poster: m.poster });
    const { error } = await supabase.from("watchlist").upsert({ user_id: user.id, item_id: m.id, ...next });
    if (error) return setMsg(error.message);
    setEntries({ ...entries, [m.id]: next });
    setMsg(`บันทึก "${m.title}" แล้ว`);
  }

  return (
    <main className="wrap">
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>ค้นหาหนัง</h1>
      <form onSubmit={search} style={{ display: "flex", gap: ".6rem" }}>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="พิมพ์ชื่อหนัง เช่น Interstellar" aria-label="ชื่อหนัง" />
        <button className="btn btn-primary" disabled={loading}>{loading ? "กำลังค้นหา..." : "ค้นหา"}</button>
      </form>
      {!user && <p className="notice">ค้นหาได้เลย แต่ต้อง <Link href="/login"><u>เข้าสู่ระบบ</u></Link> ก่อนจึงจะบันทึกลง Watchlist ได้</p>}
      {msg && <p className="notice" role="status">{msg}</p>}
      {searched && results.length === 0 && !msg && <p className="muted">ไม่พบเรื่องที่ค้นหา ลองใช้ชื่ออื่นหรือชื่อภาษาอังกฤษ</p>}
      <div className="grid-movies" style={{ marginTop: "1.25rem" }}>
        {results.map((m) => (
          <MovieCard key={m.id} movie={m} entry={entries[m.id]} onSave={(p) => save(m, p)} />
        ))}
      </div>
    </main>
  );
}
