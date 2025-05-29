// src/types/index.ts

// Simplified types for OpenLigaDB API
export interface OpenLigaDBTeam {
  teamId: number;
  teamName: string;
  shortName: string;
  teamIconUrl: string | null; // This is often not a good quality logo
}

export interface OpenLigaDBMatch {
  matchID: number;
  matchDateTimeUTC: string;
  team1: OpenLigaDBTeam;
  team2: OpenLigaDBTeam;
  leagueName: string;
  matchIsFinished: boolean;
  matchResults: {
    pointsTeam1: number;
    pointsTeam2: number;
    resultName: string; // e.g., "Endergebnis"
  }[];
  goals: {
    scoreTeam1: number;
    scoreTeam2: number;
    goalGetterName: string;
    matchMinute: number | null;
  }[];
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
  logoUrl?: string; // Will be populated from TheSportsDB
}

export interface MatchData {
  id: number;
  dateTimeUTC: string;
  team1: ProcessedTeam;
  team2: ProcessedTeam;
  leagueName: string;
  isFinished: boolean;
  score?: {
    team1: number;
    team2: number;
  };
  goals: {
    scoreTeam1: number;
    scoreTeam2: number;
    goalGetterName: string;
    matchMinute: number | null;
  }[];
}

export interface TeamLogoMap {
  [teamName: string]: string | undefined;
}
