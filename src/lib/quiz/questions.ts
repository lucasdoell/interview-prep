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
 * Option-writing rules (so questions test understanding, not test-taking):
 *  - Every option is a confident, specific claim of roughly equal length —
 *    the correct one is never the longest or most qualified. Rationale lives
 *    in `explanation`, not bolted onto the right answer.
 *  - Distractors are real misconceptions or defensible-but-worse choices.
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
        text: "It gives each item a stable identity so React can match elements across renders and keep their state.",
      },
      {
        id: "b",
        text: "It lets React skip re-rendering any item whose key and props are unchanged, like automatic memoization.",
      },
      {
        id: "c",
        text: "It only suppresses the dev warning and has no effect on how React updates the real DOM.",
      },
      {
        id: "d",
        text: "It becomes the element's DOM id, so you can later select that item by its key value.",
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
        text: "Compute it during render straight from `todos`, e.g. `todos.filter(t => t.done).length`.",
      },
      {
        id: "b",
        text: "Keep a `completedCount` in state and update it in the same handler that toggles a todo.",
      },
      {
        id: "c",
        text: "Recompute it inside a `useEffect([todos])` and write the result back into separate state.",
      },
      {
        id: "d",
        text: "Store it in a `useRef` and update `ref.current` whenever a todo is toggled on or off.",
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
        text: "It may bail out of the update and skip re-rendering this component for that change.",
      },
      {
        id: "b",
        text: "It re-renders once, then bails out of any further renders the same value would trigger.",
      },
      {
        id: "c",
        text: "It re-renders the component as usual but skips running that render's effects.",
      },
      {
        id: "d",
        text: "It throws a development-only warning telling you the update was unnecessary.",
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
        text: "Subscribing to a browser event or external store and unsubscribing again in the cleanup.",
      },
      {
        id: "b",
        text: "Deriving a filtered list for display whenever the underlying source data changes.",
      },
      {
        id: "c",
        text: "Keeping a running total in state that you update by hand every single time one of its inputs happens to change.",
      },
      {
        id: "d",
        text: "Resetting a child's local state from the parent whenever the parent re-renders.",
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
        text: "Its `value` prop is driven by React state, and every edit is routed through `onChange`.",
      },
      {
        id: "b",
        text: "It sets the initial text with `defaultValue` and you read the current value from a ref.",
      },
      {
        id: "c",
        text: "It holds the value in the DOM and only copies it into React state on blur.",
      },
      {
        id: "d",
        text: "It wires up `onChange` for events but lets the browser own the displayed value.",
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
        text: "It auto-memoizes components and values, so most hand-written `useMemo`/`useCallback` is unnecessary.",
      },
      {
        id: "b",
        text: "It only takes effect once every component is also wrapped in `React.memo`; alone it does nothing.",
      },
      {
        id: "c",
        text: "It memoizes values but still expects `useCallback` on every single function you happen to pass down to a child component.",
      },
      {
        id: "d",
        text: "It compiles `useState` into signals, so state changes update the DOM without a re-render.",
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
        text: "Mutating a value stored in a ref, such as `ref.current.x = 1`.",
      },
      {
        id: "b",
        text: "Calling a `useState` setter with a value different from the current one.",
      },
      {
        id: "c",
        text: "A context value this component reads via `useContext` being updated.",
      },
      {
        id: "d",
        text: "The parent re-rendering and passing a new value for one of its props.",
      },
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
        text: "`handleDelete` runs during render and its return value becomes the handler; pass the function itself.",
      },
      {
        id: "b",
        text: "`handleDelete` isn't wrapped in `useCallback`, so it's recreated on every render, and as a result the click silently misfires.",
      },
      {
        id: "c",
        text: "The button is missing `type=\"button\"`, so the handler never runs inside a form.",
      },
      {
        id: "d",
        text: "JSX handlers must be arrow functions; a bare named reference like this won't bind correctly.",
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
        text: "`useState` runs conditionally, so the count and order of hooks can change between renders.",
      },
      {
        id: "b",
        text: "A component can't return before all of its hooks are declared, regardless of the condition.",
      },
      {
        id: "c",
        text: "`useState` needs an initial value whose type matches the `userId` prop it depends on.",
      },
      {
        id: "d",
        text: "An early return must render `null` rather than JSX, or React loses track of the state.",
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
        text: "Indexes track position, not identity, so a reorder leaves each row's state attached to the wrong item.",
      },
      {
        id: "b",
        text: "Index keys force the entire list to re-render from scratch on every single change, which is what corrupts the input state.",
      },
      {
        id: "c",
        text: "React coerces numeric keys to strings, and the mismatch quietly drops the `row` prop updates.",
      },
      {
        id: "d",
        text: "A `key` can't be derived from the second `.map()` argument, so React ends up ignoring it.",
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
        text: "`items` is mutated in place, so its reference is unchanged and React skips the re-render.",
      },
      {
        id: "b",
        text: "`push` returns the new array length, so `setItems` ends up storing a number, not the array.",
      },
      {
        id: "c",
        text: "State setters are async, so you must `await setItems(...)` before the list reflects the change.",
      },
      {
        id: "d",
        text: "Array state requires the functional form `setItems(prev => prev)` to register as changed.",
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
        text: "With no dependency array it runs after every render, and `setUser` triggers another render — a loop.",
      },
      {
        id: "b",
        text: "`setUser` is a new function each render, so the effect sees a changed dependency on each pass and keeps refiring.",
      },
      {
        id: "c",
        text: "The effect callback has to be `async` to await `fetchUser`, and React retries it until it is.",
      },
      {
        id: "d",
        text: "The dependency array is missing `user`, so React can't tell the fetch has already finished.",
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
        text: "Vary their size, weight, color, and spacing so the most important element clearly leads.",
      },
      {
        id: "b",
        text: "Add equal, generous whitespace around all three so the whole section reads as lighter.",
      },
      {
        id: "c",
        text: "Apply one shared accent color across all three so they feel like a coherent group.",
      },
      {
        id: "d",
        text: "Scale every text element up proportionally so the section is easier to read overall.",
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
        text: "Put the button into a loading/disabled state at once, then confirm success or surface an error.",
      },
      {
        id: "b",
        text: "Show success immediately and quietly roll the change back if the request later fails.",
      },
      {
        id: "c",
        text: "Leave the button untouched and show a toast only once the request has finished.",
      },
      {
        id: "d",
        text: "Block the whole screen behind a full-page spinner until the request finally resolves, one way or the other.",
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
        text: "On blur or submit, then validate live only after that field has gone into an error state.",
      },
      {
        id: "b",
        text: "On every keystroke from the very first character, so feedback is instant the whole time.",
      },
      {
        id: "c",
        text: "Only when the form is submitted, since inline errors shown mid-field tend to distract people.",
      },
      {
        id: "d",
        text: "On blur only, and then never re-check that field again until the next form submit.",
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
        text: "\"That card was declined. Check the number and expiry date, or try a different card.\"",
      },
      {
        id: "b",
        text: "\"Your payment didn't go through. Please wait a few minutes and try submitting again.\"",
      },
      {
        id: "c",
        text: "\"We couldn't process your payment right now. Reference code 4051-PAY for support.\"",
      },
      {
        id: "d",
        text: "\"Your card was declined by the issuing bank for undisclosed security reasons.\"",
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
        text: "A perceived cue for how an element can be used — a button looks pressable, a link clickable.",
      },
      {
        id: "b",
        text: "The empty space deliberately left around an element to separate it from its neighbours.",
      },
      {
        id: "c",
        text: "A design-system token that maps a component to its correct accessible ARIA role.",
      },
      {
        id: "d",
        text: "The placeholder shown in an element's place while its interactive parts are loading.",
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
        text: "It breaks a strong convention — people expect a top-left logo that links to the home page.",
      },
      {
        id: "b",
        text: "It hurts SEO, because search crawlers expect to find the site logo inside the header.",
      },
      {
        id: "c",
        text: "Fixed bottom-right elements will overlap the mobile browser's own chrome on small screens.",
      },
      {
        id: "d",
        text: "Logos shouldn't be interactive at all, since clickable branding confuses recognition.",
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
        text: "Larger, well-spaced targets are quicker to hit and produce fewer mis-taps (Fitts's Law).",
      },
      {
        id: "b",
        text: "Touch screens physically can't register a tap on anything smaller than about 44 pixels.",
      },
      {
        id: "c",
        text: "Targets must be large enough for their text labels to clear the minimum contrast ratio.",
      },
      {
        id: "d",
        text: "Bigger tap targets cut down on the cumulative layout shift that happens during loading.",
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
        text: "Progressive disclosure: surface the common options and tuck the rest behind 'Advanced' sections.",
      },
      {
        id: "b",
        text: "Split the forty options across several separate numbered pages that the user can click through one at a time.",
      },
      {
        id: "c",
        text: "Add a search box so people can jump straight to whichever setting they happen to want.",
      },
      {
        id: "d",
        text: "List all forty alphabetically so every option's location stays completely predictable.",
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
        text: "Recognition beats recall — showing the choices offloads remembering onto the interface itself.",
      },
      {
        id: "b",
        text: "Rendering a short list is computationally cheaper than validating free-text input.",
      },
      {
        id: "c",
        text: "A recent-files list lets the app pre-cache those files so they open noticeably faster.",
      },
      {
        id: "d",
        text: "Free-text filename fields are impossible to validate in a reliable, consistent way.",
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
        text: "Add friction matching the stakes — a typed confirmation and/or an undo window before it's final.",
      },
      {
        id: "b",
        text: "Position the button far away from other controls so that it's really quite unlikely to ever be hit by accident.",
      },
      {
        id: "c",
        text: "Render it in a faint, low-contrast style so it doesn't attract any accidental clicks.",
      },
      {
        id: "d",
        text: "Require a quick double-click on the button to confirm the person really means it.",
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
        text: "Show skeleton placeholders shaped like the final layout while the data loads in.",
      },
      {
        id: "b",
        text: "Render the page immediately with zeros and blanks, then swap in the real values.",
      },
      {
        id: "c",
        text: "Cover the page with a centered spinner over a dimmed backdrop until it's ready.",
      },
      {
        id: "d",
        text: "Animate a progress bar up to about 90% regardless of how loading is actually going.",
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
        text: "Add a non-color cue — an icon and/or text — so the error reads without relying on color.",
      },
      {
        id: "b",
        text: "Deepen the red until the border clears a 3:1 contrast ratio against its background.",
      },
      {
        id: "c",
        text: "Add `aria-invalid` to the field so a screen reader announces it as being in error.",
      },
      {
        id: "d",
        text: "Briefly animate the border when it changes so the error catches the user's eye.",
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
        text: "Explain what will show up here and give a clear primary action to add the first item.",
      },
      {
        id: "b",
        text: "Show a large, friendly illustration so the screen doesn't come across as broken.",
      },
      {
        id: "c",
        text: "Render the table's column headers above an empty body so the structure is visible.",
      },
      {
        id: "d",
        text: "Pre-fill it with sample data so the user can picture what a populated view looks like.",
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
        text: "Users can't see what's blocking them — show what's required, or let them submit and reveal errors.",
      },
      {
        id: "b",
        text: "A disabled button can't take keyboard focus, so screen-reader users may never even discover the form at all.",
      },
      {
        id: "c",
        text: "Browsers wipe a disabled button's form on validation, losing whatever the user has typed.",
      },
      {
        id: "d",
        text: "It's fine, as long as every required field is marked with a red asterisk beside it.",
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
        text: "A button is focusable, works with Enter and Space, and is announced as a button automatically.",
      },
      {
        id: "b",
        text: "A `<div role=\"button\" tabindex=\"0\">` is fully equivalent, so it's really just a style choice.",
      },
      {
        id: "c",
        text: "Screen readers skip over `<div>` elements entirely, even ones that contain visible text.",
      },
      {
        id: "d",
        text: "Click handlers on a `<div>` fire only on desktop and silently do nothing on touch devices.",
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
      {
        id: "a",
        text: 'Give it an empty alt (`alt=""`) so assistive technology skips the image as decoration.',
      },
      {
        id: "b",
        text: "Drop the `alt` attribute completely so there's simply no text for it to announce.",
      },
      {
        id: "c",
        text: 'Add `role="presentation"` together with a short descriptive `alt` for the decoration.',
      },
      {
        id: "d",
        text: 'Set `aria-hidden="true"` and give it a brief `alt` such as "decorative swirl".',
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
        text: "A visible `<label>` tied to the input with `htmlFor`/`id`, or wrapped directly around it.",
      },
      {
        id: "b",
        text: "An `aria-label` on the input, treating a visible label as optional once that's set.",
      },
      {
        id: "c",
        text: "A `placeholder` for the prompt plus a `title` attribute that shows up as a tooltip.",
      },
      {
        id: "d",
        text: "A nearby `<span>` of text referenced from the input with `aria-describedby`.",
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
      { id: "b", text: "3.0:1" },
      { id: "c", text: "7.0:1" },
      { id: "d", text: "2.0:1" },
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
        text: "Every interactive element must be reachable and operable by keyboard, with a visible focus style.",
      },
      {
        id: "b",
        text: "A sensible tab order is enough on its own; a visible focus indicator is optional whenever that order is logical.",
      },
      {
        id: "c",
        text: "Custom widgets may fall back to mouse-only operation when keyboard support is difficult.",
      },
      {
        id: "d",
        text: "Only native form controls must work by keyboard; custom components are exempt from that.",
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
        text: 'Use a native `<input type="checkbox">` instead of rebuilding the control from a generic element.',
      },
      {
        id: "b",
        text: 'Build a `<div role="checkbox" tabindex="0">`, and then carefully wiring up Space, Enter, and `aria-checked` all by yourself.',
      },
      {
        id: "c",
        text: "Use a styled `<button aria-pressed>`, since a checkbox is really just a two-state toggle.",
      },
      {
        id: "d",
        text: "Hide a real checkbox visually and mirror its checked state onto a `<div>` using ARIA.",
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
        text: "Use a single `<h1>` and don't skip levels; headings convey structure, and CSS handles size.",
      },
      {
        id: "b",
        text: "Choose heading levels by the size you want, since readers move through them top to bottom.",
      },
      {
        id: "c",
        text: "Multiple `<h1>`s are fine per `<section>`, because each section starts its own outline.",
      },
      {
        id: "d",
        text: "Jumping from `<h2>` straight to `<h4>` is fine, as long as `<h3>` isn't used anywhere.",
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
        text: 'Put it in an `aria-live="polite"` region, so it\'s announced on appearance without taking focus.',
      },
      {
        id: "b",
        text: 'Give it `role="alert"` so it\'s announced assertively, interrupting whatever the user happens to be reading at that moment.',
      },
      {
        id: "c",
        text: 'Move focus to the toast with `tabindex="-1"` so the screen reader lands on and reads it.',
      },
      {
        id: "d",
        text: 'Add `aria-label="Saved"` to the toast element so assistive tech picks the message up.',
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
        text: "It isn't focusable or keyboard-operable and carries no button role — use a real `<button>`.",
      },
      {
        id: "b",
        text: "It works for mouse users and only needs `cursor: pointer` to look properly clickable.",
      },
      {
        id: "c",
        text: "It needs `aria-label=\"Menu\"`, because a plain `<div>` has no accessible name of its own.",
      },
      {
        id: "d",
        text: "Its `onClick` fires only through React's synthetic events, never as a native DOM event.",
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
        text: "A placeholder works fine as a label as long as its text meets the contrast requirement.",
      },
      {
        id: "c",
        text: "It's missing `aria-required`, which email fields need in order to be announced correctly.",
      },
      {
        id: "d",
        text: "`type=\"email\"` suppresses the label, so you should use `type=\"text\"` with a pattern instead.",
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
        text: 'An accessible name — add `aria-label="Close"` and hide the icon with `aria-hidden`.',
      },
      {
        id: "b",
        text: 'Give the `<XIcon>` `role="img"` so screen readers announce it to the user as an image.',
      },
      {
        id: "c",
        text: 'Put `title="Close"` on the icon, since that title becomes the button\'s accessible name.',
      },
      {
        id: "d",
        text: 'Add `aria-hidden="true"` to the button so the unlabeled icon can\'t confuse the user.',
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
 * Challenge mode: a curated gauntlet of harder, more nuanced questions where
 * several answers look reasonable and the distinction is subtle. Marked
 * `challenge: true` so they're excluded from normal rounds.
 */
const challenge: QuestionDraft[] = [
  {
    id: "ch-react-stale-closure",
    category: "react",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt: "`onScroll` always logs 0, even after `count` has increased. Why?",
    code: `useEffect(() => {
  function onScroll() {
    console.log(count); // always 0
  }
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "The `[]` deps run the effect once, so `onScroll` closes over `count` from the first render.",
      },
      {
        id: "b",
        text: "`addEventListener` only invokes the handler a single time unless you pass `{ once: false }`.",
      },
      {
        id: "c",
        text: "`console.log` calls inside an effect are throttled by React while in development mode.",
      },
      {
        id: "d",
        text: "State updates are asynchronous, so `count` hasn't committed by the time `onScroll` runs.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Classic stale closure: the effect ran once with `count = 0`, and the listener captured that binding forever. Fix it by keeping the latest value in a ref, or by adding `count` to the deps so the listener is re-attached with the current value.",
  },
  {
    id: "ch-react-derived-from-props",
    category: "react",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "`<Price>` shows a stale number when the `amount` prop changes. Why, and what's the right fix?",
    code: `function Price({ amount }) {
  const [display, setDisplay] = useState(amount);
  return <span>{display}</span>;
}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "`useState(amount)` only uses `amount` as the initial value; later prop changes are ignored.",
      },
      {
        id: "b",
        text: "You need `useState(() => amount)` so the lazy initializer re-runs whenever `amount` changes.",
      },
      {
        id: "c",
        text: "Function components can't sync props to state without a `componentWillReceiveProps` hook.",
      },
      {
        id: "d",
        text: "Wrapping `<Price>` in `React.memo` would make it re-read the `amount` prop on each change.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Initializing state from a prop snapshots it once — the state then has a life of its own. The fix is usually to not copy it at all (derive from the prop during render), or, if it genuinely needs local edits, remount with a `key` when the source changes. Lazy init `() => amount` still only runs once.",
  },
  {
    id: "ch-react-effect-race",
    category: "react",
    challenge: true,
    type: "code",
    difficulty: "hard",
    prompt:
      "Typing quickly in a search box sometimes shows results for an earlier query (a race). Fix the effect so only the latest query's results are applied.",
    code: `useEffect(() => {
  fetchResults(query).then(setResults);
}, [query]);`,
    codeLang: "tsx",
    starterCode: `useEffect(() => {
  fetchResults(query).then(setResults);
}, [query]);`,
    referenceSolution: `useEffect(() => {
  let ignore = false;
  fetchResults(query).then((r) => {
    if (!ignore) setResults(r);
  });
  return () => {
    ignore = true;
  };
}, [query]);`,
    explanation:
      "Each render's effect can have an in-flight request; a slow earlier one can resolve after a newer one. The cleanup sets an `ignore` flag so a superseded response is discarded. (An `AbortController` to cancel the fetch works too.)",
  },
  {
    id: "ch-react-key-reset",
    category: "react",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "A profile editor holds its own draft state. When the user switches profiles, the previous draft text lingers in the inputs. What's the cleanest fix?",
    options: [
      {
        id: "a",
        text: "Give the editor `key={profileId}` so React remounts it with fresh state on a switch.",
      },
      {
        id: "b",
        text: "Add a `useEffect` that resets every field whenever the `profileId` prop changes.",
      },
      {
        id: "c",
        text: "Lift all the draft state up to the parent and clear it inside the switch handler.",
      },
      {
        id: "d",
        text: "Wrap the editor in `React.memo` so it re-initializes its state when new props arrive.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Changing a component's `key` tells React to treat it as a new instance and remount it — the idiomatic way to reset internal state on identity change. The effect-reset approach works but is verbose and easy to get subtly wrong; `React.memo` does the opposite of re-initializing.",
  },
  {
    id: "ch-react-batching",
    category: "react",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "In React 19, how many re-renders does this cause after the awaited call resolves?",
    code: `async function save() {
  await api.save();
  setSaving(false);
  setSaved(true);
}`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "One — React 18+ batches updates automatically, including those after `await` and in timeouts.",
      },
      {
        id: "b",
        text: "Two — automatic batching applies only inside React's own synthetic event handlers, never in async callbacks.",
      },
      {
        id: "c",
        text: "Two, unless you wrap both `setState` calls together inside a single `flushSync`.",
      },
      {
        id: "d",
        text: "Zero, until the next user interaction comes along and flushes the update queue.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Automatic batching (React 18+) groups multiple state updates into a single render even across `await`, `setTimeout`, and native handlers. Pre-18, updates outside React handlers weren't batched — that's the trap in option B. `flushSync` is for opting *out* of batching.",
  },
  {
    id: "ch-uiux-optimistic",
    category: "uiux",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "For which action is optimistic UI (show success immediately, reconcile later) the WORST fit?",
    options: [
      {
        id: "a",
        text: "Confirming a bank payment, where a later silent rollback hides whether money actually moved.",
      },
      {
        id: "b",
        text: "Liking a post, where a failed request can quietly revert the little heart icon back to its previous state.",
      },
      {
        id: "c",
        text: "Renaming a file, where a failed save can simply restore the file's previous name.",
      },
      {
        id: "d",
        text: "Starring an email, where a failed toggle can just flip the star back again.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Optimistic UI shines for cheap, reversible, low-stakes actions where a failure can quietly roll back. For a payment, premature 'success' is dangerous and irreversible — the user could believe money moved when it didn't. The other three revert harmlessly.",
  },
  {
    id: "ch-uiux-loader-timing",
    category: "uiux",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "A request usually returns in ~150ms but occasionally takes 2s. What's the best loading treatment?",
    options: [
      {
        id: "a",
        text: "Delay showing the loader ~300–500ms, so quick responses skip it but slow ones still show it.",
      },
      {
        id: "b",
        text: "Show a spinner immediately on every request, to keep the behaviour consistent across the app.",
      },
      {
        id: "c",
        text: "Don't show a loader at all, since a two-second wait is well within acceptable limits.",
      },
      {
        id: "d",
        text: "Show a full-screen skeleton on every request, no matter how long it ends up taking.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Flashing a spinner for a 150ms response is jarring and makes the UI feel slower. A short delay threshold suppresses the loader for quick responses while still covering the occasional slow one. Always-on or never-on both fail one of the two cases.",
  },
  {
    id: "ch-uiux-error-summary",
    category: "uiux",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "A long form fails validation on submit with several errors. Beyond inline messages, what most helps users recover?",
    options: [
      {
        id: "a",
        text: "Show a focusable error summary at the top, each item linking to and focusing its field.",
      },
      {
        id: "b",
        text: "Scroll the page down to the submit button so it stays visible after the failed attempt.",
      },
      {
        id: "c",
        text: "Disable all the valid fields so the user only has the broken ones left to deal with.",
      },
      {
        id: "d",
        text: "Show one generic 'please fix the errors below' message pinned to the top of the form.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "For long forms, a focusable error summary that links to each invalid field (plus inline messages) is the accessible, recoverable pattern — the user immediately sees what's wrong and can jump straight to it. A generic message or hiding fields leaves them hunting.",
  },
  {
    id: "ch-uiux-modal-misuse",
    category: "uiux",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt: "Which is the WEAKEST use case for a modal dialog?",
    options: [
      {
        id: "a",
        text: "A long, multi-step form the user may need to reference other parts of the app to finish.",
      },
      {
        id: "b",
        text: "Confirming a single destructive action that can't easily be undone afterwards.",
      },
      {
        id: "c",
        text: "A short, self-contained task like renaming one item in a list view.",
      },
      {
        id: "d",
        text: "An urgent alert the user must explicitly acknowledge before they can continue.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Modals suit short, focused, interrupting interactions. A long multi-step flow trapped in a modal fights the user — especially on mobile, and when they need to reference other content. That belongs on its own page or route.",
  },
  {
    id: "ch-uiux-infinite-scroll",
    category: "uiux",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "What's a well-known drawback of infinite scroll that pagination avoids?",
    options: [
      {
        id: "a",
        text: "It makes the footer hard to reach and breaks returning to your spot after navigating away.",
      },
      {
        id: "b",
        text: "Infinite scroll simply cannot be implemented accessibly under any circumstances.",
      },
      {
        id: "c",
        text: "Pagination always transfers less data, so it always finishes loading faster than scrolling.",
      },
      {
        id: "d",
        text: "Infinite scroll stops the browser from caching any of the results it fetches along the way.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Two classic infinite-scroll problems: footer/below-feed content becomes unreachable, and returning to a remembered scroll position after navigating away is unreliable. Pagination gives stable, linkable, restorable positions. The other options overstate or invent issues.",
  },
  {
    id: "ch-a11y-route-focus",
    category: "a11y",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "In a client-side-routed app, activating a nav link swaps in new main content. What should happen for keyboard and screen-reader users?",
    options: [
      {
        id: "a",
        text: "Move focus to the new view's heading or container, since no full load occurs to reset it.",
      },
      {
        id: "b",
        text: "Nothing — the browser moves focus back to the top of the document on any navigation.",
      },
      {
        id: "c",
        text: "Wrap the entire incoming view in `aria-live=\"assertive\"` so the whole thing is read out.",
      },
      {
        id: "d",
        text: "Send focus back to the navigation link the user activated to trigger the change.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Client-side route changes don't trigger the browser's normal focus reset, so focus can be left on a now-gone element. Move focus to the new heading/region (and optionally announce it). Reading the entire view via an assertive live region is overwhelming.",
  },
  {
    id: "ch-a11y-label-in-name",
    category: "a11y",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "A button shows the text 'Search' but has `aria-label=\"Submit query\"`. Why can this hurt users?",
    code: `<button aria-label="Submit query">Search</button>`,
    codeLang: "tsx",
    options: [
      {
        id: "a",
        text: "The accessible name drops the visible text, so saying 'click Search' won't activate it.",
      },
      {
        id: "b",
        text: "`aria-label` is ignored whenever a button already has visible text, so it does nothing here.",
      },
      {
        id: "c",
        text: "Screen readers read both, so the user hears 'Submit query Search' announced together.",
      },
      {
        id: "d",
        text: "`aria-label` is only valid on form inputs, so it has no effect on a button element.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "`aria-label` overrides the visible text as the accessible name. When the visible label isn't part of that name, speech-input users who say what they see can't target the control — the Label in Name failure (WCAG 2.5.3). Keep the visible text within the accessible name.",
  },
  {
    id: "ch-a11y-aria-disabled",
    category: "a11y",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "In a toolbar you want a temporarily-unavailable button to stay keyboard-focusable and discoverable. Which is better?",
    options: [
      {
        id: "a",
        text: "`aria-disabled=\"true\"` with a no-op handler — it shows the state but stays in the tab order.",
      },
      {
        id: "b",
        text: "The native `disabled` attribute, which keeps the control focusable while greying it out.",
      },
      {
        id: "c",
        text: "`hidden`, so the control disappears entirely until the moment it becomes available again.",
      },
      {
        id: "d",
        text: "`tabindex=\"-1\"` together with a greyed-out style to signal that it's currently unavailable.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "Native `disabled` removes a control from the tab order and from many AT interactions, so users may not discover it — bad for toolbars/menus where you want roving focus over all items. `aria-disabled` announces the state while keeping it focusable; you just prevent activation yourself.",
  },
  {
    id: "ch-a11y-modal-requirements",
    category: "a11y",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt: "Which set of behaviors does an accessible modal dialog require?",
    options: [
      {
        id: "a",
        text: "Trap focus while open, restore it on close, label it, use `role=\"dialog\"`/`aria-modal`, close on Escape.",
      },
      {
        id: "b",
        text: "Center it on the screen and dim out the rest of the page behind a large, semi-transparent background overlay.",
      },
      {
        id: "c",
        text: "Put `aria-hidden=\"true\"` on the dialog itself so the page behind it isn't announced.",
      },
      {
        id: "d",
        text: "Auto-focus the first field when it opens — and nothing beyond that is really required.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "The dialog pattern needs focus management (trap + restore), a name, the right role/`aria-modal`, and Escape-to-close. Option C is backwards — you mark the *background* inert/hidden, not the dialog. Visual centering and a single auto-focus aren't enough on their own.",
  },
  {
    id: "ch-a11y-focus-on-delete",
    category: "a11y",
    challenge: true,
    type: "mcq",
    difficulty: "hard",
    prompt:
      "A user deletes the list row that currently holds keyboard focus. Where should focus go?",
    options: [
      {
        id: "a",
        text: "To a sensible neighbour — the next row, or the previous one if the deleted row was last.",
      },
      {
        id: "b",
        text: "Nowhere in particular; the browser handles focus correctly when an element is removed.",
      },
      {
        id: "c",
        text: "Back to the top of the page, so the user can get their bearings and start again.",
      },
      {
        id: "d",
        text: "Only into an `aria-live` region announcing the deletion, with no change of focus at all.",
      },
    ],
    correctOptionId: "a",
    explanation:
      "When you remove the focused element, the browser drops focus to `<body>`, stranding keyboard and screen-reader users. Deliberately move focus to a logical neighbour (next/previous item, or a heading). Announcing the deletion is a nice addition but doesn't solve the lost-focus problem.",
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
  // Challenge mode (feeds the same topic stats as the normal pool)
  "ch-react-stale-closure": "React Hooks",
  "ch-react-derived-from-props": "State & props",
  "ch-react-effect-race": "React Hooks",
  "ch-react-key-reset": "Rendering & keys",
  "ch-react-batching": "State & props",
  "ch-uiux-optimistic": "Interaction & feedback",
  "ch-uiux-loader-timing": "Interaction & feedback",
  "ch-uiux-error-summary": "Interaction & feedback",
  "ch-uiux-modal-misuse": "UX heuristics",
  "ch-uiux-infinite-scroll": "UX heuristics",
  "ch-a11y-route-focus": "Visual & keyboard",
  "ch-a11y-label-in-name": "Names & labels",
  "ch-a11y-aria-disabled": "Semantic structure",
  "ch-a11y-modal-requirements": "Semantic structure",
  "ch-a11y-focus-on-delete": "Visual & keyboard",
};

function attachTopic(draft: QuestionDraft): Question {
  const topic = TOPIC_BY_ID[draft.id];
  if (!topic) throw new Error(`Question "${draft.id}" is missing a topic`);
  return { ...draft, topic } as Question;
}

export const QUESTION_BANK: Question[] = [
  ...react,
  ...uiux,
  ...a11y,
  ...challenge,
].map(attachTopic);

/** Number of questions in the challenge pool. */
export const CHALLENGE_COUNT = QUESTION_BANK.filter((q) => q.challenge).length;

/** Count of normal (non-challenge) questions in a category. */
export function normalCountForCategory(
  category: Question["category"]
): number {
  return QUESTION_BANK.filter((q) => q.category === category && !q.challenge)
    .length;
}

/** All topics that exist for a category, in first-seen order. */
export function topicsForCategory(category: Question["category"]): string[] {
  const seen = new Set<string>();
  for (const q of QUESTION_BANK) {
    if (q.category === category) seen.add(q.topic);
  }
  return [...seen];
}
