"use client";

import styles from "./ProgressLines.module.css";

export const LINE_COUNT = 3;

type Props = {
  lit: number;
  disabled: boolean;
  onAdvance: () => void;
};

export function ProgressLines({ lit, disabled, onAdvance }: Props) {
  const complete = lit >= LINE_COUNT;

  return (
    <button
      type="button"
      className={styles.target}
      onClick={onAdvance}
      disabled={disabled || complete}
      aria-label={`Mark progress, ${lit} of ${LINE_COUNT} done`}
    >
      <span className={styles.lines}>
        {Array.from({ length: LINE_COUNT }, (_, i) => (
          <span
            key={i}
            className={styles.line}
            data-lit={i < lit || undefined}
            data-pulse={i === 0 && lit === 0 || undefined}
          />
        ))}
      </span>
    </button>
  );
}
