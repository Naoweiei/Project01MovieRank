import { NextRequest, NextResponse } from "next/server";

type TmdbMovie = { id: number; title: string; release_date?: string; poster_path?: string | null };

// เรียก TMDB ฝั่ง server เพื่อไม่ให้ token หลุดไปที่ browser
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ results: [] });

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&language=th-TH`,
    { headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` } }
  );
  if (!res.ok) return NextResponse.json({ error: "ค้นหาไม่สำเร็จ" }, { status: 502 });

  const data: { results: TmdbMovie[] } = await res.json();
  const results = data.results.slice(0, 12).map((m) => ({
    id: `movie-${m.id}`,
    title: m.title,
    year: (m.release_date ?? "").slice(0, 4),
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w342${m.poster_path}` : null,
  }));
  return NextResponse.json({ results });
}
