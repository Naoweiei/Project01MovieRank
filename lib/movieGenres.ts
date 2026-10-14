const GENRES: Record<number, string> = {
  28: "แอ็กชัน",
  12: "ผจญภัย",
  16: "แอนิเมชัน",
  35: "ตลก",
  80: "อาชญากรรม",
  99: "สารคดี",
  18: "ดราม่า",
  10751: "ครอบครัว",
  14: "แฟนตาซี",
  36: "ประวัติศาสตร์",
  27: "สยองขวัญ",
  10402: "ดนตรี",
  9648: "ลึกลับ",
  10749: "โรแมนติก",
  878: "ไซไฟ",
  10770: "ภาพยนตร์ทีวี",
  53: "ระทึกขวัญ",
  10752: "สงคราม",
  37: "คาวบอย",
};

export const MOVIE_GENRES = Object.entries(GENRES).map(([id, name]) => ({
  id: Number(id),
  name,
}));

export function getMovieGenreName(id: number, fallback?: string) {
  return GENRES[id] ?? fallback;
}
