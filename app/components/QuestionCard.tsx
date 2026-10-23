"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Question } from "@/app/data/tasks";
import type { Answer } from "@/app/lib/storage";
import panel from "./Panel.module.css";
import styles from "./QuestionCard.module.css";

type Props = {
  question: Question;
  selected: string | null;
  disabled: boolean;
  onAnswer: (answer: Answer) => void;
};

export function QuestionCard({ question, selected, disabled, onAnswer }: Props) {
  const [text, setText] = useState("");
  const rowRefs = useRef<(HTMLButtonElement | HTMLInputElement | null)[]>([]);

  const choose = (value: string, custom: boolean) => {
    if (disabled) return;
    onAnswer({ questionId: question.id, value, custom });
  };

  useEffect(() => {
    if (disabled) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const index = Number(event.key) - 1;
      const option = question.options[index];
      if (option !== undefined) {
        event.preventDefault();
        onAnswer({ questionId: question.id, value: option, custom: false });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [disabled, question, onAnswer]);

  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const rows = rowRefs.current.filter((row) => row !== null);
    const current = rows.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next = rows[(current + step + rows.length) % rows.length];
    event.preventDefault();
    next?.focus();
  };

  const trimmed = text.trim();

  return (
    <div className={styles.card}>
      <p className={panel.prompt} id={`${question.id}-prompt`}>
        {question.prompt}
      </p>
      <div
        className={panel.unit}
        role="group"
        aria-labelledby={`${question.id}-prompt`}
        onKeyDown={moveFocus}
      >
        {question.options.map((option, i) => (
          <button
            key={option}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            type="button"
            className={`${panel.row} ${styles.option}`}
            data-selected={selected === option || undefined}
            aria-pressed={selected === option}
            disabled={disabled}
            onClick={() => choose(option, false)}
          >
            <span>{option}</span>
            <kbd className={panel.keyHint} aria-hidden>
              {i + 1}
            </kbd>
          </button>
        ))}
        {question.allowFreeform && (
          <label className={`${panel.row} ${styles.freeform}`}>
            <input
              ref={(el) => {
                rowRefs.current[question.options.length] = el;
              }}
              className={panel.input}
              value={text}
              placeholder="Or write your own"
              aria-label="Your own answer"
              disabled={disabled}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && trimmed && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  choose(trimmed, true);
                }
              }}
            />
            <kbd
              className={panel.keyHint}
              data-visible={trimmed !== "" || undefined}
              aria-hidden
            >
              ↵
            </kbd>
          </label>
        )}
      </div>
    </div>
  );
}
