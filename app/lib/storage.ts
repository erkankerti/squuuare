export type Answer = {
  questionId: string;
  value: string;
  custom: boolean;
};

export type SessionRecord = {
  taskId: string;
  answers: Answer[];
  reflection: string;
  completedAt: string;
};

export type DraftPhase = "focusing" | "questioning" | "reflecting";

export type Draft = {
  taskIndex: number;
  phase: DraftPhase;
  linesLit: number;
  questionIndex: number;
  answers: Answer[];
  reflection: string;
};

const SESSIONS_KEY = "squuuare:sessions";
const PROGRESS_KEY = "squuuare:taskIndex";
const STARTED_KEY = "squuuare:started";
const DRAFT_KEY = "squuuare:draft";

const DRAFT_PHASES: DraftPhase[] = ["focusing", "questioning", "reflecting"];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota); progress just won't persist.
  }
}

export function loadSessions(): SessionRecord[] {
  return read<SessionRecord[]>(SESSIONS_KEY, []);
}

export function saveSession(record: SessionRecord) {
  write(SESSIONS_KEY, [...loadSessions(), record]);
}

export function loadTaskIndex(): number {
  const value = read<number>(PROGRESS_KEY, 0);
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

export function saveTaskIndex(index: number) {
  write(PROGRESS_KEY, index);
}

const PROGRESS_EVENT = "squuuare:progress";

export function subscribeProgress(onChange: () => void) {
  window.addEventListener(PROGRESS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function hasStarted(): boolean {
  return read<boolean>(STARTED_KEY, false) === true;
}

export function markStarted() {
  write(STARTED_KEY, true);
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

function isAnswer(value: unknown): value is Answer {
  if (typeof value !== "object" || value === null) return false;
  const answer = value as Record<string, unknown>;
  return (
    typeof answer.questionId === "string" &&
    typeof answer.value === "string" &&
    typeof answer.custom === "boolean"
  );
}

export function loadDraft(): Draft | null {
  const value = read<unknown>(DRAFT_KEY, null);
  if (typeof value !== "object" || value === null) return null;
  const draft = value as Record<string, unknown>;
  if (!Number.isInteger(draft.taskIndex) || (draft.taskIndex as number) < 0) return null;
  if (!DRAFT_PHASES.includes(draft.phase as DraftPhase)) return null;
  if (!Number.isInteger(draft.linesLit) || (draft.linesLit as number) < 0) return null;
  if (!Number.isInteger(draft.questionIndex) || (draft.questionIndex as number) < 0) return null;
  if (!Array.isArray(draft.answers) || !draft.answers.every(isAnswer)) return null;
  if (typeof draft.reflection !== "string") return null;
  return {
    taskIndex: draft.taskIndex as number,
    phase: draft.phase as DraftPhase,
    linesLit: draft.linesLit as number,
    questionIndex: draft.questionIndex as number,
    answers: draft.answers as Answer[],
    reflection: draft.reflection,
  };
}

export function saveDraft(draft: Draft) {
  write(DRAFT_KEY, draft);
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(STARTED_KEY);
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {}
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}
