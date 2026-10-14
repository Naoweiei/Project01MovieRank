"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/lib/useUser";
import MovieCard, { Movie } from "@/components/MovieCard";
import { MOVIE_GENRES } from "@/lib/movieGenres";

export default function SearchPage() {
  const { user } = useUser();
  const [q, setQ] = useState("");
  const [genreId, setGenreId] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const filteredResults = genreId
    ? results.filter((movie) => movie.genreIds?.includes(Number(genreId)))
    : results;

  const runSearch = useCallback(async (term: string, selectedGenre = "", selectedPage = 1) => {
    if (!term.trim() && !selectedGenre) return;
    setLoading(true);
    setMsg("");
    const params = new URLSearchParams();
    if (term.trim()) params.set("q", term.trim());
    if (selectedGenre) params.set("genre", selectedGenre);
    params.set("page", String(selectedPage));
    try {
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setSearched(true);
      if (!res.ok) {
        setMsg(data.error ?? "ค้นหาไม่สำเร็จ ตรวจสอบ TMDB_TOKEN ในไฟล์ .env.local");
        return;
      }
      setResults(data.results ?? []);
      setPage(data.page ?? selectedPage);
      setTotalPages(data.totalPages ?? 0);
      setTotalResults(data.totalResults ?? 0);
    } catch {
      setSearched(true);
      setMsg("ค้นหาไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }, []);

  // ถ้าเข้ามาจากการ์ดหน้าแรก (/search?q=ชื่อหนัง) ให้ค้นหาให้เลย
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) { setQ(initial); runSearch(initial); }
  }, [runSearch]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    runSearch(q, genreId, 1);
  }

  return (
    <main className="wrap">
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>ค้นหาหนัง</h1>
      <form onSubmit={search} className="search-form">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="พิมพ์ชื่อหนัง เช่น Interstellar" aria-label="ชื่อหนัง" />
        <label className="search-genre-field">
          <span>หมวดหมู่</span>
          <select className="input" value={genreId} onChange={(e) => setGenreId(e.target.value)} aria-label="เลือกหมวดหมู่หนัง">
            <option value="">ทุกหมวดหมู่</option>
            {MOVIE_GENRES.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" disabled={loading}>{loading ? "กำลังค้นหา..." : "ค้นหา"}</button>
      </form>
      {!user && <p className="notice">ค้นหาเลย แต่ต้อง <Link href="/login"><u>เข้าสู่ระบบ</u></Link> ก่อนจึงจะบันทึกลง Watchlist ได้</p>}
      {msg && <p className="notice" role="status">{msg}</p>}
      {searched && filteredResults.length === 0 && !msg && (
        <p className="muted">
          {results.length === 0
            ? genreId && !q.trim()
              ? "ไม่พบหนังในหมวดหมู่ที่เลือก"
              : "ไม่พบเรื่องที่ค้นหา ลองใช้ชื่ออื่นหรือชื่อภาษาอังกฤษ"
            : "ไม่พบหนังในหมวดหมู่ที่เลือกจากผลการค้นหานี้"}
        </p>
      )}
      {searched && totalPages > 1 && (
        <div className="search-pagination" aria-label="เปลี่ยนหน้าผลการค้นหา">
          <span className="muted">
            หน้า {page} จาก {totalPages} · {totalResults.toLocaleString("th-TH")} เรื่อง
          </span>
          <div className="search-pagination-actions">
            <button
              className="btn"
              onClick={() => runSearch(q, genreId, page - 1)}
              disabled={loading || page <= 1}
            >
              ← ก่อนหน้า
            </button>
            <button
              className="btn"
              onClick={() => runSearch(q, genreId, page + 1)}
              disabled={loading || page >= totalPages}
            >
              ถัดไป →
            </button>
          </div>
        </div>
      )}
      <div className="grid-movies" style={{ marginTop: "1.25rem" }}>
        {filteredResults.map((m) => (
          <MovieCard key={m.id} movie={m} showWatchlistActions={false} />
        ))}
      </div>
    </main>
  );
}
