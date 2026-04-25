import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    throw new Error(`Browser runtime error: ${error.message}`);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.addInitScript(() => {
    let currentTime = 0;

    class MockPlayer {
      constructor(
        _elementId: string,
        options: {
          events?: {
            onReady?: (event: { target: { playVideo: () => void } }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) {
        setTimeout(() => {
          options.events?.onReady?.({ target: { playVideo: () => undefined } });
          options.events?.onStateChange?.({ data: 1 });
        }, 0);
      }

      getCurrentTime() {
        currentTime += 10;
        return currentTime;
      }

      destroy() {
        return undefined;
      }
    }

    // @ts-expect-error test mock
    window.YT = {
      Player: MockPlayer,
      PlayerState: { PLAYING: 1 }
    };
  });

  test.info().attach("console-errors", {
    body: JSON.stringify(consoleErrors),
    contentType: "application/json"
  });
});

test("home to quiz flow has no browser runtime errors", async ({ page }) => {
  await page.goto("/#/");

  await expect(page.getByRole("heading", { name: "BTS Face & Name Quiz" })).toBeVisible();
  await page.getByRole("link", { name: "はじめる" }).click();

  await expect(page).toHaveURL(/#\/quiz/);
  await expect(page.getByRole("heading", { name: "Quiz" })).toBeVisible();
  await expect(page.getByText("Score")).toBeVisible();
});

test("quiz auto-finishes and moves to result page", async ({ page }) => {
  await page.goto("/#/quiz");

  await expect(page.getByRole("heading", { name: "Quiz" })).toBeVisible();
  await expect(page).toHaveURL(/#\/result/, { timeout: 7_000 });

  await expect(page.getByRole("heading", { name: "Result" })).toBeVisible();
  await expect(page.getByText("正答率:")).toBeVisible();
});
