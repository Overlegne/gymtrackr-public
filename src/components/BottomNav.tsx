"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ListPlus, Search, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: LayoutDashboard, href: '/' },
    { label: 'Routines', icon: ListPlus, href: '/routines' },
    { label: 'Exercises', icon: Search, href: '/exercises' },
    { label: 'Activity', icon: CalendarIcon, href: '/activity' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/95 backdrop-blur-xl border-t border-border/60 flex justify-around items-center pt-4 pb-[calc(1rem+var(--safe-bottom))] px-4 z-50 mobile-nav-shadow rounded-t-[2.5rem]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 relative group",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive ? "fill-primary/10 stroke-[2.5px]" : "stroke-[2.2px]")} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.15em] transition-opacity",
              isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
            )}>
              {item.label}
            </span>
            {isActive && <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}
