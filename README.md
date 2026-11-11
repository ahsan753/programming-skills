# Programming Skills website (pilot)

Self-paced Learn → Practise → Apply → Checkpoint pages for every programming skill in Cambridge IGCSE CS 0984.
Current release (11 Nov 2026): **Skills 1–22**, Worlds A–E: core building blocks (1–7), control structures (8–13), strings and library routines (14–15), subroutines (16–19) and data structures and files (20 1D arrays, 21 2D arrays, 22 File handling). Skills 23–33 are marked Coming soon.

## What's here
- `index.html`: the whole website in one file. Open it in a browser or upload it to GitHub Pages.
- `source/`: the parts it is built from. Edit these, then rebuild.
  - `src/content.js`: the skill map plus all the content and mark points for each skill.
  - `src/app.js`: the page, the practise/checkpoint marking and the shared marking helpers.
  - `src/game.js`: XP, levels, streaks, badges, locks, pop-ups and confetti.
  - `src/harness.py`: the Python that inspects and runs pupils' code in the browser.
  - `src/style.css`: the visual style.
  - `build.js`: joins everything into `index.html` (run `node build.js`).
  - `test/`: automatic tests. `run.js` puts right and wrong answers through the real checker; `journey.js` plays through Skill 1 as a pupil (locks, XP, badges, pop-ups).

## How the Apply marking works
Pupils paste code from their own editor. The page loads Python in the browser (Pyodide 0.26.4 from cdn.jsdelivr.net, about 10 MB, first time only) and:
1. **inspects the code** without running it: constants, assignments, `input()` calls and their conversions, comments and identifiers.
2. **runs it** with Cambridge-style test data (normal, extreme, plus an abnormal test for information) and records exactly what appears on screen.
3. **runs a change test**: it changes the constant's value and checks the output follows, which proves the constant is really used.

Each task's `mark()` function turns that into ✓/✗ mark points with spec references and feedback. Code never leaves the pupil's browser. A program that runs for longer than 8 seconds is stopped.

## Game layer (added 21 Oct 2026)
- **XP** is worked out from saved progress, so repeating a question can't farm it: Learn 20; each Practise question 10 (+5 if right first time); each Apply mark point 10 (+30 for full marks); each automatically marked Checkpoint mark 15 (+10 for full marks). Self-marked reflections count towards completion but do not earn XP or streaks. Skills 1–22 have a maximum of **9350 XP** (plus 100 for each skip-ahead challenge passed).
- **Levels**: Beginner 0, Explorer 60, Builder 150, Coder 280, Debugger 450, Developer 650, Pro 900, Ace 1200, Expert 1600, Architect 2100, Master 2700, Champion 3400, Grandmaster 4300, Hero 5000, Legend 5800, Mythic 6800, Titan 8000 XP. Add a level whenever a new world takes the maximum past the top one.
- **Streak**: correct answers in a row (Practise, Checkpoint, full-marks Apply). A wrong answer on an unfinished Practise or Apply task resets it. Repeating a solved task does not increase it.
- **11 badges**, shown on the home page (including 🚀 Fast track for passing a skip-ahead challenge).
- **Locks**: Practise opens after Learn; Apply after every Practise question is right; Checkpoint after every Apply task reaches “Nearly there” (60%+); the next skill after the previous skill's Checkpoint.
- **Teacher preview**: add `?teacher` to the address (e.g. `…/index.html?teacher`) and sign in with a **teacher login** in that tab to inspect every stage and model answer. Without a teacher sign-in, `?teacher` shows the normal student site with a prompt to sign in, so students can't use it to unlock stages or see model answers (changed 9 Nov 2026). The teacher role is read from the sign-in token, which only the teacher tool can set. Preview uses temporary, separate progress and awards no XP, streaks or badges. Removing the query returns to student mode.
- Pop-ups only for big moments (stage, task or skill complete). Level-ups and badges otherwise appear as toasts with confetti.

