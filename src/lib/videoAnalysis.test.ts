import { describe, expect, it } from "vitest";
import type { QuizData } from "../types";
import { analyzeVideoTimeline, getActiveSoloMembers, getTotalDuration } from "./videoAnalysis";

const quizData: QuizData = {
  videoId: "dummy",
  title: "dummy",
  videoDuration: 120,
  members: ["RM", "Jin", "SUGA", "j-hope", "Jimin", "V", "Jungkook"],
  soloSegments: [
    { startTime: 10, endTime: 15, member: "V" },
    { startTime: 25, endTime: 29, member: "RM" }
  ],
  questions: []
};

describe("videoAnalysis", () => {
  it("returns configured total duration", () => {
    expect(getTotalDuration(quizData)).toBe(120);
  });

  it("detects member in solo segment", () => {
    expect(getActiveSoloMembers(11, quizData.soloSegments)).toEqual(["V"]);
    expect(getActiveSoloMembers(30, quizData.soloSegments)).toEqual([]);
  });

  it("aggregates timeline analysis", () => {
    expect(analyzeVideoTimeline(26, quizData)).toEqual({
      totalDuration: 120,
      activeSoloMembers: ["RM"],
      hasSoloSegment: true
    });
  });
});
