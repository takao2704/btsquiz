import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: {
      Player: new (
        element: string | HTMLElement,
        options: {
          videoId: string;
          host?: string;
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
    apiPromise = new Promise<void>((resolve, reject) => {
      let settled = false;
      const previousReady = window.onYouTubeIframeAPIReady;

      const timeoutId = window.setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        apiPromise = null;
        reject(new Error("YouTube API の読み込みがタイムアウトしました。"));
      }, 8000);

      const done = () => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timeoutId);
        resolve();
      };

      if (window.YT?.Player) {
        done();
        return;
      }

      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]') as HTMLScriptElement | null;
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.onerror = () => {
          if (settled) {
            return;
          }

          settled = true;
          clearTimeout(timeoutId);
          apiPromise = null;
          reject(new Error("YouTube API スクリプトの読み込みに失敗しました。"));
        };
        document.body.append(script);
      }

      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        done();
      };
    });
  }

  return apiPromise;
}

export function YouTubePlayer({ videoId, onReady, onTick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const onReadyRef = useRef(onReady);
  const onTickRef = useRef(onTick);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    let mounted = true;
    let player: { getCurrentTime: () => number; destroy: () => void } | null = null;

    setErrorMessage(null);

    void loadYouTubeApi()
      .then(() => {
        if (!mounted || !containerRef.current) {
          return;
        }

        player = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            playsinline: 1,
            mute: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              event.target.playVideo();
              onReadyRef.current();
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING && timerRef.current === null) {
                timerRef.current = window.setInterval(() => {
                  if (player) {
                    onTickRef.current(player.getCurrentTime());
                  }
                }, 200);
                return;
              }

              if (event.data !== window.YT.PlayerState.PLAYING && timerRef.current !== null) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
            }
          }
        });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "動画プレイヤーの初期化に失敗しました。";
        console.error("[YouTubePlayer]", message);
        setErrorMessage(message);
      });

    return () => {
      mounted = false;
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      player?.destroy();
    };
  }, [videoId]);

  if (errorMessage) {
    return (
      <div className="player player-error" role="alert">
        <p>プレイヤー初期化エラー: {errorMessage}</p>
        <p>通信状態を確認して再読み込みしてください。</p>
      </div>
    );
  }

  return <div ref={containerRef} className="player" />;
}
