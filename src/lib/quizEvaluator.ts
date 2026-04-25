import type { MemberName, Question } from "../types";

export function isQuestionActive(currentTime: number, question: Question): boolean {
  return currentTime >= question.startTime && currentTime < question.endTime;
}

export function shouldFinalizeQuestion(prevTime: number, currentTime: number, question: Question): boolean {
  return prevTime < question.endTime && currentTime >= question.endTime;
}

export function evaluateAttempt(correctMember: MemberName, selectedMember: MemberName | null): boolean {
  return selectedMember !== null && selectedMember === correctMember;
}
