import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./utils/HomePageTesting";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import InstructorHomePage from "./pages/HomePages/InstructorHomePage";
import StudentHomePage from "./pages/HomePages/StudentHomePage";
import MainLayoutAdmin from "./components/MainLayout/MainLayoutAdmin";
import MainLayoutInstructor from "./components/MainLayout/MainLayoutInstructor";
import MainLayoutStudent from "./components/MainLayout/MainLayoutStudent";
import AdvertsPage from "./pages/AdvertsPage/AdvertsPage";
import DiscusionPage from "./pages/DiscusionPage/DiscusionPage";
import ViewQuestionPage from "./pages/DiscusionPage/ViewQuestionPage";
import ResoucesPage from "./pages/ResourcesPage/ResurcesPage";
import UsersPage from "./pages/UsersPage/UsersPage";
import ViewProfilePage from "./pages/UsersPage/ViewProfilePage";
import ReportsPage from "./pages/ReportsPage/ReportsPage";
import AdminSettingsPage from "./pages/AdminSettings/AdminSettingsPage";

function App() {

  return (
    <Router>
      <Routes>
        {/* JAVNE RUTE */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* ADMIN RUTE */}
        <Route path="/admin" element={<MainLayoutAdmin />}>
         <Route index element={<ReportsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<ViewProfilePage />} />
        <Route path="adverts" element={<AdvertsPage />} />
        <Route path="resources" element={<ResoucesPage />} />
        <Route path="discussion" element={<DiscusionPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="discussion/thread/:id" element={<ViewQuestionPage />} />
         <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* INSTRUCTOR RUTE */}
        <Route path="/instructor" element={<MainLayoutInstructor />}>
         <Route index element={<InstructorHomePage />} />
          <Route path="home" element={<InstructorHomePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<ViewProfilePage />} />
        <Route path="myProfile" element={<ViewProfilePage />} /> 
        <Route path="adverts" element={<AdvertsPage />} />
        <Route path="resources" element={<ResoucesPage />} />
        <Route path="discussion" element={<DiscusionPage />} />
        <Route path="discussion/thread/:id" element={<ViewQuestionPage />} />
        </Route>

        {/* STUDENT RUTE */}
        <Route path="/student" element={<MainLayoutStudent />}>
         <Route index element={<StudentHomePage />} />
           <Route path="home" element={<StudentHomePage />} />
        <Route path="users" element={<UsersPage />} />
         <Route path="users/:id" element={<ViewProfilePage />} />
         <Route path="myProfile" element={<ViewProfilePage />} /> 
        <Route path="adverts" element={<AdvertsPage />} />
        <Route path="resources" element={<ResoucesPage />} />
        <Route path="discussion" element={<DiscusionPage />} />
        <Route path="discussion/thread/:id" element={<ViewQuestionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
