"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef, type CSSProperties } from "react";
import { levels, type FocusTask } from "@/app/data/tasks";
import {
  clearDraft,
  clearProgress,
  loadDraft,
  loadTaskIndex,
  markStarted,
  saveDraft,
  saveSession,
  saveTaskIndex,
  type Answer,
  type Draft,
  type DraftPhase,
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
  resumed: boolean;
  phase: Phase;
  taskIndex: number;
  linesLit: number;
  questionIndex: number;
  answers: Answer[];
  reflection: string;
  selected: string | null;
  exiting: boolean;
};

type Action =
  | { type: "hydrate"; taskIndex: number; draft: Draft | null; taskCount: number; tasks: FocusTask[] }
  | { type: "light" }
  | { type: "beginQuestions" }
  | { type: "select"; value: string }
  | { type: "exitStep" }
  | { type: "answer"; answer: Answer; questionCount: number }
  | { type: "draftReflection"; value: string }
  | { type: "submitReflection" }
  | { type: "nextTask"; taskCount: number };

const freshTask = {
  phase: "focusing" as const,
  linesLit: 0,
  questionIndex: 0,
  answers: [],
  reflection: "",
  selected: null,
  exiting: false,
  resumed: false,
} satisfies Partial<State>;

const initialState: State = { hydrated: false, taskIndex: 0, ...freshTask };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fromDraft(draft: Draft, task: FocusTask): Pick<
  State,
  "phase" | "linesLit" | "questionIndex" | "answers" | "reflection" | "resumed"
> {
  const questionCount = task.questions.length;
  let phase: DraftPhase = draft.phase;
  let questionIndex = clamp(draft.questionIndex, 0, questionCount);
  let linesLit = clamp(draft.linesLit, 0, LINE_COUNT);

  if (phase === "questioning" && questionIndex >= questionCount) {
    phase = "reflecting";
  }
  if (phase === "focusing" && linesLit >= LINE_COUNT) {
    phase = "questioning";
    questionIndex = Math.min(questionIndex, Math.max(questionCount - 1, 0));
  }
  if (phase === "questioning" || phase === "reflecting") {
    linesLit = LINE_COUNT;
  }

  return {
    phase,
    linesLit,
    questionIndex,
    answers: draft.answers,
    reflection: draft.reflection,
    resumed: true,
  };
}

function toDraft(state: State): Draft | null {
  if (!state.hydrated || state.phase === "finished") return null;
  if (state.phase === "transitioning") {
    return {
      taskIndex: state.taskIndex + 1,
      phase: "focusing",
      linesLit: 0,
      questionIndex: 0,
      answers: [],
      reflection: "",
    };
  }
  return {
    taskIndex: state.taskIndex,
    phase: state.phase,
    linesLit: state.linesLit,
    questionIndex: state.questionIndex,
    answers: state.answers,
    reflection: state.reflection,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": {
      const taskIndex = Math.min(action.taskIndex, action.taskCount);
      if (taskIndex >= action.taskCount) {
        return { ...state, hydrated: true, taskIndex, phase: "finished" };
      }
      const task = action.tasks[taskIndex];
      const draft = action.draft?.taskIndex === taskIndex ? action.draft : null;
      return {
        ...state,
        hydrated: true,
        taskIndex,
        ...(draft && task ? fromDraft(draft, task) : freshTask),
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
    case "draftReflection":
      return { ...state, reflection: action.value };
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
  const latest = useRef(state);
  const heldDraft = useRef<Draft | null>(null);
  const router = useRouter();
  latest.current = state;

  const persist = useCallback((next = latest.current) => {
    const draft = heldDraft.current ?? toDraft(next);
    if (draft) saveDraft(draft);
    else clearDraft();
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    markStarted();
    dispatch({
      type: "hydrate",
      taskIndex: loadTaskIndex(),
      draft: loadDraft(),
      taskCount: tasks.length,
      tasks,
    });
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, [tasks]);

  useEffect(() => {
    if (!state.hydrated) return;
    persist(state);
  }, [
    persist,
    state.hydrated,
    state.phase,
    state.taskIndex,
    state.linesLit,
    state.questionIndex,
    state.answers,
    state.reflection,
  ]);

  useEffect(() => {
    const flush = () => persist();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [persist]);

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
      const answers = [...state.answers, value];
      const questionIndex = state.questionIndex + 1;
      heldDraft.current = {
        taskIndex: state.taskIndex,
        phase: questionIndex >= task.questions.length ? "reflecting" : "questioning",
        linesLit: LINE_COUNT,
        questionIndex,
        answers,
        reflection: "",
      };
      persist();
      dispatch({ type: "select", value: value.value });
      later(() => dispatch({ type: "exitStep" }), SELECT_HOLD);
      later(() => {
        heldDraft.current = null;
        dispatch({ type: "answer", answer: value, questionCount: task.questions.length });
      }, SELECT_HOLD + STEP_EXIT);
    },
    [busy, task, later, persist, state.answers, state.questionIndex, state.taskIndex],
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
    "--delay": `${
      state.phase === "questioning" && state.questionIndex === 0 && !state.resumed
        ? FIRST_QUESTION_DELAY
        : 0
    }ms`,
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
            <ReflectionInput
              value={state.reflection}
              disabled={busy}
              onChange={(value) => dispatch({ type: "draftReflection", value })}
              onSubmit={reflect}
            />
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
