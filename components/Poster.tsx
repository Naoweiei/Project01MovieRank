/* eslint-disable @next/next/no-img-element */
export default function Poster({ src, title }: { src: string | null; title: string }) {
  return src ? <img src={src} alt={`โปสเตอร์ ${title}`} className="poster" loading="lazy" /> : <div className="poster">ไม่มีโปสเตอร์</div>;
}
