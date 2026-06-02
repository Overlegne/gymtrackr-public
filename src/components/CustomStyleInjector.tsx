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
          --background: 0 0% 0% !important;
          --card: 250 20% 4% !important;
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
