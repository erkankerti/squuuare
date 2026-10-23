export type Question = {
  id: string;
  prompt: string;
  options: string[];
  allowFreeform: boolean;
};

export type FocusTask = {
  id: string;
  title: string;
  questions: Question[];
};

function q(id: string, prompt: string, options: string[]): Question {
  return { id, prompt, options, allowFreeform: true };
}

export const tasks: FocusTask[] = [
  {
    id: "inbox-zero",
    title: "Clear your inbox to zero",
    questions: [
      q("inbox-handling", "How did you handle most emails?", ["Archived", "Replied", "Deferred"]),
      q("inbox-distraction", "Did anything pull you off track?", ["Yes", "No"]),
    ],
  },
  {
    id: "write-300",
    title: "Write 300 words of anything",
    questions: [
      q("write-flow", "How did the words come?", ["Easily", "In bursts", "Forced"]),
      q("write-keep", "Will you keep this piece?", ["Yes", "Maybe", "No"]),
      q("write-edit", "Did you edit while writing?", ["Yes", "No"]),
    ],
  },
  {
    id: "plan-tomorrow",
    title: "Plan tomorrow's top 3 priorities",
    questions: [
      q("plan-confidence", "How confident are you in them?", ["Very", "Somewhat", "Not really"]),
      q("plan-cut", "Did you cut anything?", ["Yes", "No"]),
    ],
  },
  {
    id: "tidy-desk",
    title: "Tidy your desk",
    questions: [
      q("desk-duration", "How long did it take?", ["Under 5 min", "5 to 15 min", "Longer"]),
      q("desk-feel", "Does the space feel different?", ["Yes", "No"]),
    ],
  },
  {
    id: "phone-free-walk",
    title: "Take a 10-minute walk without your phone",
    questions: [
      q("walk-mind", "Where did your mind go?", ["Wandered", "Stayed present", "Problem-solved"]),
      q("walk-urge", "Did you want to reach for your phone?", ["Often", "Once or twice", "Never"]),
    ],
  },
  {
    id: "read-chapter",
    title: "Read one chapter of a book",
    questions: [
      q("read-focus", "How focused were you?", ["Fully", "Mostly", "Barely"]),
      q("read-notes", "Did you take notes?", ["Yes", "No"]),
      q("read-recommend", "Would you recommend it?", ["Yes", "Not yet", "No"]),
    ],
  },
  {
    id: "fix-bug",
    title: "Fix one small bug you've been avoiding",
    questions: [
      q("bug-avoid", "Why were you avoiding it?", ["Unclear cause", "Boring", "Scary"]),
      q("bug-reality", "Was it as bad as expected?", ["Worse", "Same", "Easier"]),
    ],
  },
  {
    id: "reply-message",
    title: "Reply to the message you've been putting off",
    questions: [
      q("reply-feel", "How do you feel now?", ["Relieved", "Neutral", "Anxious"]),
      q("reply-length", "Was it shorter than you thought?", ["Yes", "No"]),
    ],
  },
  {
    id: "water-stretch",
    title: "Drink a glass of water and stretch for 5 minutes",
    questions: [
      q("stretch-energy", "Energy afterwards?", ["Higher", "Same", "Lower"]),
      q("stretch-habit", "Make it a habit?", ["Yes", "No"]),
    ],
  },
  {
    id: "review-spending",
    title: "Review your week's spending",
    questions: [
      q("spend-surprise", "Any surprises?", ["Yes", "No"]),
      q("spend-feel", "How do you feel about it?", ["Good", "Okay", "Concerned"]),
      q("spend-change", "Will you change something?", ["Yes", "Maybe", "No"]),
    ],
  },
  {
    id: "sketch-idea",
    title: "Sketch an idea on paper",
    questions: [
      q("sketch-clarity", "Did the idea get clearer?", ["Much clearer", "A bit", "Not really"]),
      q("sketch-next", "What's next for it?", ["Build it", "Park it"]),
    ],
  },
  {
    id: "learn-something",
    title: "Spend 15 minutes learning something new",
    questions: [
      q("learn-format", "What format did you use?", ["Video", "Reading", "Hands-on"]),
      q("learn-retention", "How much stuck?", ["A lot", "Some", "Little"]),
    ],
  },
];
