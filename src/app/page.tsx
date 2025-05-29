// src/app/page.tsx
import AppHeader from '@/components/AppHeader';
import MatchList from '@/components/MatchList';
import { fetchPremierLeagueMatches, fetchTeamLogo } from '@/lib/api';
import type { MatchData, OpenLigaDBMatch, ProcessedTeam, TeamLogoMap } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CalendarX2 } from "lucide-react";

async function getMatchDataWithLogos(): Promise<MatchData[]> {
  const rawMatches = await fetchPremierLeagueMatches();
  if (!rawMatches || rawMatches.length === 0) {
    return [];
  }

  const uniqueTeamNames = new Set<string>();
  rawMatches.forEach(match => {
    if (match.team1?.teamName) uniqueTeamNames.add(match.team1.teamName);
    if (match.team2?.teamName) uniqueTeamNames.add(match.team2.teamName);
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
    // Use current score if available and match not finished, otherwise final score
    const currentResult = match.matchResults.find(r => r.resultName === "Halbzeit" || r.resultName === "Zwischenstand"); // Example, adjust if API provides better current score
    const finalResult = match.matchResults.find(r => r.resultName === "Endergebnis" || match.matchIsFinished);

    if (match.isFinished && finalResult) {
      score = {
        team1: finalResult.pointsTeam1,
        team2: finalResult.pointsTeam2,
      };
    } else if (!match.isFinished && currentResult) {
       score = {
        team1: currentResult.pointsTeam1,
        team2: currentResult.pointsTeam2,
      };
    } else if (match.goals.length > 0) { // Fallback to latest goal if no explicit current/final result
        const lastGoal = match.goals[match.goals.length - 1];
        score = {
            team1: lastGoal.scoreTeam1,
            team2: lastGoal.scoreTeam2,
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
      })).sort((a,b) => (a.matchMinute || 0) - (b.matchMinute || 0)), // Sort goals by minute
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
            <Alert variant="destructive" className="max-w-lg mx-auto">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Fetching Match Data</AlertTitle>
              <AlertDescription>
                There was a problem loading the match schedule from the source. Please try again later.
                (Currently using mock data, so this error state is unlikely unless mock data source fails).
              </AlertDescription>
            </Alert>
          </div>
        ) : matches.length === 0 && !errorFetchingData ? (
           <div className="container mx-auto px-4 py-8 text-center">
             <div className="flex flex-col items-center justify-center text-muted-foreground mt-10 p-6 bg-card rounded-lg shadow-md max-w-md mx-auto">
                <CalendarX2 className="h-16 w-16 mb-4 text-primary" />
                <h2 className="text-2xl font-semibold text-card-foreground mb-2">No Matches Found</h2>
                <p className="text-md">
                  It seems there are no Premier League matches scheduled or the data is currently unavailable. 
                  Please check back later! (Note: App is currently using mock data.)
                </p>
             </div>
           </div>
        ) : (
          <MatchList initialMatches={matches} />
        )}
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border">
        GoalWatch &copy; {new Date().getFullYear()} - Match data (currently mocked) powered by OpenLigaDB & TheSportsDB.
      </footer>
    </div>
  );
}

// Revalidate data periodically, e.g., every hour (less critical with mock data)
export const revalidate = 3600;
