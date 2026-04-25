import rawQuizData from "./quizData.json";
import type { QuizData } from "../types";

const quizData: QuizData = {
  videoId: rawQuizData.videoId,
  title: rawQuizData.title,
  videoDuration: rawQuizData.videoDuration,
  members: rawQuizData.members as QuizData["members"],
  soloSegments: rawQuizData.soloSegments as QuizData["soloSegments"],
  questions: rawQuizData.questions as QuizData["questions"]
};

export default quizData;
