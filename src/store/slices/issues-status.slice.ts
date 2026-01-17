import type { iStatus } from "@/interfaces/issues";
import type { iIssueStatus } from "@/interfaces/issues-status.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const issuesStatus = createSlice({
    name: "issuesStatus",
    initialState: [] as iIssueStatus[],
    reducers: {
        setIssuesSatus: (_state, action: PayloadAction<iIssueStatus[]>) => {
            return action.payload
        }
    }
})

export const { setIssuesSatus } = issuesStatus.actions;
export default issuesStatus.reducer;