
"use client"

export interface UserSettings {
  defaultRestDuration: number; // in seconds
}

const SETTINGS_KEY = 'my_strength_path_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  defaultRestDuration: 60,
};

export const getSettings = (): UserSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Partial<UserSettings>) => {
  if (typeof window === 'undefined') return;
  const current = getSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
};
