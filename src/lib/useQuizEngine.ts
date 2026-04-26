import { useMemo, useState } from "react";
import type { Attempt, MemberName, QuizData, QuizState } from "../types";
import { evaluateAttempt, isQuestionActive, shouldFinalizeQuestion } from "./quizEvaluator";

function initialState(): QuizState {
  return {
    phase: "idle",
    currentTime: 0,
    activeQuestionId: null,
    attempts: [],
    score: 0
  };
}

export function useQuizEngine(quizData: QuizData) {
  const [state, setState] = useState<QuizState>(initialState);

  const questionById = useMemo(
    () => new Map(quizData.questions.map((question) => [question.id, question])),
    [quizData.questions]
  );

  const begin = () => {
    setState((prev) => ({ ...prev, phase: "playing" }));
  };

  const reset = () => {
    setState(initialState());
  };

  const submitAnswer = (selectedMember: MemberName) => {
    setState((prev) => {
      if (prev.phase !== "playing" || prev.activeQuestionId === null) {
        return prev;
      }

      const alreadyAnswered = prev.attempts.some((attempt) => attempt.questionId === prev.activeQuestionId);
      if (alreadyAnswered) {
        return prev;
      }

      const nextAttempt: Attempt = {
        questionId: prev.activeQuestionId,
        selectedMember,
        isCorrect: false,
        answeredAt: prev.currentTime
      };

      return { ...prev, attempts: [...prev.attempts, nextAttempt] };
    });
  };

  const tick = (nextTime: number) => {
    setState((prev) => {
      if (prev.phase !== "playing") {
        return prev;
      }

      const activeQuestion = quizData.questions.find((question) => isQuestionActive(nextTime, question));
      let nextAttempts = prev.attempts;

      for (const question of quizData.questions) {
        if (!shouldFinalizeQuestion(prev.currentTime, nextTime, question)) {
          continue;
        }

        const existingAttemptIndex = nextAttempts.findIndex((attempt) => attempt.questionId === question.id);
        const selectedMember = existingAttemptIndex >= 0 ? nextAttempts[existingAttemptIndex].selectedMember : null;
        const isCorrect = evaluateAttempt(question.correctMember, selectedMember);

        if (existingAttemptIndex >= 0) {
          const copied = [...nextAttempts];
          copied[existingAttemptIndex] = { ...copied[existingAttemptIndex], isCorrect };
          nextAttempts = copied;
        } else {
          nextAttempts = [
            ...nextAttempts,
            {
              questionId: question.id,
              selectedMember: null,
              isCorrect,
              answeredAt: null
            }
          ];
        }
      }

      const score = nextAttempts.filter((attempt) => attempt.isCorrect).length;
      const isFinished = nextTime >= quizData.videoDuration;

      return {
        ...prev,
        currentTime: nextTime,
        activeQuestionId: activeQuestion?.id ?? null,
        attempts: nextAttempts,
        score,
        phase: isFinished ? "finished" : prev.phase
      };
    });
  };

  const activeQuestion = state.activeQuestionId ? questionById.get(state.activeQuestionId) ?? null : null;
  const currentQuestionIndex = activeQuestion ? quizData.questions.findIndex((question) => question.id === activeQuestion.id) + 1 : 0;
  const progressQuestionCount = quizData.questions.filter((question) => state.currentTime >= question.startTime).length;

  return {
    state,
    activeQuestion,
    currentQuestionIndex,
    progressQuestionCount,
    totalQuestions: quizData.questions.length,
    begin,
    reset,
    submitAnswer,
    tick
  };
}
