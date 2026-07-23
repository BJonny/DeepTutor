import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const webRoot = process.cwd();
const contextSource = fs.readFileSync(
  path.join(webRoot, "context/UnifiedChatContext.tsx"),
  "utf8",
);
const pageSource = fs.readFileSync(
  path.join(webRoot, "app/(workspace)/home/[[...sessionId]]/page.tsx"),
  "utf8",
);
const followupSource = fs.readFileSync(
  path.join(webRoot, "components/quiz/FollowupChatComposer.tsx"),
  "utf8",
);
const appShellSource = fs.readFileSync(
  path.join(webRoot, "context/AppShellContext.tsx"),
  "utf8",
);

test("chat turns use a synchronously updated language ref", () => {
  assert.match(
    contextSource,
    /effectiveLanguage\s*=\s*replaySnapshot\?\.language\s*\?\?\s*languageRef\.current/,
  );
  assert.match(contextSource, /languageRef\.current\s*=\s*normalized/);
  assert.doesNotMatch(
    contextSource,
    /effectiveLanguage\s*=\s*[\s\S]{0,100}readStoredLanguage\(\)/,
  );
});

test("chat session language follows the hydrated AppShell locale", () => {
  assert.match(pageSource, /setLanguage:\s*setChatLanguage/);
  assert.match(pageSource, /appLanguage\s*===\s*readStoredLanguage\(\)/);
  assert.match(pageSource, /setChatLanguage\(appLanguage\)/);
});

test("quiz follow-up sends the live AppShell language", () => {
  assert.match(followupSource, /const \{ language \} = useAppShell\(\)/);
  assert.match(followupSource, /language,\s*knowledgeBases:/);
  assert.doesNotMatch(followupSource, /language:\s*context\.language/);
});

test("AppShell hydrates the authenticated user's backend language", () => {
  assert.match(appShellSource, /apiUrl\("\/api\/v1\/settings"\)/);
  assert.match(appShellSource, /writeStoredLanguage\(backendLanguage\)/);
});