'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Briefcase, FileText, Banknote, LogOut, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/leads', label: 'Leads', icon: FileText },
  { href: '/offers', label: 'Offers', icon: Briefcase },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/withdraws', label: 'Withdraws', icon: Banknote },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('rb_token');
    router.push('/login');
  };

  return (
    <aside className="w-[240px] bg-[#0F172A] text-gray-300 flex flex-col fixed h-full border-r border-gray-800">
      <div className="p-5 flex items-center gap-3 border-b border-gray-800">
        <Bot className="text-primary w-8 h-8" />
        <h1 className="text-xl font-bold text-white">ReferBot</h1>
      </div>
      <TooltipProvider>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-white/10'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
      <div className="p-3 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sm font-medium hover:bg-white/10 text-gray-300"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
