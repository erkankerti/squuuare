export type Question = {
  id: string;
  prompt: string;
  options: string[];
  allowFreeform: boolean;
};

export type LevelId = "spark" | "steady" | "deep";

export type Level = {
  id: LevelId;
  name: string;
  description: string;
};

export type FocusTask = {
  id: string;
  level: LevelId;
  title: string;
  questions: Question[];
};

export const levels: Level[] = [
  {
    id: "spark",
    name: "Spark",
    description:
      "5 to 10 minutes, almost no willpower needed. For warming up, low-energy days, or getting unstuck. Builds momentum, not output.",
  },
  {
    id: "steady",
    name: "Steady",
    description:
      "15 to 30 minutes of focused effort with light thinking. A clear finish line and a sense of real progress.",
  },
  {
    id: "deep",
    name: "Deep",
    description:
      "45 to 90 minutes of sustained focus. The meaningful, often-avoided work that changes your week.",
  },
];

function q(id: string, prompt: string, options: string[]): Question {
  return { id, prompt, options, allowFreeform: true };
}

function task(level: LevelId, id: string, title: string, questions: Question[]): FocusTask {
  return { id, level, title, questions };
}

const spark: FocusTask[] = [
  task("spark", "drink-water", "Drink a full glass of water", [
    q("water-feel", "How do you feel now?", ["Refreshed", "About the same"]),
    q("water-habit", "Do you drink enough most days?", ["Yes", "Sometimes", "No"]),
  ]),
  task("spark", "clear-desk", "Clear your desk surface", [
    q("clear-desk-duration", "How long did it take?", ["Under 2 min", "2 to 5 min", "Longer"]),
    q("clear-desk-start", "Does it feel easier to start now?", ["Yes", "No"]),
  ]),
  task("spark", "close-tabs", "Close every tab you don't need", [
    q("tabs-count", "How many did you close?", ["A few", "A lot", "Almost all"]),
    q("tabs-letgo", "Was anything hard to let go of?", ["Yes", "No"]),
  ]),
  task("spark", "three-things", "Write down three things on your mind", [
    q("three-help", "Did writing them down help?", ["Yes", "A little", "No"]),
    q("three-urgent", "Is one of them urgent?", ["Yes", "No"]),
  ]),
  task("spark", "stretch-five", "Stretch for five minutes", [
    q("stretch-five-where", "Where did you feel it most?", ["Neck and shoulders", "Back", "Legs"]),
    q("stretch-five-energy", "Energy afterwards?", ["Higher", "Same", "Lower"]),
  ]),
  task("spark", "quick-reply", "Reply to one quick message", [
    q("quick-reply-wait", "How long had it been waiting?", ["Hours", "Days", "Longer"]),
    q("quick-reply-ease", "Was it easier than expected?", ["Yes", "No"]),
  ]),
  task("spark", "delete-photos", "Delete 20 old photos or screenshots", [
    q("photos-choose", "Was it hard to choose?", ["Yes", "No"]),
    q("photos-more", "Will you keep going another time?", ["Yes", "Maybe", "No"]),
  ]),
  task("spark", "fresh-air", "Step outside for five minutes of fresh air", [
    q("air-notice", "What did you notice?", ["The air", "Sounds", "Nothing in particular"]),
    q("air-clear", "Do you feel clearer?", ["Yes", "A little", "No"]),
  ]),
  task("spark", "put-away-pile", "Put away one pile that's been sitting out", [
    q("pile-age", "How long had it been there?", ["Days", "Weeks", "Longer"]),
    q("pile-lighter", "Does the space feel lighter?", ["Yes", "No"]),
  ]),
  task("spark", "unsubscribe", "Unsubscribe from five newsletters", [
    q("unsub-find", "Was it easy to find five?", ["Easily", "Barely", "Found more"]),
    q("unsub-almost", "Any you almost kept?", ["Yes", "No"]),
  ]),
  task("spark", "one-sentence", "Write one sentence about how you feel", [
    q("sentence-name", "Was it easy to name the feeling?", ["Yes", "Took a moment", "Not really"]),
    q("sentence-weight", "How would you describe it?", ["Light", "Mixed", "Heavy"]),
  ]),
  task("spark", "plan-meal", "Plan your next meal", [
    q("meal-choice", "What did you choose?", ["Home-cooked", "Something quick", "Eating out"]),
    q("meal-ready", "Do you have what you need?", ["Yes", "Need to shop"]),
  ]),
];

