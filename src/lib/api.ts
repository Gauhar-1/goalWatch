// src/lib/api.ts
import type { OpenLigaDBMatch, SportsDBResponse, SportsDBTeam, OpenLigaDBTeam as ApiOpenLigaDBTeam, AvailableLeague, OpenLigaDBMatchResult, OpenLigaDBGroupInfo } from '@/types';

// --- Mock Data ---
interface MockTeamInfo {
  id: number;
  name: string;
  shortName: string;
  logo: string; 
  apiTeamIconUrl: string;
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
  teamGroupName: null,
});

const defaultGroupInfo: OpenLigaDBGroupInfo = {
  groupName: "Premier League Mock Group",
  groupOrderID: 1,
  groupID: 1000,
};

const currentYear = new Date().getFullYear();

const mockResultsFinished: OpenLigaDBMatchResult[] = [{ 
  resultID: 201, 
  pointsTeam1: 2, 
  pointsTeam2: 1, 
  resultName: "Endergebnis", 
  resultOrderID: 1, 
  resultTypeID: 2, 
  resultDescription: "Result after 90 minutes" 
}];

const mockResultsLive: OpenLigaDBMatchResult[] = [{ 
  resultID: 202, 
  pointsTeam1: 1, 
  pointsTeam2: 0, 
  resultName: "Halbzeit", // Or "Zwischenstand"
  resultOrderID: 1, 
  resultTypeID: 1, 
  resultDescription: "Result at halftime" // Or current score
}];


const mockMatches: OpenLigaDBMatch[] = [
  {
    matchID: 101,
    matchDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString('sv-SE', { timeZone: 'Europe/Berlin' }).replace(' ', 'T'), 
    timeZoneID: "W. Europe Standard Time", 
    leagueId: 468, 
    leagueName: "Premier League (Mock Data)",
    leagueSeason: currentYear, 
    leagueShortcut: "gb1mock", 
    matchDateTimeUTC: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    group: defaultGroupInfo,
    team1: createMockApiTeam(mockTeamData["Arsenal FC"]),
    team2: createMockApiTeam(mockTeamData["Manchester City"]),
    lastUpdateDateTime: new Date().toISOString(),
    matchIsFinished: false,
    matchResults: [], // No results for upcoming match
    goals: [],
    location: { locationCity: "London", locationStadium: "Emirates Stadium (Mock)"} as OpenLigaDBLocation,
    numberOfViewers: 60000,
  },
  {
    matchID: 102,
    matchDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString('sv-SE', { timeZone: 'Europe/Berlin' }).replace(' ', 'T'),
    timeZoneID: "W. Europe Standard Time",
    leagueId: 468,
    leagueName: "Premier League (Mock Data)",
    leagueSeason: currentYear,
    leagueShortcut: "gb1mock",
    matchDateTimeUTC: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    group: {...defaultGroupInfo, groupName: "Matchday 15"},
    team1: createMockApiTeam(mockTeamData["Liverpool FC"]),
    team2: createMockApiTeam(mockTeamData["Chelsea FC"]),
    lastUpdateDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), 
    matchIsFinished: true,
    matchResults: mockResultsFinished,
    goals: [
      { goalID: 301, scoreTeam1: 1, scoreTeam2: 0, goalGetterName: "L. Diaz (LIV)", matchMinute: 25, comment: "Screamer from outside the box!" },
      { goalID: 302, scoreTeam1: 1, scoreTeam2: 1, goalGetterName: "C. Palmer (CHE)", matchMinute: 55 },
      { goalID: 303, scoreTeam1: 2, scoreTeam2: 1, goalGetterName: "M. Salah (LIV)", matchMinute: 78, comment: "Clinical finish" },
    ],
    location: { locationCity: "Liverpool", locationStadium: "Anfield (Mock)"} as OpenLigaDBLocation,
    numberOfViewers: 55000,
  },
  {
    matchID: 103,
    matchDateTime: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('sv-SE', { timeZone: 'Europe/Berlin' }).replace(' ', 'T'),
    timeZoneID: "W. Europe Standard Time",
    leagueId: 468,
    leagueName: "Premier League (Mock Data)",
    leagueSeason: currentYear,
    leagueShortcut: "gb1mock",
    matchDateTimeUTC: new Date(Date.now() - 30 * 60 * 1000).toISOString(), 
    group: {...defaultGroupInfo, groupName: "Matchday 16"},
    team1: createMockApiTeam(mockTeamData["Manchester United"]),
    team2: createMockApiTeam(mockTeamData["Tottenham Hotspur"]),
    lastUpdateDateTime: new Date().toISOString(),
    matchIsFinished: false, 
    matchResults: mockResultsLive,
    goals: [
      { goalID: 304, scoreTeam1: 1, scoreTeam2: 0, goalGetterName: "M. Rashford (MUN)", matchMinute: 15, comment: "Header from a corner" },
    ],
    location: { locationCity: "Manchester", locationStadium: "Old Trafford (Mock)"} as OpenLigaDBLocation,
    numberOfViewers: 70000,
  },
  {
    matchID: 104,
    matchDateTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toLocaleString('sv-SE', { timeZone: 'Europe/Berlin' }).replace(' ', 'T'),
    timeZoneID: "W. Europe Standard Time",
    leagueId: 468,
    leagueName: "Premier League (Mock Data)",
    leagueSeason: currentYear,
    leagueShortcut: "gb1mock",
    matchDateTimeUTC: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    group: defaultGroupInfo,
    team1: createMockApiTeam(mockTeamData["Newcastle United"]),
    team2: createMockApiTeam(mockTeamData["Aston Villa"]),
    lastUpdateDateTime: new Date().toISOString(),
    matchIsFinished: false,
    matchResults: [],
    goals: [],
    location: null,
    numberOfViewers: null,
  },
];
// --- End Mock Data ---

