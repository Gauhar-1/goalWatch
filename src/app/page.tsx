// src/app/page.tsx
import AppHeader from '@/components/AppHeader';
import MatchList from '@/components/MatchList';
import { fetchPremierLeagueMatches, fetchTeamLogo } from '@/lib/api';
import type { MatchData, OpenLigaDBMatch, ProcessedTeam, TeamLogoMap } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

async function getMatchDataWithLogos(): Promise<MatchData[]> {
  const rawMatches = await fetchPremierLeagueMatches();
  if (!rawMatches || rawMatches.length === 0) {
    return [];
  }

  const uniqueTeamNames = new Set<string>();
  rawMatches.forEach(match => {
    uniqueTeamNames.add(match.team1.teamName);
    uniqueTeamNames.add(match.team2.teamName);
  });

  const logoPromises = Array.from(uniqueTeamNames).map(name => 
    fetchTeamLogo(name).then(logoUrl => ({ name, logoUrl }))
  );
  
  const teamLogosResults = await Promise.all(logoPromises);
  const logoMap: TeamLogoMap = teamLogosResults.reduce((acc, { name, logoUrl }) => {
    acc[name] = logoUrl;
    return acc;
  }, {} as TeamLogoMap);

  return rawMatches.map((match: OpenLigaDBMatch): MatchData => {
    const team1: ProcessedTeam = {
      id: match.team1.teamId,
      name: match.team1.teamName,
      logoUrl: logoMap[match.team1.teamName] || match.team1.teamIconUrl || undefined,
    };
    const team2: ProcessedTeam = {
      id: match.team2.teamId,
      name: match.team2.teamName,
      logoUrl: logoMap[match.team2.teamName] || match.team2.teamIconUrl || undefined,
    };
    
    let score;
    const finalResult = match.matchResults.find(r => r.resultName === "Endergebnis" || match.matchIsFinished);
    if (finalResult) {
      score = {
        team1: finalResult.pointsTeam1,
        team2: finalResult.pointsTeam2,
      };
    }

    return {
      id: match.matchID,
      dateTimeUTC: match.matchDateTimeUTC,
      team1,
      team2,
      leagueName: match.leagueName,
      isFinished: match.matchIsFinished,
      score,
      goals: match.goals.map(g => ({
        scoreTeam1: g.scoreTeam1,
        scoreTeam2: g.scoreTeam2,
        goalGetterName: g.goalGetterName,
        matchMinute: g.matchMinute,
      })),
    };
  }).sort((a, b) => new Date(a.dateTimeUTC).getTime() - new Date(b.dateTimeUTC).getTime());
}

export default async function HomePage() {
  let matches: MatchData[] = [];
  let errorFetchingData = false;

  try {
    matches = await getMatchDataWithLogos();
  } catch (error) {
    console.error("Error fetching data for HomePage:", error);
    errorFetchingData = true;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-grow">
        {errorFetchingData ? (
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Fetching Data</AlertTitle>
              <AlertDescription>
                There was a problem loading the match schedule. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        ) : matches.length === 0 && !errorFetchingData ? (
           <div className="container mx-auto px-4 py-8 text-center">
             <p className="text-xl text-muted-foreground mt-10">No upcoming Premier League matches found or data is currently unavailable.</p>
           </div>
        ) : (
          <MatchList initialMatches={matches} />
        )}
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border">
        GoalWatch &copy; {new Date().getFullYear()} - Match data powered by OpenLigaDB & TheSportsDB.
      </footer>
    </div>
  );
}

// Revalidate data periodically, e.g., every hour
export const revalidate = 3600;
