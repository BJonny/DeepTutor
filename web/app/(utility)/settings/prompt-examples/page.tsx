"use client";

import { useState } from "react";
import {
  BrainCircuit,
  Check,
  Clipboard,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Microscope,
  PenLine,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { SettingsPageHeader } from "@/components/settings/shared";
import { notify } from "@/lib/notifications";

type PromptExample = {
  id: string;
  title: string;
  description: string;
  prompts: string[];
  icon: LucideIcon;
  accent: string;
  badge?: string;
};

const MODE_EXAMPLES: PromptExample[] = [
  {
    id: "chat",
    title: "Chat",
    description:
      "Flexible tutoring that can use tools, attached sources, memory, and skills.",
    prompts: [
      "Explain photosynthesis at secondary-school level, then ask one question to check my understanding.",
    ],
    icon: MessageSquare,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    badge: "Chat mode",
  },
  {
    id: "deep_solve",
    title: "Solve",
    description:
      "Plans and verifies a multi-step solution before presenting the final answer.",
    prompts: [
      "Solve this step by step and verify the result: a rectangle has perimeter 54 cm and its length is 3 cm more than twice its width. Find both dimensions.",
    ],
    icon: BrainCircuit,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    badge: "Solve mode",
  },
  {
    id: "deep_question",
    title: "Quiz",
    description:
      "Generates auto-validated questions using the quiz settings you select.",
    prompts: [
      "Create a 10-question quiz on cell biology for a first-year university student, mixing recall and application questions.",
    ],
    icon: PenLine,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    badge: "Quiz mode",
  },
  {
    id: "deep_research",
    title: "Research",
    description:
      "Decomposes a broad topic, researches its parts, and writes a sourced report.",
    prompts: [
      "Research the evidence for and against a four-day working week. Compare productivity, employee wellbeing, and implementation risks, and cite the sources.",
    ],
    icon: Microscope,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    badge: "Research mode",
  },
  {
    id: "visualize",
    title: "Visualize",
    description:
      "Creates a diagram, chart, interactive page, or mathematical visualization.",
    prompts: [
      "Create an interactive visualization showing how the unit circle generates the sine and cosine waves, with clearly labelled axes and angles.",
    ],
    icon: Sparkles,
    accent: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
    badge: "Visualize mode",
  },
  {
    id: "mastery_path",
    title: "Mastery Path",
    description:
      "Teaches and assesses a sequence of objectives, requiring mastery before advancing.",
    prompts: [
      "Build a mastery path for introductory probability. Start by checking what I already know and teach one objective at a time.",
    ],
    icon: GraduationCap,
    accent: "bg-lime-500/10 text-lime-700 dark:text-lime-400",
    badge: "Mastery Path mode",
  },
];

const SKILL_EXAMPLES: PromptExample[] = [
  {
    id: "socratic-tutor",
    title: "Socratic Tutor",
    description:
      "Guides you with one question at a time instead of immediately giving away the answer.",
    prompts: [
      "Use the socratic-tutor skill to help me understand why dividing by a fraction is the same as multiplying by its reciprocal. Do not simply give me the explanation.",
      "Use the socratic-tutor skill to teach me Bayes’ theorem. Ask one question at a time.",
    ],
    icon: Lightbulb,
    accent: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    badge: "socratic-tutor",
  },
  {
    id: "concept-explainer",
    title: "Concept Explainer",
    description:
      "Builds understanding progressively with purpose, one analogy, a worked example, and a knowledge check.",
    prompts: [
      "Use the concept-explainer skill to explain gradient descent to me. Assume I understand basic algebra but not calculus.",
    ],
    icon: Sparkles,
    accent: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    badge: "concept-explainer",
  },
  {
    id: "flashcard-deck",
    title: "Flashcard Deck",
    description:
      "Turns source material into atomic recall cards, cloze cards, and optional Anki-ready TSV.",
    prompts: [
      "Use the flashcard-deck skill to create 15 flashcards from the attached material. Include Q/A and cloze cards and provide an Anki-compatible TSV block.",
      "Read the attached notes and use the flashcard-deck skill to create 20 atomic cards, followed by an Anki TSV export.",
    ],
    icon: Clipboard,
    accent: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    badge: "flashcard-deck",
  },
  {
    id: "exam-blueprint",
    title: "Exam Blueprint",
    description:
      "Designs a balanced assessment with coverage, difficulty, points, and an explained answer key.",
    prompts: [
      "Use the exam-blueprint skill to build a 45-minute practice exam on introductory statistics. University level, 12 questions, with emphasis on application. Keep the answers hidden until after the exam.",
      "Use the exam-blueprint skill with the attached notes to create a 30-minute test. Do not reveal the answers until I submit mine.",
    ],
    icon: FlaskConical,
    accent: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    badge: "exam-blueprint",
  },
];

export default function PromptExamplesSettingsPage() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

  const copyPrompt = async (key: string, prompt: string) => {
    const text = t(prompt);
    try {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        try {
          textarea.select();
          if (!document.execCommand("copy")) throw new Error();
        } finally {
          textarea.remove();
        }
      }
      setCopied(key);
      window.setTimeout(() => {
        setCopied((current) => (current === key ? null : current));
      }, 1800);
    } catch {
      setCopied(null);
      notify(
        t("Could not copy the prompt. Select the text and copy it manually."),
        { tone: "error" },
      );
    }
  };

  return (
    <div>
      <SettingsPageHeader
        title={t("Prompt examples")}
        description={t(
          "Copy practical starting prompts for every chat mode and the installed Academics skills.",
        )}
      />

      <div className="mb-7 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
        <div className="flex gap-3">
          <Lightbulb
            size={18}
            className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
          />
          <div>
            <h2 className="text-[14px] font-medium text-[var(--foreground)]">
              {t("How skills appear in Chat")}
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted-foreground)]">
              {t(
                'Skills are playbooks, not separate chat modes. Use Chat and name the skill explicitly. Expand the activity trace and look for “Reading skill · skill-name” to verify that DeepTutor loaded it.',
              )}
            </p>
          </div>
        </div>
      </div>

      <PromptSection
        title={t("Chat mode examples")}
        description={t(
          "Choose the matching mode in the composer before sending one of these prompts.",
        )}
        examples={MODE_EXAMPLES}
        copied={copied}
        onCopy={copyPrompt}
        translateBadges
      />

      <PromptSection
        title={t("Academics skill examples")}
        description={t(
          "Use these in Chat. Attach your notes first when an example refers to source material.",
        )}
        examples={SKILL_EXAMPLES}
        copied={copied}
        onCopy={copyPrompt}
      />
    </div>
  );
}

