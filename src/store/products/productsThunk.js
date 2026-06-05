import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

export const fetchProducts = createAsyncThunk(
  "Products",
  async ({ limit = 20, skip = 0, q = "" } = {}, { rejectWithValue }) => {
    try {
      const endpoint = q ? "/products/search" : "/products";
      const response = await axiosInstance.get(endpoint, {
        params: q ? { q, limit, skip } : { limit, skip },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Gagal memuat produk"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return { ...response.data, id: Number(id) };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Gagal memperbarui produk"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      return Number(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Gagal menghapus produk"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/products/add", productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Gagal menambahkan produk"
      );
    }
  }
);
