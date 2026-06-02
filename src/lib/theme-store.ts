
"use client"

export interface CustomTheme {
  primary: string; // HSL value like "250 69% 51%"
  background: string; // HSL value like "252 14% 95%"
}

const THEME_KEY = 'my_strength_path_custom_theme';

export const getCustomTheme = (): CustomTheme | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(THEME_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveCustomTheme = (theme: CustomTheme) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  // Dispatch event for injector to pick up
  window.dispatchEvent(new Event('theme-change'));
};

export const resetCustomTheme = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(THEME_KEY);
  window.dispatchEvent(new Event('theme-change'));
};
