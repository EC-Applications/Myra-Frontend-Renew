import type { CycleIssueDetail } from "@/interfaces/cycle.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
 
type CycleIssuesState = CycleIssueDetail | null;

const initialState: CycleIssuesState = null;

const cycleIssuesSlice = createSlice({
  name: "cycleIssues",
  initialState: initialState as CycleIssuesState,
  reducers: {
    setCycleIssues: (_state, action: PayloadAction<CycleIssueDetail>) => {
      console.log("📥 setCycleIssues called with:", action.payload);
      return action.payload as CycleIssuesState;
    },

    clearCycleIssues: (_state) => {
      return null as CycleIssuesState;
    },
  },
});

export const { setCycleIssues, clearCycleIssues } = cycleIssuesSlice.actions;
export default cycleIssuesSlice.reducer;