const steady: FocusTask[] = [
  task("steady", "inbox-zero", "Clear your inbox to zero", [
    q("inbox-handling", "How did you handle most emails?", ["Archived", "Replied", "Deferred"]),
    q("inbox-distraction", "Did anything pull you off track?", ["Yes", "No"]),
  ]),
  task("steady", "write-300", "Write 300 words of anything", [
    q("write-flow", "How did the words come?", ["Easily", "In bursts", "Forced"]),
    q("write-keep", "Will you keep this piece?", ["Yes", "Maybe", "No"]),
    q("write-edit", "Did you edit while writing?", ["Yes", "No"]),
  ]),
  task("steady", "plan-tomorrow", "Plan tomorrow's top 3 priorities", [
    q("plan-confidence", "How confident are you in them?", ["Very", "Somewhat", "Not really"]),
    q("plan-cut", "Did you cut anything?", ["Yes", "No"]),
  ]),
  task("steady", "phone-free-walk", "Take a 20-minute walk without your phone", [
    q("walk-mind", "Where did your mind go?", ["Wandered", "Stayed present", "Problem-solved"]),
    q("walk-urge", "Did you want to reach for your phone?", ["Often", "Once or twice", "Never"]),
  ]),
  task("steady", "read-chapter", "Read one chapter of a book", [
    q("read-focus", "How focused were you?", ["Fully", "Mostly", "Barely"]),
    q("read-notes", "Did you take notes?", ["Yes", "No"]),
    q("read-recommend", "Would you recommend it?", ["Yes", "Not yet", "No"]),
  ]),
  task("steady", "reply-message", "Reply to the message you've been putting off", [
    q("reply-feel", "How do you feel now?", ["Relieved", "Neutral", "Anxious"]),
    q("reply-length", "Was it shorter than you thought?", ["Yes", "No"]),
  ]),
  task("steady", "review-spending", "Review your week's spending", [
    q("spend-surprise", "Any surprises?", ["Yes", "No"]),
    q("spend-feel", "How do you feel about it?", ["Good", "Okay", "Concerned"]),
    q("spend-change", "Will you change something?", ["Yes", "Maybe", "No"]),
  ]),
  task("steady", "tidy-room", "Tidy one room", [
    q("room-which", "Which room?", ["Bedroom", "Kitchen", "Living space"]),
    q("room-feel", "Does the room feel different?", ["Yes", "A little", "No"]),
  ]),
  task("steady", "sketch-idea", "Sketch an idea on paper", [
    q("sketch-clarity", "Did the idea get clearer?", ["Much clearer", "A bit", "Not really"]),
    q("sketch-next", "What's next for it?", ["Build it", "Park it"]),
  ]),
  task("steady", "learn-something", "Learn something new for 20 minutes", [
    q("learn-format", "What format did you use?", ["Video", "Reading", "Hands-on"]),
    q("learn-retention", "How much stuck?", ["A lot", "Some", "Little"]),
  ]),
  task("steady", "call-someone", "Call someone you've been meaning to call", [
    q("call-gap", "How long since you last talked?", ["Weeks", "Months", "Longer"]),
    q("call-again", "Will you call again soon?", ["Yes", "Maybe", "No"]),
  ]),
  task("steady", "cook-meal", "Cook a simple meal from scratch", [
    q("cook-result", "How did it turn out?", ["Great", "Fine", "Not great"]),
    q("cook-again", "Would you make it again?", ["Yes", "No"]),
  ]),
];

const deep: FocusTask[] = [
  task("deep", "deep-work-hour", "Work on your most important project for an hour, uninterrupted", [
    q("deep-interruptions", "How often did you get pulled away?", ["Never", "Once or twice", "Often"]),
    q("deep-progress", "How much moved forward?", ["A lot", "Some", "Little"]),
  ]),
  task("deep", "fix-bug", "Fix the problem you've been avoiding", [
    q("bug-avoid", "Why were you avoiding it?", ["Unclear cause", "Boring", "Scary"]),
    q("bug-reality", "Was it as bad as expected?", ["Worse", "Same", "Easier"]),
  ]),
  task("deep", "full-draft", "Write a full draft of something you've been putting off", [
    q("draft-complete", "How complete is the draft?", ["Done", "Mostly", "Halfway"]),
    q("draft-hardest", "What was the hardest part?", ["Starting", "The middle", "Finishing"]),
  ]),
  task("deep", "plan-month", "Plan the next month: goals, dates, and first steps", [
    q("month-clarity", "How clear do the next weeks feel?", ["Very", "Somewhat", "Still foggy"]),
    q("month-dates", "Did you set dates?", ["Yes", "Some", "No"]),
  ]),
  task("deep", "full-budget", "Do a full budget: income, spending, and savings", [
    q("budget-surprise", "Did the numbers surprise you?", ["Yes", "A little", "No"]),
    q("budget-room", "Is there room to save?", ["Yes", "Some", "Not yet"]),
  ]),
  task("deep", "hard-conversation", "Have the hard conversation you've been delaying", [
    q("talk-went", "How did it go?", ["Better than expected", "As expected", "Harder"]),
    q("talk-resolved", "Is it resolved?", ["Yes", "Partly", "No"]),
  ]),
  task("deep", "declutter-space", "Declutter one whole space, like a closet, a set of drawers, or a corner", [
    q("declutter-amount", "How much did you clear?", ["A lot", "Some", "A little"]),
    q("declutter-where", "Where is it going?", ["Donate", "Throw away", "Both"]),
  ]),
  task("deep", "read-50", "Read 50 pages without checking your phone", [
    q("read50-phone", "How often did you reach for your phone?", ["Never", "Once or twice", "Often"]),
    q("read50-absorbed", "Did you get lost in it?", ["Yes", "At times", "No"]),
  ]),
  task("deep", "practice-skill", "Practice a skill hands-on for an hour", [
    q("skill-kind", "What kind of skill?", ["Creative", "Physical", "Technical"]),
    q("skill-feel", "How did it feel by the end?", ["Easier", "Same", "Harder"]),
  ]),
  task("deep", "exercise-45", "Exercise for 45 minutes", [
    q("exercise-type", "What did you do?", ["Cardio", "Strength", "Mixed"]),
    q("exercise-feel", "How do you feel now?", ["Energized", "Tired", "Both"]),
  ]),
  task("deep", "finish-ninety", "Finish the task that's been 90% done for weeks", [
    q("ninety-block", "What was blocking it?", ["A small detail", "Waiting on someone", "Lost interest"]),
    q("ninety-close", "How does it feel to close it?", ["Relieved", "Proud", "Neutral"]),
  ]),
  task("deep", "future-letter", "Write a letter to your future self about where you're headed", [
    q("letter-topic", "What did you write about most?", ["Goals", "Feelings", "Advice"]),
    q("letter-when", "When will you read it?", ["In a few months", "In a year", "Not sure"]),
  ]),
];

export const tasks: FocusTask[] = [...spark, ...steady, ...deep];
