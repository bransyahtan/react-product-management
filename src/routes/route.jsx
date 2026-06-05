import { Routes, Route, Navigate } from "react-router-dom";

import { Home, Login, Dashboard, Profile, ProductDetail } from "../pages";

export const AppRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/product/:id" element={<ProductDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
