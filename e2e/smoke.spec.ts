import { expect, test } from "@playwright/test";

const consoleErrorsByTestId = new Map<string, string[]>();

test.beforeEach(async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  consoleErrorsByTestId.set(testInfo.testId, consoleErrors);

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
        currentTime += 5;
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
});

test.afterEach(async ({}, testInfo) => {
  const consoleErrors = consoleErrorsByTestId.get(testInfo.testId) ?? [];

  await testInfo.attach("console-errors", {
    body: JSON.stringify(consoleErrors, null, 2),
    contentType: "application/json"
  });

  expect(consoleErrors, "Browser console errors should be empty").toEqual([]);

  consoleErrorsByTestId.delete(testInfo.testId);
});

test("home to quiz flow has no browser runtime errors", async ({ page }) => {
  await page.goto("/#/");

  await expect(page.getByRole("heading", { name: "BTS Face & Name Quiz" })).toBeVisible();
  await page.getByRole("link", { name: "はじめる" }).click();

  await expect(page).toHaveURL(/#\/quiz/);
  await expect(page.getByRole("heading", { name: "Quiz" })).toBeVisible();
  await expect(page.getByText("スコア:")).toBeVisible();
});

test("quiz page runs stably for a short period", async ({ page }) => {
  await page.goto("/#/quiz");

  await expect(page.getByRole("heading", { name: "Quiz" })).toBeVisible();
  await expect(page).toHaveURL(/#\/quiz/);

  await page.waitForTimeout(3_000);
  await expect(page.getByRole("alert")).toHaveCount(0);
});
