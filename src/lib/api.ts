// src/lib/api.ts
import type { OpenLigaDBMatch, SportsDBResponse, SportsDBTeam } from '@/types';

const OPENLIGADB_API_BASE = 'https://api.openligadb.de';
const SPORTSDB_API_BASE = 'https://www.thesportsdb.com/api/v1/json/3'; // Using test API key "3"

export async function fetchPremierLeagueMatches(): Promise<OpenLigaDBMatch[]> {
  try {
    // gb1 is the identifier for English Premier League
    // Fetching current season matches
    const response = await fetch(`${OPENLIGADB_API_BASE}/getmatchdata/gb1`);
    if (!response.ok) {
      console.error('Failed to fetch matches:', response.status, await response.text());
      return [];
    }
    const data = await response.json();
    return data as OpenLigaDBMatch[];
  } catch (error) {
    console.error('Error fetching Premier League matches:', error);
    return [];
  }
}

export async function fetchTeamLogo(teamName: string): Promise<string | undefined> {
  try {
    // Normalize team name for better matching, e.g. "Man City" vs "Manchester City"
    // TheSportsDB is generally good with common names.
    const response = await fetch(`${SPORTSDB_API_BASE}/searchteams.php?t=${encodeURIComponent(teamName)}`);
    if (!response.ok) {
      console.error(`Failed to fetch logo for ${teamName}:`, response.status, await response.text());
      return undefined;
    }
    const data: SportsDBResponse = await response.json();
    
    if (data.teams && data.teams.length > 0) {
      // Try to find an exact match or a team that plays in Premier League
      const premierLeagueTeam = data.teams.find(
        (team: SportsDBTeam) => 
          team.strTeam.toLowerCase() === teamName.toLowerCase() || 
          (team.strAlternate && team.strAlternate.toLowerCase().includes(teamName.toLowerCase())) ||
          data.teams!.length === 1 // if only one result, assume it's correct
      );
      
      if (premierLeagueTeam && premierLeagueTeam.strTeamBadge) {
        return premierLeagueTeam.strTeamBadge;
      }
      // Fallback to first team if specific logic fails but results exist
      if(data.teams[0].strTeamBadge) {
        return data.teams[0].strTeamBadge;
      }
    }
    console.warn(`No logo found for team: ${teamName}`);
    return undefined;
  } catch (error) {
    console.error(`Error fetching logo for ${teamName}:`, error);
    return undefined;
  }
}
