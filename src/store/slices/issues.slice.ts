import type { iIssues } from "@/interfaces/issues";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { iIssues } from "./";

// issues.slice.ts
const initialState: iIssues[] = [];

const issuesSlice = createSlice({
    name: "issues",
    initialState,
    reducers: {
        setIssues: (_state, action: PayloadAction<iIssues[]>) => {
            console.log("📥 setIssues called with:", action.payload);
            return action.payload;
        },


        removeIssue: (state, action: PayloadAction<number>) => {
            const issueId = action.payload;

            return state.filter((issue) => issue.id !== issueId);
        }
    },
});

export const { setIssues, removeIssue } = issuesSlice.actions;
export default issuesSlice.reducer;

