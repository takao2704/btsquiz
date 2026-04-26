type Props = {
  progressQuestion: number;
  totalQuestions: number;
};

export function QuizHUD({ progressQuestion, totalQuestions }: Props) {
  return (
    <div className="hud">
      <p>進捗: {progressQuestion}/{totalQuestions}</p>
    </div>
  );
}
