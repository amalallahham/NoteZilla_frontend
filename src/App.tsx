import React from "react";
import Layout from "./components/Layout";
import Uploader from "./components/uploader/Uploader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Summery from "./components/uploader/Summery";
import UploaderWrapper from "./components/uploader/UploaderWrapper";
import SummeryList from "./components/summary/summaryList";
import AdminDashboard from "./components/AdminDashboard";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import SummaryDetails from "./components/summary/summaryDetails";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<UploaderWrapper />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summery"
            element={
              <ProtectedRoute>
                <SummeryList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/summery/:id"
            element={
              <ProtectedRoute>
                <SummaryDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
