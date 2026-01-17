import type { iLabel } from "@/interfaces/label.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const labelSlice = createSlice({
    name: "label",
    initialState: [] as iLabel[],
    reducers: {
        setLabel: (_state, action: PayloadAction<iLabel[]>) => {
            return action.payload
        }
    }

})

export const { setLabel } = labelSlice.actions;
export default labelSlice.reducer;