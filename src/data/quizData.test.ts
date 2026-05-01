import { describe, expect, it } from "vitest";
import { quizDataBySet } from "./quizData";

describe("quizData question generation", () => {
  it("keeps existing DNA questions", () => {
    expect(quizDataBySet.dna.questions.length).toBe(10);
    expect(quizDataBySet.dna.questions[0]).toMatchObject({
      id: 1,
      startTime: 23,
      endTime: 49,
      correctMember: "Jungkook"
    });
  });

  it("builds Blood Sweat & Tears questions", () => {
    expect(quizDataBySet["blood-sweat-tears"].questions.length).toBe(20);
    expect(quizDataBySet["blood-sweat-tears"].questions[1]).toMatchObject({
      id: 2,
      startTime: 22,
      endTime: 27,
      correctMember: "V"
    });
  });
});
