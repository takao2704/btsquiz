import { useEffect, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MemberButtons } from "../components/MemberButtons";
import { QuizHUD } from "../components/QuizHUD";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { type QuizSetId, quizDataBySet } from "../data/quizData";
import { useQuizEngine } from "../lib/useQuizEngine";

export function QuizPage() {
  const navigate = useNavigate();
  const params = useParams<{ quizSetId: QuizSetId }>();
  const quizSetId = params.quizSetId;

  if (!quizSetId || !(quizSetId in quizDataBySet)) {
    return <Navigate to="/" replace />;
  }

  const selectedQuizData = quizDataBySet[quizSetId as QuizSetId];
  const engine = useQuizEngine(selectedQuizData);

  const answeredActiveQuestion = useMemo(() => {
    if (!engine.activeQuestion) {
      return false;
    }

    return engine.state.attempts.some((attempt) => attempt.questionId === engine.activeQuestion?.id && attempt.selectedMember !== null);
  }, [engine.activeQuestion, engine.state.attempts]);

  const selectedMemberForActiveQuestion = useMemo(() => {
    if (!engine.activeQuestion) {
      return null;
    }

    const activeAttempt = engine.state.attempts.find((attempt) => attempt.questionId === engine.activeQuestion?.id);
    return activeAttempt?.selectedMember ?? null;
  }, [engine.activeQuestion, engine.state.attempts]);

  useEffect(() => {
    if (engine.state.phase === "finished") {
      navigate("/result", {
        replace: true,
        state: {
          attempts: engine.state.attempts,
          score: engine.state.score,
          total: engine.totalQuestions,
          quizSetId
        }
      });
    }
  }, [engine.state.attempts, engine.state.phase, engine.state.score, engine.totalQuestions, navigate, quizSetId]);

  return (
    <main className="page">
      <h2>Quiz</h2>
      <p>{selectedQuizData.title}</p>
      <YouTubePlayer videoId={selectedQuizData.videoId} onReady={engine.begin} onTick={engine.tick} />
      <QuizHUD progressQuestion={engine.progressQuestionCount} totalQuestions={engine.totalQuestions} />
      <MemberButtons
        members={selectedQuizData.members}
        visible={engine.activeQuestion !== null}
        disabled={answeredActiveQuestion}
        selectedMember={selectedMemberForActiveQuestion}
        onSelect={engine.submitAnswer}
      />
    </main>
  );
}
