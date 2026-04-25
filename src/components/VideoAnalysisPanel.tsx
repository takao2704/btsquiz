import type { MemberName } from "../types";

type Props = {
  currentTime: number;
  totalDuration: number;
  activeSoloMembers: MemberName[];
};

function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(clamped / 60);
  const remainingSeconds = clamped % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function VideoAnalysisPanel({ currentTime, totalDuration, activeSoloMembers }: Props) {
  return (
    <section className="analysis-panel" aria-label="video-analysis-panel">
      <h3>動画解析</h3>
      <p>
        全体の時間: {formatTime(totalDuration)} / 現在: {formatTime(currentTime)}
      </p>
      <p>
        ソロ判定: {activeSoloMembers.length > 0 ? activeSoloMembers.join(", ") : "該当なし"}
      </p>
    </section>
  );
}
