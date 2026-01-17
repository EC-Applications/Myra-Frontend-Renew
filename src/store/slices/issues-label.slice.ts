import type { iIssuesLabel } from "@/interfaces/issues.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const isssueLabelSlice = createSlice({
    name: "issuesLabel",
    initialState: [] as iIssuesLabel[],
    reducers: {
        setIssuesLabel: (_state, action: PayloadAction<iIssuesLabel[]>) => {
            return action.payload
        }
    }

})

export const { setIssuesLabel } = isssueLabelSlice.actions;
export default isssueLabelSlice.reducer;