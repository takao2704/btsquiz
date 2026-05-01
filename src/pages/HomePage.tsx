import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="page">
      <h1>BTS Face & Name Quiz</h1>
      <p>BTS初心者向けに、MVを見ながらメンバー名を覚えるクイズです。</p>
      <div className="actions">
        <Link to="/quiz/dna" className="primary-button">
          Dynamite（既存問題）
        </Link>
        <Link to="/quiz/blood-sweat-tears" className="secondary-button">
          Butter（新しい問題）
        </Link>
      </div>
    </main>
  );
}
