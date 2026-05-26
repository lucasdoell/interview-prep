import type { Question } from "./types";

/**
 * The full question bank. Each attempt draws a balanced random subset
 * (see `selectQuestions`), so repeated practice stays fresh.
 *
 * Three flavors per category:
 *  - concept MCQs that reinforce the idea behind a topic
 *  - spot-the-bug MCQs that pair a snippet with "what's wrong / what fixes it"
 *  - write-the-fix code questions (self-graded against a reference solution)
 */

const react: Question[] = [
  {
    id: "react-keys",
    category: "react",
    type: "mcq",
    difficulty: "easy",
    prompt:
      "Why does React ask for a stable `key` when you render a list with `.map()`?",
    options: [
      {
        id: "a",
        text: "It lets React match items between renders so it can reuse DOM and preserve component state correctly.",
      },
      { id: "b", text: "It improves SEO by labelling each list item." },
      {
        id: "c",
        text: "It is required only for styling list items with CSS.",
      },
      {
        id: "d",
        text: "It tells React the order to run effects in.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Keys give each item a stable identity across renders. Without good keys, React falls back to matching by index, which can reuse the wrong DOM node or component state when the list reorders, inserts, or removes items.",
  },
  {
    id: "react-derived-state",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "You have a `todos` array in state and want to show how many are completed. What is the idiomatic approach?",
    options: [
      {
        id: "a",
        text: "Compute the count during render from `todos` — no extra state needed.",
      },
      {
        id: "b",
        text: "Store `completedCount` in its own `useState` and update it everywhere a todo changes.",
      },
      {
        id: "c",
        text: "Put `completedCount` in a `useRef` and mutate it.",
      },
      {
        id: "d",
        text: "Recalculate it inside a `useEffect` and write it back to state.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Anything you can calculate from existing state or props is derived state — compute it during render (e.g. `todos.filter(t => t.done).length`). Mirroring it into separate state invites bugs where the two fall out of sync.",
  },
  {
    id: "react-setstate-same-value",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "What happens if you call a state setter with a value that is `Object.is`-equal to the current state?",
    options: [
      {
        id: "a",
        text: "React may bail out and skip re-rendering that component.",
      },
      { id: "b", text: "React always re-renders and re-runs every effect." },
      { id: "c", text: "It throws an error about an unnecessary update." },
      {
        id: "d",
        text: "It schedules the update for the next animation frame.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "If the next state is identical (by `Object.is`) to the current state, React can bail out of re-rendering. This is also why mutating an object/array and passing the same reference can fail to trigger a render — the reference didn't change.",
  },
  {
    id: "react-effect-purpose",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which task is an appropriate use of `useEffect`?",
    options: [
      {
        id: "a",
        text: "Subscribing to a browser event or external store and cleaning up on unmount.",
      },
      {
        id: "b",
        text: "Transforming props into the value you render this frame.",
      },
      {
        id: "c",
        text: "Computing a filtered list to display from existing state.",
      },
      {
        id: "d",
        text: "Updating one piece of state whenever another piece of state changes.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Effects are for synchronizing with systems outside React (subscriptions, timers, manual DOM, network). Data you can derive during render shouldn't live in an effect — that just adds an extra render and a chance to desync.",
  },
  {
    id: "react-controlled-input",
    category: "react",
    type: "mcq",
    difficulty: "easy",
    prompt: "What makes an `<input>` a *controlled* component in React?",
    options: [
      {
        id: "a",
        text: "Its `value` is driven by state and updated via `onChange`.",
      },
      { id: "b", text: "It has the `controlled` attribute set." },
      { id: "c", text: "It uses a `ref` to read the DOM value on submit." },
      { id: "d", text: "It is wrapped in a `<form>` element." },
    ],
    correctOptionId: "a",
    explanation:
      "A controlled input's displayed value comes from React state (`value={x}`) and changes flow through `onChange`. An uncontrolled input keeps its own DOM state and you read it via a ref (or `defaultValue`).",
  },
  {
    id: "react-compiler-memo",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "This project has the React Compiler enabled. What does that change about manual `useMemo`/`useCallback`?",
    options: [
      {
        id: "a",
        text: "The compiler auto-memoizes components and values, so most manual memoization becomes unnecessary.",
      },
      {
        id: "b",
        text: "You must wrap every component in `React.memo` for it to work.",
      },
      {
        id: "c",
        text: "`useMemo` and `useCallback` are removed from the API entirely.",
      },
      {
        id: "d",
        text: "It only memoizes server components, never client ones.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "The React Compiler analyzes your components and inserts memoization automatically, so the reflex to scatter `useMemo`/`useCallback` everywhere mostly goes away. You still write idiomatic React; the compiler handles re-render optimization.",
  },
  {
    id: "react-render-triggers",
    category: "react",
    type: "mcq",
    difficulty: "easy",
    prompt: "Which of these does NOT, by itself, cause a component to re-render?",
    options: [
      { id: "a", text: "Mutating a module-level variable it reads from." },
      { id: "b", text: "Its own state changing via a setter." },
      { id: "c", text: "Its parent re-rendering." },
      { id: "d", text: "A subscribed context value changing." },
    ],
    correctOptionId: "a",
    explanation:
      "React re-renders in response to state, props/parent renders, and context changes. Mutating an external variable doesn't notify React, so the UI can silently go stale — that data belongs in state or an external store with a subscription.",
  },
  {
    id: "react-bug-onclick-call",
    category: "react",
    type: "mcq",
    difficulty: "easy",
    prompt: "What's wrong with this button?",
    code: `<button onClick={handleDelete()}>Delete</button>`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "`handleDelete()` runs during render; pass the function itself: `onClick={handleDelete}`.",
      },
      { id: "b", text: "`onClick` should be `onclick` (lowercase)." },
      { id: "c", text: "Buttons can't have click handlers in React." },
      { id: "d", text: "Nothing — this is correct." },
    ],
    correctOptionId: "a",
    explanation:
      "Writing `onClick={handleDelete()}` calls the function while rendering and assigns its return value as the handler. Pass a reference (`onClick={handleDelete}`) or a wrapper (`onClick={() => handleDelete(id)}`).",
  },
  {
    id: "react-bug-conditional-hook",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "Why does this component break the Rules of Hooks?",
    code: `function Profile({ userId }) {
  if (!userId) return <p>Sign in</p>;
  const [name, setName] = useState("");
  // ...
}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "`useState` is called conditionally, so the hook order can change between renders.",
      },
      {
        id: "b",
        text: "You can't return JSX before declaring state.",
      },
      {
        id: "c",
        text: "`useState` must be given a typed initial value.",
      },
      {
        id: "d",
        text: "Components can't take a `userId` prop.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Hooks must run in the same order on every render. The early `return` means `useState` is sometimes skipped, breaking React's index-based hook tracking. Move all hooks above any conditional returns.",
  },
  {
    id: "react-bug-index-key",
    category: "react",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "This list lets users reorder and delete rows. Why can using the array index as `key` cause visible bugs?",
    code: `{rows.map((row, i) => (
  <EditableRow key={i} row={row} />
))}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "When the list reorders, indexes stay 1,2,3… so React reuses the wrong component instances and their internal state (e.g. input text) sticks to the wrong row.",
      },
      {
        id: "b",
        text: "Index keys make the list render twice as slowly.",
      },
      {
        id: "c",
        text: "React forbids numeric keys.",
      },
      {
        id: "d",
        text: "Index keys disable the `row` prop from updating.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Index keys describe position, not identity. After a reorder or deletion, item identities shift but the indexes don't, so React keeps the old component (and its local state) in place. Use a stable id from the data (`key={row.id}`).",
  },
  {
    id: "react-bug-mutate-state",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "Why doesn't the list update on screen after clicking Add?",
    code: `function handleAdd(item) {
  items.push(item);
  setItems(items);
}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "`items` is mutated in place, so the reference is unchanged and React bails out of re-rendering. Create a new array: `setItems([...items, item])`.",
      },
      {
        id: "b",
        text: "`push` returns the new length, which confuses the setter.",
      },
      {
        id: "c",
        text: "You must call `setItems` twice for arrays.",
      },
      {
        id: "d",
        text: "Arrays can't be stored in `useState`.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "React compares the next state to the previous by reference. `push` mutates the same array, so the reference is identical and the render is skipped. Always produce a new value: `setItems([...items, item])`.",
  },
  {
    id: "react-bug-effect-deps",
    category: "react",
    type: "mcq",
    difficulty: "hard",
    prompt: "Why does this effect run on every render?",
    code: `useEffect(() => {
  fetchUser(userId).then(setUser);
}); // <- no dependency array`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "With no dependency array, the effect runs after every render — and `setUser` triggers another render, creating a loop.",
      },
      {
        id: "b",
        text: "`fetchUser` must be wrapped in `useCallback` or it won't run.",
      },
      {
        id: "c",
        text: "`.then` is not allowed inside effects.",
      },
      {
        id: "d",
        text: "Effects only run once regardless of the dependency array.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Omitting the dependency array means the effect fires after every render. Since it sets state, that schedules another render, which re-runs the effect — an infinite loop. Add `[userId]` so it only refetches when the id changes.",
  },
  {
    id: "react-fix-infinite-effect",
    category: "react",
    type: "code",
    difficulty: "medium",
    prompt:
      "This component re-renders forever. Fix the effect so the count is set once on mount (write the corrected `useEffect`).",
    code: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  });

  return <p>{count}</p>;
}`,
    codeLang: "tsx",
    starterCode: `useEffect(() => {
  setCount(count + 1);
});`,
    referenceSolution: `useEffect(() => {
  setCount((c) => c + 1);
}, []); // empty deps -> runs once on mount`,
    explanation:
      "The effect had no dependency array, so it ran after every render and each `setCount` queued another render. Adding `[]` runs it once on mount; the functional updater `(c) => c + 1` avoids depending on the `count` value.",
  },
  {
    id: "react-fix-functional-update",
    category: "react",
    type: "code",
    difficulty: "medium",
    prompt:
      "This interval should increment once per second but gets stuck at 1. Fix it (the effect has `[]` deps and should keep them).",
    code: `useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // always sees count = 0
  }, 1000);
  return () => clearInterval(id);
}, []);`,
    codeLang: "tsx",
    starterCode: `setInterval(() => {
  setCount(count + 1);
}, 1000);`,
    referenceSolution: `setInterval(() => {
  setCount((c) => c + 1); // functional update reads the latest value
}, 1000);`,
    explanation:
      "With `[]` deps the interval closes over `count` from the first render (0) forever, so it sets 0 + 1 every tick. The functional updater `(c) => c + 1` always receives the latest state, fixing the stale-closure bug without re-creating the interval.",
  },
  {
    id: "react-fix-mutation",
    category: "react",
    type: "code",
    difficulty: "easy",
    prompt:
      "Rewrite this so adding a tag actually updates the UI (no direct mutation).",
    code: `function addTag(tag) {
  tags.push(tag);
  setTags(tags);
}`,
    codeLang: "tsx",
    starterCode: `function addTag(tag) {
  tags.push(tag);
  setTags(tags);
}`,
    referenceSolution: `function addTag(tag) {
  setTags([...tags, tag]); // new array reference
}`,
    explanation:
      "`push` mutates the existing array, so its reference is unchanged and React skips the render. Build a fresh array with the spread syntax so React sees a new value.",
  },
  {
    id: "react-fix-key",
    category: "react",
    type: "code",
    difficulty: "easy",
    prompt:
      "Add a correct `key` to this list. Each `user` has a unique `id`.",
    code: `{users.map((user) => (
  <UserRow user={user} />
))}`,
    codeLang: "tsx",
    starterCode: `{users.map((user) => (
  <UserRow user={user} />
))}`,
    referenceSolution: `{users.map((user) => (
  <UserRow key={user.id} user={user} />
))}`,
    explanation:
      "Each sibling in a list needs a stable, unique `key`. Use the data's own id (`user.id`) rather than the array index so identities survive reorders and deletions.",
  },
];

const uiux: Question[] = [
  {
    id: "uiux-hierarchy",
    category: "uiux",
    type: "mcq",
    difficulty: "easy",
    prompt:
      "A screen has a title, body text, and a primary action that all look the same weight. Which change most improves visual hierarchy?",
    options: [
      {
        id: "a",
        text: "Differentiate them with size, weight, color, and spacing so the eye knows what's most important.",
      },
      { id: "b", text: "Center every element on the page." },
      { id: "c", text: "Add a drop shadow to all three." },
      { id: "d", text: "Make all the text uppercase." },
    ],
    correctOptionId: "a",
    explanation:
      "Hierarchy is created by contrast — differences in size, weight, color, and whitespace guide attention in order of importance. When everything looks equally prominent, nothing stands out and users don't know where to look.",
  },
  {
    id: "uiux-feedback",
    category: "uiux",
    type: "mcq",
    difficulty: "easy",
    prompt:
      "A 'Save' button triggers a 2-second network request. What's the best feedback?",
    options: [
      {
        id: "a",
        text: "Immediately show a loading/disabled state on the button, then confirm success or show an error.",
      },
      {
        id: "b",
        text: "Do nothing until the request finishes, then reload the page.",
      },
      {
        id: "c",
        text: "Show an alert dialog saying 'Please wait'.",
      },
      {
        id: "d",
        text: "Disable the whole screen with no indicator.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Every action needs prompt, visible feedback. A loading state on the control reassures users the click registered and prevents double-submits, then a clear success/error result closes the loop.",
  },
  {
    id: "uiux-validation-timing",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt: "When should a form field show a validation error?",
    options: [
      {
        id: "a",
        text: "After the user finishes the field (on blur) or on submit — not aggressively on every keystroke.",
      },
      {
        id: "b",
        text: "On every keystroke from the very first character typed.",
      },
      {
        id: "c",
        text: "Only after the form is submitted to the server.",
      },
      {
        id: "d",
        text: "Never — let the server reject it.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Validating on blur or submit respects the user's flow; flagging an email as invalid while they're still typing the first letters is noisy and stressful. Once a field has an error, switching to live validation as they fix it is a nice touch.",
  },
  {
    id: "uiux-error-message",
    category: "uiux",
    type: "mcq",
    difficulty: "easy",
    prompt: "Which error message is best?",
    options: [
      {
        id: "a",
        text: "\"That card was declined. Check the number and expiry, or try another card.\"",
      },
      { id: "b", text: '"Error 0x80004005."' },
      { id: "c", text: '"Something went wrong."' },
      { id: "d", text: '"Invalid input."' },
    ],
    correctOptionId: "a",
    explanation:
      "Good error messages say what happened, in plain language, and what the user can do next. Generic or codey messages leave people stuck with no path forward.",
  },
  {
    id: "uiux-affordance",
    category: "uiux",
    type: "mcq",
    difficulty: "easy",
    prompt: "What is an 'affordance' in UI design?",
    options: [
      {
        id: "a",
        text: "A visual cue that signals how an element can be used (a button looks pressable, a link looks clickable).",
      },
      { id: "b", text: "The amount of whitespace around an element." },
      { id: "c", text: "The time it takes a screen to load." },
      { id: "d", text: "A premium feature behind a paywall." },
    ],
    correctOptionId: "a",
    explanation:
      "An affordance is a perceived signal of how something works. Buttons that look raised/clickable and links that look tappable let users act without instructions. Flat, ambiguous controls erode this.",
  },
  {
    id: "uiux-jakobs-law",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "Your team wants to put the site logo in the bottom-right and make it scroll the page to the top. What's the UX concern?",
    options: [
      {
        id: "a",
        text: "It violates established conventions — users expect a top-left logo to link home (Jakob's Law).",
      },
      { id: "b", text: "Logos can't be interactive." },
      { id: "c", text: "Bottom-right positions are impossible in CSS." },
      { id: "d", text: "There's no concern; novelty always wins." },
    ],
    correctOptionId: "a",
    explanation:
      "Jakob's Law: users spend most of their time on other sites and expect yours to work the same way. A top-left logo that links home is a strong convention; breaking it for novelty adds friction with little benefit.",
  },
  {
    id: "uiux-fitts",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "On a mobile interface, why should primary tap targets be reasonably large (~44px) and well-spaced?",
    options: [
      {
        id: "a",
        text: "Bigger, well-separated targets are faster and more reliable to hit, reducing mis-taps (Fitts's Law).",
      },
      { id: "b", text: "Large targets always look more modern." },
      { id: "c", text: "It's required for the page to be responsive." },
      { id: "d", text: "Small targets break JavaScript event handling." },
    ],
    correctOptionId: "a",
    explanation:
      "Fitts's Law: time to acquire a target depends on its size and distance. Fingers are imprecise, so tiny or crowded targets cause errors. ~44px with adequate spacing is a common minimum for touch.",
  },
  {
    id: "uiux-progressive-disclosure",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A settings page has 40 rarely-used options. What technique keeps it approachable?",
    options: [
      {
        id: "a",
        text: "Progressive disclosure — show common options first, tuck advanced ones behind 'Advanced' or sections.",
      },
      { id: "b", text: "Put all 40 in one long flat list to be transparent." },
      { id: "c", text: "Randomize their order each visit." },
      { id: "d", text: "Hide all of them and require support to change settings." },
    ],
    correctOptionId: "a",
    explanation:
      "Progressive disclosure reduces cognitive load by surfacing what most people need and deferring the rest. It keeps the default view simple while still making advanced controls reachable.",
  },
  {
    id: "uiux-recognition-recall",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "Why is a visible list of recent files usually better than asking users to type the exact filename from memory?",
    options: [
      {
        id: "a",
        text: "Recognition is easier than recall — showing options offloads memory to the interface.",
      },
      { id: "b", text: "Typing is slower on every keyboard." },
      { id: "c", text: "Recent-file lists improve security." },
      { id: "d", text: "It reduces the number of HTTP requests." },
    ],
    correctOptionId: "a",
    explanation:
      "A core usability heuristic: prefer recognition over recall. Letting users pick from visible choices is far less effortful and error-prone than making them remember and reproduce information.",
  },
  {
    id: "uiux-destructive-confirm",
    category: "uiux",
    type: "mcq",
    difficulty: "easy",
    prompt:
      "What's a good pattern for a 'Delete account' action that can't be undone?",
    options: [
      {
        id: "a",
        text: "Require explicit confirmation (and ideally an undo window or typed confirmation) before destroying data.",
      },
      {
        id: "b",
        text: "Delete instantly on the first click for speed.",
      },
      {
        id: "c",
        text: "Hide the button so nobody clicks it by accident.",
      },
      {
        id: "d",
        text: "Show a 10-second spinner before deleting.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Destructive, irreversible actions need friction proportional to their consequences: a confirmation step, a typed confirmation for high stakes, or an undo grace period. This prevents costly accidental clicks.",
  },
  {
    id: "uiux-perceived-performance",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A dashboard takes ~1.5s to load data. Which approach best improves *perceived* performance?",
    options: [
      {
        id: "a",
        text: "Show skeleton placeholders that mirror the layout while data loads.",
      },
      {
        id: "b",
        text: "Show a blank white screen until everything is ready.",
      },
      { id: "c", text: "Block interaction with a modal spinner." },
      { id: "d", text: "Load nothing until the user clicks 'Refresh'." },
    ],
    correctOptionId: "a",
    explanation:
      "Skeletons set expectations about what's coming and make waits feel shorter and more structured than a blank screen or a lone spinner. Perceived performance is often as important as raw speed.",
  },
  {
    id: "uiux-color-alone",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A form marks invalid fields by turning their border red and nothing else. What's the problem?",
    options: [
      {
        id: "a",
        text: "Color alone isn't enough — add an icon and/or text so colorblind and low-vision users can perceive the error.",
      },
      { id: "b", text: "Red borders are too expensive to render." },
      { id: "c", text: "Borders can't convey state in CSS." },
      { id: "d", text: "There's no problem; red universally means error." },
    ],
    correctOptionId: "a",
    explanation:
      "Roughly 1 in 12 men has some color vision deficiency. Never rely on color as the only signal — pair it with text, an icon, or a pattern so the meaning survives without color perception.",
  },
  {
    id: "uiux-empty-state",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt: "What makes a strong empty state (e.g. a brand-new, empty inbox)?",
    options: [
      {
        id: "a",
        text: "Explain what goes here and offer a clear next action to fill it.",
      },
      { id: "b", text: "Leave the area blank so it looks clean." },
      { id: "c", text: "Show a generic 'No data' string only." },
      { id: "d", text: "Display a 404 page." },
    ],
    correctOptionId: "a",
    explanation:
      "Empty states are an onboarding opportunity. The best ones orient the user (what belongs here) and provide a primary action to get started, instead of a dead-end 'nothing here' message.",
  },
  {
    id: "uiux-bug-disabled-submit",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A signup form keeps the Submit button disabled until the form is valid, but gives no other hints. Why can this frustrate users?",
    options: [
      {
        id: "a",
        text: "Users can't tell what's missing or why they can't proceed — show validation hints and/or enable submit and surface errors on click.",
      },
      {
        id: "b",
        text: "Disabled buttons slow down the page.",
      },
      {
        id: "c",
        text: "Disabling a button is invalid HTML.",
      },
      {
        id: "d",
        text: "It's fine; users enjoy figuring it out.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "A silently disabled submit button is a dead end — the user doesn't know which field is blocking them. Either show clear inline guidance about what's required, or let them submit and reveal the specific errors.",
  },
];

const a11y: Question[] = [
  {
    id: "a11y-semantic-button",
    category: "a11y",
    type: "mcq",
    difficulty: "easy",
    prompt:
      "Why prefer a real `<button>` over a `<div onClick={...}>` for a clickable control?",
    options: [
      {
        id: "a",
        text: "`<button>` is focusable, keyboard-operable (Enter/Space), and announced as a button to assistive tech — for free.",
      },
      {
        id: "b",
        text: "`<div>` elements can't have click handlers.",
      },
      {
        id: "c",
        text: "`<button>` renders faster than `<div>`.",
      },
      {
        id: "d",
        text: "There's no difference; it's purely stylistic.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Native `<button>` comes with keyboard focus, Enter/Space activation, and the correct role/announcement. A clickable `<div>` is invisible to keyboard and screen-reader users unless you re-add `role`, `tabindex`, and key handlers manually.",
  },
  {
    id: "a11y-alt-decorative",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "An image is purely decorative (a background flourish next to a heading). What's the correct `alt`?",
    options: [
      {
        id: "a",
        text: 'An empty alt (`alt=""`) so screen readers skip it.',
      },
      { id: "b", text: 'A description like `alt="decorative swirl"`.' },
      { id: "c", text: "Omit the `alt` attribute entirely." },
      { id: "d", text: 'Use `alt="image"`.' },
    ],
    correctOptionId: "a",
    explanation:
      'Decorative images should have `alt=""` (empty, not missing) so assistive tech ignores them as noise. Informative images need descriptive alt; omitting `alt` entirely makes some screen readers announce the file name.',
  },
  {
    id: "a11y-label-association",
    category: "a11y",
    type: "mcq",
    difficulty: "easy",
    prompt: "What's the most robust way to label a text input?",
    options: [
      {
        id: "a",
        text: "A `<label>` associated via `htmlFor`/`id` (or wrapping the input).",
      },
      { id: "b", text: "A `placeholder` that disappears on focus." },
      { id: "c", text: "Nearby text in a `<div>` with no association." },
      { id: "d", text: "A `title` attribute only." },
    ],
    correctOptionId: "a",
    explanation:
      "A programmatically associated `<label>` is announced by screen readers, expands the click target, and persists while typing. Placeholders aren't labels — they vanish on input and often fail contrast.",
  },
  {
    id: "a11y-contrast",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "What's the WCAG AA minimum contrast ratio for normal-size body text against its background?",
    options: [
      { id: "a", text: "4.5:1" },
      { id: "b", text: "1.5:1" },
      { id: "c", text: "21:1" },
      { id: "d", text: "2:1" },
    ],
    correctOptionId: "a",
    explanation:
      "WCAG 2.x AA requires at least 4.5:1 for normal text and 3:1 for large text (≥24px, or ≥19px bold). Light-gray-on-white placeholder-style text frequently fails this.",
  },
  {
    id: "a11y-keyboard",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which statement about keyboard accessibility is correct?",
    options: [
      {
        id: "a",
        text: "Every interactive element must be reachable and operable by keyboard, with a visible focus indicator.",
      },
      {
        id: "b",
        text: "Removing focus outlines globally is fine as long as it looks cleaner.",
      },
      {
        id: "c",
        text: "Keyboard users can rely on a mouse for complex widgets.",
      },
      {
        id: "d",
        text: "Only forms need to be keyboard accessible.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Keyboard-only and switch users navigate by Tab/arrow keys and need a visible focus ring to know where they are. Never strip `:focus-visible` styling without replacing it; everything clickable must also be keyboard-operable.",
  },
  {
    id: "a11y-aria-first-rule",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "You need a checkbox. Which approach best follows the first rule of ARIA?",
    options: [
      {
        id: "a",
        text: "Use a native `<input type=\"checkbox\">` instead of building one from a `<div>` with ARIA roles.",
      },
      {
        id: "b",
        text: 'Use a `<div role="checkbox">` with custom key handling for full control.',
      },
      {
        id: "c",
        text: "Use a `<span>` and toggle a CSS class.",
      },
      {
        id: "d",
        text: "Use an image of a checkbox.",
      },
    ],
    correctOptionId: "a",
    explanation:
      'The first rule of ARIA: if a native HTML element gives you the semantics and behavior you need, use it rather than repurposing a generic element with ARIA. "No ARIA is better than bad ARIA."',
  },
  {
    id: "a11y-heading-order",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which heading practice supports screen-reader navigation?",
    options: [
      {
        id: "a",
        text: "Use one `<h1>` and don't skip levels — headings describe document structure, not font size.",
      },
      {
        id: "b",
        text: "Pick heading levels purely by how big you want the text.",
      },
      {
        id: "c",
        text: "Use multiple `<h1>`s for every section to be safe.",
      },
      {
        id: "d",
        text: "Avoid headings and style bold `<div>`s instead.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Screen-reader users jump between headings to skim a page, so a logical outline (one h1, then h2/h3 without skipping) matters. Choose levels by meaning and control size with CSS.",
  },
  {
    id: "a11y-live-region",
    category: "a11y",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "After saving, you show a 'Saved!' toast. How do you make sure screen-reader users hear it?",
    options: [
      {
        id: "a",
        text: 'Put the message in an `aria-live="polite"` region so it\'s announced when it appears.',
      },
      {
        id: "b",
        text: "Increase the toast's font size.",
      },
      {
        id: "c",
        text: "Add `tabindex=\"-1\"` and hope focus lands there.",
      },
      {
        id: "d",
        text: "Nothing — screen readers announce all DOM changes automatically.",
      },
    ],
    correctOptionId: "a",
    explanation:
      'Screen readers don\'t announce arbitrary DOM updates. A live region (`aria-live="polite"`, or `role="status"`) tells assistive tech to announce changes to that container without moving focus. Use `assertive` only for urgent messages.',
  },
  {
    id: "a11y-bug-div-button",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "What accessibility problems does this control have?",
    code: `<div className="btn" onClick={openMenu}>
  Menu
</div>`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "It's not focusable or keyboard-operable and isn't announced as a button — use a real `<button>`.",
      },
      {
        id: "b",
        text: "`className` should be `class`.",
      },
      {
        id: "c",
        text: "`onClick` doesn't work on `<div>` elements.",
      },
      {
        id: "d",
        text: "It needs an `alt` attribute.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "A clickable `<div>` can't receive keyboard focus, doesn't respond to Enter/Space, and has no button role. Keyboard and screen-reader users can't use it. Replace it with `<button>` (or, as a last resort, add `role`, `tabIndex`, and key handlers).",
  },
  {
    id: "a11y-bug-placeholder-label",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "Why is this input not accessible?",
    code: `<input type="email" placeholder="Email address" />`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "It has no associated `<label>` — a placeholder isn't a label and disappears once the user types.",
      },
      {
        id: "b",
        text: "`type=\"email\"` isn't a valid input type.",
      },
      {
        id: "c",
        text: "Placeholders are forbidden by HTML.",
      },
      {
        id: "d",
        text: "It needs `autocomplete=\"off\"`.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Placeholder text is not a substitute for a label: it vanishes on input, often has poor contrast, and isn't reliably announced. Add a real `<label>` associated with the input.",
  },
  {
    id: "a11y-bug-icon-button",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "What's missing from this icon-only button?",
    code: `<button onClick={close}>
  <XIcon />
</button>`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: 'An accessible name — add `aria-label="Close"` (the icon alone conveys nothing to screen readers).',
      },
      {
        id: "b",
        text: "A `type` attribute is legally required.",
      },
      {
        id: "c",
        text: "The icon should be a background image.",
      },
      {
        id: "d",
        text: "Nothing — the icon is enough.",
      },
    ],
    correctOptionId: "a",
    explanation:
      'An icon button has no text, so screen readers announce nothing meaningful. Give it an accessible name with `aria-label="Close"` (and hide the decorative icon from the a11y tree with `aria-hidden`).',
  },
  {
    id: "a11y-fix-div-button",
    category: "a11y",
    type: "code",
    difficulty: "easy",
    prompt:
      "Make this control accessible to keyboard and screen-reader users with the simplest correct fix.",
    code: `<div className="card-action" onClick={handleSelect}>
  Select plan
</div>`,
    codeLang: "tsx",
    starterCode: `<div className="card-action" onClick={handleSelect}>
  Select plan
</div>`,
    referenceSolution: `<button type="button" className="card-action" onClick={handleSelect}>
  Select plan
</button>`,
    explanation:
      "Swapping the `<div>` for a `<button>` restores focusability, Enter/Space activation, and the button role with zero extra code. Reach for `role`/`tabIndex`/key-handler workarounds only when a native element truly can't be used.",
  },
  {
    id: "a11y-fix-label",
    category: "a11y",
    type: "code",
    difficulty: "easy",
    prompt:
      "Associate a visible label with this input so screen readers announce it.",
    code: `<input id="email" type="email" />`,
    codeLang: "tsx",
    starterCode: `<input id="email" type="email" />`,
    referenceSolution: `<label htmlFor="email">Email address</label>
<input id="email" type="email" />`,
    explanation:
      "A `<label htmlFor=\"email\">` tied to `<input id=\"email\">` is announced by assistive tech and makes the label text a click target for the field. (In React it's `htmlFor`, not `for`.)",
  },
  {
    id: "a11y-fix-img-alt",
    category: "a11y",
    type: "code",
    difficulty: "easy",
    prompt:
      "This informative image (a product photo) is missing alt text. Add appropriate alt.",
    code: `<img src="/red-sneaker.jpg" />`,
    codeLang: "tsx",
    starterCode: `<img src="/red-sneaker.jpg" />`,
    referenceSolution: `<img src="/red-sneaker.jpg" alt="Red high-top canvas sneaker, side view" />`,
    explanation:
      "Informative images need concise, descriptive alt text that conveys their meaning. Avoid 'image of…' filler and the file name; describe what matters about the picture.",
  },
  {
    id: "a11y-fix-icon-button",
    category: "a11y",
    type: "code",
    difficulty: "medium",
    prompt:
      "Give this icon-only button an accessible name and hide the decorative icon from assistive tech.",
    code: `<button onClick={toggleMenu}>
  <MenuIcon />
</button>`,
    codeLang: "tsx",
    starterCode: `<button onClick={toggleMenu}>
  <MenuIcon />
</button>`,
    referenceSolution: `<button onClick={toggleMenu} aria-label="Open menu">
  <MenuIcon aria-hidden="true" />
</button>`,
    explanation:
      "`aria-label` supplies the name screen readers announce, and `aria-hidden` keeps the decorative icon from adding noise. Now the control is meaningful without any visible text.",
  },
];

export const QUESTION_BANK: Question[] = [...react, ...uiux, ...a11y];