## Progress
Progress is saved in the pupil's own browser (localStorage). Saved data is checked against the content's mark limits before use. Stale tabs merge completed achievements instead of overwriting them, and a visible warning appears if saving fails. Checkpoint questions can be retried: the best mark is kept, and only the first attempt affects the streak. Unmarked work is kept too (restored 9 Nov 2026, after the 21 Oct versions were lost from the source): Apply code, typed Practise and Checkpoint answers, field values, trace-table cells, error corrections, classification selections, multiple-choice choices, and self-mark answers with their reveal state and ticks. Restoring a draft only shows the answer again; it never marks it or awards XP or streak. Each draft has a fixed shape for its question type and a length limit (20,000 characters for code, 5,000 for written answers, 500 per field). Typing is saved 300 ms after the last keystroke, and straight away when a box loses focus, the page changes, the tab is hidden or the page closes. Earned marks save immediately. Teacher preview drafts remain temporary and never touch student storage. Teachers see signed-in students' progress in the database, so there is no copy-to-Teams summary (removed 9 Nov 2026).

## Option order (added 9 Nov 2026)
Multiple-choice options and the buttons on classify questions are shuffled differently on each computer. A random number is kept on that computer (`ps-shuffle` in browser storage), so a neighbour's screen shows a different order and answers can't be copied by position, but the order stays the same when the page reloads. Questions whose options must stay in order ("Line 1, Line 2…" or "A …, B …") are never shuffled. Marking follows the option chosen, not its position.

## Skip-ahead challenges (added 8 Nov 2026)
A confident student can jump to a later world by passing a challenge on every skill before it (`source/src/fasttrack.js`).
- **Where:** a **⚡ Skip ahead** button appears on each locked world that has live skills (now World B and World C; later worlds get one automatically once their skills go live). In teacher preview (`?teacher`) every later world shows **Preview skip-ahead challenge**.
- **What's in it:**
  - one exam-style question for each earlier skill, drawn at random from that skill's Checkpoint questions (multi-mark ones where possible, so part marks count);
  - one Python coding task, drawn from the last two skills of the world before. It can be checked up to 3 times and the best score counts. Python errors and time-outs don't use up a check.
  - Each question can be answered once. Model answers are hidden.
  - Answers save as the student goes, so they can leave and come back. The challenge ends only when they press Finish.
- **Pass mark:** 80% overall, and at least one mark on every skill.
- **When they pass:**
  - the world opens and every earlier skill is marked **⚡ Tested out**;
  - tested-out skills stay open (every stage unlocked) to revisit, and their stages earn XP only when actually done;
  - the student gets +100 XP and the 🚀 Fast track badge;
- **When they don't:** the result shows marks per skill, and they can try again after an hour with a fresh random set. Where a skill has only one suitable question, that question can repeat.
- **Saving:** challenge state is saved with the rest of the progress in `_fast`, so it syncs to signed-in accounts. As with all marks here, results are self-reported.

## Student accounts and cloud saving (Supabase)
Students can sign in with a username and password made by the teacher. Their progress then saves to their account and follows them to any computer. Signing in is optional: without it the site works exactly as before, saving in that browser only.

- **Project:** Supabase "Programming Skills" (`nqmxehehpmlnlvwokoxn`, eu-central-1, free plan). Tables and rules are in `source/supabase/001_progress.sql`.
- **Data kept:** for each login, the username, display name, class and the same progress JSON the browser keeps (including Apply code and unmarked Practise/Checkpoint answers). Each student can read and change only their own row. Teacher logins can read every row (ready for a dashboard).
- **How syncing works** (`source/src/cloud.js`): the browser keeps a separate local copy per account, so students sharing a computer never mix. Changes save online about 2.5 seconds after they happen and when the tab is hidden or closed. The online copy is merged with the same best-result rules as before, and a save is refused if another computer saved first (the page then merges and retries), so working on two computers never loses marks.
- **First sign-in:** if the browser already has progress without an account, the student is asked whether it is theirs before it is added. Closing the question counts as No.
- **Code drafts:** each Apply draft records when it was last edited, and the newest edit wins, so an old copy on another computer can't replace newer code.
- **Newer releases:** progress on skills that an older open tab doesn't know about is kept in the cloud copy, never dropped.
- **Shared computers:** "Keep me signed in" is off by default, so closing the tab signs the student out. Signing out removes that account's local copy once it is safely saved online (an unconfirmed copy is kept until it is). It signs out every open tab of that account on that computer, but not the student's other computers.
- **Sign-in expired or revoked:** the page asks the student to sign in again and keeps their work on that computer until it is uploaded.

### Making logins (teacher)
Needs Node.js. Once only: in the Supabase dashboard open Project Settings → API Keys, copy a **secret** key, and save it in a file called `.programming-skills-secret-key` in your home folder (not in OneDrive). Never put the secret key in the website, a CSV or Teams.

