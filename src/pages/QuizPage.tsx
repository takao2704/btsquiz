import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MemberButtons } from "../components/MemberButtons";
import { QuizHUD } from "../components/QuizHUD";
import { YouTubePlayer } from "../components/YouTubePlayer";
import quizData from "../data/quizData";
import { useQuizEngine } from "../lib/useQuizEngine";

export function QuizPage() {
  const navigate = useNavigate();
  const engine = useQuizEngine(quizData);

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
          total: engine.totalQuestions
        }
      });
    }
  }, [engine.state.attempts, engine.state.phase, engine.state.score, engine.totalQuestions, navigate]);

  return (
    <main className="page">
      <h2>Quiz</h2>
      <YouTubePlayer videoId={quizData.videoId} onReady={engine.begin} onTick={engine.tick} />
      <QuizHUD currentQuestion={engine.currentQuestionIndex} totalQuestions={engine.totalQuestions} score={engine.state.score} />
      <MemberButtons
        members={quizData.members}
        visible={engine.activeQuestion !== null}
        disabled={answeredActiveQuestion}
        selectedMember={selectedMemberForActiveQuestion}
        onSelect={engine.submitAnswer}
      />
    </main>
  );
}
