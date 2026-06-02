
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dumbbell, ListPlus, Search, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: LayoutDashboard, href: '/' },
    { label: 'Activity', icon: CalendarIcon, href: '/activity' },
    { label: 'Routines', icon: ListPlus, href: '/routines' },
    { label: 'Exercises', icon: Search, href: '/exercises' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around items-center py-3 px-4 z-50 mobile-nav-shadow rounded-t-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-200",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive ? "fill-primary/10" : "")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
