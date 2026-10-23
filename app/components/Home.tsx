"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { clearProgress, hasStarted, subscribeProgress } from "@/app/lib/storage";
import styles from "./Home.module.css";

export function Home() {
  const started = useSyncExternalStore(subscribeProgress, hasStarted, () => null);

  return (
    <main className={styles.stage}>
      {started !== null && (
        <>
          <Link key={String(started)} href="/focus" className={styles.word}>
            {started ? "Continue?" : "hi"}
          </Link>
          {started && (
            <button type="button" className={styles.anew} onClick={clearProgress}>
              begin anew
            </button>
          )}
        </>
      )}
    </main>
  );
}
