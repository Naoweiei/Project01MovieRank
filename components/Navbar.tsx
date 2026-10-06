"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const links = [
    { href: "/search", label: "ค้นหา" },
    { href: "/watchlist", label: "Watchlist ของฉัน" },
    { href: "/ranking", label: "อันดับ" },
  ];

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="nav" aria-label="เมนูหลัก">
      <div className="nav-in">
        <Link href="/" className="brand">Movie<span>Rank</span></Link>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={`link ${path === l.href ? "active" : ""}`}>{l.label}</Link>
        ))}
        {user ? (
          <button className="link" onClick={logout}>ออกจากระบบ</button>
        ) : (
          <Link href="/login" className={`link ${path === "/login" ? "active" : ""}`}>เข้าสู่ระบบ</Link>
        )}
      </div>
    </nav>
  );
}