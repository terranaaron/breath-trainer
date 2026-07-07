# Breath Trainer

A dry breath-hold training app built around **freediving practice**: the goal is a
long *comfortable* hold — how far you get before the first contraction — not just a
white-knuckle max. Runs entirely in the browser — no accounts, no server, your data
stays on your device.

**Live:** https://terranaaron.github.io/breath-trainer/

### Scan to open on your phone

<img src="breath-trainer-qr.png" alt="QR code linking to the Breath Trainer app" width="220">

Point your phone camera at this code (or open [`qr.html`](qr.html) for a full-screen,
printable version). It opens the live app — then use Share → **Add to Home Screen**.

## Training modes

| Mode | What it is | When |
|---|---|---|
| **Comfort Table** | 8 holds, each ending at the **first hint of a contraction** — never past it. Fixed 2:00 rest. No numeric targets: your body sets them, so it auto-adjusts to good and bad days. Progression rule: a full contraction-free week earns +15–20s. | Default day (2–3× / week) |
| **CO₂ Table** | 8 holds at a fixed length, rest shrinks each round (105s → 15s). The deliberate hard day — builds tolerance to CO₂ build-up. Levels scale with your best (40/55/70%, capped at 2:00). | 1× / week |
| **O₂ Table** | 8 holds that grow each round (40% → 85% of your best), rest fixed at 2:00. Walks you deeper into the hold. | 1× / week |
| **Max Test** | 2:00 of calm breathing, then one relaxed all-out hold. Sets/updates your baseline. | 1× / week |

During **any** hold, a **First urge** button (or the `U` key) marks the moment the urge
to breathe arrives. It's a separate event from beginning your exhale: the gap between
them is how long you rode the urge before stopping. Urge-free time is the freediving
progress number, tracked on Progress alongside your best totals. In Comfort mode, if
you don't mark the urge, it's assumed you stopped at it (urge = hold). The app suggests
today's session (Comfort by default, others rotated weekly, rest day after 6 straight).

## Calm — parasympathetic breathing

A separate **Calm** tab for slow, exhale-weighted breathing that settles the nervous
system (longer exhales bias you parasympathetic; slowing your rate toward ~6 breaths/min
is where the heart-rate-variability benefit peaks). Pick a cadence (6→2 breaths/min,
each exhale-weighted) and a duration (3/5/10 min); a breathing orb paces you with tone
and haptic cues. The **Journey** card tracks your slowest *comfortable* cadence over
time, toward a 2-breaths-per-minute (30-second cycle) north star — comfort-bounded,
never strained. Calm data is stored separately and never affects your hold stats.

## Android app (recommended for daily training)

A native Android build lives in [`native/`](native/) — same app, but your data gets
real custody: an **SQLCipher-encrypted database** in the app's private sandbox, with
the key in the Android Keystore behind your **fingerprint/face/PIN**. No browser
container splits, no eviction. Plus a silent on-device auto-backup after every session.

**Install:** grab the APK from the repo's [Releases](../../releases) page on your
Android phone → download → allow "install unknown apps" for your browser (one-time)
→ install. Requires Android 7+. Updates: download the new APK and install over the
old one — data is preserved (same signing key).

**Build/release** (maintainer): Actions → *Android release APK* → Run workflow with a
version number. CI builds, signs (keystore in repo secrets; local copy in gitignored
`native/keys/` — **back that folder up**, losing it breaks in-place updates), and
publishes the APK as a GitHub release.

## Use it on your iPhone

1. Open the live link in **Safari**
2. Tap **Share** → **Add to Home Screen**
3. It opens full-screen like a real app. Keep the sound on — the beeps let you
   train with your eyes closed.

## During a session — the two-tap hold

A hold is measured through the **completed exhale**, with two taps:

1. **Tap 1 — "Begin exhale"**: freezes your *pure hold* time; the timer keeps
   counting (in blue) through the exhale
2. **Tap 2 — "Exhale complete"**: stops the clock — that's your *total*, the
   headline number used for your best, the chart, and goal progress

Table targets are measured against **pure hold** (the effort); the exhale is on top.
Each rep records all three: pure hold, exhale length, and total. The second tap is
required — the clock runs until you tap.

- **Tap anywhere on the big timer card** for both taps (or use the button)
- Beep + buzz at target · low tone on tap 1, resolving pair on tap 2 ·
  milestone beeps every 30s on max tests · PB-crossing chime
- The screen stays awake during a session (Wake Lock)

## Your goal

The goal is a **comfortable hold**: your urge-free time reaching the target, not a
one-off max. Tap the goal card on the **Progress** tab to set the target (presets
1:30–3:00 or custom) and date. The header, progress bar, countdown, and the chart's
goal line all follow it; the chart shows both best-total (gold) and urge-free (teal)
lines per session.

## Sharing it with other people

Just send them the link. History is stored **per device, per browser** — every
person's phone keeps its own private log, and nothing is ever uploaded anywhere.
On first run the app asks for a name, which is bound to that device's log: it shows
in the header, labels data exports (`breath-trainer-aaron.json`), and the app warns
if you try to import a file that belongs to someone else.

Two people sharing **one** device/browser would share one log — if that comes up,
use separate browsers (e.g., Safari vs. Chrome) or ask for a profiles feature.

## Your data

History lives in your browser's `localStorage` (per device). Use **Export data** /
**Import** on the Progress tab to back it up or move it between your own devices.
**Add the app to your home screen** — besides the app-like feel, iOS gives
home-screen web apps durable storage, while a plain Safari tab left unvisited for
a week can have its site data evicted.

## Safety — read this

- **This app is for dry training only.** Dry land, sitting or lying down, never while
  driving. If you're training toward freediving: in-water apnea is only ever done with
  a trained buddy — never alone — and a certification course (AIDA, Molchanovs, PFI,
  SSI) is the bridge from these dry numbers to the water.
- **Never practice breath-holds in or near water.** Dry land, sitting or lying down, only.
- **Never hyperventilate before a hold.** Fast deep breathing removes the CO₂ warning
  signal and can make you black out with no warning. Calm, normal breathing only.
- Stop immediately if you feel dizzy, tingly, or see spots.
- One table session per day — recovery is part of the training.
- If you have any cardiovascular or respiratory condition, or are pregnant, talk to a
  doctor before training breath-holds.
