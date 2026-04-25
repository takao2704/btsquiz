import { describe, expect, it } from "vitest";
import { evaluateAttempt, isQuestionActive, shouldFinalizeQuestion } from "./quizEvaluator";

describe("quizEvaluator", () => {
  it("returns true only in active interval", () => {
    const question = { id: 1, startTime: 10, endTime: 12, correctMember: "V" as const };
    expect(isQuestionActive(9.9, question)).toBe(false);
    expect(isQuestionActive(10, question)).toBe(true);
    expect(isQuestionActive(11.99, question)).toBe(true);
    expect(isQuestionActive(12, question)).toBe(false);
  });

  it("finalizes when crossing endTime with tolerance", () => {
    const question = { id: 1, startTime: 1, endTime: 2, correctMember: "V" as const };
    expect(shouldFinalizeQuestion(1.7, 1.79, question)).toBe(false);
    expect(shouldFinalizeQuestion(1.7, 1.81, question)).toBe(true);
  });

  it("evaluates correctness", () => {
    expect(evaluateAttempt("V", "V")).toBe(true);
    expect(evaluateAttempt("V", "RM")).toBe(false);
    expect(evaluateAttempt("V", null)).toBe(false);
  });
});
