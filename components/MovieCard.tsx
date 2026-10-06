"use client";

import Poster from "./Poster";
import Stars from "./Stars";

export type Movie = { id: string; title: string; year: string; poster: string | null };
export type Entry = { status: "want" | "watched"; rating: number | null };

type Props = {
  movie: Movie;
  entry?: Entry | null;
  onSave: (patch: Partial<Entry>) => void;
  onRemove?: () => void;
};

export default function MovieCard({ movie, entry, onSave, onRemove }: Props) {
  return (
    <article className="movie">
      <Poster src={movie.poster} title={movie.title} />
      <div className="movie-body">
        <div>
          <h3 className="movie-title">{movie.title}</h3>
          <span className="muted" style={{ fontSize: ".85rem" }}>{movie.year}</span>
        </div>

        {entry ? (
          <>
            <span className={`chip ${entry.status === "watched" ? "done" : ""}`}>
              {entry.status === "watched" ? "ดูแล้ว" : "อยากดู"}
            </span>
            <Stars value={entry.rating} onChange={(n) => onSave({ rating: n, status: "watched" })} />
            <button className="btn" onClick={() => onSave({ status: entry.status === "want" ? "watched" : "want" })}>
              {entry.status === "want" ? "ทำเครื่องหมายว่าดูแล้ว" : "กลับไปเป็นอยากดู"}
            </button>
            {onRemove && <button className="btn btn-quiet" onClick={onRemove}>ลบออกจากลิสต์</button>}
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => onSave({ status: "want" })}>+ เพิ่มใน Watchlist</button>
            <Stars value={null} onChange={(n) => onSave({ rating: n, status: "watched" })} />
          </>
        )}
      </div>
    </article>
  );
}
