import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

export const loginUser = createAsyncThunk(
  "Login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
        expiresInMins: 30,
      });

      const data = response.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("image", data.image);

      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan koneksi";
      return rejectWithValue(errorMessage);
    }
  }
);
