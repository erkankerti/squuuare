"use client";

import panel from "./Panel.module.css";
import styles from "./QuestionCard.module.css";

type Props = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: (reflection: string) => void;
};

export function ReflectionInput({ value, disabled, onChange, onSubmit }: Props) {
  const trimmed = value.trim();

  const submit = () => {
    if (disabled || !trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className={styles.card}>
      <label className={panel.prompt} htmlFor="reflection">
        How did it go?
      </label>
      <div className={panel.unit}>
        <textarea
          id="reflection"
          className={panel.textarea}
          value={value}
          placeholder="A few words about the experience"
          autoFocus
          disabled={disabled}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
        />
        <div className={panel.footer}>
          <span>Enter to finish, Shift+Enter for a new line</span>
          <button
            type="button"
            className={panel.submit}
            disabled={disabled || !trimmed}
            onClick={submit}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
