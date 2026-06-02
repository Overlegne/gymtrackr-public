
"use client"

export interface UserSettings {
  defaultRestDuration: number; // in seconds
  unitSystem: 'Metric' | 'Imperial';
}

const SETTINGS_KEY = 'my_strength_path_user_settings';

export const DEFAULT_SETTINGS: UserSettings = {
  defaultRestDuration: 60,
  unitSystem: 'Metric',
};

/**
 * Returns settings if in browser, otherwise returns defaults.
 * Components should ideally call this in useEffect to avoid hydration mismatches.
 */
export const getSettings = (): UserSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<UserSettings>) => {
  if (typeof window === 'undefined') return;
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
};
