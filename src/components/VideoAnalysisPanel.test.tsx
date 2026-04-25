import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoAnalysisPanel } from "./VideoAnalysisPanel";

describe("VideoAnalysisPanel", () => {
  it("formats elapsed time from seconds using floor", () => {
    render(<VideoAnalysisPanel currentTime={61.9} totalDuration={125.1} activeSoloMembers={[]} />);

    expect(screen.getByText("全体の時間: 2:05 / 現在: 1:01")).toBeTruthy();
  });
});
