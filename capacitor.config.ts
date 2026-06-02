import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.overlegne.gymtrackr',
  appName: 'GymTrackr',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    url: 'https://gymtrackr-psi.vercel.app/',
    cleartext: false,
  },
};

export default config;