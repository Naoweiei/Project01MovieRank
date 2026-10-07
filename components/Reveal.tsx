"use client";

import { useEffect, useRef, useState } from "react";

// ค่อย ๆ เลื่อนขึ้นและเฟดเข้ามาเมื่อเลื่อนหน้าจอมาถึง
export default function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${shown ? "in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
