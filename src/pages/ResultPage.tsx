import { Link, Navigate, useLocation } from "react-router-dom";
import { type QuizSetId, quizDataBySet } from "../data/quizData";
import type { Attempt } from "../types";

type ResultState = {
  attempts: Attempt[];
  score: number;
  total: number;
  quizSetId: QuizSetId;
};

export function ResultPage() {
  const location = useLocation();
  const result = (location.state as ResultState | null) ?? null;

  if (!result || !(result.quizSetId in quizDataBySet)) {
    return <Navigate to="/" replace />;
  }

  const selectedQuizData = quizDataBySet[result.quizSetId];
  const accuracy = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <main className="page">
      <h2>Result</h2>
      <p>正答数: {result.score} / {result.total}</p>
      <p>正答率: {accuracy}%</p>
      <ul className="history-list">
        {selectedQuizData.questions.map((question) => {
          const attempt = result.attempts.find((item) => item.questionId === question.id);
          return (
            <li key={question.id}>
              #{question.id}: 回答 {attempt?.selectedMember ?? "未回答"} / 正解 {question.correctMember} / {attempt?.isCorrect ? "○" : "×"}
            </li>
          );
        })}
      </ul>
      <div className="actions">
        <Link to={`/quiz/${result.quizSetId}`} className="primary-button">もう一回</Link>
        <Link to="/" className="secondary-button">Homeへ</Link>
      </div>
    </main>
  );
}
