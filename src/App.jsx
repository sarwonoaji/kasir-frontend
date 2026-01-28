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
import CashierSessionOpenForm from "./pages/chasier/SessionOpen";
import CashierSessionActiveForm from "./pages/chasier/SessionActive";
import CashierStock from "./pages/chasier/Stock";
import CashierHistoryIndex from "./pages/chasier/HistoryIndex";
import CashierHistoryDetail from "./pages/chasier/HistoryDetail";
import Reports from "./pages/Reports";

import MainLayout from "./layouts/MainLayout";
import CashierLayout from "./layouts/CashierLayout";
import { isLoggedIn } from "./lib/auth";
import ProtectedRoute from "./lib/ProtectedRoute";
import { SessionProvider } from "./lib/SessionContext";

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
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

          {/* DASHBOARD - Can access without active session (read-only info) */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />

          {/* SHIFT - Read-only can access, but create/edit need active session */}
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
                <ProtectedRoute>
                  <ShiftCreate />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          <Route
            path="/shift/edit/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ShiftEdit />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* PRODUCTS - Read-only can access */}
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
                <ProtectedRoute>
                  <ProductCreate />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          <Route
            path="/products/edit/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductEdit />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* PRODUCTS IN - Needs active session */}
          <Route
            path="/products-in"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductInIndex />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          <Route
            path="/products-in/create"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductInCreate />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          <Route
            path="/products-in/edit/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductInEdit />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/products-in/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductInShow />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* PRODUCTS OUT - Needs active session */}
          <Route
            path="/products-out"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductOutIndex />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          <Route
            path="/products-out/create"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductOutCreate />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/products-out/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductOutShow />
                </ProtectedRoute>
              </MainLayout>
            }
          />
          <Route
            path="/products-out/edit/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <ProductOutEdit />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* REPORTS */}
          <Route
            path="/reports"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* USERS */}
          <Route
            path="/users"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <UserIndex />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          <Route
            path="/users/create"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <UserCreate />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          <Route
            path="/users/edit/:id"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <UserEdit />
                </ProtectedRoute>
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

          {/* <Route
            path="/cashier-sessions/open"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <CashierSessionOpen />
                </ProtectedRoute>
              </MainLayout>
            }
          /> */}

          <Route
            path="/cashier-sessions/active"
            element={
              <MainLayout>
                <ProtectedRoute>
                  <CashierSessionActive />
                </ProtectedRoute>
              </MainLayout>
            }
          />

          {/* CASHIER */}
          <Route
            path="/cashier/create"
            element={
              <CashierLayout>
                <ProtectedRoute>
                  <CashierCreate />
                </ProtectedRoute>
              </CashierLayout>
            }
          />

          <Route
            path="/cashier/stock"
            element={
              <CashierLayout>
                <CashierStock />
              </CashierLayout>
            }
          />

          <Route
            path="/cashier/historyindex"
            element={
              <CashierLayout>
                <CashierHistoryIndex/>
              </CashierLayout>
            }
          />

          {/* CASHIER SESSION MANAGEMENT - Khusus Cashier */}
          <Route
            path="/chasier/session/open"
            element={
              <CashierLayout>
                <CashierSessionOpenForm />
              </CashierLayout>
            }
          />

          <Route
            path="/chasier/session/active"
            element={
              <CashierLayout>
                <ProtectedRoute>
                  <CashierSessionActiveForm />
                </ProtectedRoute>
              </CashierLayout>
            }
          />

          <Route
            path="/cashier/history"
            element={
              <CashierLayout>
                <ProtectedRoute>
                  <CashierHistoryIndex />
                </ProtectedRoute>
              </CashierLayout>
            }
          />

          <Route
            path="/cashier/HistoryDetail/:id"
            element={
              <CashierLayout>
                <ProtectedRoute>
                  <CashierHistoryDetail />
                </ProtectedRoute>
              </CashierLayout>
            }
          />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
