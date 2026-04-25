import { describe, expect, it } from "vitest";
import quizData from "./quizData";

describe("quizData question generation", () => {
  it("skips opening segment that starts at 0s for answer buttons", () => {
    expect(quizData.questions.length).toBe(6);
    expect(quizData.questions[0]).toMatchObject({
      id: 1,
      startTime: 20,
      endTime: 26,
      correctMember: "RM"
    });
  });
});
