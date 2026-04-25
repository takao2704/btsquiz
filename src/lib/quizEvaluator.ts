import type { MemberName, Question } from "../types";

export const TIME_TOLERANCE_SEC = 0.2;

export function isQuestionActive(currentTime: number, question: Question): boolean {
  return currentTime >= question.startTime && currentTime < question.endTime;
}

export function shouldFinalizeQuestion(prevTime: number, currentTime: number, question: Question): boolean {
  return prevTime < question.endTime - TIME_TOLERANCE_SEC && currentTime >= question.endTime - TIME_TOLERANCE_SEC;
}

export function evaluateAttempt(correctMember: MemberName, selectedMember: MemberName | null): boolean {
  return selectedMember !== null && selectedMember === correctMember;
}
