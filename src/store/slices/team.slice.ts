import type { iTeams } from "@/interfaces/teams.interface";
// import { getItem, setItem } from "@/services/storage.service";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface iTeamsState {
  id: number | string;
  workspace_id: number | string;
  name: string;
}

const teamsSlice = createSlice({
  name: "teams",
  initialState: [] as iTeams[],

  reducers: {
    setTeams: (_state, action: PayloadAction<iTeams[]>) => {
      return action.payload;
    },

    removeMemberFromTeam: (state, action: PayloadAction<{ teamId: number, memberId: number }>) => {
      const team = state.find(t => t.id === action.payload.teamId);
      if (team && team.members) {
        team.members = team.members.filter(m => m.id !== action.payload.memberId);
      }
    },

    removeTeam: (state, action: PayloadAction<number | string>) => {
      return state.filter(team => team.id !== action.payload);
    },

  },
});

export const { setTeams, removeMemberFromTeam, removeTeam } = teamsSlice.actions;
export default teamsSlice.reducer;


