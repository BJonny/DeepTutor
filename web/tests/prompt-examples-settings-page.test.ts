import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const webRoot = process.cwd();
const pagePath = path.join(
  webRoot,
  "app",
  "(utility)",
  "settings",
  "prompt-examples",
  "page.tsx",
);
const navPath = path.join(webRoot, "lib", "settings-nav.ts");

function readPage(): string {
  return fs.readFileSync(pagePath, "utf8");
}

test("prompt examples: is registered as a Chat settings leaf", () => {
  const nav = fs.readFileSync(navPath, "utf8");
  assert.match(nav, /key: "prompt-examples"/);
  assert.match(nav, /href: "\/settings\/prompt-examples"/);
  assert.match(nav, /NAV_ONLY_ROUTES[\s\S]*"\/settings\/prompt-examples"/);
});

test("prompt examples: documents every visible chat capability", () => {
  const page = readPage();
  for (const capability of [
    "chat",
    "deep_solve",
    "deep_question",
    "deep_research",
    "visualize",
    "mastery_path",
  ]) {
    assert.match(page, new RegExp(`id: "${capability}"`));
  }
});

test("prompt examples: includes every installed Academics skill", () => {
  const page = readPage();
  for (const skill of [
    "socratic-tutor",
    "concept-explainer",
    "flashcard-deck",
    "exam-blueprint",
  ]) {
    assert.match(page, new RegExp(`id: "${skill}"`));
  }
});

test("prompt examples: provides copy controls and explains skill trace verification", () => {
  const page = readPage();
  assert.match(page, /navigator\.clipboard\.writeText/);
  assert.match(page, /document\.execCommand\("copy"\)/);
  assert.match(page, /Could not copy the prompt/);
  assert.match(page, /Reading skill · skill-name/);
  assert.match(page, /Copy prompt/);
  assert.match(page, /translateBadges \? t\(example\.badge\) : example\.badge/);
});
