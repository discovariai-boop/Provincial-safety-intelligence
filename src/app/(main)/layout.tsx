import { MainNavigation } from '@/components/main-navigation';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <MainNavigation />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-16">
        <main className="grid flex-1 items-start gap-4 p-4 pb-24 sm:px-6 sm:py-0 sm:pb-4 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
