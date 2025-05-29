// src/app/page.tsx
import AppHeader from '@/components/AppHeader';
import MatchList from '@/components/MatchList';
import { fetchSpecificLeagueRoundMatches, fetchTeamLogo } from '@/lib/api';
import type { MatchData, OpenLigaDBMatch, ProcessedTeam, TeamLogoMap } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CalendarX2 } from "lucide-react";

async function getMatchDataWithLogos(): Promise<MatchData[]> {
  const rawMatches = await fetchSpecificLeagueRoundMatches("bl1", "2023", 15);
  if (!rawMatches || rawMatches.length === 0) {
    return [];
  }

  const uniqueTeamNames = new Set<string>();
  rawMatches.forEach(match => {
    // Ensure team1 and team2 objects and their teamName properties exist before adding
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
    const team1Name = match.team1?.teamName?.trim() || "Unknown Team";
    const team2Name = match.team2?.teamName?.trim() || "Unknown Team";

    const team1: ProcessedTeam = {
      id: match.team1.teamId,
      name: team1Name,
      logoUrl: logoMap[match.team1.teamName] || match.team1.teamIconUrl || undefined,
    };
    const team2: ProcessedTeam = {
      id: match.team2.teamId,
      name: team2Name,
      logoUrl: logoMap[match.team2.teamName] || match.team2.teamIconUrl || undefined,
    };
    
    let score;
    // Prioritize final result if match is finished
    const finalResult = match.matchIsFinished 
      ? match.matchResults.find(r => r.resultName === "Endergebnis") 
      : undefined;

    // If not finished or no "Endergebnis", try to find current/halftime result
    const currentResult = !finalResult 
      ? match.matchResults.find(r => r.resultName === "Halbzeit" || r.resultName === "Zwischenstand")
      : undefined;

    if (finalResult) {
      score = {
        team1: finalResult.pointsTeam1,
        team2: finalResult.pointsTeam2,
      };
    } else if (currentResult) {
       score = {
        team1: currentResult.pointsTeam1,
        team2: currentResult.pointsTeam2,
      };
    } else if (match.goals.length > 0) { 
        // Fallback to last goal score if no explicit result object is suitable
        const lastGoal = match.goals[match.goals.length - 1];
        score = {
            team1: lastGoal.scoreTeam1,
            team2: lastGoal.scoreTeam2,
        };
    }

    // Goals are mapped directly from the specific OpenLigaDBMatch object (match.goals),
    // ensuring they are only for this particular match.
    const goals = match.goals.map(g => ({
      scoreTeam1: g.scoreTeam1,
      scoreTeam2: g.scoreTeam2,
      goalGetterName: g.goalGetterName?.trim() || "Unknown Player",
      matchMinute: g.matchMinute, // Already number | null
      comment: g.comment?.trim() || undefined, // Trim comment, set to undefined if empty or only whitespace
    })).sort((a,b) => (a.matchMinute || 0) - (b.matchMinute || 0));

    // Process groupName: trim, remove leading number. (e.g., "15. Spieltag" -> "Spieltag")
    const processedGroupName = match.group?.groupName?.trim().replace(/^\d+\.\s+/, '').trim();

    // Process leagueName: trim, remove leading "1. " prefix specifically.
    let processedLeagueName = match.leagueName?.trim() || "Unknown League";
    processedLeagueName = processedLeagueName.replace(/^1\.\s+/, '').trim();


    return {
      id: match.matchID,
      dateTimeUTC: match.matchDateTimeUTC,
      team1,
      team2,
      leagueName: processedLeagueName,
      leagueSeason: match.leagueSeason, // This is a number
      groupName: processedGroupName || undefined, // Use processed group name, ensure undefined if empty
      isFinished: match.matchIsFinished,
      score,
      goals: goals, // This ensures only goals for this match are passed
      locationCity: match.location?.locationCity?.trim() || undefined,
      locationStadium: match.location?.locationStadium?.trim() || undefined,
      numberOfViewers: match.numberOfViewers,
      lastUpdateDateTime: match.lastUpdateDateTime,
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
                  Please check back later!
                </p>
             </div>
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

export const revalidate = 3600; // Revalidate data periodically

