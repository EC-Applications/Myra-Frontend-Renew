// import type { iMember } from "@/interfaces/teams.interface";
import type { iWorkspaceMember } from "@/interfaces/workspace.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
    name: "workspace",
    initialState: [] as iWorkspaceMember[],
    reducers: {
        setWorkspaceMember: (_state, action: PayloadAction<iWorkspaceMember[]>) => {
            return action.payload
        },
        
          removeWorkspaceMember: (state, action: PayloadAction<number | undefined>) => {
            return state.filter(member => member.id !== action.payload);
        },

    }
})

export const { setWorkspaceMember, removeWorkspaceMember } = workspaceSlice.actions;
export default workspaceSlice.reducer;