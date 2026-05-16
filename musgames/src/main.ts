import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { environment } from './environment/environment';

const firebaseApp = initializeApp(environment.firebaseConfig);
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);

// Beregn om farven er mørk eller lys returnerer true hvis mørk
function isDark(hexColor: string): boolean {
  if (!hexColor || typeof hexColor !== 'string') return false;

  const hex = hexColor.trim();

  if (!hex.startsWith('#')) return false;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } else {
    return false;
  }

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance < 128;
}

// Sæt CSS variabler for fontfarver og input styling ud fra theme
function applyFontColors(theme: { backgroundColor?: string; navbarColor?: string }) {
  const root = document.documentElement.style;

  if (theme.backgroundColor) {
    const dark = isDark(theme.backgroundColor);

    root.setProperty('--app-fg', dark ? '#ffffff' : '#000000');

    if (dark) {
      root.setProperty('--input-fg', '#ffffff');
      root.setProperty('--input-placeholder-fg', 'rgba(255, 255, 255, 0.65)');
      root.setProperty('--input-border', 'rgba(255, 255, 255, 0.22)');
      root.setProperty('--input-focus-border', '#8f9cff');
      root.setProperty('--input-focus-outline', 'rgba(143, 156, 255, 0.35)');
    } else {
      root.setProperty('--input-fg', '#000000');
      root.setProperty('--input-placeholder-fg', 'rgb(0, 0, 0)');
      root.setProperty('--input-border', 'rgba(0, 0, 0, 0.22)');
      root.setProperty('--input-focus-border', '#040029');
      root.setProperty('--input-focus-outline', 'rgba(4, 0, 41, 0.28)');
    }

    document.body.style.backgroundColor = theme.backgroundColor;
  }

  if (theme.navbarColor) {
    const navDark = isDark(theme.navbarColor);

    root.setProperty('--navbar-fg', navDark ? '#ffffff' : '#000000');

    const navbar = document.querySelector('.Navbar') as HTMLElement | null;

    if (navbar) {
      navbar.style.backgroundColor = theme.navbarColor;
    }
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const themeRef = ref(database, `users/${user.uid}/theme`);

    try {
      const snapshot = await get(themeRef);

      if (snapshot.exists()) {
        const theme = snapshot.val() as { backgroundColor?: string; navbarColor?: string };

        applyFontColors(theme);
      }
    } catch (err) {
      console.error('❌ Kunne ikke hente theme fra Firebase:', err);
    }
  }

  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
});