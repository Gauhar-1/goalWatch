// src/components/AppHeader.tsx
import { TvIcon } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 bg-gradient-to-r from-primary via-accent to-primary shadow-lg">
      <div className="container mx-auto flex items-center justify-center md:justify-start">
        <TvIcon className="h-10 w-10 text-primary-foreground mr-3" />
        <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground">
          GoalWatch
        </h1>
      </div>
    </header>
  );
}
