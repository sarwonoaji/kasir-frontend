import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ShiftIndex from "./pages/shift/Index";
import ShiftCreate from "./pages/shift/Create";
import ShiftEdit from "./pages/shift/Edit";

import UserIndex from "./pages/users/Index";
import UserCreate from "./pages/users/Create";
import UserEdit from "./pages/users/Edit";

import ProductIndex from "./pages/products/Index";
import ProductCreate from "./pages/products/Create";
import ProductEdit from "./pages/products/Edit";

import ProductInIndex from "./pages/products-in/Index";
import ProductInCreate from "./pages/products-in/Create";
import ProductInEdit from "./pages/products-in/Edit";
import ProductInShow from "./pages/products-in/Show";

import ProductOutIndex from "./pages/products-out/Index";
import ProductOutCreate from "./pages/products-out/Create";
import ProductOutShow from "./pages/products-out/Show";
import ProductOutEdit from "./pages/products-out/Edit";

import CashierSessionIndex from "./pages/cashier-sessions/Index";
import CashierSessionOpen from "./pages/cashier-sessions/Open";
import CashierSessionActive from "./pages/cashier-sessions/Active";

import CashierCreate from "./pages/chasier/Create";

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

        {/* SHIFT*/}
        <Route
          path="/shift"
          element={
            <MainLayout>
              <ShiftIndex />
            </MainLayout>
          }
        />

        <Route
          path="/shift/create"
          element={
            <MainLayout>
              <ShiftCreate />
            </MainLayout>
          }
        />

        <Route
          path="/shift/edit/:id"
          element={
            <MainLayout>
              <ShiftEdit />
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
        {/* PRODUCTS OUT */}
        <Route
          path="/products-out"
          element={
            <MainLayout>
              <ProductOutIndex />
            </MainLayout>
          }
        />

        <Route
          path="/products-out/create"
          element={
            <MainLayout>
              <ProductOutCreate />
            </MainLayout>
          }
        />
        <Route
          path="/products-out/:id"
          element={
            <MainLayout>
              <ProductOutShow />
            </MainLayout>
          }
        />
        <Route
          path="/products-out/edit/:id"
          element={
            <MainLayout>
              <ProductOutEdit />
            </MainLayout>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <MainLayout>
              <UserIndex />
            </MainLayout>
          }
        />

        <Route
          path="/users/create"
          element={
            <MainLayout>
              <UserCreate />
            </MainLayout>
          }
        />

        <Route
          path="/users/edit/:id"
          element={
            <MainLayout>
              <UserEdit />
            </MainLayout>
          }
        />

        {/* CASHIER SESSIONS */}
        <Route
          path="/cashier-sessions"
          element={
            <MainLayout>
              <CashierSessionIndex />
            </MainLayout>
          }
        />

        <Route
          path="/cashier-sessions/open"
          element={
            <MainLayout>
              <CashierSessionOpen />
            </MainLayout>
          }
        />

        <Route
          path="/cashier-sessions/active"
          element={
            <MainLayout>
              <CashierSessionActive />
            </MainLayout>
          }
        />

        {/* CASHIER */}
        <Route
          path="/cashier/create"
          element={<CashierCreate />}
        />
      </Routes>
    </BrowserRouter>
  );
}
