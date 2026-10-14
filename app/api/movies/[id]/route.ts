import { NextRequest, NextResponse } from "next/server";
import { getMovieGenreName } from "@/lib/movieGenres";

type TmdbMovie = {
  title?: string;
  original_title?: string;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  runtime?: number | null;
  genres?: { id: number; name: string }[];
  tagline?: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const match = /^movie-(\d+)$/.exec(id);
  if (!match) return NextResponse.json({ error: "รหัสหนังไม่ถูกต้อง" }, { status: 400 });

  const token = process.env.TMDB_TOKEN;
  if (!token) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า TMDB_TOKEN" }, { status: 500 });

  const movieId = match[1];
  let responses: Response[];
  try {
    responses = await Promise.all(
      ["th-TH", "en-US"].map((language) =>
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=${language}`, {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 3600 },
        }),
      ),
    );
  } catch {
    return NextResponse.json({ error: "ติดต่อ TMDB ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" }, { status: 502 });
  }

  const [thaiResponse, englishResponse] = responses;
  if (!thaiResponse.ok && !englishResponse.ok) {
    const notFound = thaiResponse.status === 404 && englishResponse.status === 404;
    return NextResponse.json(
      { error: notFound ? "ไม่พบข้อมูลหนังเรื่องนี้" : "โหลดข้อมูลหนังไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: notFound ? 404 : 502 },
    );
  }

  try {
    const thaiMovie: Promise<TmdbMovie> = thaiResponse.ok
      ? thaiResponse.json()
      : Promise.resolve({});
    const englishMovie: Promise<TmdbMovie> = englishResponse.ok
      ? englishResponse.json()
      : Promise.resolve({});
    const [thai, english] = await Promise.all([
      thaiMovie,
      englishMovie,
    ]);
    const title = thai.title || english.title || english.original_title || "ไม่ทราบชื่อหนัง";
    const poster = thai.poster_path ?? english.poster_path ?? null;
    const backdrop = thai.backdrop_path ?? english.backdrop_path ?? null;

    return NextResponse.json({
      id: `movie-${movieId}`,
      title,
      originalTitle: thai.original_title || english.original_title || "",
      year: (thai.release_date || english.release_date || "").slice(0, 4),
      releaseDate: thai.release_date || english.release_date || "",
      overview: thai.overview || english.overview || "",
      rating: Math.round((thai.vote_average ?? english.vote_average ?? 0) * 10) / 10,
      runtime: thai.runtime ?? english.runtime ?? null,
      genres: (thai.genres ?? english.genres ?? []).map((genre) =>
        getMovieGenreName(genre.id, genre.name),
      ),
      tagline: thai.tagline || english.tagline || "",
      poster: poster ? `https://image.tmdb.org/t/p/w500${poster}` : null,
      backdrop: backdrop ? `https://image.tmdb.org/t/p/w1280${backdrop}` : null,
    });
  } catch {
    return NextResponse.json({ error: "อ่านข้อมูลหนังจาก TMDB ไม่สำเร็จ" }, { status: 502 });
  }
}
