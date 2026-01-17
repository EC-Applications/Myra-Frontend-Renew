import type { iPojectStatus } from "@/interfaces/project.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const statusSlice = createSlice({
    name: "status",
    initialState: [] as iPojectStatus[],
    reducers: {
        projectCatetory: (_state, action: PayloadAction<iPojectStatus[]>) => {
            return action.payload;
        }
    }
})

export const { projectCatetory } = statusSlice.actions;
export default statusSlice.reducer;  