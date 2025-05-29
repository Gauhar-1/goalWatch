// src/components/MatchList.tsx
"use client";

import type { MatchData } from '@/types';
import { useState, useMemo } from 'react';
import MatchCard from './MatchCard';
import TeamFilter from './TeamFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchX } from 'lucide-react';

interface MatchListProps {
  initialMatches: MatchData[];
}

function MatchListLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg bg-card shadow-md">
          <Skeleton className="h-[20px] w-[150px] rounded-md bg-muted/50" />
          <div className="flex justify-around items-center py-4">
            <Skeleton className="h-[48px] w-[48px] rounded-full bg-muted/50" />
            <Skeleton className="h-[30px] w-[50px] bg-muted/50" />
            <Skeleton className="h-[48px] w-[48px] rounded-full bg-muted/50" />
          </div>
          <Skeleton className="h-[20px] w-full rounded-md bg-muted/50" />
          <Skeleton className="h-[20px] w-[200px] rounded-md bg-muted/50" />
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

  if (!initialMatches || initialMatches.length === 0 && !selectedTeam) { // Added check for initialMatches being empty even without filter
     // If initialMatches is truly empty (and not just filtered to empty), page.tsx handles the main "no matches" message.
     // This component's skeleton is more for if data is being loaded client-side or if initialMatches could be null/undefined.
     // Given page.tsx pre-fetches, this specific skeleton might show briefly if initialMatches is an empty array from the start.
     // However, page.tsx has its own more prominent "No Matches Found" display for this case.
     // So, if initialMatches is empty, page.tsx likely shows its message, and this component might not even render or its empty state is superseded.
     // The primary use of skeleton here is if initialMatches was dynamically loaded.
     // For now, returning null if initialMatches is empty and no filter is applied, to let page.tsx handle it.
     if (initialMatches && initialMatches.length === 0 && !selectedTeam) return null; 
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
        <div className="text-center mt-8 py-10 flex flex-col items-center justify-center text-muted-foreground bg-card p-6 rounded-lg shadow-md max-w-md mx-auto">
          <SearchX className="h-16 w-16 mb-4 text-primary" />
          <h2 className="text-2xl font-semibold text-card-foreground mb-2">No Matches Found</h2>
          <p className="text-md">
            {selectedTeam 
              ? `There are no matches scheduled for ${selectedTeam} in the current list.`
              : "No matches found matching your criteria."}
          </p>
        </div>
      )}
    </div>
  );
}
