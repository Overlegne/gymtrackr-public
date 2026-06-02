"use client"

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      background: '252 14% 95%'
    });
  };

  const handleReset = () => {
    resetCustomTheme();
    setActivePrimary('250 69% 51%');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-5 py-6 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted/30 hover:bg-muted/50 transition-colors">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">Personalize your journey</p>
        </div>
      </header>

      <main className="flex-1 p-5 space-y-6 pb-32">
        {/* Appearance Section */}
        <Card className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-black flex items-center gap-2 text-foreground">
              <Sun className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Theme & Dark Mode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between bg-muted/20 p-4 rounded-2xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-foreground">Theme Mode</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-black">{theme}</p>
                </div>
              </div>
              <div className="flex bg-card rounded-xl p-1 shadow-sm border border-border/50">
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

        {/* Custom Branding Section */}
        <Card className="border-none shadow-sm bg-card rounded-[2rem] overflow-hidden ring-1 ring-border/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-black flex items-center gap-2 text-foreground">
                  <Palette className="h-5 w-5 text-primary" />
                  Custom Branding
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary Color Engine</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset} 
                className="h-8 text-[9px] font-black uppercase tracking-widest text-foreground hover:text-primary bg-muted/40 hover:bg-muted/60 rounded-full px-3 transition-colors"
              >
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
                    activePrimary === color.value ? 'ring-4 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-95'
                  }`}
                  style={{ backgroundColor: `hsl(${color.value})` }}
                >
                  {activePrimary === color.value && <Check className="text-white h-6 w-6 stroke-[3.5px]" />}
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>

            {/* Live Preview Container */}
            <div className="bg-muted/10 p-5 rounded-[2rem] border border-border/60">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Live Preview</h4>
              <div className="flex flex-col gap-3">
                <Button className="w-full rounded-xl h-12 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Main Action Button</Button>
                <div className="flex gap-2">
                  <div className="h-8 px-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center uppercase tracking-widest">Badge</div>
                  <div className="h-8 px-4 rounded-full border border-primary text-primary text-[9px] font-black flex items-center justify-center uppercase tracking-widest">Outline</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center space-y-2 pb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">My Strength Path v2.0</p>
          <p className="text-[10px] font-bold leading-relaxed max-w-[240px] mx-auto text-muted-foreground">Design and colors are optimized for contrast and readability in all lighting conditions.</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
