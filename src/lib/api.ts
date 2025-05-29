// src/lib/api.ts
import type { OpenLigaDBMatch, SportsDBResponse, SportsDBTeam, OpenLigaDBTeam as ApiOpenLigaDBTeam } from '@/types';

// --- Mock Data ---
interface MockTeamInfo {
  id: number;
  name: string;
  shortName: string;
  logo: string; // Using direct logo URL for mock
  apiTeamIconUrl: string; // for teamIconUrl field
}

const mockTeamData: { [key: string]: MockTeamInfo } = {
  "Arsenal FC": { id: 1, name: "Arsenal FC", shortName: "ARS", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
  "Manchester City": { id: 2, name: "Manchester City", shortName: "MCI", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
  "Liverpool FC": { id: 3, name: "Liverpool FC", shortName: "LIV", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
  "Chelsea FC": { id: 4, name: "Chelsea FC", shortName: "CHE", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
  "Manchester United": { id: 5, name: "Manchester United", shortName: "MUN", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
  "Tottenham Hotspur": { id: 6, name: "Tottenham Hotspur", shortName: "TOT", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
  "Newcastle United": { id: 7, name: "Newcastle United", shortName: "NEW", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
  "Aston Villa": { id: 8, name: "Aston Villa", shortName: "AVL", logo: "https://placehold.co/64x64.png", apiTeamIconUrl: "https://placehold.co/64x64.png" },
};

const createMockApiTeam = (teamInfo: MockTeamInfo): ApiOpenLigaDBTeam => ({
  teamId: teamInfo.id,
  teamName: teamInfo.name,
  shortName: teamInfo.shortName,
  teamIconUrl: teamInfo.apiTeamIconUrl,
});

const mockMatches: OpenLigaDBMatch[] = [
  {
    matchID: 101,
    matchDateTimeUTC: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Upcoming in 2 hours
    team1: createMockApiTeam(mockTeamData["Arsenal FC"]),
    team2: createMockApiTeam(mockTeamData["Manchester City"]),
    leagueName: "Premier League (Mock Data)",
    matchIsFinished: false,
    matchResults: [],
    goals: [],
  },
  {
    matchID: 102,
    matchDateTimeUTC: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Finished 2 days ago
    team1: createMockApiTeam(mockTeamData["Liverpool FC"]),
    team2: createMockApiTeam(mockTeamData["Chelsea FC"]),
    leagueName: "Premier League (Mock Data)",
    matchIsFinished: true,
    matchResults: [{ pointsTeam1: 2, pointsTeam2: 1, resultName: "Endergebnis" }],
    goals: [
      { scoreTeam1: 1, scoreTeam2: 0, goalGetterName: "L. Diaz (LIV)", matchMinute: 25 },
      { scoreTeam1: 1, scoreTeam2: 1, goalGetterName: "C. Palmer (CHE)", matchMinute: 55 },
      { scoreTeam1: 2, scoreTeam2: 1, goalGetterName: "M. Salah (LIV)", matchMinute: 78 },
    ],
  },
  {
    matchID: 103,
    matchDateTimeUTC: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Live, started 30 mins ago
    team1: createMockApiTeam(mockTeamData["Manchester United"]),
    team2: createMockApiTeam(mockTeamData["Tottenham Hotspur"]),
    leagueName: "Premier League (Mock Data)",
    matchIsFinished: false,
    matchResults: [{ pointsTeam1: 1, pointsTeam2: 0, resultName: "Halbzeit" }], // Example: current score
    goals: [
      { scoreTeam1: 1, scoreTeam2: 0, goalGetterName: "M. Rashford (MUN)", matchMinute: 15 },
    ],
  },
  {
    matchID: 104,
    matchDateTimeUTC: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Upcoming tomorrow
    team1: createMockApiTeam(mockTeamData["Newcastle United"]),
    team2: createMockApiTeam(mockTeamData["Aston Villa"]),
    leagueName: "Premier League (Mock Data)",
    matchIsFinished: false,
    matchResults: [],
    goals: [],
  },
  {
    matchID: 105,
    matchDateTimeUTC: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Upcoming in 3 days
    team1: createMockApiTeam(mockTeamData["Arsenal FC"]),
    team2: createMockApiTeam(mockTeamData["Liverpool FC"]),
    leagueName: "Premier League (Mock Data)",
    matchIsFinished: false,
    matchResults: [],
    goals: [],
  },
];
// --- End Mock Data ---

// const OPENLIGADB_API_BASE = 'https://api.openligadb.de';
// const SPORTSDB_API_BASE = 'https://www.thesportsdb.com/api/v1/json/3'; // Using test API key "3"

export async function fetchPremierLeagueMatches(): Promise<OpenLigaDBMatch[]> {
  console.log("Using MOCK data for fetchPremierLeagueMatches");
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve([...mockMatches]); // Return a copy
}

export async function fetchTeamLogo(teamName: string): Promise<string | undefined> {
  console.log(`Using MOCK data for fetchTeamLogo: ${teamName}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  const foundTeam = Object.values(mockTeamData).find(
    team => team.name.toLowerCase() === teamName.toLowerCase() || team.shortName.toLowerCase() === teamName.toLowerCase()
  );
  if (foundTeam) {
    return Promise.resolve(foundTeam.logo);
  }
  // Fallback if teamName is not in our detailed mockTeamData but might exist in mockMatches team objects
  const teamFromMatches = mockMatches.flatMap(m => [m.team1, m.team2]).find(t => t.teamName === teamName);
  if (teamFromMatches && teamFromMatches.teamIconUrl) {
     return Promise.resolve(teamFromMatches.teamIconUrl);
  }
  
  console.warn(`Mock logo not found for team: ${teamName}, returning generic placeholder.`);
  return Promise.resolve("https://placehold.co/64x64.png"); 
}
