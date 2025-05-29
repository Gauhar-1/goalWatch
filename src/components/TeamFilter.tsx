"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TeamFilterProps {
  teams: string[];
  selectedTeam: string | undefined;
  onTeamChange: (teamName: string | undefined) => void;
}

export default function TeamFilter({ teams, selectedTeam, onTeamChange }: TeamFilterProps) {
  const handleValueChange = (value: string) => {
    onTeamChange(value === "all" ? undefined : value);
  };

  return (
    <div className="my-6 p-4 bg-card rounded-lg shadow-md">
      <Label htmlFor="team-filter-select" className="text-lg font-semibold mb-2 block text-card-foreground">
        Filter by Team
      </Label>
      <Select value={selectedTeam || "all"} onValueChange={handleValueChange}>
        <SelectTrigger id="team-filter-select" className="w-full md:w-[280px] bg-input text-foreground border-border focus:ring-primary">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground">
          <SelectItem value="all">All Teams</SelectItem>
          {teams.map((teamName) => (
            <SelectItem key={teamName} value={teamName}>
              {teamName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
