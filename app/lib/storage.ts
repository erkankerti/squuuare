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

const SESSIONS_KEY = "squuuare:sessions";
const PROGRESS_KEY = "squuuare:taskIndex";
const STARTED_KEY = "squuuare:started";

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

export function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY);
    window.localStorage.removeItem(STARTED_KEY);
  } catch {}
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}
