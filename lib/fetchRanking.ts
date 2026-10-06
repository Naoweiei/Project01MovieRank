import { supabase } from "./supabase";
import { rank, Ranked, RatingRow } from "./ranking";

// ดึงคะแนนทุกคนจากฐานข้อมูล แล้วคำนวณอันดับ
export async function fetchRanking(): Promise<Ranked[]> {
  const { data } = await supabase
    .from("watchlist")
    .select("item_id, rating, items(title, poster)")
    .not("rating", "is", null);
  return rank((data ?? []) as unknown as RatingRow[]);
}
