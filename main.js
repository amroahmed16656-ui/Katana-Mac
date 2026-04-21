const { app, powerMonitor, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');
const { execSync, exec } = require('child_process');
const fs = require('fs');

// ── Keep a single instance ─────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); process.exit(0); }

// ── Resolve asset paths (works both in dev and packaged) ───────
function assetPath(file) {
  const base = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, 'assets');
  return path.join(base, file);
}

// ── Play sound using the OS native player (no window needed) ───
function playKatanaSound() {
  const soundFile = assetPath('katana.wav');

  if (!fs.existsSync(soundFile)) {
    console.warn('Sound file not found:', soundFile);
    return;
  }

  if (process.platform === 'darwin') {
    // macOS — afplay is built-in
    exec(`afplay "${soundFile}"`);
  } else if (process.platform === 'win32') {
    // Windows — PowerShell Media.SoundPlayer
    const ps = `
      Add-Type -AssemblyName PresentationCore;
      $player = New-Object System.Windows.Media.MediaPlayer;
      $player.Open([System.Uri]"${soundFile.replace(/\\/g, '\\\\')}");
      $player.Play();
      Start-Sleep -Milliseconds 3000;
    `.replace(/\n/g, ' ');
    exec(`powershell -Command "${ps}"`);
  }
}

// ── Auto-launch on login ───────────────────────────────────────
function setLoginItem() {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,   // silent — no window
  });
}

// ── Tray setup (so the app lives in the menu bar / system tray) ─
let tray = null;

function createTray() {
  // Use a simple template image — replace with your own 16x16 or 22x22 icon
  const iconFile = process.platform === 'darwin'
    ? assetPath('trayTemplate.png')   // macOS: use Template image (black, will adapt)
    : assetPath('tray.png');          // Windows: full-colour 16x16

  let icon;
  try {
    icon = nativeImage.createFromPath(iconFile);
  } catch (e) {
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);
  tray.setToolTip('Katana — Active');

  const menu = Menu.buildFromTemplate([
    {
      label: '⚔  Katana is active',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: '▶  Test sound',
      click: playKatanaSound,
    },
    { type: 'separator' },
    {
      label: 'Launch at login',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click(item) {
        app.setLoginItemSettings({ openAtLogin: item.checked, openAsHidden: true });
      },
    },
    { type: 'separator' },
    {
      label: 'Quit Katana',
      click: () => app.quit(),
    },
  ]);

  tray.setContextMenu(menu);
}

// ── App ready ─────────────────────────────────────────────────
app.whenReady().then(() => {
  // Don't show in the Dock (macOS) or Taskbar (Windows)
  if (app.dock) app.dock.hide();

  createTray();
  setLoginItem();

  // Play on startup / login
  playKatanaSound();

  // Play when the system resumes from sleep (lid open / wake)
  powerMonitor.on('resume', () => {
    playKatanaSound();
  });

  // Also fires on "unlock-screen" on some systems
  powerMonitor.on('unlock-screen', () => {
    playKatanaSound();
  });
});

// Prevent the app from quitting when all windows are closed
// (there are no windows — we live in the tray)
app.on('window-all-closed', (e) => {
  // do nothing — keep running
});
