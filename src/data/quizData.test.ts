import { describe, expect, it } from "vitest";
import quizData from "./quizData";

describe("quizData question generation", () => {
  it("builds questions from configured solo segments", () => {
    expect(quizData.questions.length).toBe(10);
    expect(quizData.questions[0]).toMatchObject({
      id: 1,
      startTime: 23,
      endTime: 49,
      correctMember: "Jungkook"
    });
    expect(quizData.questions[9]).toMatchObject({
      id: 10,
      startTime: 167,
      endTime: 174,
      correctMember: "Jimin"
    });
  });
});
