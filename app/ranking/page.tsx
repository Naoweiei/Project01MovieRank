"use client";

import { useEffect, useState } from "react";
import { fetchRanking } from "@/lib/fetchRanking";
import type { Ranked } from "@/lib/ranking";
import Poster from "@/components/Poster";

export default function RankingPage() {
  const [list, setList] = useState<Ranked[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRanking().then((r) => { setList(r); setLoading(false); }); }, []);

  return (
    <main className="wrap" style={{ maxWidth: "48rem" }}>
      <h1 style={{ fontSize: "1.8rem" }}>อันดับหนังที่ทุกคนชอบ</h1>
      <p className="muted" style={{ margin: ".4rem 0 1.5rem" }}>
        คะแนนถ่วงน้ำหนักด้วยจำนวนโหวต เรื่องที่มีคนให้ดาวน้อยจะถูกดึงเข้าหาค่าเฉลี่ยรวม จึงไม่ขึ้นอันดับหนึ่งง่าย ๆ
      </p>
      {loading && <p className="muted">กำลังโหลด...</p>}
      {!loading && list.length === 0 && <div className="panel">ยังไม่มีใครให้คะแนน ไปที่หน้าค้นหาแล้วให้ดาวเรื่องแรกได้เลย</div>}
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: ".7rem" }}>
        {list.map((m, i) => (
          <li key={m.id} className="rank-row">
            <span className="rank-no">{i + 1}</span>
            <div className="rank-thumb"><Poster src={m.poster} title={m.title} /></div>
            <div>
              <strong>{m.title}</strong>
              <div className="muted" style={{ fontSize: ".85rem" }}>เฉลี่ย {m.avg.toFixed(1)} จาก {m.count} คน</div>
              <div className="bar"><i style={{ width: `${(m.score / 5) * 100}%` }} /></div>
            </div>
            <span className="score">{m.score.toFixed(2)}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
