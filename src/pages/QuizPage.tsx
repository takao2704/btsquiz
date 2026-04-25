import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MemberButtons } from "../components/MemberButtons";
import { QuizHUD } from "../components/QuizHUD";
import { VideoAnalysisPanel } from "../components/VideoAnalysisPanel";
import { YouTubePlayer } from "../components/YouTubePlayer";
import quizData from "../data/quizData";
import { useQuizEngine } from "../lib/useQuizEngine";
import { analyzeVideoTimeline } from "../lib/videoAnalysis";

export function QuizPage() {
  const navigate = useNavigate();
  const engine = useQuizEngine(quizData);

  const answeredActiveQuestion = useMemo(() => {
    if (!engine.activeQuestion) {
      return false;
    }

    return engine.state.attempts.some((attempt) => attempt.questionId === engine.activeQuestion?.id && attempt.selectedMember !== null);
  }, [engine.activeQuestion, engine.state.attempts]);

  const analysis = useMemo(() => analyzeVideoTimeline(engine.state.currentTime, quizData), [engine.state.currentTime]);

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
      <VideoAnalysisPanel
        currentTime={engine.state.currentTime}
        totalDuration={analysis.totalDuration}
        activeSoloMembers={analysis.activeSoloMembers}
      />
      <QuizHUD currentQuestion={engine.currentQuestionIndex} totalQuestions={engine.totalQuestions} score={engine.state.score} />
      <MemberButtons
        members={quizData.members}
        visible={engine.activeQuestion !== null}
        disabled={answeredActiveQuestion}
        suggestedMembers={analysis.activeSoloMembers}
        onSelect={engine.submitAnswer}
      />
    </main>
  );
}
