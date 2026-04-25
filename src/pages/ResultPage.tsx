import { Link, useLocation, useNavigate } from "react-router-dom";
import quizData from "../data/quizData";
import type { Attempt } from "../types";

type ResultState = {
  attempts: Attempt[];
  score: number;
  total: number;
};

export function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = (location.state as ResultState | null) ?? null;

  if (!result) {
    navigate("/");
    return null;
  }

  const accuracy = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <main className="page">
      <h2>Result</h2>
      <p>正答数: {result.score} / {result.total}</p>
      <p>正答率: {accuracy}%</p>
      <ul className="history-list">
        {quizData.questions.map((question) => {
          const attempt = result.attempts.find((item) => item.questionId === question.id);
          return (
            <li key={question.id}>
              #{question.id}: 回答 {attempt?.selectedMember ?? "未回答"} / 正解 {question.correctMember} / {attempt?.isCorrect ? "○" : "×"}
            </li>
          );
        })}
      </ul>
      <div className="actions">
        <Link to="/quiz" className="primary-button">もう一回</Link>
        <Link to="/" className="secondary-button">Homeへ</Link>
      </div>
    </main>
  );
}
