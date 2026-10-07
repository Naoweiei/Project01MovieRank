"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [term, setTerm] = useState("");

  const links = [
    { href: "/", label: "หน้าแรก" },
    { href: "/search", label: "ค้นหา" },
    { href: "/watchlist", label: "Watchlist ของฉัน" },
    { href: "/ranking", label: "อันดับ" },
  ];

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = term.trim();
    if (t) window.location.assign(`/search?q=${encodeURIComponent(t)}`);
  }

  return (
    <nav className="nav" aria-label="เมนูหลัก">
      <div className="nav-in">
        <Link href="/" className="brand"><span className="logo-mark">M</span>MovieRank</Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`link ${path === l.href ? "active" : ""}`}>{l.label}</Link>
          ))}
        </div>
        <form className="nav-search" onSubmit={submit} role="search">
          <input className="input" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="ค้นหาหนัง..." aria-label="ค้นหาหนัง" />
        </form>
        {user ? (
          <div className="nav-user">
            <span className="avatar" title={user.email ?? ""}>{(user.email ?? "?")[0].toUpperCase()}</span>
            <button className="link" onClick={logout}>ออกจากระบบ</button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm">เข้าสู่ระบบ</Link>
        )}
      </div>
    </nav>
  );
}
