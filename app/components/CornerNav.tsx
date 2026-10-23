"use client";

import Link from "next/link";
import styles from "./CornerNav.module.css";

type Props = {
  back?: boolean;
};

export function CornerNav({ back }: Props) {
  if (!back) return null;

  return (
    <Link href="/" className={styles.icon} aria-label="Back to home">
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
    </Link>
  );
}
