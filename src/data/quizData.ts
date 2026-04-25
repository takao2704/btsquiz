import rawQuizData from "./quizData.json";
import type { QuizData } from "../types";

const quizData: QuizData = {
  videoId: rawQuizData.videoId,
  title: rawQuizData.title,
  members: rawQuizData.members as QuizData["members"],
  questions: rawQuizData.questions as QuizData["questions"]
};

export default quizData;
