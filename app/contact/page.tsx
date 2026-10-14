import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา | MovieRank",
  description: "ติดต่อทีม MovieRank เพื่อสอบถาม เสนอแนะ หรือแจ้งปัญหาการใช้งาน",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-wrap">
        <header className="contact-intro">
          <span className="contact-eyebrow">CONTACT MOVIERANK</span>
          <h1>ติดต่อเรา</h1>
          <p className="muted">
            คำถาม ข้อเสนอแนะ หรือปัญหาที่พบในการใช้งาน
          </p>
        </header>

        <section className="contact-card" aria-labelledby="contact-email-title">
          <div className="contact-icon" aria-hidden="true">@</div>
          <div className="contact-details">
            <span className="contact-label">ส่งอีเมลหาเรา</span>
            <h2 id="contact-email-title">คุยกับทีม MovieRank</h2>
            <a className="contact-email" href="mailto:MoiveRank@gmail.com">
              MoiveRank@gmail.com
            </a>
          </div>
        </section>

        <p className="contact-note muted">
          
        </p>
      </div>
    </main>
  );
}
