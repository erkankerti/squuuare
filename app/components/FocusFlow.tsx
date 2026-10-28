"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef, type CSSProperties } from "react";
import { levels, type FocusTask } from "@/app/data/tasks";
import {
  clearProgress,
  loadTaskIndex,
  markStarted,
  saveSession,
  saveTaskIndex,
  type Answer,
} from "@/app/lib/storage";
import { CornerNav } from "./CornerNav";
import { LINE_COUNT, ProgressLines } from "./ProgressLines";
import { QuestionCard } from "./QuestionCard";
import { ReflectionInput } from "./ReflectionInput";
import styles from "./FocusFlow.module.css";

// Keep in sync with the durations in FocusFlow.module.css.
const LAST_LINE_PAUSE = 450;
const SELECT_HOLD = 160;
const STEP_EXIT = 220;
const TASK_LEAVE = 450;
const FIRST_QUESTION_DELAY = 350;

type Phase = "focusing" | "questioning" | "reflecting" | "transitioning" | "finished";

type State = {
  hydrated: boolean;
  phase: Phase;
  taskIndex: number;
  linesLit: number;
  questionIndex: number;
  answers: Answer[];
  selected: string | null;
  exiting: boolean;
};

type Action =
  | { type: "hydrate"; taskIndex: number; taskCount: number }
  | { type: "light" }
  | { type: "beginQuestions" }
  | { type: "select"; value: string }
  | { type: "exitStep" }
  | { type: "answer"; answer: Answer; questionCount: number }
  | { type: "submitReflection" }
  | { type: "nextTask"; taskCount: number };

const freshTask = {
  phase: "focusing",
  linesLit: 0,
  questionIndex: 0,
  answers: [],
  selected: null,
  exiting: false,
} satisfies Partial<State>;

const initialState: State = { hydrated: false, taskIndex: 0, ...freshTask };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": {
      const taskIndex = Math.min(action.taskIndex, action.taskCount);
      return {
        ...state,
        hydrated: true,
        taskIndex,
        phase: taskIndex >= action.taskCount ? "finished" : "focusing",
      };
    }
    case "light":
      return { ...state, linesLit: Math.min(state.linesLit + 1, LINE_COUNT) };
    case "beginQuestions":
      return { ...state, phase: "questioning" };
    case "select":
      return { ...state, selected: action.value };
    case "exitStep":
      return { ...state, exiting: true };
    case "answer": {
      const questionIndex = state.questionIndex + 1;
      return {
        ...state,
        answers: [...state.answers, action.answer],
        questionIndex,
        selected: null,
        exiting: false,
        phase: questionIndex >= action.questionCount ? "reflecting" : "questioning",
      };
    }
    case "submitReflection":
      return { ...state, phase: "transitioning" };
    case "nextTask": {
      const taskIndex = state.taskIndex + 1;
      return {
        ...state,
        ...freshTask,
        taskIndex,
        phase: taskIndex >= action.taskCount ? "finished" : "focusing",
      };
    }
  }
}

export function FocusFlow({ tasks }: { tasks: FocusTask[] }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timers = useRef<number[]>([]);
  const router = useRouter();

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    markStarted();
    dispatch({ type: "hydrate", taskIndex: loadTaskIndex(), taskCount: tasks.length });
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, [tasks.length]);

  const task = tasks[state.taskIndex];
  const question = task?.questions[state.questionIndex];
  const levelTasks = tasks.filter((t) => t.level === task?.level);
  const levelPosition = levelTasks.indexOf(task) + 1;
  const levelName = levels.find((l) => l.id === task?.level)?.name;
  const busy = state.selected !== null || state.exiting;

  const advance = () => {
    if (state.phase !== "focusing" || state.linesLit >= LINE_COUNT) return;
    dispatch({ type: "light" });
    if (state.linesLit + 1 === LINE_COUNT) {
      later(() => dispatch({ type: "beginQuestions" }), LAST_LINE_PAUSE);
    }
  };

  const answer = useCallback(
    (value: Answer) => {
      if (busy || !task) return;
      dispatch({ type: "select", value: value.value });
      later(() => dispatch({ type: "exitStep" }), SELECT_HOLD);
      later(
        () => dispatch({ type: "answer", answer: value, questionCount: task.questions.length }),
        SELECT_HOLD + STEP_EXIT,
      );
    },
    [busy, task, later],
  );

  const reflect = (reflection: string) => {
    if (busy || !task) return;
    const answers = state.answers;
    const nextIndex = state.taskIndex + 1;
    dispatch({ type: "exitStep" });
    later(() => {
      saveSession({
        taskId: task.id,
        answers,
        reflection,
        completedAt: new Date().toISOString(),
      });
      saveTaskIndex(nextIndex);
      dispatch({ type: "submitReflection" });
    }, STEP_EXIT);
    later(() => dispatch({ type: "nextTask", taskCount: tasks.length }), STEP_EXIT + TASK_LEAVE);
  };

  const restart = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    clearProgress();
    router.push("/");
  };

  const raised =
    state.phase === "questioning" ||
    state.phase === "reflecting" ||
    state.phase === "transitioning";

  const stepStyle = {
    "--delay": `${state.phase === "questioning" && state.questionIndex === 0 ? FIRST_QUESTION_DELAY : 0}ms`,
  } as CSSProperties;

  return (
    <main className={styles.stage} data-ready={state.hydrated || undefined}>
      <CornerNav back />

      {task && state.phase !== "finished" && (
        <section
          key={task.id}
          className={styles.taskLayer}
          data-raised={raised || undefined}
          data-leaving={state.phase === "transitioning" || undefined}
        >
          <div className={styles.taskInner}>
            <p className={styles.counter}>
              {levelName} · {levelPosition} of {levelTasks.length}
            </p>
            <h1 className={styles.title}>{task.title}</h1>
            <ProgressLines
              key={task.id}
              lit={state.linesLit}
              disabled={raised}
              onAdvance={advance}
            />
          </div>
        </section>
      )}

      {state.phase === "questioning" && question && (
        <section className={styles.answerLayer}>
          <div
            key={question.id}
            className={styles.step}
            data-exiting={state.exiting || undefined}
            style={stepStyle}
          >
            <QuestionCard
              question={question}
              selected={state.selected}
              disabled={busy}
              onAnswer={answer}
            />
          </div>
        </section>
      )}

      {state.phase === "reflecting" && (
        <section className={styles.answerLayer}>
          <div key="reflection" className={styles.step} data-exiting={state.exiting || undefined}>
            <ReflectionInput disabled={busy} onSubmit={reflect} />
          </div>
        </section>
      )}

      {state.phase === "finished" && (
        <section className={styles.answerLayer}>
          <div className={`${styles.step} ${styles.finished}`}>
            <h1 className={styles.title}>That&rsquo;s all for today.</h1>
            <button type="button" className={styles.reset} onClick={restart}>
              Start over
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
