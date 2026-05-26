import type {
  CodeQuestion,
  MultipleChoiceQuestion,
  Question,
} from "./types";

/** A question literal before its `topic` is attached (see TOPIC_BY_ID below). */
type QuestionDraft =
  | Omit<MultipleChoiceQuestion, "topic">
  | Omit<CodeQuestion, "topic">;

/**
 * The full question bank. Each attempt draws a balanced random subset
 * (see `selectQuestions`), which also shuffles option order so the correct
 * answer isn't positionally predictable.
 *
 * Distractors are written to be *plausible* — real misconceptions or
 * defensible-but-worse choices — so questions test understanding rather than
 * spotting the one serious option among jokes.
 *
 * Three flavors per category:
 *  - concept MCQs that reinforce the idea behind a topic
 *  - spot-the-bug MCQs that pair a snippet with "what's wrong / what fixes it"
 *  - write-the-fix code questions (self-graded against a reference solution)
 */

const react: QuestionDraft[] = [
  {
    id: "react-keys",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "What does a stable `key` actually do for a list rendered with `.map()`?",
    options: [
      {
        id: "a",
        text: "Gives each item a stable identity so React can match elements across renders and preserve their state.",
      },
      {
        id: "b",
        text: "Tells React it can skip re-rendering an item whose `key` didn't change, like built-in memoization.",
      },
      {
        id: "c",
        text: "Only silences the console warning — it has no effect on what the DOM does at runtime.",
      },
      {
        id: "d",
        text: "Sets the DOM `id` of each rendered element so you can query it later.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Keys are about identity, not memoization or DOM ids. They let React tell which item is which between renders, so it reuses the right DOM nodes and keeps each item's component state attached to the correct data when the list changes order.",
  },
  {
    id: "react-derived-state",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "You have a `todos` array in state and need the count of completed ones. What's the best approach?",
    options: [
      {
        id: "a",
        text: "Compute it during render from `todos` (e.g. `todos.filter(t => t.done).length`).",
      },
      {
        id: "b",
        text: "Keep a `completedCount` state and update it in the same handler that toggles a todo.",
      },
      {
        id: "c",
        text: "Recompute it in a `useEffect([todos])` and store the result back in state.",
      },
      {
        id: "d",
        text: "Store it in a `useRef` and mutate `ref.current` whenever a todo changes.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "The count is derived data — fully determined by `todos`. Computing it during render means it can never drift out of sync. Mirroring it into separate state or an effect adds a source of truth to keep aligned (and an extra render), which is where bugs creep in.",
  },
  {
    id: "react-setstate-same-value",
    category: "react",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "You call a state setter with a value that is `Object.is`-equal to the current state. What can React do?",
    options: [
      {
        id: "a",
        text: "Bail out and skip re-rendering this component for that update.",
      },
      {
        id: "b",
        text: "Re-render once, then bail out of any further renders that value triggers.",
      },
      {
        id: "c",
        text: "Re-render the component but skip running its effects.",
      },
      {
        id: "d",
        text: "Throw a development warning about an unnecessary state update.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "If the next state is identical by `Object.is`, React may bail out of the render entirely. This is also why mutating an object/array and passing the same reference can fail to update the UI — the reference didn't change, so React sees 'no change'.",
  },
  {
    id: "react-effect-purpose",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which of these is genuinely a job for `useEffect`?",
    options: [
      {
        id: "a",
        text: "Subscribing to a browser event or external store, and unsubscribing on cleanup.",
      },
      {
        id: "b",
        text: "Recomputing a filtered list to display whenever the source data changes.",
      },
      {
        id: "c",
        text: "Keeping a derived total in state, updated whenever its inputs change.",
      },
      {
        id: "d",
        text: "Resetting a form's local state when its `key`-less parent re-renders.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Effects are for synchronizing with systems outside React — subscriptions, timers, manual DOM, the network. Filtering and totals are derived data you should compute during render; storing them via effects just adds a render and a chance to desync.",
  },
  {
    id: "react-controlled-input",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which describes a *controlled* `<input>`?",
    options: [
      {
        id: "a",
        text: "Its displayed `value` comes from state and every change flows through `onChange`.",
      },
      {
        id: "b",
        text: "It uses `defaultValue` for the initial text and you read the current value from a ref.",
      },
      {
        id: "c",
        text: "It keeps its value in the DOM and syncs to React state only on blur.",
      },
      {
        id: "d",
        text: "It has an `onChange` handler but lets the browser manage the displayed value.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Controlled means React state is the single source of truth: `value={state}` plus `onChange`. Option B describes an *uncontrolled* input. C and D are hybrids that drift, because the DOM and React can disagree about the current value.",
  },
  {
    id: "react-compiler-memo",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "This project has the React Compiler enabled. What's the most accurate effect on `useMemo`/`useCallback`?",
    options: [
      {
        id: "a",
        text: "It auto-memoizes components and values, so most manual `useMemo`/`useCallback` becomes unnecessary.",
      },
      {
        id: "b",
        text: "It only helps if you also wrap each component in `React.memo`; on its own it does nothing.",
      },
      {
        id: "c",
        text: "It memoizes values, but you still need `useCallback` on every function passed to a child.",
      },
      {
        id: "d",
        text: "It compiles `useState` into signals, so updating state no longer triggers re-renders.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "The compiler analyzes your components and inserts memoization for you, so the habit of scattering `useMemo`/`useCallback` mostly goes away. It doesn't require `React.memo`, and it doesn't change React's fundamental state-and-render model.",
  },
  {
    id: "react-ref-no-rerender",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "Which change will NOT, on its own, schedule a re-render of the component?",
    options: [
      {
        id: "a",
        text: "Mutating an object held in a ref, e.g. `ref.current.x = 1`.",
      },
      { id: "b", text: "Calling a `useState` setter with a new value." },
      { id: "c", text: "A subscribed `useContext` value changing." },
      { id: "d", text: "Receiving a new prop value from the parent." },
    ],
    correctOptionId: "a",
    explanation:
      "Refs are an escape hatch from the render cycle: writing to `ref.current` never triggers a render. State updates, context changes, and new props all do. That's exactly why a ref is the right place for a `setInterval` id or other mutable value you don't render.",
  },
  {
    id: "react-bug-onclick-call",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "What's the bug here?",
    code: `<button onClick={handleDelete()}>Delete</button>`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "`handleDelete()` is called during render; pass the function: `onClick={handleDelete}` (or `() => handleDelete()`).",
      },
      {
        id: "b",
        text: "`handleDelete` must be wrapped in `useCallback`, or it's recreated every render and the click misfires.",
      },
      {
        id: "c",
        text: "The button needs `type=\"button\"`, otherwise the handler never runs.",
      },
      {
        id: "d",
        text: "Inline handlers in JSX must be arrow functions; a named reference won't bind correctly.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "`onClick={handleDelete()}` invokes the function while rendering and assigns its return value as the handler. Pass a reference (`onClick={handleDelete}`) or wrap it (`onClick={() => handleDelete(id)}`). `useCallback` and `type` are unrelated to this bug.",
  },
  {
    id: "react-bug-conditional-hook",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "Why does this component violate the Rules of Hooks?",
    code: `function Profile({ userId }) {
  if (!userId) return <p>Sign in</p>;
  const [name, setName] = useState("");
  // ...
}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "`useState` runs conditionally, so the number/order of hooks can change between renders.",
      },
      {
        id: "b",
        text: "A component may not `return` before all of its hooks have been declared, in any case.",
      },
      {
        id: "c",
        text: "`useState` must be given an initial value whose type matches the `userId` prop.",
      },
      {
        id: "d",
        text: "Early returns must render `null`, never JSX, or React loses track of state.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "React tracks hooks by call order, assuming the same hooks run every render. The early `return` skips `useState` when `userId` is falsy, shifting the order. Move hooks above any conditional return — the early return itself is fine once hooks come first.",
  },
  {
    id: "react-bug-index-key",
    category: "react",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "Users can reorder and delete these rows, each of which has its own input. Why can an index `key` cause visible bugs?",
    code: `{rows.map((row, i) => (
  <EditableRow key={i} row={row} />
))}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "Indexes track position, not identity — after a reorder/delete, React reuses the wrong instances and their local state (e.g. input text) sticks to the wrong row.",
      },
      {
        id: "b",
        text: "Index keys force the entire list to re-render on every change, which corrupts input state.",
      },
      {
        id: "c",
        text: "React coerces numeric keys to strings, and the mismatch drops the `row` prop updates.",
      },
      {
        id: "d",
        text: "`key` can't be derived from the second `.map()` argument, so React ignores it.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "When the list reorders or an item is removed, the indexes stay 0,1,2… but the data behind them shifts. React matches by key, so it keeps the old component (and its uncontrolled input state) in the old position. Use a stable id from the data: `key={row.id}`.",
  },
  {
    id: "react-bug-mutate-state",
    category: "react",
    type: "mcq",
    difficulty: "medium",
    prompt: "Why doesn't the list update on screen after Add is clicked?",
    code: `function handleAdd(item) {
  items.push(item);
  setItems(items);
}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "`items` is mutated in place, so the reference is unchanged and React bails on the render. Use `setItems([...items, item])`.",
      },
      {
        id: "b",
        text: "`push` returns the new length, so `setItems` ends up storing a number, not the array.",
      },
      {
        id: "c",
        text: "State updates are asynchronous, so you must `await setItems(...)` before the UI reflects it.",
      },
      {
        id: "d",
        text: "Array state requires the functional form `setItems(prev => prev)` to register a change.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "React compares next vs. previous state by reference. `push` mutates the same array, so the reference matches and the render is skipped. The fix is a new array: `setItems([...items, item])`. (`setItems` is given the array, not `push`'s return value.)",
  },
  {
    id: "react-bug-effect-deps",
    category: "react",
    type: "mcq",
    difficulty: "hard",
    prompt: "Why does this effect run on every render (and loop)?",
    code: `useEffect(() => {
  fetchUser(userId).then(setUser);
}); // no dependency array`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "With no dependency array it runs after every render; `setUser` causes a render, which re-runs it — a loop. Add `[userId]`.",
      },
      {
        id: "b",
        text: "`setUser` is a new function each render, so the effect sees a changed dependency and re-fires.",
      },
      {
        id: "c",
        text: "The effect callback must be `async` to await `fetchUser`; without that React retries it every frame.",
      },
      {
        id: "d",
        text: "The dependency array is missing `user`, so React can't tell the fetch already completed.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "No dependency array means 'run after every render'. Since the effect sets state, it schedules another render, which runs the effect again. Add `[userId]` so it only refetches when the id changes. (`setUser`'s identity is stable, and effect callbacks must not be `async`.)",
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
      "This interval should increment once per second but gets stuck at 1. Fix it (keep the `[]` deps).",
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
    prompt: "Add a correct `key` to this list. Each `user` has a unique `id`.",
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

const uiux: QuestionDraft[] = [
  {
    id: "uiux-hierarchy",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A screen's title, body text, and primary button all read at the same visual weight. Which change best establishes hierarchy?",
    options: [
      {
        id: "a",
        text: "Differentiate them with size, weight, color, and spacing so importance is obvious at a glance.",
      },
      {
        id: "b",
        text: "Add equal, generous whitespace around all three so the section feels lighter.",
      },
      {
        id: "c",
        text: "Apply the same accent color to all three to visually tie them together.",
      },
      {
        id: "d",
        text: "Increase every text size proportionally to improve overall readability.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Hierarchy comes from *contrast* — differences that rank elements. Uniform spacing, a shared color, or scaling everything up keeps them equal, so nothing leads. Vary size/weight/color/space to signal what matters most.",
  },
  {
    id: "uiux-feedback",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A 'Save' button triggers a ~2s network request. What's the best default feedback?",
    options: [
      {
        id: "a",
        text: "Immediately put the button in a loading/disabled state, then confirm success or show an error.",
      },
      {
        id: "b",
        text: "Optimistically show success right away and quietly roll back if the request fails.",
      },
      {
        id: "c",
        text: "Leave the button unchanged and show a toast only once the request finishes.",
      },
      {
        id: "d",
        text: "Disable the whole screen with a full-page blocking spinner until it's done.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "The click needs immediate, local feedback: a loading state confirms it registered and prevents double-submits, then a clear result closes the loop. Optimistic UI suits cheap, low-risk actions; a silent button or a full-page block are too little or too much.",
  },
  {
    id: "uiux-validation-timing",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt: "When should a form field surface its validation error?",
    options: [
      {
        id: "a",
        text: "On blur or submit — then, once a field is in error, re-validate live as the user fixes it.",
      },
      {
        id: "b",
        text: "On every keystroke from the first character, so feedback is always instant.",
      },
      {
        id: "c",
        text: "Only on submit; inline errors mid-form are distracting and should be avoided.",
      },
      {
        id: "d",
        text: "On blur only, and never re-check until the next submit.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Flagging an error before the user finishes a field (e.g. an 'invalid email' while they type the first letters) is noisy and stressful. Validate on blur/submit, then switch to live validation for that field so they can see when it's fixed.",
  },
  {
    id: "uiux-error-message",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt: "A card payment fails. Which message is best?",
    options: [
      {
        id: "a",
        text: "\"That card was declined. Check the number and expiry, or try another card.\"",
      },
      { id: "b", text: '"Payment failed. Please try again later."' },
      { id: "c", text: '"We couldn\'t process your payment (error 4051)."' },
      {
        id: "d",
        text: '"Your card was declined by the issuing bank for security reasons."',
      },
    ],
    correctOptionId: "a",
    explanation:
      "Good errors say what happened in plain language and what to do next. 'Try again later' isn't actionable, an error code is meaningful only to support, and a vague 'security reasons' gives the user no path forward.",
  },
  {
    id: "uiux-affordance",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt: "What is an 'affordance' in interface design?",
    options: [
      {
        id: "a",
        text: "A perceived visual cue for how an element can be used — a button looks pressable, a field looks editable.",
      },
      {
        id: "b",
        text: "The negative space that separates one element from its neighbours.",
      },
      {
        id: "c",
        text: "A design token that maps a component to its accessible ARIA role.",
      },
      {
        id: "d",
        text: "The placeholder UI shown while an interactive element is loading.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "An affordance is a signal of possible action — raised buttons, underlined links, draggable handles. Flat, ambiguous controls weaken affordance and force users to guess what's interactive. The other options describe whitespace, tokens, and loading states.",
  },
  {
    id: "uiux-jakobs-law",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A stakeholder wants the site logo moved to the bottom-right and repurposed as a 'scroll to top' control. What's the main usability concern?",
    options: [
      {
        id: "a",
        text: "It breaks a strong convention — users expect a top-left logo that links home (Jakob's Law).",
      },
      {
        id: "b",
        text: "Repurposing the logo hurts SEO because crawlers expect it in the header.",
      },
      {
        id: "c",
        text: "Fixed bottom-right elements always overlap the mobile browser's UI chrome.",
      },
      {
        id: "d",
        text: "Logos shouldn't be interactive at all, since that confuses brand recognition.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Jakob's Law: people expect your site to behave like the many others they use. A top-left logo linking home is deeply ingrained; relocating and repurposing it adds friction for little gain. (Logos can absolutely be links, and SEO isn't the core UX issue.)",
  },
  {
    id: "uiux-fitts",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "Why should primary tap targets on mobile be reasonably large (~44px) and well-spaced?",
    options: [
      {
        id: "a",
        text: "Bigger, well-separated targets are faster to acquire and reduce mis-taps (Fitts's Law).",
      },
      {
        id: "b",
        text: "Touch screens physically cannot register taps on elements smaller than ~44px.",
      },
      {
        id: "c",
        text: "Larger targets are needed for their text labels to meet contrast requirements.",
      },
      {
        id: "d",
        text: "Bigger tap targets reduce cumulative layout shift while the page loads.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Fitts's Law: acquisition time depends on a target's size and distance. Fingers are imprecise, so small or crowded targets cause errors. Screens can register taps smaller than 44px — it's just error-prone — and contrast/layout-shift are separate concerns.",
  },
  {
    id: "uiux-progressive-disclosure",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A settings page has 40 options, most of them rarely used. What technique best keeps it approachable?",
    options: [
      {
        id: "a",
        text: "Progressive disclosure — surface common options, tuck the rest behind 'Advanced' or grouped sections.",
      },
      {
        id: "b",
        text: "Paginate the options across several numbered pages.",
      },
      {
        id: "c",
        text: "Add a search box and let users find the specific setting they need.",
      },
      {
        id: "d",
        text: "List all 40 alphabetically so their location is always predictable.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Progressive disclosure lowers cognitive load by showing what most people need and deferring the rest while keeping it reachable. Search helps when you know the name; pagination and a flat A–Z list still confront everyone with the full complexity.",
  },
  {
    id: "uiux-recognition-recall",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "Why is a visible list of recent files usually better than asking users to type the exact filename?",
    options: [
      {
        id: "a",
        text: "Recognition is easier than recall — showing choices offloads memory onto the interface.",
      },
      {
        id: "b",
        text: "Because rendering a list is cheaper than validating free-text input.",
      },
      {
        id: "c",
        text: "Because a recent-files list lets the app cache those files for faster opening.",
      },
      {
        id: "d",
        text: "Because free-text filename inputs can't be reliably validated.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "It's a core usability heuristic: prefer recognition over recall. Letting people pick from visible options is far less effortful and error-prone than making them remember and reproduce exact text. The other options are technical side-effects, not the UX reason.",
  },
  {
    id: "uiux-destructive-confirm",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt: "What's the best pattern for a 'Delete account' action that can't be undone?",
    options: [
      {
        id: "a",
        text: "Add friction proportional to the stakes: an explicit confirmation (e.g. type the name) and/or an undo window.",
      },
      {
        id: "b",
        text: "Position the button far from other controls so it's unlikely to be clicked by accident.",
      },
      {
        id: "c",
        text: "Style it faint and low-contrast so it doesn't draw clicks.",
      },
      {
        id: "d",
        text: "Require a double-click on the button to confirm the user means it.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Irreversible actions deserve deliberate confirmation matched to their cost — a confirm step, typed confirmation, or undo grace period. Hiding the button with distance or low contrast hurts discoverability and accessibility, and double-click isn't a recognized confirmation pattern.",
  },
  {
    id: "uiux-perceived-performance",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A dashboard takes ~1.5s to load its data. Which best improves *perceived* performance?",
    options: [
      {
        id: "a",
        text: "Show skeleton placeholders that mirror the final layout while data loads.",
      },
      {
        id: "b",
        text: "Render the page immediately with zeros/empty values, then swap in real data.",
      },
      {
        id: "c",
        text: "Cover the page with a centered spinner over a dimmed backdrop until it's ready.",
      },
      {
        id: "d",
        text: "Show a progress bar that animates to ~90% regardless of actual progress.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Skeletons set expectations about what's coming and avoid layout shift, making the wait feel shorter and more structured. Flashing zeros causes a jarring swap, a blocking spinner stalls everything, and a fake progress bar erodes trust when it stalls at 90%.",
  },
  {
    id: "uiux-color-alone",
    category: "uiux",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "A form marks invalid fields only by turning the border red. What's the most important fix?",
    options: [
      {
        id: "a",
        text: "Add a non-color cue — an icon and/or a short text message — so the error is perceivable without seeing color.",
      },
      {
        id: "b",
        text: "Darken the red so the border meets a 3:1 contrast ratio against the background.",
      },
      {
        id: "c",
        text: "Add `aria-invalid` to the field so screen readers announce the error.",
      },
      {
        id: "d",
        text: "Briefly animate the border so the change catches the user's eye.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Never rely on color alone — colorblind and low-vision users may not perceive the red. Pair it with an icon and/or text. `aria-invalid` helps screen readers (do it too!) but doesn't help a sighted colorblind user, and better contrast or animation still leaves color as the only signal.",
  },
  {
    id: "uiux-empty-state",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt: "What makes a strong empty state for a brand-new, empty inbox?",
    options: [
      {
        id: "a",
        text: "Explain what will appear here and offer a clear primary action to get started.",
      },
      {
        id: "b",
        text: "Show a large friendly illustration so the screen doesn't look broken.",
      },
      {
        id: "c",
        text: "Render the column headers and an empty table so the structure is visible.",
      },
      {
        id: "d",
        text: "Auto-populate sample data so users can see what a full inbox looks like.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Empty states are an onboarding moment: orient the user and give them a next step. An illustration alone is decoration, bare headers explain nothing, and fake sample data can be mistaken for real content. Guidance + a CTA does the real work.",
  },
  {
    id: "uiux-bug-disabled-submit",
    category: "uiux",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "A signup form keeps Submit disabled until everything is valid, with no other hints. Why is this a problem?",
    options: [
      {
        id: "a",
        text: "Users can't tell what's blocking them — show inline guidance on what's required, or let them submit and reveal the errors.",
      },
      {
        id: "b",
        text: "Disabled buttons can't receive focus, so screen-reader users won't know the form exists at all.",
      },
      {
        id: "c",
        text: "Browsers clear disabled buttons' forms on validation, losing the user's input.",
      },
      {
        id: "d",
        text: "It's fine as long as every required field is marked with a red asterisk.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "A silently disabled submit is a dead end: the user doesn't know which field is holding them up. Show what's required inline, or allow submit and surface specific errors. (The form's fields are still perceivable; browsers don't wipe input like that.)",
  },
];

const a11y: QuestionDraft[] = [
  {
    id: "a11y-semantic-button",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "Why prefer a native `<button>` over a `<div onClick={...}>` for a clickable control?",
    options: [
      {
        id: "a",
        text: "`<button>` is focusable, operable with Enter/Space, and announced as a button — all for free.",
      },
      {
        id: "b",
        text: "A `<div role=\"button\" tabindex=\"0\">` is fully equivalent, so it's really just personal preference.",
      },
      {
        id: "c",
        text: "Screen readers ignore `<div>` elements entirely, even ones containing text.",
      },
      {
        id: "d",
        text: "`onClick` on a `<div>` doesn't fire on touch devices, only on desktop.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "A real `<button>` gives you focus, keyboard activation, and the button role with no extra work. A `<div role=\"button\" tabindex=\"0\">` still needs manual Enter/Space handling to match — close, but not free. Screen readers do read `<div>` text, and `onClick` works on touch.",
  },
  {
    id: "a11y-alt-decorative",
    category: "a11y",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "An image is purely decorative (a flourish beside a heading). What's the correct handling?",
    options: [
      { id: "a", text: 'Give it an empty alt (`alt=""`) so screen readers skip it.' },
      {
        id: "b",
        text: "Omit the `alt` attribute entirely so there's no text to announce.",
      },
      {
        id: "c",
        text: 'Use `role="presentation"`, which also requires a short descriptive `alt`.',
      },
      {
        id: "d",
        text: 'Set `aria-hidden="true"` and a brief `alt` like "decorative swirl".',
      },
    ],
    correctOptionId: "a",
    explanation:
      'Decorative images take `alt=""` (present but empty) so assistive tech ignores them. Omitting `alt` makes some screen readers read the file name. The other options mix contradictory attributes — `role="presentation"` doesn\'t need descriptive alt, and you don\'t pair `aria-hidden` with alt text.',
  },
  {
    id: "a11y-label-association",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "What's the most robust way to label a text input?",
    options: [
      {
        id: "a",
        text: "A visible `<label>` associated via `htmlFor`/`id` (or wrapping the input).",
      },
      {
        id: "b",
        text: "An `aria-label` on the input — a visible label is optional once that's present.",
      },
      {
        id: "c",
        text: "A `placeholder` plus a `title` attribute as a tooltip.",
      },
      {
        id: "d",
        text: "A nearby `<span>` referenced with `aria-describedby`.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "A real associated `<label>` is announced, stays visible while typing, and extends the click target. `aria-label` works for screen readers but leaves no visible label and is easy to let rot. A placeholder isn't a label, and `aria-describedby` provides a description, not the name.",
  },
  {
    id: "a11y-contrast",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt:
      "What's the WCAG 2.x AA minimum contrast ratio for normal-size body text?",
    options: [
      { id: "a", text: "4.5:1" },
      { id: "b", text: "3:1" },
      { id: "c", text: "7:1" },
      { id: "d", text: "2:1" },
    ],
    correctOptionId: "a",
    explanation:
      "AA requires 4.5:1 for normal text. 3:1 is the bar for large text and for UI components/graphics; 7:1 is the stricter AAA level for normal text. Light-gray-on-white body text often quietly fails 4.5:1.",
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
        text: "A logical tab order is enough; a visible focus ring is optional if the order is sensible.",
      },
      {
        id: "c",
        text: "Custom widgets may rely on a documented mouse-only fallback if keyboard support is hard.",
      },
      {
        id: "d",
        text: "Only native form controls must be keyboard-operable; custom components are exempt.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Keyboard and switch users need to reach and operate everything interactive — and *see* where focus is. Tab order alone isn't enough without a visible indicator, and there's no exemption for custom widgets or a mouse-only fallback.",
  },
  {
    id: "a11y-aria-first-rule",
    category: "a11y",
    type: "mcq",
    difficulty: "hard",
    prompt: "You need a checkbox. Which best follows the first rule of ARIA?",
    options: [
      {
        id: "a",
        text: 'Use a native `<input type="checkbox">` rather than recreating one from a generic element.',
      },
      {
        id: "b",
        text: 'Build a `<div role="checkbox" tabindex="0">` and wire up Space/Enter and `aria-checked` for full control.',
      },
      {
        id: "c",
        text: "Use a styled `<button aria-pressed>` — a checkbox is just a toggle anyway.",
      },
      {
        id: "d",
        text: "Visually hide a native checkbox and mirror its state onto a `<div>` with ARIA roles.",
      },
    ],
    correctOptionId: "a",
    explanation:
      'First rule of ARIA: if a native element provides the semantics and behavior, use it instead of rebuilding with ARIA — "no ARIA is better than bad ARIA." A `role="checkbox"` div needs you to reimplement keyboard and state; a toggle button (`aria-pressed`) is a different role with different semantics.',
  },
  {
    id: "a11y-heading-order",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "Which heading practice best supports screen-reader navigation?",
    options: [
      {
        id: "a",
        text: "Use one `<h1>` and don't skip levels — headings convey structure, and CSS controls size.",
      },
      {
        id: "b",
        text: "Pick heading levels by the font size you want; readers go top-to-bottom regardless.",
      },
      {
        id: "c",
        text: "Multiple `<h1>`s are fine per `<section>`, since each section starts its own outline.",
      },
      {
        id: "d",
        text: "Skipping from `<h2>` to `<h4>` is fine as long as `<h3>` is unused everywhere.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Screen-reader users jump by headings, so a clean outline (one h1, no skipped levels) matters; choose levels by meaning and style with CSS. The HTML5 'each section restarts the outline' idea was never implemented by assistive tech — a single h1 with proper nesting is the safe rule.",
  },
  {
    id: "a11y-live-region",
    category: "a11y",
    type: "mcq",
    difficulty: "hard",
    prompt:
      "After saving, you show a non-urgent 'Saved!' toast. How should screen-reader users hear it?",
    options: [
      {
        id: "a",
        text: 'Put it in an `aria-live="polite"` region so it\'s announced when it appears, without stealing focus.',
      },
      {
        id: "b",
        text: 'Give it `role="alert"` so it\'s announced assertively, interrupting whatever is being read.',
      },
      {
        id: "c",
        text: 'Move focus to the toast with `tabindex="-1"` so the reader lands on it.',
      },
      {
        id: "d",
        text: 'Add `aria-label="Saved"` to the toast element so assistive tech picks it up.',
      },
    ],
    correctOptionId: "a",
    explanation:
      "A polite live region announces changes when the user is idle, without hijacking focus or interrupting — right for a non-urgent confirmation. `role=\"alert\"` is assertive (save it for errors), moving focus is disruptive for a transient toast, and `aria-label` alone isn't announced just because the element appears.",
  },
  {
    id: "a11y-bug-div-button",
    category: "a11y",
    type: "mcq",
    difficulty: "medium",
    prompt: "What's the most serious accessibility problem here?",
    code: `<div className="btn" onClick={openMenu}>
  Menu
</div>`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "It isn't focusable or keyboard-operable and has no button role — use a real `<button>`.",
      },
      {
        id: "b",
        text: "It works for mouse users; it just needs `cursor: pointer` to look clickable.",
      },
      {
        id: "c",
        text: "It needs `aria-label=\"Menu\"`, because a `<div>` has no accessible name.",
      },
      {
        id: "d",
        text: "`onClick` on a `<div>` only fires through React's synthetic events, not natively.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Keyboard users can't Tab to it or activate it with Enter/Space, and it's not announced as a button. Swapping to `<button>` fixes all of that at once. `cursor: pointer` is cosmetic, the text already gives it a name, and React's events aren't the issue.",
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
        text: "It has no associated `<label>` — a placeholder isn't a label and vanishes once the user types.",
      },
      {
        id: "b",
        text: "The placeholder is fine as a label as long as it has sufficient contrast.",
      },
      {
        id: "c",
        text: "It's missing `aria-required`, which email fields need to be announced.",
      },
      {
        id: "d",
        text: "`type=\"email\"` suppresses the label; use `type=\"text\"` with a pattern instead.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "A placeholder isn't a substitute for a label: it disappears on input, often fails contrast, and isn't reliably treated as the field's name. Add a real associated `<label>`. (Input type doesn't suppress labels, and the missing label — not `aria-required` — is the problem.)",
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
        text: 'An accessible name — add `aria-label="Close"` (and hide the icon with `aria-hidden`).',
      },
      {
        id: "b",
        text: 'Give the `<XIcon>` `role="img"` so screen readers announce it as an image.',
      },
      {
        id: "c",
        text: 'Set `title="Close"` on the `<XIcon>`; that becomes the button\'s accessible name.',
      },
      {
        id: "d",
        text: 'Add `aria-hidden="true"` to the button so the unlabeled icon doesn\'t confuse users.',
      },
    ],
    correctOptionId: "a",
    explanation:
      'The button has no text, so screen readers announce nothing useful. Give it a name with `aria-label="Close"` and mark the icon `aria-hidden`. `role="img"` would announce "image", `title` on an SVG is unreliable, and `aria-hidden` on the button would hide the control entirely.',
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
      'A `<label htmlFor="email">` tied to `<input id="email">` is announced by assistive tech and makes the label text a click target for the field. (In React it\'s `htmlFor`, not `for`.)',
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

/**
 * Subcategory for each question, kept in one place so the taxonomy is easy to
 * read and adjust. Used to track which areas the user struggles with and to
 * offer focused, weak-area practice rounds.
 */
const TOPIC_BY_ID: Record<string, string> = {
  // React
  "react-keys": "Rendering & keys",
  "react-derived-state": "State & props",
  "react-setstate-same-value": "State & props",
  "react-effect-purpose": "React Hooks",
  "react-controlled-input": "State & props",
  "react-compiler-memo": "Rendering & keys",
  "react-ref-no-rerender": "State & props",
  "react-bug-onclick-call": "Rendering & keys",
  "react-bug-conditional-hook": "React Hooks",
  "react-bug-index-key": "Rendering & keys",
  "react-bug-mutate-state": "State & props",
  "react-bug-effect-deps": "React Hooks",
  "react-fix-infinite-effect": "React Hooks",
  "react-fix-functional-update": "React Hooks",
  "react-fix-mutation": "State & props",
  "react-fix-key": "Rendering & keys",
  // UI/UX
  "uiux-hierarchy": "Visual design",
  "uiux-feedback": "Interaction & feedback",
  "uiux-validation-timing": "Interaction & feedback",
  "uiux-error-message": "Interaction & feedback",
  "uiux-affordance": "Visual design",
  "uiux-jakobs-law": "UX heuristics",
  "uiux-fitts": "UX heuristics",
  "uiux-progressive-disclosure": "UX heuristics",
  "uiux-recognition-recall": "UX heuristics",
  "uiux-destructive-confirm": "Interaction & feedback",
  "uiux-perceived-performance": "Interaction & feedback",
  "uiux-color-alone": "Visual design",
  "uiux-empty-state": "Visual design",
  "uiux-bug-disabled-submit": "Interaction & feedback",
  // Accessibility
  "a11y-semantic-button": "Semantic structure",
  "a11y-alt-decorative": "Names & labels",
  "a11y-label-association": "Names & labels",
  "a11y-contrast": "Visual & keyboard",
  "a11y-keyboard": "Visual & keyboard",
  "a11y-aria-first-rule": "Semantic structure",
  "a11y-heading-order": "Semantic structure",
  "a11y-live-region": "Visual & keyboard",
  "a11y-bug-div-button": "Semantic structure",
  "a11y-bug-placeholder-label": "Names & labels",
  "a11y-bug-icon-button": "Names & labels",
  "a11y-fix-div-button": "Semantic structure",
  "a11y-fix-label": "Names & labels",
  "a11y-fix-img-alt": "Names & labels",
  "a11y-fix-icon-button": "Names & labels",
};

function attachTopic(draft: QuestionDraft): Question {
  const topic = TOPIC_BY_ID[draft.id];
  if (!topic) throw new Error(`Question "${draft.id}" is missing a topic`);
  return { ...draft, topic } as Question;
}

export const QUESTION_BANK: Question[] = [...react, ...uiux, ...a11y].map(
  attachTopic
);

/** All topics that exist for a category, in first-seen order. */
export function topicsForCategory(category: Question["category"]): string[] {
  const seen = new Set<string>();
  for (const q of QUESTION_BANK) {
    if (q.category === category) seen.add(q.topic);
  }
  return [...seen];
}
