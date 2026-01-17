import type { iMilestone } from "@/interfaces/milestone.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const mileStoneSlice = createSlice({
    name: "milestone",
    initialState: [] as iMilestone[],
    reducers: {
        addMilestone: (state, action: PayloadAction<iMilestone>) => {
            state.push(action.payload);
        },

        updateMilestone: (state, action: PayloadAction<{ index: number; milestone: iMilestone }>) => {
            state[action.payload.index] = action.payload.milestone;
        },
        removeMilestone: (state, action: PayloadAction<number>) => {
            return state.filter((_, index) => index !== action.payload);
        },
        clearMilestones: (state) => {
            return [];
        },
    }
})

export const { addMilestone, removeMilestone, clearMilestones, updateMilestone } = mileStoneSlice.actions;
export default mileStoneSlice.reducer;