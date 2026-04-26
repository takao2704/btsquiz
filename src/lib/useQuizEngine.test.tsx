import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { QuizData } from "../types";
import { useQuizEngine } from "./useQuizEngine";

const quizData: QuizData = {
  videoId: "dummy",
  title: "dummy",
  videoDuration: 30,
  members: ["RM", "Jin", "SUGA", "j-hope", "Jimin", "V", "Jungkook"],
  soloSegments: [],
  questions: [
    { id: 1, startTime: 10, endTime: 12, correctMember: "V" },
    { id: 2, startTime: 20, endTime: 22, correctMember: "RM" }
  ]
};

describe("useQuizEngine", () => {
  it("shows active question only within configured question window", () => {
    const { result } = renderHook(() => useQuizEngine(quizData));

    act(() => result.current.begin());

    act(() => result.current.tick(9.99));
    expect(result.current.activeQuestion?.id ?? null).toBeNull();

    act(() => result.current.tick(10));
    expect(result.current.activeQuestion?.id).toBe(1);
    expect(result.current.currentQuestionIndex).toBe(1);
    expect(result.current.progressQuestionCount).toBe(1);

    act(() => result.current.tick(11.99));
    expect(result.current.activeQuestion?.id).toBe(1);

    act(() => result.current.tick(12));
    expect(result.current.activeQuestion?.id ?? null).toBeNull();
    expect(result.current.progressQuestionCount).toBe(1);
  });

  it("records answer time as-is and finalizes result when question closes", () => {
    const { result } = renderHook(() => useQuizEngine(quizData));

    act(() => result.current.begin());
    act(() => result.current.tick(10.43));
    act(() => result.current.submitAnswer("V"));
    act(() => result.current.tick(12));

    expect(result.current.state.currentTime).toBe(12);
    expect(result.current.state.attempts).toEqual([
      { questionId: 1, selectedMember: "V", isCorrect: true, answeredAt: 10.43 }
    ]);
    expect(result.current.state.score).toBe(1);
  });

  it("locks answer changes after first click in the same question window", () => {
    const { result } = renderHook(() => useQuizEngine(quizData));

    act(() => result.current.begin());
    act(() => result.current.tick(10.2));
    act(() => result.current.submitAnswer("V"));
    act(() => result.current.submitAnswer("RM"));
    act(() => result.current.tick(12));

    expect(result.current.state.attempts).toEqual([
      { questionId: 1, selectedMember: "V", isCorrect: true, answeredAt: 10.2 }
    ]);
  });
});