```sh
cd source/supabase
node students.js add class-10A.csv        # CSV columns: name,class[,username]; writes logins-….csv with passwords
node students.js add-one "Ali Khan" 10A
node students.js reset ali.khan           # new password
node students.js list 10A                 # usernames and when each last saved
node students.js remove ali.khan          # deletes the login and its saved progress
node students.js teacher "Mr Shah"        # a teacher login (can read all progress)
```

Usernames are made from names (`ali.khan`, then `ali.khan2` …) unless the CSV gives one. Passwords look like `maple-otter-42`. Hand them out, then delete the logins file.

Supabase settings to keep: **Authentication → Sign In / Providers → turn off "Allow new users to sign up"** so only the teacher tool can create accounts. Free projects pause after a week with no activity (for example in the holidays). Restore the project from the dashboard before term starts, or upgrade to Pro to avoid pausing.

## World D: subroutines (added 11 Nov 2026)
Skills 16–19 live in their own files, `source/src/worldD-s16.js` … `worldD-s19.js`. `build.js` includes every `src/world<Letter>-s<N>.js` after `content.js`, in skill order, so put later worlds in `worldE-s20.js` and so on.

- **Skill 16 Procedures:** define vs CALL, flow of control, typed parameters, a parameter controlling a loop. Apply: "Team cheer" `cheer(team, times)`; "Player card" `show_player(name, score)` with High score! at 100. Checkpoint: June 2024 P21 Q2(b), November 2025 P22 Q2(b)(ii), and an exam-style Countdown procedure marked by running it.
- **Skill 17 Functions:** RETURN vs OUTPUT, RETURNS type, used in expressions (never CALL), Boolean returns. Apply: "League points" `points(result)`; "Strong password" `strong(password)` used in a loop. Checkpoint: June 2026 P21 Q11 (Power) and June 2025 P21 Q9(b) (Odds), both marked by running the pupil's pseudocode, plus a function trace.
- **Skill 18 Local and global variables:** scope, Python's `global`, same-name variables, why locals are safer (0984 pseudocode has no GLOBAL keyword). Apply: "Coin collector" (a procedure changes a global, watched through call tests); "Video length" `total_seconds(minutes, seconds)` with a local variable and no globals (constants in CAPITALS allowed). Checkpoint: June 2024 P21 Q2(a) matching, a scope trace (20, 8, 20), an MCQ.
- **Skill 19 Maintainable programs:** identifiers, comments, procedures/functions, constants; the exam answer is a method plus an example from the algorithm. Apply tasks are **tidy-ups of starter code**: behaviour must stay the same, change tests prove the constants are used, and the untouched starter scores 0 (renaming plus a comment earns those two marks). Checkpoint: June 2025 P21 Q6(b) and June 2023 P21 Q6 (self-marked) and an exam-style rewrite marked by running it.

