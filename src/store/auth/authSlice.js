import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authThunk";

const initialState = {
  token: localStorage.getItem("accessToken") || null,
  user: localStorage.getItem("accessToken")
    ? {
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
        image: localStorage.getItem("image"),
      }
    : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("firstName");
      localStorage.removeItem("lastName");
      localStorage.removeItem("image");
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          image: action.payload.image,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
