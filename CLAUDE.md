# breath-trainer — project conventions

Personal training tool, not a venture. Goal: Aaron holds his breath 2:00
(stretch 3:00) by 2026-10-31.

## Hard constraints

- **Single file.** The entire app is `index.html` — inline CSS + JS, no build step,
  no dependencies, no external requests. Deployment is "push to main"; GitHub Pages
  serves it. Keep it that way.
- **Data compatibility.** Session history lives in `localStorage` under
  `co2trainer_sessions_v1` as an array of `{date, mode?, level?, targets?, holds[]}`.
  Old records have no `mode` (treat as `co2`). Never break reads of existing records —
  Aaron's training history is the product.
  Device-bound profile name lives under `co2trainer_profile_v1` (`{name}`).
  Exports are `{app, owner, exported, sessions[]}`; import must also accept the
  old bare-array format, and warns when `owner` ≠ this device's profile name.
- **Timing is timestamp-based** (`Date.now()` deltas), never tick-counting —
  mobile browsers throttle `setInterval` aggressively.
- **Safety copy is not optional.** Never remove the warnings about water,
  hyperventilation, or dizziness, in the app or README.

## Deploy

`git push` to `main` → GitHub Pages redeploys automatically (~1 min).
Live at: https://terranaaron.github.io/breath-trainer/

## QR code

`breath-trainer-qr.{svg,png}` and `qr.html` point at the live URL. Regenerate with
`python -c "import segno; segno.make('https://terranaaron.github.io/breath-trainer/', error='h').save('breath-trainer-qr.svg', scale=8, border=4, dark='#0f1720', light='#fff')"`
(also emit the `.png`). If the live URL ever changes, regenerate both and re-verify by scanning.

## Verify a change

`node --check` the extracted script block, then render with headless Edge
(`msedge --headless=new --dump-dom file:///...`) and confirm rounds + suggestion
render. There are no tests; the smoke render is the gate.
