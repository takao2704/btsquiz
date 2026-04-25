import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="page">
      <h1>BTS Face & Name Quiz</h1>
      <p>BTS初心者向けに、MVを見ながらメンバー名を覚えるクイズです。</p>
      <Link to="/quiz" className="primary-button">
        はじめる
      </Link>
    </main>
  );
}
