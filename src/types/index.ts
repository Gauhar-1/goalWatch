// src/types/index.ts

// New interface for Group Information within a match
export interface OpenLigaDBGroupInfo {
  groupName: string;
  groupOrderID: number;
  groupID: number;
}

// Updated interface for Match Results within a match
export interface OpenLigaDBMatchResult {
  resultID: number;
  resultName: string; // e.g., "Endergebnis", "Halbzeit"
  pointsTeam1: number;
  pointsTeam2: number;
  resultOrderID: number;
  resultTypeID: number;
  resultDescription: string;
}

// Interface for Location (can be null)
export interface OpenLigaDBLocation {
  locationID?: number;
  locationCity?: string;
  locationStadium?: string;
  // Add other fields if known and needed
}

// Updated types for OpenLigaDB API Team
export interface OpenLigaDBTeam {
  teamId: number;
  teamName: string;
  shortName: string;
  teamIconUrl: string | null;
  teamGroupName: string | null;
}

// Updated types for OpenLigaDB API Match
export interface OpenLigaDBMatch {
  matchID: number;
  matchDateTime: string; // Specific datetime string from API
  timeZoneID: string; // e.g., "W. Europe Standard Time"
  leagueId: number;
  leagueName: string;
  leagueSeason: number; // Season year, e.g., 2023
  leagueShortcut: string; // e.g., "bl1", "gb1"
  matchDateTimeUTC: string; // ISO string for UTC date/time
  group: OpenLigaDBGroupInfo;
  team1: OpenLigaDBTeam;
  team2: OpenLigaDBTeam;
  lastUpdateDateTime: string; // ISO string
  matchIsFinished: boolean;
  matchResults: OpenLigaDBMatchResult[];
  goals: {
    goalID?: number; // Optional, not always present
    scoreTeam1: number;
    scoreTeam2: number;
    goalGetterName: string;
    matchMinute: number | null;
    comment?: string; // Optional
  }[];
  location: OpenLigaDBLocation | null;
  numberOfViewers: number | null;
}

// Types for TheSportsDB API
export interface SportsDBTeam {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string | null; // URL to the team badge/logo
  strAlternate: string | null;
}

export interface SportsDBResponse {
  teams: SportsDBTeam[] | null; // API returns null if no team found
}

// Combined and processed match data for UI
export interface ProcessedTeam {
  id: number;
  name: string;
  logoUrl?: string; // Will be populated from TheSportsDB or teamIconUrl
}

export interface GoalData {
  scoreTeam1: number;
  scoreTeam2: number;
  goalGetterName: string;
  matchMinute: number | null;
  comment?: string; // Added comment
}

export interface MatchData {
  id: number;
  dateTimeUTC: string;
  team1: ProcessedTeam;
  team2: ProcessedTeam;
  leagueName: string;
  leagueSeason?: number;
  groupName?: string;
  isFinished: boolean;
  score?: {
    team1: number;
    team2: number;
  };
  goals: GoalData[];
  locationCity?: string;
  locationStadium?: string;
  numberOfViewers?: number | null;
  lastUpdateDateTime?: string;
}


export interface TeamLogoMap {
  [teamName: string]: string | undefined;
}

// Types for Available Leagues API
export interface SportInfo {
  sportId: number;
  sportName: string;
}

export interface AvailableLeague {
  leagueId: number;
  leagueName: string;
  leagueShortcut: string;
  leagueSeason: string; // Note: This is string from /getavailableleagues
  sport: SportInfo;
}

