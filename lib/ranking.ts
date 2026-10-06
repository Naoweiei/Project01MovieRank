export type RatingRow = {
  item_id: string;
  rating: number;
  items: { title: string; poster: string | null };
};

export type Ranked = {
  id: string;
  title: string;
  poster: string | null;
  avg: number;
  count: number;
  score: number;
};

// Weighted rating: score = v/(v+m)*R + m/(v+m)*C
// R = คะแนนเฉลี่ยของเรื่องนี้, v = จำนวนโหวต, C = คะแนนเฉลี่ยรวมทุกเรื่อง, m = จำนวนโหวตขั้นต่ำที่ถือว่า "เชื่อถือได้"
// ทำให้เรื่องที่มีคนให้ 5 ดาวแค่คนเดียวไม่ขึ้นที่ 1
export function rank(rows: RatingRow[], m = 3): Ranked[] {
  if (rows.length === 0) return [];
  const C = rows.reduce((s, r) => s + r.rating, 0) / rows.length;

  const map = new Map<string, { title: string; poster: string | null; sum: number; count: number }>();
  for (const r of rows) {
    const cur = map.get(r.item_id) ?? { title: r.items.title, poster: r.items.poster, sum: 0, count: 0 };
    cur.sum += r.rating;
    cur.count += 1;
    map.set(r.item_id, cur);
  }

  return [...map.entries()]
    .map(([id, v]) => {
      const avg = v.sum / v.count;
      const score = (v.count / (v.count + m)) * avg + (m / (v.count + m)) * C;
      return { id, title: v.title, poster: v.poster, avg, count: v.count, score };
    })
    .sort((a, b) => b.score - a.score);
}
