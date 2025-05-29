// src/components/MatchCard.tsx
"use client";

import type { MatchData } from '@/types';
import Image from 'next/image';
import { CalendarDays, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from './ui/separator';
import { useEffect, useState } from 'react';

interface MatchCardProps {
  match: MatchData;
}

export default function MatchCard({ match }: MatchCardProps) {
  const [localDateTime, setLocalDateTime] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    if (match.dateTimeUTC) {
      const dateObj = new Date(match.dateTimeUTC);
      setLocalDateTime({
        date: dateObj.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: dateObj.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      });
    }
  }, [match.dateTimeUTC]);

  const placeholderLogo = "https://placehold.co/64x64.png";

  return (
    <Card className="bg-card text-card-foreground shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="p-4 bg-opacity-50">
        <div className="flex justify-between items-center mb-2">
          <CardDescription className="text-sm text-muted-foreground flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            {localDateTime ? localDateTime.date : 'Loading date...'}
          </CardDescription>
          {match.isFinished ? (
            <Badge variant="destructive" className="text-xs">Finished</Badge>
          ) : (
            <Badge variant="secondary" className="text-xs animate-pulse">Upcoming</Badge>
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center w-1/3">
              <Image
                src={match.team1.logoUrl || placeholderLogo}
                alt={`${match.team1.name} logo`}
                width={48}
                height={48}
                className="object-contain mb-1 h-12 w-12"
                data-ai-hint="soccer logo"
              />
              <span className="block text-sm truncate w-full text-center">{match.team1.name}</span>
            </div>
            <span className="text-3xl font-extrabold mx-2 text-primary">
              {match.score ? `${match.score.team1} - ${match.score.team2}` : 'vs'}
            </span>
            <div className="flex flex-col items-center w-1/3">
              <Image
                src={match.team2.logoUrl || placeholderLogo}
                alt={`${match.team2.name} logo`}
                width={48}
                height={48}
                className="object-contain mb-1 h-12 w-12"
                data-ai-hint="soccer logo"
              />
              <span className="block text-sm truncate w-full text-center">{match.team2.name}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>{localDateTime ? localDateTime.time : 'Loading time...'} (Local Time)</span>
        </div>
        <div className="text-muted-foreground text-sm">
          {match.leagueName}
        </div>
        {match.goals && match.goals.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Goal Scorers:</h4>
            <ul className="list-disc list-inside text-xs space-y-0.5">
              {match.goals.slice(0, 3).map((goal, index) => (
                <li key={index} className="truncate">
                  {goal.goalGetterName} ({goal.matchMinute ? `${goal.matchMinute}'` : ''}) - {goal.scoreTeam1}:{goal.scoreTeam2}
                </li>
              ))}
              {match.goals.length > 3 && <li>...and more</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
