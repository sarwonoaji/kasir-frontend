import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProductIndex from "./pages/products/Index";
import ProductCreate from "./pages/products/Create";
import ProductEdit from "./pages/products/Edit";

import MainLayout from "./layouts/MainLayout";
import { isLoggedIn } from "./lib/auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ROOT */}
        <Route
          path="/"
          element={
            isLoggedIn() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <MainLayout>
              <ProductIndex />
            </MainLayout>
          }
        />

        <Route
          path="/products/create"
          element={
            <MainLayout>
              <ProductCreate />
            </MainLayout>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <MainLayout>
              <ProductEdit />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
