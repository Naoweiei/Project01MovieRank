"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import MovieCard, { Entry, Movie } from "@/components/MovieCard";

type Row = Entry & { movie: Movie };
type Filter = "all" | "want" | "watched";
type DbRow = { item_id: string; status: "want" | "watched"; rating: number | null; items: Omit<Movie, "id"> };

export default function WatchlistPage() {
  const { user, ready } = useUser();
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("watchlist").select("item_id, status, rating, items(title, year, poster)").eq("user_id", user.id);
    setRows(((data ?? []) as unknown as DbRow[]).map((r) => ({ status: r.status, rating: r.rating, movie: { id: r.item_id, ...r.items } })));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  async function update(id: string, patch: Partial<Entry>) {
    await supabase.from("watchlist").update(patch).eq("user_id", user!.id).eq("item_id", id);
    setRows((rs) => rs.map((r) => (r.movie.id === id ? { ...r, ...patch } : r)));
  }

  async function remove(id: string) {
    await supabase.from("watchlist").delete().eq("user_id", user!.id).eq("item_id", id);
    setRows((rs) => rs.filter((r) => r.movie.id !== id));
  }

  if (ready && !user)
    return <main className="wrap"><div className="panel">กรุณา <Link href="/login"><u>เข้าสู่ระบบ</u></Link> เพื่อดู Watchlist ของคุณ</div></main>;

  const shown = rows.filter((r) => filter === "all" || r.status === filter);
  const tabs: [Filter, string][] = [["all", `ทั้งหมด (${rows.length})`], ["want", "อยากดู"], ["watched", "ดูแล้ว"]];

  return (
    <main className="wrap">
      <h1 style={{ fontSize: "1.8rem" }}>Watchlist ของฉัน</h1>
      <div className="tabs">
        {tabs.map(([k, label]) => (
          <button key={k} className="tab" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
        ))}
      </div>
      {loading && <p className="muted">กำลังโหลด...</p>}
      {!loading && shown.length === 0 && (
        <div className="panel">ยังไม่มีหนังในหมวดนี้ <Link href="/search"><u>ไปค้นหาเรื่องแรก</u></Link></div>
      )}
      <div className="grid-movies">
        {shown.map((r) => (
          <MovieCard key={r.movie.id} movie={r.movie} entry={r} onSave={(p) => update(r.movie.id, p)} onRemove={() => remove(r.movie.id)} />
        ))}
      </div>
    </main>
  );
}
