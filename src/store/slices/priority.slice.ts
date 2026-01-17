import type { IPriority } from "@/interfaces/project.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const prioritySlice = createSlice({
    name: "priority",
    initialState: [] as IPriority[],
    reducers: {
        setPriorityList: (state, action: PayloadAction<IPriority[]>) => {
            return action.payload;
        }
    }
})

export const { setPriorityList } = prioritySlice.actions;
export default prioritySlice.reducer;  