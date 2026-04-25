import type { MemberName, QuizData, SoloSegment } from "../types";

export type VideoAnalysisResult = {
  totalDuration: number;
  activeSoloMembers: MemberName[];
  hasSoloSegment: boolean;
};

export function getTotalDuration(quizData: QuizData): number {
  return quizData.videoDuration;
}

export function getActiveSoloMembers(currentTime: number, segments: SoloSegment[]): MemberName[] {
  return segments
    .filter((segment) => currentTime >= segment.startTime && currentTime <= segment.endTime)
    .map((segment) => segment.member);
}

export function analyzeVideoTimeline(currentTime: number, quizData: QuizData): VideoAnalysisResult {
  const activeSoloMembers = getActiveSoloMembers(currentTime, quizData.soloSegments);

  return {
    totalDuration: getTotalDuration(quizData),
    activeSoloMembers,
    hasSoloSegment: activeSoloMembers.length > 0
  };
}
