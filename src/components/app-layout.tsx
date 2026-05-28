import type { ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AppLayout({ title, description, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-10">
          <div className="px-6 py-5 max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </header>
        <div className="px-6 py-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
