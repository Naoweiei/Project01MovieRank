"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    router.push("/search");
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    setMsg(error ? error.message : "สมัครสำเร็จ ลองกด \"เข้าสู่ระบบ\" ได้เลย (ถ้าเปิดยืนยันอีเมลไว้ ให้เช็กกล่องจดหมายก่อน)");
  }

  return (
    <main className="wrap" style={{ maxWidth: "26rem" }}>
      <form className="panel" onSubmit={signIn} style={{ display: "grid", gap: ".8rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>เข้าสู่ระบบ</h1>
        <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมล" aria-label="อีเมล" />
        <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)" aria-label="รหัสผ่าน" />
        <button className="btn btn-primary">เข้าสู่ระบบ</button>
        <button type="button" className="btn" onClick={signUp}>สมัครสมาชิกใหม่</button>
        {msg && <p className="notice" role="status" style={{ margin: 0 }}>{msg}</p>}
      </form>
    </main>
  );
}
