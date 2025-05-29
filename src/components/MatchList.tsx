// src/components/MatchList.tsx
"use client";

import type { MatchData } from '@/types';
import { useState, useMemo, Suspense } from 'react';
import MatchCard from './MatchCard';
import TeamFilter from './TeamFilter';
import { Skeleton } from '@/components/ui/skeleton';

interface MatchListProps {
  initialMatches: MatchData[];
}

function MatchListLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
          <Skeleton className="h-[20px] w-[150px] rounded-md" />
          <div className="flex justify-around items-center py-4">
            <Skeleton className="h-[48px] w-[48px] rounded-full" />
            <Skeleton className="h-[30px] w-[50px]" />
            <Skeleton className="h-[48px] w-[48px] rounded-full" />
          </div>
          <Skeleton className="h-[20px] w-full rounded-md" />
          <Skeleton className="h-[20px] w-[200px] rounded-md" />
        </div>
      ))}
    </div>
  );
}


export default function MatchList({ initialMatches }: MatchListProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);

  const filteredMatches = useMemo(() => {
    if (!selectedTeam) return initialMatches;
    return initialMatches.filter(match => 
      match.team1.name.toLowerCase() === selectedTeam.toLowerCase() || 
      match.team2.name.toLowerCase() === selectedTeam.toLowerCase()
    );
  }, [initialMatches, selectedTeam]);

  const uniqueTeamNames = useMemo(() => {
    const allTeamNames = new Set<string>();
    initialMatches.forEach(match => {
      if (match.team1.name) allTeamNames.add(match.team1.name);
      if (match.team2.name) allTeamNames.add(match.team2.name);
    });
    return Array.from(allTeamNames).sort((a, b) => a.localeCompare(b));
  }, [initialMatches]);

  if (!initialMatches) {
     return <MatchListLoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TeamFilter 
        teams={uniqueTeamNames} 
        selectedTeam={selectedTeam} 
        onTeamChange={setSelectedTeam} 
      />
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMatches.map(match => (
             <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <p className="text-center mt-8 text-lg text-muted-foreground py-10">
          No matches found {selectedTeam ? `for ${selectedTeam}` : ''}.
        </p>
      )}
    </div>
  );
}
