import { describe, expect, it } from "vitest";
import quizData from "./quizData";

describe("quizData question generation", () => {
  it("builds questions from configured solo segments", () => {
    expect(quizData.questions.length).toBe(20);
    expect(quizData.questions[0]).toMatchObject({
      id: 1,
      startTime: 9,
      endTime: 14,
      correctMember: "Jungkook"
    });
    expect(quizData.questions[19]).toMatchObject({
      id: 20,
      startTime: 169,
      endTime: 173,
      correctMember: "j-hope"
    });
  });
});