const OPENLIGADB_API_BASE = 'https://api.openligadb.de';

// Function to fetch Premier League matches (currently uses mock data)
export async function fetchPremierLeagueMatches(): Promise<OpenLigaDBMatch[]> {
  console.log("Using MOCK data for fetchPremierLeagueMatches with updated schema");
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return Promise.resolve(JSON.parse(JSON.stringify(mockMatches))); // Return a deep copy
}


export async function fetchTeamLogo(teamName: string): Promise<string | undefined> {
  // Note: This function currently re-fetches match data for a specific league/season/round
  // to find a single team's logo. If called in a loop (e.g., for all unique teams in a match list),
  // this can be very inefficient (N+1 problem).
  // Consider refactoring to use already fetched match data or a more targeted team API if available.
  console.log(`Fetching logo for team: ${teamName} via OpenLigaDB match data`);
  
  // Using the same hardcoded league/season/round as in page.tsx for consistency in this example
  const matches = await fetchSpecificLeagueRoundMatches("bl1", "2023", 15); 
  
  if (!matches || matches.length === 0) {
    console.warn(`No match data found when trying to fetch logo for ${teamName}.`);
    return undefined;
  }

  // Artificial delay, can be removed if not needed for simulating network latency
  // await new Promise(resolve => setTimeout(resolve, 100)); 

  const teamInfo = matches
    .flatMap(match => [match.team1, match.team2])
    // Ensure team and teamName are not null before calling toLowerCase
    .find(team => team && team.teamName && team.teamName.toLowerCase() === teamName.toLowerCase());

  if (teamInfo && teamInfo.teamIconUrl) {
    return teamInfo.teamIconUrl;
  }
  
  console.warn(`Logo not found for team: ${teamName} in OpenLigaDB data. Downstream will use fallbacks.`);
  return undefined; 
}


export async function fetchAvailableLeagues(): Promise<AvailableLeague[]> {
  try {
    const response = await fetch(`${OPENLIGADB_API_BASE}/getavailableleagues`);
    if (!response.ok) {
      console.error(`Error fetching available leagues: ${response.status} ${response.statusText}`);
      return []; 
    }
    const data: AvailableLeague[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch available leagues:", error);
    return [];
  }
}


/**
 * Fetches match data for a specific league, season, and group/round.
 * Example: fetchSpecificLeagueRoundMatches("bl1", "2023", 15) for Bundesliga 2023/2024, 15th matchday.
 * @param leagueShortcut The shortcut for the league (e.g., "bl1", "gb1").
 * @param season The season year (e.g., "2023" for 2023/2024 season).
 * @param groupOrderID The matchday or round number.
 * @returns A promise that resolves to an array of OpenLigaDBMatch objects.
 */
export async function fetchSpecificLeagueRoundMatches(
  leagueShortcut: string, 
  season: string, // Season year string, e.g., "2023"
  groupOrderID: number
): Promise<OpenLigaDBMatch[]> {
  try {
    // For development and to avoid hitting the API too often, you might want to switch to mock data here too.
    // For now, it makes a live call as per previous setup.
    // if (leagueShortcut === "bl1" && season === "2023" && groupOrderID === 15) {
    //   console.log("fetchSpecificLeagueRoundMatches returning MOCK data for bl1/2023/15");
    //   return Promise.resolve(JSON.parse(JSON.stringify(mockMatches)));
    // }

    const response = await fetch(`${OPENLIGADB_API_BASE}/getmatchdata/${leagueShortcut}/${season}/${groupOrderID}`);
    if (!response.ok) {
      console.error(`Error fetching specific league round matches (${leagueShortcut}/${season}/${groupOrderID}): ${response.status} ${response.statusText}`);
      return []; 
    }
    const data: OpenLigaDBMatch[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch specific league round matches (${leagueShortcut}/${season}/${groupOrderID}):`, error);
    return [];
  }
}

