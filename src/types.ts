export type MemberName = "RM" | "Jin" | "SUGA" | "j-hope" | "Jimin" | "V" | "Jungkook";

export type Question = {
  id: number;
  startTime: number;
  endTime: number;
  correctMember: MemberName;
};

export type SoloSegment = {
  startTime: number;
  endTime: number;
  member: MemberName;
};

export type Attempt = {
  questionId: number;
  selectedMember: MemberName | null;
  isCorrect: boolean;
  answeredAt: number | null;
};

export type QuizState = {
  phase: "idle" | "playing" | "finished";
  currentTime: number;
  activeQuestionId: number | null;
  attempts: Attempt[];
  score: number;
};

export type QuizData = {
  videoId: string;
  title: string;
  videoDuration: number;
  members: MemberName[];
  soloSegments: SoloSegment[];
  questions: Question[];
};
