import type {
  iAuthState,
  iLoginResponse,
  iSwitchWorkspace,
  iUserResponse,
} from "@/interfaces/auth.interface";
import type {
  iWorkspace,
  iWorkspaceInviteDto,
} from "@/interfaces/workspace.interface";
import { getItem, setItem } from "@/services/storage.service";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const auth = getItem<iAuthState>("auth");

const initialState: iAuthState = auth || {
  currentUser: 0,
  currentWorkspace: 0,
  currentWorkspaceName: "",
  users: {},
  tokens: {},
};

const updateStorage = (state: iAuthState) => {
  setItem<iAuthState>("auth", state);
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<iLoginResponse>) => {
      const user = action.payload.user;
      state.currentUser = user.id;
      state.currentWorkspace = user.owned_workspaces[0]?.id || 0;
      state.currentWorkspaceName = user.owned_workspaces[0]?.name || "";
      state.tokens[user.id] = action.payload.token;
      state.users[user.id] = action.payload.user;
      updateStorage(state);
    },
    addWorkspace: (state, action: PayloadAction<iWorkspace>) => {
      state.currentWorkspace = action.payload.id;
      state.users[state.currentUser].owned_workspaces.push(action.payload);
      updateStorage(state);
    },
    changeWorkspace: (state, action: PayloadAction<iSwitchWorkspace>) => {
      if (action.payload.userId) state.currentUser = action.payload.userId;
      state.currentWorkspace = action.payload.workspaceId;
      state.currentWorkspaceName = action.payload.workspaceName;
      updateStorage(state);
    },
    changeAccount: (state, action: PayloadAction<iUserResponse>) => {
      const user = action.payload;
      state.currentUser = user.id;
      state.currentWorkspace = user.owned_workspaces[0]?.id || 0;
      updateStorage(state);
    },
    removeInvite: (state, action: PayloadAction<iWorkspaceInviteDto>) => {
      const cu = state.currentUser;
      const invites = [...state.users[cu].invites_workspaces];
      const i = invites.findIndex((x) => x.id == action.payload.id);
      invites.splice(i, 1);
      state.users[cu].invites_workspaces = invites;
      updateStorage(state);
    },
    logout: (state) => {
      const cu = state.currentUser;
      delete state.tokens[cu];
      delete state.users[cu];
      state.currentUser = 0;
      state.currentWorkspace = 0;
      const users = Object.values(state.users);

      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const uw = user.owned_workspaces;
        if (uw.length > 0) {
          state.currentUser = user.id;
          state.currentWorkspace = uw[0].id;
          break;
        }
      }
      if (!state.currentUser) state.currentUser = users[0]?.id || 0;
      if (!state.currentWorkspace)
        state.currentWorkspace = users[0]?.owned_workspaces?.[0]?.id || 0;
      updateStorage(state);
    },
  },
});

export const {
  addAccount,
  addWorkspace,
  changeWorkspace,
  changeAccount,
  removeInvite,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
