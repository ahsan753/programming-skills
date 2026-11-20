# Programming Skills website (pilot)

Self-paced Learn → Practise → Apply → Checkpoint pages for every programming skill in Cambridge IGCSE CS 0984.
Current release (11 Nov 2026): **Skills 1–22**, Worlds A–E: core building blocks (1–7), control structures (8–13), strings and library routines (14–15), subroutines (16–19) and data structures and files (20 1D arrays, 21 2D arrays, 22 File handling). Skills 23–33 are marked Coming soon.

**Pseudocode split (built 19 Nov 2026, awaiting the teacher's review; not published).** **0984 compliance pass (20 Nov 2026):** see [Cambridge 0984 compliance](#cambridge-0984-compliance-20-nov-2026). The path is now Skill 0 → Python Skill 1 → Pseudocode Unit 1 → Python Skill 2 → … → Unit 22. Each Python skill page is Python only, and its pseudocode material sits in its own unit straight after it. See [The learning path and pseudocode units](#the-learning-path-and-pseudocode-units-19-nov-2026) and `PSEUDOCODE-SPLIT-DESIGN.md`. **Run `source/supabase/004_units.sql` early, before publishing it** (it doesn't change anything for the site that's live now).

## What's here
- `index.html`: the whole website in one file. Open it in a browser or upload it to GitHub Pages.
- `source/`: the parts it is built from. Edit these, then rebuild.
  - `src/content.js`: the skill map plus all the content and mark points for Skills 1–15 and their units. Skill 0 is `src/world0-s0.js`; Skills 16–22 and their units are in `src/worldD-s16.js` … `src/worldE-s22.js`.
  - `src/legacy.js`: `LEGACY_ORDER` (the frozen table of old question positions) and `convertLegacy()`, which moves old saved progress onto question ids.
  - `src/app.js`: the page, the practise/checkpoint marking and the shared marking helpers.
  - `src/game.js`: XP, levels, streaks, badges, locks, pop-ups and confetti.
  - `src/fasttrack.js`: skip-ahead challenges. `src/pseudo.js`: the pseudocode interpreter. `src/cloud.js`: sign-in and cloud saving. `src/teacher.js`: the teacher dashboard (built as a separate file).
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
- **XP** is worked out from saved progress, so repeating a question can't farm it: Learn 20; each Practise question 10 (+5 if right first time); each Apply mark point 10 (+30 for full marks, except Skill 0's task, which has no bonus); each automatically marked Checkpoint mark 15 (+10 for full marks). Self-marked reflections count towards completion but do not earn XP or streaks. Skill 0, the Python skills and the pseudocode units all earn XP at these rates (a unit's Replicate task counts like an Apply task). Skills 0–22 and Units 1–22 have a maximum of **17,280 XP** (Skill 0 125, Python Skills 1–22 8990, Units 1–22 8165), plus 100 for each skip-ahead challenge passed (4 challenges today, so 17,680 at most). Before the split, Skills 1–22 had a maximum of 9350; a student's old work still gives the same XP after conversion (`test/adversarial.js`).
- **Levels**: Beginner 0, Explorer 60, Builder 150, Coder 280, Debugger 450, Developer 650, Pro 900, Ace 1200, Expert 1600, Architect 2100, Master 2700, Champion 3400, Grandmaster 4300, Hero 5000, Legend 5800, Mythic 6800, Titan 8000, Wizard 9400, Virtuoso 11000, Sage 12800, Oracle 14800, Supernova 17000, Immortal 19400 XP. Above Titan each gap is 200 XP bigger than the one before (1400, 1600 … 2400). Immortal is above today's maximum, so there is room for Skills 23–33; add a level whenever a new world takes the maximum past the top one. **Never raise a threshold**: levels are worked out from XP, so raising one could take a level away from a student. (Skill 0 at full marks is 125 XP, which reaches Explorer but not Builder, so Skill 0 gives one level-up. Its Apply task has no full-marks bonus for this reason; Skill 0 isn't published, so this lowered nobody's level.)
- **Streak**: correct answers in a row (Practise, Checkpoint, full-marks Apply). A wrong answer on an unfinished Practise or Apply task resets it. Repeating a solved task does not increase it.
- **11 badges**, shown on the home page (including 🚀 Fast track for passing a skip-ahead challenge). 🏆 Skill master is earned by finishing all four stages of a skill or a pseudocode unit.
- **Locks**: Practise opens after Learn; Apply (Replicate in a unit) after every Practise question is right; Checkpoint after every Apply task reaches “Nearly there” (60%+); the next item on the path after the previous item's Checkpoint (see the learning path below).
- **Teacher preview**: add `?teacher` to the address (e.g. `…/index.html?teacher`) and sign in with a **teacher login** in that tab to inspect every stage and model answer. Without a teacher sign-in, `?teacher` shows the normal student site with a prompt to sign in, so students can't use it to unlock stages or see model answers (changed 9 Nov 2026). The teacher role is read from the sign-in token, which only the teacher tool can set. Preview uses temporary, separate progress and awards no XP, streaks or badges. Removing the query returns to student mode.
- Pop-ups only for big moments (stage, task or skill complete). Level-ups and badges otherwise appear as toasts with confetti.

## The learning path and pseudocode units (19 Nov 2026)
A student learns each skill in Python first, then straight away replicates it in Cambridge pseudocode. Design and decisions: `PSEUDOCODE-SPLIT-DESIGN.md`; build log: `PSEUDOCODE-SPLIT-LOG.md`.

- **The path:** Skill 0 → Python Skill 1 → Pseudocode Unit 1 → Python Skill 2 → Unit 2 → … → Unit 22, one route on the home page map.
  - **Skill 0** "Start here: your first Python program" (`src/world0-s0.js`) has Learn, Practise and Apply, and no Checkpoint. It is done once Learn and Practise are finished and its task reaches “Nearly there”. Students who had finished the Skill 1 Learn stage before Skill 0 existed count as past it: their map shows “Optional · done” (a student who actually did it sees “Done”).
  - **Python skill pages** (`s1` … `s22`) contain only Python and language-neutral theory, plus 3–4 new Python Checkpoint questions each.
  - **Pseudocode units** are stored as their own skills, `s1pc` … `s22pc`, each a row in `SKILL_MAP` straight after its skill with `{unit:true}`. They hold the pseudocode Learn sections, Practise and Checkpoint questions moved from the skill, and a **Replicate** stage (the third stage): the student rewrites their own Apply programs from the Python skill in pseudocode (`replicates:"a1"` on the task). Their saved Python is shown beside the box; if there is none (tested out, or saved on another computer), the model Python answer is shown, clearly labelled. Unit nodes are slate with a rounded badge and labelled “📝 N · Pseudocode”.
- **Locks:** Skill 0 is always open; Skill 1 opens when Skill 0 is done; Unit N opens when Skill N's Checkpoint is done; Skill N+1 opens when Unit N's Checkpoint is done (so both are needed). Teacher preview opens everything, as before.
- **Nobody is locked out by the update:** an item with saved work never locks, and anything a student had already opened before the units arrived stays open (`PROG._open`, worked out once when old progress is loaded). Units they skipped show **Catch up** on the map and in the dashboard, and the home page's Continue button carries on from where they were.
- **What students and teachers will see after this release:** students keep every mark, XP point and badge, and nothing they had opened is locked. But each Python Skill 1–22 now has 3–4 new Python Checkpoint questions, which nobody has answered yet, so a Python skill a student had finished is **no longer shown as done (★)** until they answer the new questions, and its percentage dips a little. On the dashboard, **"Skills done" drops to about 0 for everyone** at release (it needs both the Python skill and its unit finished), and rises again as students answer the new questions and finish their units. This is expected, not lost work; behaviour is deliberately unchanged.
- **Fixed question ids:** Practise and Checkpoint questions have fixed ids (`p1`, `p2` … and `c1`, `c2` … within each skill or unit), and progress (`practise`, `check`, `att`, `first`, `choices`, `pdraft`, `cdraft`) is saved by id. A question that moved to its unit keeps its id. Old progress, saved by position, is converted when it loads (local or cloud) using `LEGACY_ORDER` in `src/legacy.js`, a frozen table of the old positions. Marks for moved questions go to the same question in its unit, so nobody loses or gains marks, XP or badges. Converted progress is saved with `_v: 2`; conversion is safe to run twice and works with the merge rules (best mark wins, newest draft wins). **Never reorder `LEGACY_ORDER`**; if a question moves again, change only the target skill of its entry.
- **The Python editor link** is one constant, `PY_WEB_EDITOR = "https://editor.raspberrypi.org/"`, near the top of `src/app.js`. Skill 0 links to it (opening in a new tab). Swap in a class project link there if you have one, then rebuild.
- **Python file handling (Skill 22):** Skill 22's Apply tasks are now Python. The checker gives pupils' code a pretend `open()` (in memory, never the real disk) with the test's starting files (`files:{"Team.txt":[…]}` on a test); `FileNotFoundError` and friends behave as in real Python, and the run reports the files afterwards (`files_out`) and any left open (`files_open`), so tasks can mark the mode by its effect and check the file was closed (or `with` was used). The pseudocode file tasks moved to Unit 22. Tests: `test/pyfiles.js`.
- **Before publishing this release:** run `source/supabase/004_units.sql` once in the Supabase SQL Editor, and do it **early** (see below): it doesn't affect the site that's live now, and it must be in place first, so a tab left open across the release can't overwrite new marks with an old-format save. Check it's in place with `select tgname from pg_trigger where tgname='guard_format';` (one row). Then publish `index.html` and `teacher.js` together.
- **Tests for the split:** `ids.js` (fixed ids and conversion give the same XP and percentages as before), `units.js` (order, locks, Catch up, Skill 0, levels and XP), `replicate.js`, `pyfiles.js`, `split.js` (Python pages have no pseudocode syntax, moved questions keep their ids and marks), `history-sql.js` (includes `004_units.sql`).

## Progress reset (prepared 20 Nov 2026)
The site is in alpha, so every student starts again with this release (Skill 0, the pseudocode units and the 0984 fixes). Logins, names and classes are kept.
- **In the site:** progress is now stored in the browser as `igcse-progskills-v2`. Copies under the old name `igcse-progskills-v1` (with or without an account suffix) are never read and are deleted when the page loads (`src/cloud.js`, `test/reset.js`).
- **In the database:** `source/supabase/005_reset.sql` backs up `progress` and `progress_daily` into `private.progress_backup_20261120` and `private.progress_daily_backup_20261120` (not reachable from the website), deletes every progress row and snapshot, and adds a guard that refuses the old page's format on insert and update, so a tab left open on the old page can't put old marks back. It records the reset in `private.reset_log` and is safe to run twice (the clear happens once). Tested in `test/history-sql.js`.
- **Order:** in the Supabase SQL Editor run `004_units.sql`, then `005_reset.sql`; then publish `index.html` and `teacher.js` together. Re-running `004` later is harmless: `005`'s guard is a separate trigger (`guard_reset`) and stays in place.
- **To restore one student's old progress** (only if ever needed): in the SQL Editor, copy their row back from `private.progress_backup_20261120`. Old rows are in the pre-split format, which the site converts when it loads them.

## Cambridge 0984 compliance (20 Nov 2026)
The site teaches pseudocode exactly as the **pseudocode guide in the 0984 syllabus** writes it (`Admin/spec.txt`, from line 1587), and teaches nothing the syllabus (8.1–8.3) doesn't list. `test/compliance.js` checks this on every build; run it after any content change.

- **Constants:** `CONSTANT <identifier> ← <value>`, a literal only. `CONSTANT X = v` is never taught, and in marking it loses the constant mark with the right form shown (`RP.EQ_MSG`).
- **IF layout:** `IF <condition>` on its own line, `THEN` and `ELSE` two spaces in, statements four spaces in, `ENDIF` lined up with the IF. Marking still credits `THEN` at the end of the IF line (layout isn't a syntax error), but no sample, hint or feedback shows it that way.
- **CASE:** clauses two spaces in; `OTHERWISE <statement>` with **no colon**; one value per clause (no ranges).
- **FOR loops:** `NEXT <identifier>` always. A bare `NEXT` is reported by the checker (`nextErrors`, `bare:true`) and loses the loop mark.
- **MOD and DIV** only in function form, `MOD(a, b)` / `DIV(a, b)`.
- **No string joining:** the 0984 guide has no `&` and no `+` for strings. To show several values on one line, list them after `OUTPUT`, separated by commas. Skill 13's second Apply task is now **Stadium seats** (nested loops printing `Row 1 Seat 1` …), replacing Star rectangle, which needed `&`. Skill 21's Python prints a row with `print(row[0], row[1], row[2])` instead of `join`.
- **Files:** only `READ` and `WRITE` modes. Skill 22's Python teaches `"r"` and `"w"` with `open` … `close()`; append mode (`"a"`), `with` and `for line in file` were removed (several lines are read with a count on the first line, as in the pseudocode).
- **The checker (`pseudo.js`) follows the guide:** `&`, `+` on text, infix `MOD`/`DIV`, `OTHERWISE :` and CASE ranges are refused with a message saying what to write; `EOF`, `NUM_TO_STR` and other A Level routines already were.
- **Wording:** no "some Cambridge materials…", "both are accepted" or "usually accepted" notes. Unit 15 no longer claims how Cambridge's ROUND treats halves (the guide doesn't say).
- **Display:** code fonts never draw `>=`, `<=` or `<>` as one symbol (ligatures off, `style.css`), so students see exactly what to type. The arrow can be typed as `<-` (the box says it is read as ←).
- Python is the implementation language: its own mechanics (`int(input(...))`, `str()`, `file.write(x + "\n")`, `elif`, `while True` … `break` for REPEAT) stay, because candidates may answer in Python; no Python page teaches a concept outside 8.1–8.3.

## Progress
Progress is saved in the pupil's own browser (localStorage). Saved data is checked against the content's mark limits before use. Stale tabs merge completed achievements instead of overwriting them, and a visible warning appears if saving fails. Checkpoint questions can be retried: the best mark is kept, and only the first attempt affects the streak. Unmarked work is kept too (restored 9 Nov 2026, after the 21 Oct versions were lost from the source): Apply code, typed Practise and Checkpoint answers, field values, trace-table cells, error corrections, classification selections, multiple-choice choices, and self-mark answers with their reveal state and ticks. Restoring a draft only shows the answer again; it never marks it or awards XP or streak. Each draft has a fixed shape for its question type and a length limit (20,000 characters for code, 5,000 for written answers, 500 per field). Typing is saved 300 ms after the last keystroke, and straight away when a box loses focus, the page changes, the tab is hidden or the page closes. Earned marks save immediately. Teacher preview drafts remain temporary and never touch student storage. Teachers see signed-in students' progress in the database, so there is no copy-to-Teams summary (removed 9 Nov 2026).

## Option order (added 9 Nov 2026)
Multiple-choice options and the buttons on classify questions are shuffled differently on each computer. A random number is kept on that computer (`ps-shuffle` in browser storage), so a neighbour's screen shows a different order and answers can't be copied by position, but the order stays the same when the page reloads. Questions whose options must stay in order ("Line 1, Line 2…" or "A …, B …") are never shuffled. Marking follows the option chosen, not its position.

## Skip-ahead challenges (added 8 Nov 2026)
A confident student can jump to a later world by passing a challenge on every skill before it (`source/src/fasttrack.js`).
- **Where:** a **⚡ Skip ahead** button appears on each locked world that has live skills (Worlds B to E; any later world gets one automatically once its skills go live). In teacher preview (`?teacher`) every later world shows **Preview skip-ahead challenge**.
- **What's in it:**
  - one exam-style question for each earlier skill **and one for each earlier pseudocode unit** (Task 10 of the split), drawn at random from that skill's or unit's Checkpoint questions (multi-mark ones where possible, so part marks count). Skill 0 has no Checkpoint, so it isn't on the paper. The World B challenge has 14 questions, C 26, D 30, E 38. Each unit's question sits straight after its skill's;
  - one Python coding task, drawn from the last two skills of the world before. It can be checked up to 3 times and the best score counts. Python errors and time-outs don't use up a check.
  - Each question can be answered once. Model answers are hidden.
  - Answers save as the student goes, so they can leave and come back. The challenge ends only when they press Finish.
  - The paper is worked out from a saved seed. The unit questions are drawn after the Python questions and the coding task, so a challenge started before this release keeps its coding task and any answered marks. The Python questions on a challenge already in progress may be new, because the Python Checkpoints were rewritten: a saved mark higher than the new question's marks is dropped and that question can be answered again.
- **Pass mark:** 80% overall, and at least one mark on every skill. A skill's marks include its unit's question (and the coding task, for the skill it comes from), so a mark on either counts.
- **When they pass:**
  - the world opens and every earlier skill and unit (and Skill 0) is marked **⚡ Tested out**, so the student isn't stuck behind a unit;
  - tested-out skills stay open (every stage unlocked) to revisit, and their stages earn XP only when actually done;
  - the student gets +100 XP and the 🚀 Fast track badge;
- **When they don't:** the result shows marks per skill, and they can try again after an hour with a fresh random set. Where a skill has only one suitable question, that question can repeat.
- **Saving:** challenge state is saved with the rest of the progress in `_fast`, so it syncs to signed-in accounts. As with all marks here, results are self-reported.

## Student accounts and cloud saving (Supabase)
Students sign in with a username and password made by the teacher. Their progress then saves to their account and follows them to any computer.

- **Sign-in is required (12 Nov 2026).** Visitors who aren't signed in see a welcome page with the sign-in form, and no skill opens until they sign in, so every student's work reaches the teacher dashboard. Progress already saved in a browser without an account is offered on first sign-in, as before.
- **Emergency switch:** if Supabase is down or paused and students can't sign in, set `const REQUIRE_SIGNIN = true;` in `source/src/app.js` to `false`, rebuild and publish. The site then works without accounts, saving in each browser, as it used to.

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

## Teacher dashboard (Phase 1, added 12 Nov 2026)
Sign in on the site with a **teacher login** and a **📊 Dashboard** button appears in the header (`#teacher`). Students never see it, and if a student opens `#teacher` the page refuses. More importantly, the database only gives other students' data to teacher logins. Plan and later phases: `TEACHER-PORTAL-PLAN.md`.

- **Class overview:**
  - class menu, and cards for students, active in the last 7 days, average progress and need help;
  - a sortable grid with one row per student: last active, level, XP, skills done, overall %, and for each skill a **Py** (Python) and a **Pc** (pseudocode unit) cell under a “Skill N” heading (not started / in progress % / ✓ Checkpoint done / ⚡ tested out). A unit left behind shows **Catch up**. A unit counted as done from old Checkpoint answers whose Replicate tasks aren't at “Nearly there” yet shows **✓ R0/2** (Replicate tasks done / total). Hover a cell for details.
  - **Skills done** counts Skill 1 onwards only when the Python skill **and** its unit are both done (or tested out), out of 22. Skill 0 has its own cell but isn't counted, so students who skipped it compare fairly with those who did it.
  - the CSV has three columns per skill and per unit: `S1 Py %`, `S1 Py Apply`, `S1 Py Checkpoint`, `S1 Pc %`, `S1 Pc Replicate`, `S1 Pc Checkpoint` … (Skill 0 is `S0`).
- **Who needs help:** automatic flags with reasons:
  - no activity for 4+ days, or never signed in;
  - 3+ tries on a Practise question without solving it;
  - 3+ checks on an Apply task while still below 60%;
  - below 60% on a finished Checkpoint;
  - 2+ skills behind the class median.
  Units are flagged too, named “Skill N Pseudocode …”. Adjust these under "Adjust when students are flagged"; the settings are kept in that browser.
- **Started** means any saved work or any attempt (a wrong Practise try, an Apply check). This one meaning (`hasStarted()` in `game.js`) is used by the dashboard and by the first-sign-in question, which names units (“Skill 1, Unit 1 (pseudocode)”). Locks use only saved work (`hasProgress()`), so a try alone never changes what is open.
- **Student page:** every Practise result (first time / tries), Apply best mark, checks and saved code, Checkpoint marks, badges with dates, skip-ahead challenges, and preview links to each stage.
- **Question analysis:** per question, how many tried, % solved / right first time / average mark / full marks, average tries, and the class's 10 hardest questions.
- **Export:** class grid and question analysis download as CSV files that open in Excel. Cells that start with `=`, `+`, `-` or `@` are prefixed so they can't run as formulas.
- **How it works:** `source/src/teacher.js` is built to a separate `teacher.js` file, loaded only for teacher logins, so students' page load doesn't grow. **Publish `teacher.js` together with `index.html`.** It reads every profile and progress row (teacher logins only, by the database rules) and works out the figures with the same functions the student site uses, so numbers match what each student sees. Teacher accounts and `test.*` logins are left out of class lists.
- **Limits:** marks are worked out in students' browsers, so treat them as a guide, not exam evidence. Dates and activity counts in the history *are* trustworthy, because the database records them.

## Progress history (Phase 2, switched on 19 Nov 2026)
The database keeps one snapshot per student per school day, so the dashboard can show change over time.

- **How it's recorded** (`source/supabase/002_history.sql`): a trigger on `progress` writes to `progress_daily` whenever a student's progress changes, with that day's save count. The student page is unchanged, and students can't skip, read, change or backdate it. Only teacher logins can read it.
- **Days** are school days in Qatar time (UTC+3). **Weeks** are rolling 7-day blocks ending today.
- **What a snapshot keeps:** marks, attempts, badges and skip-ahead results only (an allow-list). Never code, typed drafts or multiple-choice choices.
- **Starting point:** switching it on copies everyone's current progress, dated the day they last saved, with 0 saves. Work done before then shows as "by <date>", not as an exact completion date.
- **In the dashboard:**
  - class grid: a **Last 7 days** column (days active out of 7; hover for saves), also in the CSV;
  - **History** tab: active students, student-days of work and saves in the last 7 days; the class's average overall progress at the end of each week (with a table view); a days-active grid for the last 8 weeks, with CSV download;
  - student page: an **Activity** strip (one square per day, 8 weeks), an overall-progress chart and **Completed on** dates for each stage of each skill.
- **If it isn't switched on yet**, the rest of the dashboard works and the History views say to run `002_history.sql`.
- **Size:** at launch the 35 starting snapshots averaged under 1 KB each. Even at about 5 KB per student per active day (a student far into the course), that is roughly 40 MB a year for 40 students (the free plan allows 500 MB).
- **Switching it on:** open the Supabase dashboard → SQL Editor, paste `source/supabase/002_history.sql` and run it once. Then run `node source/test/cloud-attack.js`.

## Managing classes and students (Phase 4, live 19 Nov 2026)
The dashboard's **Manage** tab does everything `students.js` did for student logins, plus classes.

- **Classes:** add, rename and delete. A class can exist before it has students. Deleting a class moves its students to **No class**; their logins and work are kept. Renaming a class renames it for its students.
- **Add students:** paste names, one per line (optionally `Name, username`), up to 40 at a time, into any class. Usernames are made from names as before (`ali.khan`, then `ali.khan2`), and passwords look the same (`maple-otter-42`).
- **New passwords are shown once**, with **🖨 Print login slips** (two per row, with the website address) and a CSV download. They're kept only in that browser tab until you press Done.
- **Per student:** reset password, rename, archive. Tick several to move, reset or archive them together.
- **Archive** (instead of deleting straight away): the login is switched off at once, every session is signed out, and saving is refused even from a tab left open. The work is kept and the student disappears from the dashboard's views. **Restore** brings them back with the same password and work. **Delete permanently** (archived students only, after typing the username) removes the login, progress and history for good.
- **How it works:** changes go through a Supabase Edge Function, `teacher-admin` (`source/supabase/functions/teacher-admin/`), which holds the server-only key. It checks the caller is a teacher login (in the database, not just the token), only ever changes **student** logins, handles at most 40 accounts per request, and records every action in `admin_log` (who, what, when; never passwords). The tables are in `source/supabase/003_manage.sql`; nobody can write them directly from the website, teachers included.
- **Teacher logins** are still made with `node students.js teacher "Name"`. `students.js` keeps working for students too, and now adds a new class to the class list automatically.
- The class `TEST` holds the automated tests' logins and is hidden in the dashboard.
- **Switching it on:** run `003_manage.sql` in the Supabase SQL Editor, deploy the function (`supabase functions deploy teacher-admin`), then run `node source/test/cloud-admin.js` and `node source/test/cloud-attack.js`.

- **Pseudocode units release (`004_units.sql`):** run `004_units.sql` once in the SQL Editor **before** publishing this release (step 1 of publishing it; step 2 is publishing `index.html` and `teacher.js` together). Run it **early**: it doesn't affect the site that's live now (the current page never writes `_v`, so the guard never applies to its saves, and the history simply keeps a few more keys). It lets the history keep the new unit keys (`s1pc` and so on) and adds a guard that refuses a save in the old position-keyed format (numeric keys in `practise`, `check` or `att`, such as `practise: {"0": true}` or `att: {"0": 0}`) over a row the new page has already saved (`_v` of 2 or more; error `old page format`), so a tab left open across the release can't overwrite marks. It is safe to run twice. **Check it's in place:** `select tgname from pg_trigger where tgname='guard_format';` should return one row. **If you published first,** run it now: until then an old tab could overwrite marks, and the history snapshots from those days lack the unit data (`s1pc` …) and `_v` (the dashboard's History tab says so: "History isn't recording pseudocode units yet"). Later snapshots are complete. Tested locally with `node source/test/history-sql.js`; running it on the live project needs the teacher's yes.

## World D: subroutines (added 11 Nov 2026)
*Since the pseudocode split (19 Nov 2026), the pseudocode parts of these skills, and the Checkpoint papers marked as pseudocode, are in each skill's unit (`s16pc` … `s19pc`, in the same files); each Python Checkpoint has four new exam-style Python questions.*
Skills 16–19 live in their own files, `source/src/worldD-s16.js` … `worldD-s19.js`. `build.js` includes every `src/world<Letter>-s<N>.js` after `content.js`, in skill order, so put later worlds in `worldE-s20.js` and so on.

- **Skill 16 Procedures:** define vs CALL, flow of control, typed parameters, a parameter controlling a loop. Apply: "Team cheer" `cheer(team, times)`; "Player card" `show_player(name, score)` with High score! at 100. Checkpoint: four new exam-style Python questions. Unit 16 Checkpoint: June 2024 P21 Q2(b), November 2025 P22 Q2(b)(ii), and an exam-style Countdown procedure marked by running it.
- **Skill 17 Functions:** RETURN vs OUTPUT, RETURNS type, used in expressions (never CALL), Boolean returns. Apply: "League points" `points(result)`; "Strong password" `strong(password)` used in a loop. Checkpoint: four new exam-style Python questions. Unit 17 Checkpoint: June 2026 P21 Q11 (Power) and June 2025 P21 Q9(b) (Odds), both marked by running the pupil's pseudocode, plus a function trace.
- **Skill 18 Local and global variables:** scope, Python's `global`, same-name variables, why locals are safer (0984 pseudocode has no GLOBAL keyword). Apply: "Coin collector" (a procedure changes a global, watched through call tests); "Video length" `total_seconds(minutes, seconds)` with a local variable and no globals (constants in CAPITALS allowed). Checkpoint: June 2024 P21 Q2(a) matching, an MCQ, and four new exam-style Python questions. Unit 18 Checkpoint: a scope trace (20, 8, 20).
- **Skill 19 Maintainable programs:** identifiers, comments, procedures/functions, constants; the exam answer is a method plus an example from the algorithm. Apply tasks are **tidy-ups of starter code**: behaviour must stay the same, change tests prove the constants are used, and the untouched starter scores 0 (renaming plus a comment earns those two marks). Checkpoint: June 2023 P21 Q6 (self-marked) and four new exam-style Python questions. Unit 19 Checkpoint: June 2025 P21 Q6(b) (self-marked) and an exam-style rewrite marked by running it.

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

- **Skill 20 1D arrays:** declaring `ARRAY[1:n]`, 1-based pseudocode vs 0-based Python, a variable as the index, filling and reading with loops. Apply (Python): "Squad list" (five names into a list with a loop, numbered output printed by a loop); "Level select" (list of five levels, `levels[number - 1]`, rejects 0, 6, 7 and -1; levels 2 and 4 are tested too). Checkpoint: four new exam-style Python questions. Unit 20 Checkpoint: June 2025 P21 Q3 (rewrite with a condition-controlled loop, run), June 2025 P22 Q5(a) (five errors), exam-style declare-and-zero 30 elements (run).
- **Skill 21 2D arrays:** `ARRAY[1:r, 1:c]`, `Grid[Row, Column]`, lists of lists, nested loops, the `[[...]*3]*3` trap. Apply (Python): "Noughts and crosses" (place X, print the board with a loop; corner tests catch swapped indexes); "Scoreboard" (input inside nested loops into a 2D list). Checkpoint: four new exam-style Python questions. Unit 21 Checkpoint: November 2025 P22 Q2(b)(i) NewData (run; MP2 needs the identifier Number), November 2025 P22 Q2(a) (**any five of six** errors), exam-style trace.
- *Since the pseudocode split (19 Nov 2026), the pseudocode parts of Skills 16–22 described here (declarations, CALL, OPENFILE … and the pseudocode Checkpoint questions) are in each skill's unit, `s16pc` … `s22pc`. Skill 22's Python page now has Python Apply tasks a3 "Save the high score" and a4 "Read the team sheet" (see the learning path section); the two pseudocode tasks below moved to Unit 22, where they are its Replicate tasks.*
- **Skill 22 File handling:** reasons for files, OPENFILE/READFILE/WRITEFILE/CLOSEFILE, WRITE wipes a file, reading several lines using a count on the first line. **Apply tasks are pseudocode (Ahsan's choice)**, run against virtual files: "Save the high score" (HighScore.txt) and "Read the team sheet" (Team.txt, 2, 3 and 5 players). Quotation marks round file names earn a mark (a variable holding the name is fine). Checkpoint: four new exam-style Python questions. Unit 22 Checkpoint: June 2026 P21 Q5(c) (missing quotes or wrong name "penalise once"), June 2024 P21 Q7(b) (five mark points, max 4), November 2024 P22 Q10 (nine mark points, max 6); the 2024 schemes accept unquoted names, with a tip.

### Checker features added for World E
- **Pseudocode Apply tasks** (`lang:"pc"` on a task, optional `files` shown in the brief, tests with `files:{name:[lines]}`): `pcCheck()` runs each test through `PC.run`; unreadable lines are listed ("Not run yet") before running; test cards show the files at the start and afterwards (trimmed). Skip-ahead coding tasks never use pseudocode tasks.
- **`pseudo.js`:** 1D/2D arrays (bounds checked, uninitialised reads reported, `Name[i][j]` flagged), files (quoted, bare or variable names; names match whatever the capitals; READ needs an existing file; WRITE starts empty; reading past the end is an error), `res.events`, `res.files`, `res.fileOps`, `res.stillOpen`, `res.cell()`, `arrays` option for pre-populated arrays, `prog.nextErrors` when NEXT names the wrong counter. Limits: 10,000-character strings, 100-character file names, 5,000 file operations, 2,000 lines per file, 100,000 array cells.
- **Harness:** `info.listNames`, `lists2d`, `subscripts`, `subscripts2`, `listLiterals`, `printCount`, `printInLoop`, and `inputs[].inLoop`/`loopDepth` (comprehensions count as loops). Output events now record which print call and which source line wrote them; `H.outLines`, `H.loopPrinted` (were these lines printed by a loop?) and `H.afterInput` use this.
- **Checkpoints:** errors questions can list more errors than marks ("find any N"; an error may accept several `lines`); pseudocode scores are capped at the question's marks (`maxNote` explains), so schemes with extra mark points work.
- **Audit (11 Nov 2026):** three independent reviews again (content, security, marking fairness); all confirmed issues fixed and replayed in `source/test/worldE-regression.js` (92 checks).

## Adding the next skill
Create `source/src/world<Letter>-s<N>.js` with `SKILLS.sN = {...}` (same shape as the World D files) and its pseudocode unit `SKILLS.sNpc = {...}` (Python only on the skill page; pseudocode Learn, Practise, Replicate tasks with `replicates:"aK"` and a pseudocode Checkpoint in the unit, as in `worldE-s22.js`). Set the 4th item of its row in `SKILL_MAP` to `"sN"` only once the skill exists, and add the unit's row straight after it: `[N, "<title> · Pseudocode", "<ref>", "sNpc", {unit:true}]`. Give every question a fixed `id` (`p1` …, `c1` …) and never renumber; new skills need no `LEGACY_ORDER` entry. Every stage needs at least one item (`build.js` refuses an empty stage). Use call tests for function tasks, labelled numbers rather than "last number printed", boundary tests, and varied MCQ answers. Check pseudocode against the 0984 guide (not 9618) and mark pseudocode checkpoints by running them with `H.pcRun` where possible. Rebuild, run every suite, update the maximum XP in `test/units.js` and this README, the world list in `test/fasttrack.js` and the skill list in `test/split.js`, and add a level if the maximum XP passes the top one.

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
node source/test/teacher-dashboard.js # required sign-in, and the teacher dashboard (with history) against a fake database (no real data)
node source/test/history-sql.js # 001 + 002 SQL in an in-memory Postgres: snapshots, no code kept, access rules (npm install --no-save @electric-sql/pglite)
node source/test/cloud-attack.js # access attacks on the real Supabase project with the TEST logins, including history
node source/test/manage-sql.js  # 003 SQL in an in-memory Postgres: classes, archiving, access rules
node source/test/admin-function.js # the teacher-admin function's rules against a fake Supabase (Node 22.18+ runs the .ts directly)
node source/test/cloud-admin.js # class and student management end to end on the real project (throwaway class and student)
node source/test/adversarial.js # sandbox escapes, forged saves, hostile drafts (exits non-zero on failure)
node source/test/checkpoints.js # every Checkpoint question's correct answer scores full marks (Skills 2–19)
node source/test/worldB-smoke.js # every Apply model answer full marks, off-task 0, hard-coded output never full marks (Skills 8–19)
node source/test/worldB-regression.js; node source/test/worldC-regression.js; node source/test/worldD-regression.js; node source/test/worldE-regression.js # each world's audit cases
node source/test/ids.js        # fixed question ids; old position-keyed progress converts with the same XP and percentages
node source/test/units.js      # path order, locks, Catch up, no re-locking, Skill 0, map, XP and levels
node source/test/replicate.js  # Replicate tasks: the student's own Python (or the labelled model) beside the box
node source/test/pyfiles.js    # Python file handling: the pretend open(), files before and after
node source/test/split.js      # Python pages have no pseudocode syntax; moved questions keep their ids and marks
```

Set `PLAYWRIGHT_CHANNEL=chrome` to select installed Google Chrome if needed. The suites run as a guest (the test launcher sets `window.__psTestGuest`) unless they test sign-in itself. `experience.js` downloads axe-core from jsDelivr; set `AXE_PATH` to a local `axe.min.js` to run it offline. The browser tests need internet access for Pyodide. See `AUDIT.md` for the findings and residual limitations.

## Accessibility and interface behaviour
In code boxes Tab indents and Shift+Tab un-indents, like a code editor; press Esc and then Tab to move on to the next button (a hint under each box says so). Completion dialogs keep their action visible on short screens, contain keyboard focus, close with Escape and restore focus. Trace cells and written-code fields have descriptive labels. Stage locks and progress percentages refresh as marks change. Feedback has a concise polite screen-reader announcement. Both colour themes are tested with axe-core; these automated checks complement keyboard and layout tests and are not a complete conformance certification.

## Saved data compatibility
The progress key remains `igcse-progskills-v1`. Existing valid progress, best marks and Apply drafts are retained; missing answer-draft fields initialise empty. Only known questions and bounded, typed answer data are accepted. New drafts never award marks merely by being restored. When an Apply task's declared mark total changes, an older score with a different denominator is discarded and the task must be checked again; other progress and saved drafts remain. Do not reinterpret an old score as newly earned marks without an explicit migration.
