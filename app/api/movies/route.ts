import { NextRequest, NextResponse } from "next/server";
import { getMovieGenreName } from "@/lib/movieGenres";

const PATHS = {
  trending: "trending/movie/week",
  now_playing: "movie/now_playing",
  top_rated: "movie/top_rated",
} as const;

type Raw = {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
};

async function load(path: string, lang: string): Promise<Raw[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/${path}?language=${lang}`,
    {
      headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
      next: { revalidate: 3600 }, // แคช 1 ชั่วโมง ลดการเรียก TMDB
    },
  );
  if (!res.ok) return [];
  const data: { results?: Raw[] } = await res.json();
  return data.results ?? [];
}

// GET /api/movies?type=trending | now_playing | top_rated
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") as
    | keyof typeof PATHS
    | null;
  if (!type || !(type in PATHS))
    return NextResponse.json({ results: [] }, { status: 400 });

  // ขอทั้งไทยและอังกฤษ เพราะบางเรื่องไม่มีเรื่องย่อภาษาไทย จะใช้อังกฤษแทน
  const [th, en] = await Promise.all([
    load(PATHS[type], "th-TH"),
    load(PATHS[type], "en-US"),
  ]);
  const enById = new Map(en.map((m) => [m.id, m]));

  const results = th
    .slice(0, 20)
    .map((m) => {
      const e = enById.get(m.id);
      const poster = m.poster_path ?? e?.poster_path ?? null;
      const backdrop = m.backdrop_path ?? e?.backdrop_path ?? null;
      return {
        id: `movie-${m.id}`,
        title: m.title,
        year: (m.release_date ?? "").slice(0, 4),
        poster: poster ? `https://image.tmdb.org/t/p/w342${poster}` : null,
        backdrop: backdrop
          ? `https://image.tmdb.org/t/p/w1280${backdrop}`
          : null,
        overview: m.overview || e?.overview || "",
        rating: Math.round((m.vote_average ?? 0) * 10) / 10,
        genres: (m.genre_ids ?? [])
          .map((g) => getMovieGenreName(g))
          .filter(Boolean)
          .slice(0, 3),
      };
    })
    .filter((m) => m.poster);
  return NextResponse.json({ results });
}
