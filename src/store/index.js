import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import profileReducer from "./profile";
import productsReducer from "./products";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    products: productsReducer,
  },
});

export default store;
