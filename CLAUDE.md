# breath-trainer — project conventions

Personal training tool, not a venture. Goal: Aaron holds his breath 2:00
(stretch 3:00) by 2026-10-31.

## Hard constraints

- **Single file.** The entire app is `index.html` — inline CSS + JS, no build step,
  no dependencies, no external requests. Deployment is "push to main"; GitHub Pages
  serves it. Keep it that way. The Android app (`native/`) is a Capacitor shell that
  copies this same `index.html` — one source of truth for web and native.
- **Storage goes through `Store`** (in-memory cache + write-through), never raw
  `localStorage`. Web backend: localStorage. Native backend: SQLCipher-encrypted
  SQLite (`@capacitor-community/sqlite`), secret in Android Keystore behind a
  biometric/device-credential gate (`androidBiometric` in `native/capacitor.config.json`).
  Native plugins are reached via `window.Capacitor.Plugins.*` (no bundler). Auth
  failure shows the lock screen with retry; after 2 failures an explicit
  "continue without encryption" escape hatch sets `bt_native_plain_v1`.
- **Android release**: Actions workflow `android-release.yml` (manual dispatch,
  version input) → signed APK on a GitHub release. Signing keystore: gitignored
  `native/keys/` + repo secrets ANDROID_KEYSTORE_*. **Same key forever** — losing it
  breaks in-place updates (= user data loss on reinstall). minSdk 24 (Android 7).
- **Data compatibility.** Session history lives in `localStorage` under
  `co2trainer_sessions_v1` as an array of `{date, mode?, level?, targets?, holds[]}`.
  Old records have no `mode` (treat as `co2`). Never break reads of existing records —
  Aaron's training history is the product.
  Three hold generations coexist: bare integers (gen 1), `{total, pure, exhale}`
  (gen 2), plus optional `urge` (gen 3, seconds to first contraction; in comfort
  mode `urge === pure` by protocol). Read every hold ONLY through
  `holdTotal()/holdPure()/holdExhale()/holdUrge()`. `total` = headline for PB;
  table targets compare against `pure`; the goal is judged on `urge`
  (best urge-free hold, 14-day window).
  Modes: `comfort` (default day, no targets, end at first contraction),
  `co2` (hard day, 1×/wk, levels 40/55/70% of PB, floor 20s cap 120s),
  `o2` (ramp tops at 85%), `max` (weekly). Old sessions have no `mode` → co2.
  Profile under `co2trainer_profile_v1`: `{name, goalSec?, goalDate?}` (defaults
  2:00 / 2026-10-31). This is a freediving dry-training app — safety copy must
  keep: dry-only, buddy for any in-water work, never hyperventilate, course names.
  `urge` and begin-exhale are SEPARATE events in all modes (First-urge button/`U`
  key marks the involuntary urge; the stage tap begins the voluntary exhale). Unmarked
  urge → null, except comfort mode falls back to `urge = pure`. Goal is judged on
  `urge` (best urge-free, 14-day window).
- **Calm tab** (parasympathetic breathing) is a SEPARATE feature with its own store
  `co2trainer_calm_v1` — array of `{date, cycleSec, inhale, exhale, durationMin,
  comfortable}`. It must NEVER read or write `holds[]`/PB/hold-goal (verified by a
  no-leak assertion). Exhale-weighted cadences 6→2 breaths/min; Journey metric =
  slowest cadence flagged comfortable; north star 2/min (30s cycle). Reuses the
  shared timer/wake-lock/beep/buzz helpers.
  Exports are `{app, owner, exported, sessions[]}`; import must also accept the
  old bare-array format, and warns when `owner` ≠ this device's profile name.
- **Timing is timestamp-based** (`Date.now()` deltas), never tick-counting —
  mobile browsers throttle `setInterval` aggressively.
- **Safety copy is not optional.** Never remove the warnings about water,
  hyperventilation, or dizziness, in the app or README.

## Deploy

`git push` to `main` → GitHub Pages redeploys automatically. Live at:
https://terranaaron.github.io/breath-trainer/
Pages builds have stalled 8+ min repeatedly; the fix is requesting a fresh build:
`gh api -X POST repos/terranaaron/breath-trainer/pages/builds` — then poll again.
Android: dispatch `android-release.yml` with a version input → signed APK on a
GitHub release. Windows gotcha: files CI executes need their exec bit set in git
(`git update-index --chmod=+x`) — a bare Windows commit strips it (bit gradlew once).

## QR code

`breath-trainer-qr.{svg,png}` and `qr.html` point at the live URL. Regenerate with
`python -c "import segno; segno.make('https://terranaaron.github.io/breath-trainer/', error='h').save('breath-trainer-qr.svg', scale=8, border=4, dark='#0f1720', light='#fff')"`
(also emit the `.png`). If the live URL ever changes, regenerate both and re-verify by scanning.

## Verify a change (the harness pattern — no test framework, this is the gate)

1. `node --check` the extracted `<script>` block.
2. **Iframe harnesses** in the session scratchpad: a small HTML page that seeds
   `localStorage` (file:// pages share one origin), loads the app in an iframe,
   drives it (clicks/taps via `setTimeout` chains), and writes assertions into its
   own DOM. Render with headless Edge:
   `msedge --headless=new --allow-file-access-from-files --virtual-time-budget=N --dump-dom <harness>`
   — virtual time fast-forwards timers, so whole timed sessions (prep→hold→taps→rest)
   run in seconds with exact expected splits.
3. Mandatory gates: **multi-generation storage seed** (int holds, gen-2 objects,
   gen-3 with urge, all in one history) must render; **no-leak assertion** (calm
   flows leave `co2trainer_sessions_v1` null); flow harnesses for any changed
   state-machine path.
4. Git Bash `echo` mangles backslashes in JSON — pipe test payloads from files,
   never inline. When a harness fails, suspect the harness first (two of two
   harness failures so far were harness bugs, not app bugs).

## Status & open loops (2026-07-08)

- Web + Android v1.0.0 shipped. **UNTESTED on Aaron's Android device**: install
  flow, biometric/PIN prompt on old hardware (needs Android 7+), the
  no-auth-configured fallback, share-sheet export, import. Ask how the device
  test went before building more native features.
- Aaron's original iPhone history is gone (iOS Safari-vs-home-screen container
  split, 2026-07-06) — he restarted ~2026-07-05. Long-shot: an old export JSON in
  iPhone Files would import.
- Deferred/parked: Set-Departure table mode (revisit when comfortable hold >1:30),
  iOS TestFlight path, guided breathe-up before max tests, box breathing.
