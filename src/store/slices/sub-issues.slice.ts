
import type { iIssues } from "@/interfaces/issues";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const subIssuesSlice = createSlice({
    name: "subIssues",
    initialState: [] as iIssues[],
    reducers: {
        setSubIssues: (_state, action: PayloadAction<iIssues[]>) => {
            console.log("📥 setIssues called with:", action.payload);
            return action.payload;
        },


        removeSubIssue: (state, action: PayloadAction<number>) => {
            console.log("🗑️ removeIssue called for ID:", action.payload);
            console.log("🗑️ State BEFORE filter:", state);
            console.log("🗑️ State IDs:", state.map(i => i.id));
            const newState = state.filter(issue => issue.id !== action.payload);

            console.log("🗑️ State AFTER filter:", newState);
            console.log("🗑️ Removed?", state.length !== newState.length);

            return newState;
        },
    },
});

export const { setSubIssues, removeSubIssue } = subIssuesSlice.actions;
export default subIssuesSlice.reducer;

