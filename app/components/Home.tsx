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
          <div key={String(started)} className={styles.cluster}>
            {started && <p className={styles.greeting}>welcome back</p>}
            <Link href="/focus" className={styles.word}>
              {started ? "continue" : "hi"}
            </Link>
          </div>
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
