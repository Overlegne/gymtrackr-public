"use client"

import { useEffect, useState } from 'react';
import { getCustomTheme } from '@/lib/theme-store';

export function CustomStyleInjector() {
  const [styles, setStyles] = useState('');

  const updateStyles = () => {
    const custom = getCustomTheme();
    if (custom) {
      setStyles(`
        :root {
          --primary: ${custom.primary} !important;
          --background: ${custom.background} !important;
        }
        .dark {
          --primary: ${custom.primary} !important;
          --background: 250 20% 6% !important;
          --card: 250 20% 12% !important;
          --popover: 250 20% 14% !important;
          --secondary: 250 20% 18% !important;
          --muted: 250 20% 18% !important;
          --border: 250 20% 22% !important;
        }
      `);
    } else {
      setStyles('');
    }
  };

  useEffect(() => {
    updateStyles();
    window.addEventListener('theme-change', updateStyles);
    return () => window.removeEventListener('theme-change', updateStyles);
  }, []);

  if (!styles) return null;

  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}