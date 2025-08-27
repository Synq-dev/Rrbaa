'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { useAppContext } from '@/contexts/app-context';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { pageTitle } = useAppContext();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('rb_token');
    router.push('/login');
  };

  return (
    <header className="flex items-center h-16 px-6 lg:px-8 bg-card border-b sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">{pageTitle}</h2>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/100" alt="Admin" data-ai-hint="person user" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@referbot.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
