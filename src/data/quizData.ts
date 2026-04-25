import rawQuizData from "./quizData.json";
import type { Question, QuizData, SoloSegment } from "../types";

function buildQuestionsFromSoloSegments(soloSegments: SoloSegment[]): Question[] {
  return soloSegments.map((segment, index) => ({
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

const soloSegments = rawQuizData.soloSegments as QuizData["soloSegments"];
const configuredQuestions = rawQuizData.questions as QuizData["questions"];

const questions = configuredQuestions.length > 0
  ? normalizeQuestions(configuredQuestions)
  : buildQuestionsFromSoloSegments(soloSegments);

const quizData: QuizData = {
  videoId: rawQuizData.videoId,
  title: rawQuizData.title,
  videoDuration: rawQuizData.videoDuration,
  members: rawQuizData.members as QuizData["members"],
  soloSegments,
  questions

};

export default quizData;
