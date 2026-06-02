
"use client"

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { ChevronLeft, Palette, Moon, Sun, Monitor, RotateCcw, Check } from 'lucide-react';
import Link from 'next/link';
import { getCustomTheme, saveCustomTheme, resetCustomTheme } from '@/lib/theme-store';

const PRESET_COLORS = [
  { name: 'Strength Violet', value: '250 69% 51%' },
  { name: 'Electric Blue', value: '217 100% 65%' },
  { name: 'Fit Green', value: '142 70% 45%' },
  { name: 'Active Red', value: '0 84% 60%' },
  { name: 'Sunset Orange', value: '24 95% 53%' },
  { name: 'Noir Edge', value: '0 0% 10%' },
];

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activePrimary, setActivePrimary] = useState('250 69% 51%');

  useEffect(() => {
    setMounted(true);
    const custom = getCustomTheme();
    if (custom) {
      setActivePrimary(custom.primary);
    }
  }, []);

  const handleColorChange = (hsl: string) => {
    setActivePrimary(hsl);
    saveCustomTheme({
      primary: hsl,
      background: '252 14% 95%' // Default base background
    });
  };

  const handleReset = () => {
    resetCustomTheme();
    setActivePrimary('250 69% 51%');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b px-5 py-6 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 dark:bg-slate-800">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Personalize your journey</p>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6 pb-32">
        {/* Appearance Section */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Theme & Dark Mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold">Theme Mode</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black">{theme}</p>
                </div>
              </div>
              <div className="flex bg-white dark:bg-slate-700 rounded-xl p-1 shadow-sm border border-slate-100 dark:border-slate-600">
                <Button 
                  variant={theme === 'light' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setTheme('light')}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button 
                  variant={theme === 'system' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="h-9 w-9 rounded-lg"
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Section */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Custom Branding
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Primary Color Engine</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-3 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center transition-all ${
                    activePrimary === color.value ? 'ring-4 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''
                  }`}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                >
                  {activePrimary === color.value && <Check className="text-white h-6 w-6 stroke-[3px]" />}
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-3xl border border-primary/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Live Preview</h4>
              <div className="flex flex-col gap-2">
                <Button className="w-full rounded-xl h-12 font-black">Main Action Button</Button>
                <div className="flex gap-2">
                  <div className="h-8 px-4 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center uppercase">Badge</div>
                  <div className="h-8 px-4 rounded-full border border-primary text-primary text-[10px] font-black flex items-center justify-center uppercase">Outline</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-2 opacity-50">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">My Strength Path v1.5</p>
          <p className="text-[9px] font-medium leading-relaxed max-w-[200px] mx-auto">Design & Colors are updated globally across all charts, buttons, and navigation.</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
