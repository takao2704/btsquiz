type Props = {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
};

export function QuizHUD({ currentQuestion, totalQuestions, score }: Props) {
  return (
    <div className="hud">
      <p>問題: {currentQuestion}/{totalQuestions}</p>
      <p>スコア: {score}正解</p>
    </div>
  );
}
