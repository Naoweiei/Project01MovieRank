import { NextRequest, NextResponse } from "next/server";
import { MOVIE_GENRES } from "@/lib/movieGenres";

type TmdbMovie = {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
  genre_ids?: number[];
};

type TmdbResponse = {
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

const PAGE_SIZE = 15;
const TMDB_PAGE_SIZE = 20;
const MAX_TMDB_PAGES = 500;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const genreParam = req.nextUrl.searchParams.get("genre");
  const genreId = genreParam && MOVIE_GENRES.some((genre) => genre.id === Number(genreParam))
    ? Number(genreParam)
    : null;
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");

  if (!Number.isInteger(page) || page < 1) {
    return NextResponse.json({ error: "เลขหน้าไม่ถูกต้อง" }, { status: 400 });
  }
  if (!q && !genreId) {
    return NextResponse.json({ results: [], page: 1, totalPages: 0, totalResults: 0 });
  }

  const token = process.env.TMDB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า TMDB_TOKEN" }, { status: 500 });
  }

  const baseUrl = q
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&language=th-TH`
    : `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=th-TH&sort_by=popularity.desc`;
  const offset = (page - 1) * PAGE_SIZE;
  const firstTmdbPage = Math.floor(offset / TMDB_PAGE_SIZE) + 1;
  if (firstTmdbPage > MAX_TMDB_PAGES) {
    return NextResponse.json({ error: "เกินจำนวนหน้าสูงสุดที่ TMDB รองรับ" }, { status: 400 });
  }
  const skip = offset % TMDB_PAGE_SIZE;

  async function loadTmdbPage(pageNumber: number): Promise<TmdbResponse | null> {
    const separator = baseUrl.includes("?") ? "&" : "?";
    const response = await fetch(`${baseUrl}${separator}page=${pageNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return await response.json() as TmdbResponse;
  }

  try {
    const first = await loadTmdbPage(firstTmdbPage);
    if (!first) return NextResponse.json({ error: "ค้นหาไม่สำเร็จ" }, { status: 502 });

    let movies = first.results.slice(skip);
    if (movies.length < PAGE_SIZE && firstTmdbPage < Math.min(first.total_pages, MAX_TMDB_PAGES)) {
      const second = await loadTmdbPage(firstTmdbPage + 1);
      if (!second) return NextResponse.json({ error: "ค้นหาไม่สำเร็จ" }, { status: 502 });
      movies = movies.concat(second.results).slice(0, PAGE_SIZE);
    } else {
      movies = movies.slice(0, PAGE_SIZE);
    }

    if (genreId) movies = movies.filter((movie) => movie.genre_ids?.includes(genreId));

    return NextResponse.json({
      results: movies.map((movie) => ({
        id: `movie-${movie.id}`,
        title: movie.title,
        year: (movie.release_date ?? "").slice(0, 4),
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null,
        genreIds: movie.genre_ids ?? [],
      })),
      page,
      totalPages: Math.min(
        Math.ceil(first.total_results / PAGE_SIZE),
        Math.ceil(MAX_TMDB_PAGES * TMDB_PAGE_SIZE / PAGE_SIZE),
      ),
      totalResults: first.total_results,
    });
  } catch {
    return NextResponse.json({ error: "ติดต่อ TMDB ไม่สำเร็จ กรุณาลองใหม่" }, { status: 502 });
  }
}