### Checker features added for World D
- **Call tests** (`call:{fn,args}` or a list, optional `watch:[globals]`): the harness runs only definitions, imports and constant-style assignments, then calls the pupil's function and records each returned value (and the watched globals). Test cards show "▶ calls … ↩ returns …". `testSpec(t)` builds what the checker is sent (used by Apply, skip-ahead and the tests).
- **Harness analysis:** `info.funcs` (params, returnsValue, prints, inputs, globals, locals, freeNames, assignsGlobal), `info.userCalls` (where each call is, whether its value is used, whether it's in a loop), `info.ifCount`/`ifOwners`. Reading `__name__` is allowed, so `if __name__ == "__main__":` works; dunder names bound any other way are rejected.
- **Marking helpers:** `H.fn`, `H.fnMissing`, `H.ret`, `H.callOut`, `H.callLines`, `H.mainCalls` (calls from anywhere except the subroutine itself), `H.callErr`, `H.labelled` (the number on the answer line, so extra numbers after it don't matter).
- **`source/src/pseudo.js`:** a small Cambridge pseudocode interpreter (`PC.parse`, `PC.run`, used as `H.pcRun`/`H.pcParse`) for marking Checkpoint answers by running them. It walks a parse tree; answer text is never turned into JavaScript. Step, output, nesting and call-depth limits stop hostile answers hanging or crashing the page. No arrays or files yet (needed for World E).
- **New Checkpoint type `match`** (drop-downs, one mark per link), also used by skip-ahead challenges. Pseudocode `mark(L, H, raw)` now also receives the raw answer text.
- `starterCaption` on an Apply task changes the caption above its starter code. Skip-ahead coding tasks never use a task with starter code.
- **Audit (11 Nov 2026):** three independent reviews (content accuracy against the spec and mark schemes, security, fairness of marking). All confirmed issues were fixed; `source/test/worldD-regression.js` replays them.

## World E: data structures and files (added 11 Nov 2026)
Skills 20–22 are in `source/src/worldE-s20.js` … `worldE-s22.js`.

- **Skill 20 1D arrays:** declaring `ARRAY[1:n]`, 1-based pseudocode vs 0-based Python, a variable as the index, filling and reading with loops. Apply (Python): "Squad list" (five names into a list with a loop, numbered output printed by a loop); "Level select" (list of five levels, `levels[number - 1]`, rejects 0, 6, 7 and -1; levels 2 and 4 are tested too). Checkpoint: June 2025 P21 Q3 (rewrite with a condition-controlled loop, run), June 2025 P22 Q5(a) (five errors), exam-style declare-and-zero 30 elements (run).
- **Skill 21 2D arrays:** `ARRAY[1:r, 1:c]`, `Grid[Row, Column]`, lists of lists, nested loops, the `[[...]*3]*3` trap. Apply (Python): "Noughts and crosses" (place X, print the board with a loop; corner tests catch swapped indexes); "Scoreboard" (input inside nested loops into a 2D list). Checkpoint: November 2025 P22 Q2(b)(i) NewData (run; MP2 needs the identifier Number), November 2025 P22 Q2(a) (**any five of six** errors), exam-style trace.
- **Skill 22 File handling:** reasons for files, OPENFILE/READFILE/WRITEFILE/CLOSEFILE, WRITE wipes a file, reading several lines using a count on the first line. **Apply tasks are pseudocode (Ahsan's choice)**, run against virtual files: "Save the high score" (HighScore.txt) and "Read the team sheet" (Team.txt, 2, 3 and 5 players). Quotation marks round file names earn a mark (a variable holding the name is fine). Checkpoint: June 2026 P21 Q5(c) (missing quotes or wrong name "penalise once"), June 2024 P21 Q7(b) (five mark points, max 4), November 2024 P22 Q10 (nine mark points, max 6); the 2024 schemes accept unquoted names, with a tip.

### Checker features added for World E
- **Pseudocode Apply tasks** (`lang:"pc"` on a task, optional `files` shown in the brief, tests with `files:{name:[lines]}`): `pcCheck()` runs each test through `PC.run`; unreadable lines are listed ("Not run yet") before running; test cards show the files at the start and afterwards (trimmed). Skip-ahead coding tasks never use pseudocode tasks.
- **`pseudo.js`:** 1D/2D arrays (bounds checked, uninitialised reads reported, `Name[i][j]` flagged), files (quoted, bare or variable names; names match whatever the capitals; READ needs an existing file; WRITE starts empty; reading past the end is an error), `res.events`, `res.files`, `res.fileOps`, `res.stillOpen`, `res.cell()`, `arrays` option for pre-populated arrays, `prog.nextErrors` when NEXT names the wrong counter. Limits: 10,000-character strings, 100-character file names, 5,000 file operations, 2,000 lines per file, 100,000 array cells.
- **Harness:** `info.listNames`, `lists2d`, `subscripts`, `subscripts2`, `listLiterals`, `printCount`, `printInLoop`, and `inputs[].inLoop`/`loopDepth` (comprehensions count as loops). Output events now record which print call and which source line wrote them; `H.outLines`, `H.loopPrinted` (were these lines printed by a loop?) and `H.afterInput` use this.
- **Checkpoints:** errors questions can list more errors than marks ("find any N"; an error may accept several `lines`); pseudocode scores are capped at the question's marks (`maxNote` explains), so schemes with extra mark points work.
- **Audit (11 Nov 2026):** three independent reviews again (content, security, marking fairness); all confirmed issues fixed and replayed in `source/test/worldE-regression.js` (92 checks).

## Adding the next skill
Create `source/src/world<Letter>-s<N>.js` with `SKILLS.sN = {...}` (same shape as the World D files), then set the 4th item of its row in `SKILL_MAP` to `"sN"` only once the skill exists. Use call tests for function tasks, labelled numbers rather than "last number printed", boundary tests, and varied MCQ answers. Check pseudocode against the 0984 guide (not 9618) and mark pseudocode checkpoints by running them with `H.pcRun` where possible. Rebuild, run every suite, update the XP totals in `test/adversarial.js` and the world list in `test/fasttrack.js`, and add a level if the maximum XP passes the top one.

## Security limits
This is a browser-only learning tool. Students who edit browser storage or run JavaScript can still forge in-range marks, unlock stages, inspect model answers or edit a copied summary. Progress summaries are labelled self-reported. Client-side limits prevent accidental overflows and common reward farming; they do not establish verified attainment. Signed-in accounts stop progress being lost or mixed up between computers, but marking still happens in the browser, so saved marks are still self-reported. Reliable teacher records or competitive leaderboards would need server-side marking/reward records. Do not place a secret API key or teacher password in this HTML.

Pupil Python runs with a restricted set of built-ins. `.format()` is only accepted straight after a string in quotes (or use an f-string), so format fields can be checked; ordinary text containing underscores is allowed. Imports, browser access and private Python internals are unavailable for these pilot tasks. Checks run one at a time, stop after eight seconds, and recover after worker errors or loading failures. This is a limited classroom checker, not a general Python interpreter or a security-certified sandbox.

## Verification
Install Playwright (`npm install --no-save playwright`), with a supported Chromium browser or Google Chrome available. From this folder:

```sh
node source/build.js
node source/test/run.js        # correct/incorrect answers, syntax errors and timeout recovery
node source/test/security.js   # reward limits, persistence, preview isolation, failures and mobile layout
node source/test/journey.js    # a pupil's complete Skill 1 journey
node source/test/ui.js         # every Practise/Checkpoint interaction type
node source/test/experience.js # keyboard, drafts, dialogs, both themes, mobile and loading stability
node source/test/cloud.js      # sign-in, import question, two computers at once, sign-out (real Supabase, TEST logins)
node source/test/cloud-edge.js # offline, expired/revoked sign-in, closing mid-save, tampered data, tabs, drafts, rate limits
node source/test/fasttrack.js  # skip-ahead challenges: paper, one-answer questions, coding task, pass/fail, cooldown, tested-out skills
node source/test/shuffle.js    # option order differs between computers, stays on reload, marking unaffected
node source/test/teacher-gate.js # ?teacher needs a teacher sign-in; students stay in student mode
node source/test/adversarial.js # sandbox escapes, forged saves, hostile drafts (exits non-zero on failure)
node source/test/checkpoints.js # every Checkpoint question's correct answer scores full marks (Skills 2–19)
node source/test/worldB-smoke.js # every Apply model answer full marks, off-task 0, hard-coded output never full marks (Skills 8–19)
node source/test/worldB-regression.js; node source/test/worldC-regression.js; node source/test/worldD-regression.js; node source/test/worldE-regression.js # each world's audit cases
```

Set `PLAYWRIGHT_CHANNEL=chrome` to select installed Google Chrome if needed. `experience.js` downloads axe-core from jsDelivr; set `AXE_PATH` to a local `axe.min.js` to run it offline. The browser tests need internet access for Pyodide. See `AUDIT.md` for the findings and residual limitations.

## Accessibility and interface behaviour
In code boxes Tab indents and Shift+Tab un-indents, like a code editor; press Esc and then Tab to move on to the next button (a hint under each box says so). Completion dialogs keep their action visible on short screens, contain keyboard focus, close with Escape and restore focus. Trace cells and written-code fields have descriptive labels. Stage locks and progress percentages refresh as marks change. Feedback has a concise polite screen-reader announcement. Both colour themes are tested with axe-core; these automated checks complement keyboard and layout tests and are not a complete conformance certification.

## Saved data compatibility
The progress key remains `igcse-progskills-v1`. Existing valid progress, best marks and Apply drafts are retained; missing answer-draft fields initialise empty. Only known questions and bounded, typed answer data are accepted. New drafts never award marks merely by being restored. When an Apply task's declared mark total changes, an older score with a different denominator is discarded and the task must be checked again; other progress and saved drafts remain. Do not reinterpret an old score as newly earned marks without an explicit migration.
