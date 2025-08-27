import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-muted">
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-[240px]">
        <AppHeader />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
