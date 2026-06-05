import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, updateProduct, deleteProduct } from "./productsThunk";

const initialState = {
  products: [],
  total: 0,
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.id) {
          const index = state.products.findIndex((p) => p.id === action.payload.id);
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.products = state.products.filter(
            (p) => p.id !== action.payload && p.id !== Number(action.payload)
          );
          state.total = Math.max(0, state.total - 1);
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