function PromptSection({
  title,
  description,
  examples,
  copied,
  onCopy,
  translateBadges = false,
}: {
  title: string;
  description: string;
  examples: PromptExample[];
  copied: string | null;
  onCopy: (key: string, prompt: string) => Promise<void>;
  translateBadges?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <section className="mb-8">
      <div className="mb-3">
        <h2 className="font-serif text-[19px] font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {examples.map((example) => {
          const Icon = example.icon;
          return (
            <article
              key={example.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${example.accent}`}
                >
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[14px] font-medium text-[var(--foreground)]">
                      {t(example.title)}
                    </h3>
                    {example.badge && (
                      <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)]">
                        {translateBadges ? t(example.badge) : example.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
                    {t(example.description)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {example.prompts.map((prompt, index) => {
                  const key = `${example.id}-${index}`;
                  const isCopied = copied === key;
                  return (
                    <div
                      key={key}
                      className="rounded-lg border border-[var(--border)]/70 bg-[var(--muted)]/35 p-3"
                    >
                      <p className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-[var(--foreground)]">
                        {t(prompt)}
                      </p>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => void onCopy(key, prompt)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                          aria-label={t("Copy prompt")}
                        >
                          {isCopied ? <Check size={13} /> : <Clipboard size={13} />}
                          {isCopied ? t("Copied") : t("Copy prompt")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
