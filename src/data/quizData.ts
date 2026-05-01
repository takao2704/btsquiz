import rawDefaultQuizData from "./quizData.json";
import rawBloodSweatTearsQuizData from "./quizDataBloodSweatTears.json";
import type { Question, QuizData, SoloSegment } from "../types";

const MINIMUM_QUESTION_START_TIME_SECONDS = 1;

export type QuizSetId = "dna" | "blood-sweat-tears";

function buildQuestionsFromSoloSegments(soloSegments: SoloSegment[]): Question[] {
  return soloSegments
    .filter((segment) => segment.startTime >= MINIMUM_QUESTION_START_TIME_SECONDS)
    .map((segment, index) => ({
      id: index + 1,
      startTime: segment.startTime,
      endTime: segment.endTime,
      correctMember: segment.member
    }));
}

function normalizeQuestions(rawQuestions: Question[]): Question[] {
  return [...rawQuestions]
    .sort((a, b) => a.startTime - b.startTime)
    .map((question, index) => ({
      ...question,
      id: index + 1
    }));
}

function buildQuizData(rawQuizData: QuizData): QuizData {
  const soloSegments = rawQuizData.soloSegments as QuizData["soloSegments"];
  const configuredQuestions = rawQuizData.questions as QuizData["questions"];

  const questions = configuredQuestions.length > 0
    ? normalizeQuestions(configuredQuestions)
    : buildQuestionsFromSoloSegments(soloSegments);

  return {
    videoId: rawQuizData.videoId,
    title: rawQuizData.title,
    videoDuration: rawQuizData.videoDuration,
    members: rawQuizData.members as QuizData["members"],
    soloSegments,
    questions
  };
}

export const quizDataBySet: Record<QuizSetId, QuizData> = {
  dna: buildQuizData(rawDefaultQuizData as QuizData),
  "blood-sweat-tears": buildQuizData(rawBloodSweatTearsQuizData as QuizData)
};

const quizData = quizDataBySet.dna;

export default quizData;
