"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import Stars from "@/components/Stars";

type MovieDetailsData = {
  id: string;
  title: string;
  originalTitle: string;
  year: string;
  releaseDate: string;
  overview: string;
  rating: number;
  runtime: number | null;
  genres: string[];
  tagline: string;
  poster: string | null;
  backdrop: string | null;
};

type ApiError = { error: string };
type WatchlistEntry = { status: "want" | "watched"; rating: number | null };
type EntryCheck = {
  key: string;
  value: WatchlistEntry | null;
  error: string;
};

function isMovieDetails(data: unknown): data is MovieDetailsData {
  if (typeof data !== "object" || data === null) return false;
  const movie = data as Record<string, unknown>;
  return typeof movie.id === "string"
    && typeof movie.title === "string"
    && typeof movie.overview === "string"
    && Array.isArray(movie.genres);
}

function formatRuntime(runtime: number | null) {
  if (!runtime) return null;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return [hours ? `${hours} ชม.` : "", minutes ? `${minutes} นาที` : ""].filter(Boolean).join(" ");
}

export default function MovieDetails({ id }: { id: string }) {
  const { user, ready } = useUser();
  const [movie, setMovie] = useState<MovieDetailsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [entryCheck, setEntryCheck] = useState<EntryCheck | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const entryKey = user && movie ? `${user.id}:${movie.id}` : "";
  const matchingEntryCheck = entryCheck?.key === entryKey ? entryCheck : null;
  const currentEntry = matchingEntryCheck?.value ?? null;
  const entryLoading = Boolean(user && movie && !matchingEntryCheck);

  useEffect(() => {
    if (!user || !movie) return;
    let active = true;
    supabase
      .from("watchlist")
      .select("status, rating")
      .eq("user_id", user.id)
      .eq("item_id", movie.id)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setEntryCheck({ key: `${user.id}:${movie.id}`, value: null, error: queryError.message });
          return;
        }

        if (data && (data.status === "want" || data.status === "watched")) {
          setEntryCheck({
            key: `${user.id}:${movie.id}`,
            value: { status: data.status, rating: typeof data.rating === "number" ? data.rating : null },
            error: "",
          });
          return;
        }
        setEntryCheck({ key: `${user.id}:${movie.id}`, value: null, error: "" });
      });
    return () => {
      active = false;
    };
  }, [movie, user]);

  async function saveEntry(patch: Partial<WatchlistEntry>) {
    if (!user || !movie || saving || entryLoading) return;
    setSaving(true);
    setSaveMessage("");

    const next: WatchlistEntry = {
      status: patch.status ?? currentEntry?.status ?? "want",
      rating: patch.rating ?? currentEntry?.rating ?? null,
    };
    const { error: itemError } = await supabase.from("items").upsert({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      poster: movie.poster,
    });
    if (itemError) {
      setSaveMessage(`บันทึกข้อมูลหนังไม่สำเร็จ: ${itemError.message}`);
      setSaving(false);
      return;
    }

    const { error: watchlistError } = await supabase.from("watchlist").upsert({
      user_id: user.id,
      item_id: movie.id,
      ...next,
    });
    if (watchlistError) {
      setSaveMessage(`บันทึก Watchlist ไม่สำเร็จ: ${watchlistError.message}`);
      setSaving(false);
      return;
    }

    setEntryCheck({
      key: `${user.id}:${movie.id}`,
      value: next,
      error: "",
    });
    if (!currentEntry) setSaveMessage(`เพิ่ม "${movie.title}" เข้า Watchlist แล้ว`);
    setSaving(false);
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/movies/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (response) => {
        const data: unknown = await response.json();
        if (!response.ok) {
          const message = typeof data === "object" && data !== null && "error" in data
            && typeof (data as ApiError).error === "string"
            ? (data as ApiError).error
            : "โหลดข้อมูลหนังไม่สำเร็จ";
          throw new Error(message);
        }
        if (!isMovieDetails(data)) throw new Error("รูปแบบข้อมูลหนังไม่ถูกต้อง");
        setMovie(data);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : "เกิดข้อผิดพลาดในการโหลดข้อมูลหนัง");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <main className="wrap"><div className="panel movie-detail-loading" aria-busy="true">กำลังโหลดข้อมูลหนัง...</div></main>;
  }

  if (error || !movie) {
    return (
      <main className="wrap">
        <p className="notice" role="alert">{error || "ไม่พบข้อมูลหนังเรื่องนี้"}</p>
        <Link href="/" className="btn">กลับหน้าแรก</Link>
      </main>
    );
  }

  const runtime = formatRuntime(movie.runtime);
  const heroStyle = movie.backdrop
    ? { backgroundImage: `linear-gradient(90deg, var(--bg), rgba(13, 13, 16, 0.84) 48%, rgba(13, 13, 16, 0.55)), url("${movie.backdrop}")` }
    : undefined;

  return (
    <main className="movie-detail-page">
      <div className="movie-detail-hero" style={heroStyle}>
        <div className="movie-detail-wrap">
          <Link href="/" className="movie-detail-back">← กลับหน้าแรก</Link>
          <div className="movie-detail-content">
            <div className="movie-detail-poster">
              {movie.poster
                ? <img src={movie.poster} alt={`โปสเตอร์ ${movie.title}`} />
                : <div className="poster">ไม่มีโปสเตอร์</div>}
            </div>
            <section className="movie-detail-info" aria-labelledby="movie-title">
              <div className="movie-detail-meta">
                {movie.year && <span>{movie.year}</span>}
                {runtime && <span>{runtime}</span>}
                {movie.rating > 0 && <span className="movie-detail-rating">★ {movie.rating.toFixed(1)} / 10</span>}
              </div>
              <h1 id="movie-title">{movie.title}</h1>
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="movie-original-title muted">{movie.originalTitle}</p>
              )}
              {movie.tagline && <p className="movie-tagline">{movie.tagline}</p>}
              {movie.genres.length > 0 && (
                <div className="genres">{movie.genres.map((genre) => <span key={genre} className="chip">{genre}</span>)}</div>
              )}
              <div className="movie-overview">
                <h2>เรื่องย่อ</h2>
                <p>{movie.overview || "ยังไม่มีเรื่องย่อสำหรับหนังเรื่องนี้"}</p>
              </div>
              {movie.releaseDate && (
                <p className="movie-release">วันเข้าฉาย: {movie.releaseDate}</p>
              )}
              <section className="movie-watchlist" aria-label="จัดการ Watchlist">
                <div className="movie-watchlist-head">
                  <div>
                    <span className="movie-watchlist-eyebrow">MOVIERANK WATCHLIST</span>
                    <h2>สถานะของคุณ</h2>
                  </div>
                  {currentEntry && (
                    <span className={`chip ${currentEntry.status === "watched" ? "done" : ""}`}>
                      {currentEntry.status === "watched" ? "ดูแล้ว" : "อยากดู"}
                    </span>
                  )}
                </div>
                {!ready ? (
                  <div className="movie-watchlist-controls">
                    <button className="btn btn-primary" disabled>กำลังตรวจสอบบัญชี...</button>
                  </div>
                ) : user ? (
                  entryLoading ? (
                    <div className="movie-watchlist-controls">
                      <button className="btn btn-primary" disabled>กำลังตรวจสอบ Watchlist...</button>
                    </div>
                  ) : currentEntry ? (
                    <div className="movie-watchlist-controls">
                      <button
                        className="btn"
                        onClick={() => saveEntry({ status: currentEntry.status === "want" ? "watched" : "want" })}
                        disabled={saving}
                      >
                        {saving ? "กำลังบันทึก..." : currentEntry.status === "want" ? "ทำเครื่องหมายว่าดูแล้ว" : "กลับไปเป็นอยากดู"}
                      </button>
                      <div className="movie-watchlist-rating">
                        <span>{currentEntry.status === "watched" ? "คะแนนของคุณ" : "ให้คะแนนเมื่อดูจบ"}</span>
                        <Stars
                          value={currentEntry.rating}
                          onChange={(rating) => saveEntry({ rating, status: "watched" })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="movie-watchlist-controls">
                      <button
                        className="btn btn-primary"
                        onClick={() => saveEntry({ status: "want" })}
                        disabled={saving}
                      >
                        {saving ? "กำลังบันทึก..." : "+ เพิ่มใน Watchlist"}
                      </button>
                      <div className="movie-watchlist-rating">
                        <span>ให้คะแนนเพื่อบันทึกว่า “ดูแล้ว”</span>
                        <Stars
                          value={null}
                          onChange={(rating) => saveEntry({ rating, status: "watched" })}
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="movie-watchlist-controls">
                    <Link href="/login" className="btn btn-primary">เข้าสู่ระบบเพื่อเพิ่มเข้า Watchlist</Link>
                    <p className="muted movie-watchlist-hint">บันทึกหนังที่อยากดู ให้คะแนน และจัดการสถานะได้ที่นี่</p>
                  </div>
                )}
              </section>
              {(matchingEntryCheck?.error || saveMessage) && (
                <p className="notice" role="status">
                  {matchingEntryCheck?.error
                    ? `ตรวจสอบ Watchlist ไม่สำเร็จ: ${matchingEntryCheck.error}`
                    : saveMessage}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
