import { describe, expect, it } from "vitest";
import quizData from "./quizData";

describe("quizData question generation", () => {
  it("uses configured questions when present", () => {
    expect(quizData.questions.length).toBe(2);
    expect(quizData.questions[0]).toMatchObject({
      id: 1,
      startTime: 9,
      endTime: 14,
      correctMember: "Jungkook"
    });
    expect(quizData.questions[1]).toMatchObject({
      id: 2,
      startTime: 22,
      endTime: 27,
      correctMember: "V"
    });
  });
});
