"use client";

import Link from "next/link";
import styles from "./CornerNav.module.css";

type Props = {
  back?: boolean;
  onRestart?: () => void;
};

export function CornerNav({ back, onRestart }: Props) {
  return (
    <>
      {back && (
        <Link href="/" className={`${styles.icon} ${styles.left}`} aria-label="Back to home">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
        </Link>
      )}
      {onRestart && (
        <button
          type="button"
          className={`${styles.icon} ${styles.right}`}
          aria-label="Restart"
          onClick={onRestart}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
        </button>
      )}
    </>
  );
}
