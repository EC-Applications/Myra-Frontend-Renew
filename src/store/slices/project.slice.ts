import type { iProject } from "@/interfaces/project.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
    projects: iProject[];
}

const projectSlice = createSlice({
    name: "project",
    initialState: { projects: [] } as ProjectState,
    reducers: {
        setProject: (state, action: PayloadAction<iProject[]>) => {
            state.projects = action.payload;
        },
        addProject: (state, action: PayloadAction<iProject>) => {
            state.projects.unshift(action.payload);
        },

        removeProject: (state, action: PayloadAction<{ projectId: number }>) => {
            state.projects = state.projects.filter(
                project => project.id !== action.payload.projectId
            );
        },
        updateProject: (
            state,
            action: PayloadAction<{ projectId: number; data: Partial<iProject> }>
        ) => {
            const index = state.projects.findIndex((p: { id: number; }) => p.id === action.payload.projectId);
            if (index !== -1) {
                state.projects[index] = {
                    ...state.projects[index],
                    ...action.payload.data,
                };
            }
        },

    }
})

export const { setProject, removeProject, updateProject, addProject } = projectSlice.actions;
export default projectSlice.reducer; 