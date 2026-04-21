# ⚔ Katana Laptop

> Plays a katana unsheathing sound every time your laptop wakes up or starts.

---

## What it does

| Trigger | Sound |
|---|---|
| Laptop starts / you log in | 🔊 Katana unsheathe |
| Laptop wakes from sleep (lid open) | 🔊 Katana unsheathe |

Runs silently in the background. Lives in your **system tray** (Windows) or **menu bar** (Mac). No window, no fuss.

---

## Setup (first time only)

### Requirements
- [Node.js](https://nodejs.org) — version 18 or newer

### Steps

```bash
# 1. Open this folder in your terminal

# 2. Install dependencies
npm install

# 3. Run the app right now to test it
npm start
```

You should hear the katana sound immediately on launch.

---

## Build an installable app (.exe / .dmg)

```bash
# Windows installer (.exe)
npm run build:win

# Mac disk image (.dmg)
npm run build:mac

# Both at once
npm run build:all
```

The finished installer will appear in the `dist/` folder.  
Install it and Katana will auto-launch every time you log in.

---

## Tray menu options

Right-click the ⚔ icon in your tray / menu bar:

- **Test sound** — play the sound manually
- **Launch at login** — toggle auto-start (on by default)
- **Quit Katana** — stop the app

---

## Swap the sound

Replace `assets/katana.wav` with any `.wav` file you like.  
Keep the filename the same, or update the path in `main.js`.

---

## How it works (beginner explanation)

| Piece | What it does |
|---|---|
| `main.js` | The brain — listens for wake/resume events, plays the sound |
| `assets/katana.wav` | The sound file |
| `package.json` | Tells Node.js what libraries to use and how to build |
| Electron | A framework that lets you build desktop apps with JavaScript |
| `powerMonitor` | Electron's built-in sensor that detects sleep/wake/login |

---

Built with ❤️ and Electron.
