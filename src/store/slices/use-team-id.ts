import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { act } from "react";
// import { setTeams } from "./team.slice";

const useTeamId = createSlice({
  name: "teamId",
  initialState: 0,
  reducers: {
    setTeamId: (_state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { setTeamId } = useTeamId.actions;
export default useTeamId.reducer;
