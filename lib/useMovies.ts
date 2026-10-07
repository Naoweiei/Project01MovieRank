"use client";

import { useEffect, useState } from "react";

export type TmdbMovie = {
  id: string; title: string; year: string; poster: string | null; backdrop: string | null;
  overview: string; rating: number; genres: string[];
};

export function useMovies(type: "trending" | "now_playing" | "top_rated") {
  const [items, setItems] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/movies?type=${type}`)
      .then((r) => r.json())
      .then((d) => setItems(d.results ?? []))
      .catch(() => {}) // ดึงไม่ได้ก็แค่ไม่แสดงแถวนั้น
      .finally(() => setLoading(false));
  }, [type]);
  return { items, loading };
}
