import {
  AI_RISK_STORAGE_KEY,
  expect,
  FIXTURE_LESSON,
  test,
} from "./fixtures";

const CHAT_HISTORY_KEY = "ts-school-ai-chat-history";
const SEEDED_USER_TEXT = "What causes my first type error?";

function seedChatHistoryScript() {
  return {
    chatKey: CHAT_HISTORY_KEY,
    userText: SEEDED_USER_TEXT,
  };
}

test.describe("Ask chat history persistence", () => {
  test("seeded history survives reload without loading a model", async ({
    page,
  }) => {
    await page.addInitScript(
      ({ chatKey, userText }) => {
        localStorage.setItem(
          chatKey,
          JSON.stringify({
            version: 1,
            updatedAt: "2026-08-12T00:00:00.000Z",
            messages: [
              { role: "user", content: userText },
              {
                role: "assistant",
                content: "TypeScript flags values that do not match the expected type.",
              },
            ],
          }),
        );
      },
      seedChatHistoryScript(),
    );

    await page.goto(FIXTURE_LESSON.path);
    await page.reload();
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();
    await expect(page.getByTestId("ts-ai-load")).toBeVisible();

    const userBubble = page
      .getByTestId("ts-ai-bubble")
      .filter({ hasText: SEEDED_USER_TEXT });
    await expect(userBubble).toBeVisible();
    await expect(userBubble).toHaveAttribute("data-role", "user");
  });

  test("sidebar clear chat wipes storage and empties the pane", async ({
    page,
  }) => {
    await page.addInitScript(
      ({ chatKey, userText }) => {
        localStorage.setItem(
          chatKey,
          JSON.stringify({
            version: 1,
            updatedAt: "2026-08-12T00:00:00.000Z",
            messages: [{ role: "user", content: userText }],
          }),
        );
      },
      seedChatHistoryScript(),
    );

    await page.goto(FIXTURE_LESSON.path);
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(
      page.getByTestId("ts-ai-bubble").filter({ hasText: SEEDED_USER_TEXT }),
    ).toBeVisible();

    await page.getByTestId("ts-ai-clear-chat").click();
    await expect(page.getByTestId("ts-ai-bubble")).toHaveCount(0);
    await expect(page.getByTestId("ts-ai-messages")).toContainText(
      /Load Gemma 4/i,
    );
    expect(
      await page.evaluate((key) => localStorage.getItem(key), CHAT_HISTORY_KEY),
    ).toBeNull();
  });

  test("profile clear chat history removes the storage key", async ({
    page,
  }) => {
    await page.addInitScript(
      ({ chatKey, userText }) => {
        localStorage.setItem(
          chatKey,
          JSON.stringify({
            version: 1,
            updatedAt: "2026-08-12T00:00:00.000Z",
            messages: [{ role: "user", content: userText }],
          }),
        );
      },
      seedChatHistoryScript(),
    );

    await page.goto("/profile");
    await page.getByTestId("ts-profile-clear-chat").click();
    await expect(page.getByTestId("ts-profile-status")).toContainText(
      /chat history cleared/i,
    );
    expect(
      await page.evaluate((key) => localStorage.getItem(key), CHAT_HISTORY_KEY),
    ).toBeNull();
  });
});
