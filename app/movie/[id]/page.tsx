import type { Metadata } from "next";
import MovieDetails from "@/components/MovieDetails";

export const metadata: Metadata = {
  title: "รายละเอียดหนัง | MovieRank",
  description: "ดูเรื่องย่อ คะแนน และข้อมูลหนังเพิ่มเติมบน MovieRank",
};

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MovieDetails id={id} />;
}
