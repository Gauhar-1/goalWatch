// src/components/MatchCard.tsx
"use client";

import type { MatchData } from '@/types';
import Image from 'next/image';
import { CalendarDays, Clock, MapPin, Users, InfoIcon, RefreshCwIcon, Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { useEffect, useState } from 'react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/utils'; // Added missing import

interface MatchCardProps {
  match: MatchData;
}

const DetailItem: React.FC<{ icon: React.ElementType; label?: string; value: React.ReactNode; className?: string }> = ({ icon: Icon, label, value, className }) => {
  if (!value && typeof value !== 'number') return null;
  return (
    <div className={cn("flex items-center text-xs text-muted-foreground", className)}>
      <Icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-primary/80" />
      {label && <span className="font-medium mr-1">{label}:</span>}
      <span>{value}</span>
    </div>
  );
};


export default function MatchCard({ match }: MatchCardProps) {
  const [localDateTime, setLocalDateTime] = useState<{ date: string; time: string } | null>(null);
  const [status, setStatus] = useState<{ text: string; variant: "default" | "secondary" | "destructive"; pulse: boolean } | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string | null>(null);

  useEffect(() => {
    if (match.dateTimeUTC) {
      const dateObj = new Date(match.dateTimeUTC);
      setLocalDateTime({
        date: format(dateObj, 'PPP'), // e.g., Jun 20, 2024
        time: format(dateObj, 'p'), // e.g., 2:30 PM
      });

      const now = new Date();
      if (match.isFinished) {
        setStatus({ text: 'Finished', variant: 'destructive', pulse: false });
      } else if (dateObj <= now) {
        // Check if match actually started recently or is ongoing
        // Simple check: if started within the last 3 hours and not finished, consider it Live
        const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        if (dateObj > threeHoursAgo) {
            setStatus({ text: 'Live', variant: 'default', pulse: true });
        } else {
            // If it's past match time but not explicitly "finished" and older than 3 hours, could be "Delayed/Postponed" or just old data.
            // For now, let's assume if it's old and not finished, it's just "Past" or an unknown past state.
            // A more robust system would need better status from the API.
             setStatus({ text: 'Past', variant: 'secondary', pulse: false });
        }
      } else {
        setStatus({ text: 'Upcoming', variant: 'secondary', pulse: false });
      }
    }

    if (match.lastUpdateDateTime) {
      try {
        setLastUpdatedText(formatDistanceToNowStrict(new Date(match.lastUpdateDateTime), { addSuffix: true }));
      } catch (e) {
        // Fallback if date is invalid
        setLastUpdatedText(new Date(match.lastUpdateDateTime).toLocaleTimeString());
      }
    }
  }, [match.dateTimeUTC, match.isFinished, match.lastUpdateDateTime]);

  const placeholderLogo = "https://placehold.co/64x64.png";

  return (
    <Card className="bg-card text-card-foreground shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow">
            <CardDescription className="text-xs text-muted-foreground flex items-center mb-0.5">
              <CalendarDays className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              {localDateTime ? localDateTime.date : 'Loading date...'}
            </CardDescription>
            <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span>{localDateTime ? localDateTime.time : 'Loading time...'} (Local)</span>
            </div>
          </div>
          {status && (
            <Badge variant={status.variant} className={`text-xs ml-2 shrink-0 ${status.pulse ? 'animate-pulse' : ''}`}>
              {status.text}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-2xl font-bold text-center pt-1">
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center w-1/3 text-center">
              <Image
                src={match.team1.logoUrl || placeholderLogo}
                alt={`${match.team1.name} logo`}
                width={48}
                height={48}
                className="object-contain mb-1 h-12 w-12"
                data-ai-hint="soccer club"
              />
              <span className="block text-sm font-medium truncate w-full px-1">{match.team1.name}</span>
            </div>
            <span className="text-3xl font-extrabold mx-2 text-primary">
              {match.score ? `${match.score.team1} - ${match.score.team2}` : 'vs'}
            </span>
            <div className="flex flex-col items-center w-1/3 text-center">
              <Image
                src={match.team2.logoUrl || placeholderLogo}
                alt={`${match.team2.name} logo`}
                width={48}
                height={48}
                className="object-contain mb-1 h-12 w-12"
                data-ai-hint="soccer club"
              />
              <span className="block text-sm font-medium truncate w-full px-1">{match.team2.name}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-4 space-y-3 flex-grow">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <DetailItem icon={InfoIcon} value={`${match.leagueName}${match.leagueSeason ? ` (${match.leagueSeason})` : ''}`} />
            <DetailItem icon={InfoIcon} value={match.groupName} />
            {(match.locationCity || match.locationStadium) && (
                 <DetailItem 
                    icon={MapPin} 
                    value={[match.locationCity, match.locationStadium].filter(Boolean).join(', ') || 'N/A'} 
                    className="col-span-2"
                />
            )}
            <DetailItem icon={Users} value={match.numberOfViewers?.toLocaleString() ?? 'N/A'} />
        </div>

        {match.goals && match.goals.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Goal Scorers:</h4>
            <ScrollArea className="h-[100px] pr-3"> {/* Max height for scrollability */}
              <ul className="space-y-1.5 text-xs text-foreground/90">
                {match.goals.map((goal, index) => (
                  <li key={index} className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <span className="truncate font-medium">
                        {goal.goalGetterName} ({goal.matchMinute ? `${goal.matchMinute}'` : 'N/A'})
                        </span>
                        <Badge variant="secondary" className="text-xs">{goal.scoreTeam1}:{goal.scoreTeam2}</Badge>
                    </div>
                    {goal.comment && (
                        <div className="text-muted-foreground/80 pl-2 flex items-start text-[0.7rem] mt-0.5">
                            <Quote className="h-2.5 w-2.5 mr-1 mt-0.5 shrink-0" /> 
                            <span className="italic">{goal.comment}</span>
                        </div>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      
      {lastUpdatedText && (
        <>
          <Separator/>
          <div className="p-3 text-center">
            <DetailItem icon={RefreshCwIcon} value={`Last updated: ${lastUpdatedText}`} className="text-center justify-center"/>
          </div>
        </>
      )}
    </Card>
  );
}
