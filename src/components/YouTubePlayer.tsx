import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: { playVideo: () => void } }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => {
        getCurrentTime: () => number;
        destroy: () => void;
      };
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type Props = {
  videoId: string;
  onReady: () => void;
  onTick: (currentTime: number) => void;
};

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve) => {
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.append(script);
      }

      if (window.YT?.Player) {
        resolve();
      } else {
        window.onYouTubeIframeAPIReady = () => resolve();
      }
    });
  }

  return apiPromise;
}

export function YouTubePlayer({ videoId, onReady, onTick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    let player: { getCurrentTime: () => number; destroy: () => void } | null = null;

    void loadYouTubeApi().then(() => {
      if (!mounted) {
        return;
      }

      if (!containerRef.current) {
        return;
      }

      player = new window.YT.Player(containerRef.current.id, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          playsinline: 1,
          mute: 1,
          rel: 0
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            onReady();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING && timerRef.current === null) {
              timerRef.current = window.setInterval(() => {
                if (player) {
                  onTick(player.getCurrentTime());
                }
              }, 200);
            }
          }
        }
      });
    });

    return () => {
      mounted = false;
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      player?.destroy();
    };
  }, [videoId, onReady, onTick]);

  return <div id="yt-player" ref={containerRef} className="player" />;
}
