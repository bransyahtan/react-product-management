import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

export const fetchProducts = createAsyncThunk(
  "Products",
  async ({ limit = 20, skip = 0 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/products", {
        params: { limit, skip },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Gagal memuat produk"
      );
    }
  }
);
