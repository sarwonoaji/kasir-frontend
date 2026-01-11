import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProductIndex from "./pages/products/Index";
import ProductCreate from "./pages/products/Create";
import ProductEdit from "./pages/products/Edit";

import ProductInIndex from "./pages/products-in/Index";
import ProductInCreate from "./pages/products-in/Create";
import ProductInEdit from "./pages/products-in/Edit";
import ProductInShow from "./pages/products-in/Show";

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

        {/* PRODUCTS IN */}
        <Route
          path="/products-in"
          element={
            <MainLayout>
              <ProductInIndex />
            </MainLayout>
          }
        />

        <Route
          path="/products-in/create"
          element={
            <MainLayout>
              <ProductInCreate />
            </MainLayout>
          }
        />

        <Route
          path="/products-in/edit/:id"
          element={
            <MainLayout>
              <ProductInEdit />
            </MainLayout>
          }
        />
        <Route
          path="/products-in/:id"
          element={
            <MainLayout>
              <ProductInShow />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
