"use client";

import Link from "next/link";
import Poster from "./Poster";
import Stars from "./Stars";
import { getMovieGenreName } from "@/lib/movieGenres";

export type Movie = { id: string; title: string; year: string; poster: string | null; genreIds?: number[] };
export type Entry = { status: "want" | "watched"; rating: number | null };

type Props = {
  movie: Movie;
  entry?: Entry | null;
  onSave?: (patch: Partial<Entry>) => void;
  onRemove?: () => void;
  showWatchlistActions?: boolean;
};

export default function MovieCard({ movie, entry, onSave, onRemove, showWatchlistActions = true }: Props) {
  const genres = (movie.genreIds ?? [])
    .map((id) => getMovieGenreName(id))
    .filter((genre): genre is string => Boolean(genre));

  return (
    <article className={`movie ${onRemove ? "movie-watchlist-card" : ""}`}>
      {onRemove ? (
        <Poster src={movie.poster} title={movie.title} />
      ) : (
        <Link href={`/movie/${movie.id}`} className="movie-poster-link" aria-label={`เปิดข้อมูล ${movie.title}`}>
          <Poster src={movie.poster} title={movie.title} />
          {genres.length > 0 && (
            <div className="row-overlay">
              <div className="row-genres" aria-label={`หมวดหมู่: ${genres.join(", ")}`}>
                {genres.map((genre) => <span key={genre}>{genre}</span>)}
              </div>
            </div>
          )}
        </Link>
      )}
      <div className="movie-body">
        <div>
          <h3 className="movie-title">
            {onRemove
              ? movie.title
              : <Link href={`/movie/${movie.id}`} className="movie-detail-link">{movie.title}</Link>}
          </h3>
          <span className="muted" style={{ fontSize: ".85rem" }}>{movie.year}</span>
        </div>

        {showWatchlistActions && entry ? (
          <>
            {onRemove ? (
              <div className="watchlist-actions">
                <div className="watchlist-status-row">
                  <span className={`chip ${entry.status === "watched" ? "done" : ""}`}>
                    {entry.status === "watched" ? "ดูแล้ว" : "อยากดู"}
                  </span>
                  <span className="watchlist-rating-label">{entry.rating ? `${entry.rating} / 5` : "ยังไม่ให้คะแนน"}</span>
                </div>
                <div className="watchlist-rating">
                  <span className="watchlist-action-caption">คะแนน</span>
                  <Stars value={entry.rating} onChange={(n) => onSave?.({ rating: n, status: "watched" })} />
                </div>
                <button className="btn watchlist-status-button" onClick={() => onSave?.({ status: entry.status === "want" ? "watched" : "want" })}>
                  {entry.status === "want" ? "ทำเครื่องหมายว่าดูแล้ว" : "กลับไปเป็นอยากดู"}
                </button>
                <button className="btn btn-quiet watchlist-remove-button" onClick={onRemove}>
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                    <path d="M4 6h12M8 6V4h4v2m-6 0 .7 10h6.6L14 6m-5 3v4m2-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  ลบออกจากลิสต์
                </button>
              </div>
            ) : (
              <>
                <span className={`chip ${entry.status === "watched" ? "done" : ""}`}>
                  {entry.status === "watched" ? "ดูแล้ว" : "อยากดู"}
                </span>
                <Stars value={entry.rating} onChange={(n) => onSave?.({ rating: n, status: "watched" })} />
                <button className="btn" onClick={() => onSave?.({ status: entry.status === "want" ? "watched" : "want" })}>
                  {entry.status === "want" ? "ทำเครื่องหมายว่าดูแล้ว" : "กลับไปเป็นอยากดู"}
                </button>
              </>
            )}
          </>
        ) : showWatchlistActions ? (
          <>
            <button className="btn btn-primary" onClick={() => onSave?.({ status: "want" })}>+ เพิ่มใน Watchlist</button>
            <Stars value={null} onChange={(n) => onSave?.({ rating: n, status: "watched" })} />
          </>
        ) : null}
      </div>
    </article>
  );
}
