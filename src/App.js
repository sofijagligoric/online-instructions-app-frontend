import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./utils/HomePageTesting";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import AdminHomePage from "./pages/HomePages/AdminHomePage";
import InstructorHomePage from "./pages/HomePages/InstructorHomePage";
import StudentHomePage from "./pages/HomePages/StudentHomePage";
import MainLayoutAdmin from "./components/MainLayout/MainLayoutAdmin";
import MainLayoutInstructor from "./components/MainLayout/MainLayoutInstructor";
import MainLayoutStudent from "./components/MainLayout/MainLayoutStudent";
import AdvertsPage from "./pages/AdvertsPage/AdvertsPage";
import DiscusionPage from "./pages/DiscusionPage/DiscusionPage";
import ViewQuestionPage from "./pages/DiscusionPage/ViewQuestionPage";
import ResoucesPage from "./pages/ResourcesPage/ResurcesPage";

function App() {
  // TODO - Popraviti rutiranje kada bude omoguceno na backu, staviti da bude preglednije i smislenije
/*   return (
    <Router>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/admin/main" element={<MainLayoutAdmin />} />
        <Route path="/admin/home" element={<AdminHomePage />} />
        <Route path="/admin/users" element={<AdminHomePage />} />
        <Route path="/admin/adverts" element={<AdminHomePage />} />
        <Route path="/admin/resources" element={<AdminHomePage />} />
        <Route path="/admin/discusion" element={<AdminHomePage />} />
        <Route path="/admin/reports" element={<AdminHomePage />} />

        <Route path="/instructor/main" element={<MainLayoutInstructor />} />
        <Route path="/instructor/home" element={<InstructorHomePage />} />
        <Route path="/instructor/users" element={<InstructorHomePage />} />
        <Route path="/instructor/adverts" element={<InstructorHomePage />} />
        <Route path="/instructor/resources" element={<InstructorHomePage />} />
        <Route path="/instructor/discusion" element={<InstructorHomePage />} />

        <Route path="/student/main" element={<MainLayoutStudent />} />
        <Route path="/student/home" element={<StudentHomePage />} />
        <Route path="/student/users" element={<StudentHomePage />} />
        <Route path="/student/adverts" element={<StudentHomePage />} />
        <Route path="/student/resources" element={<StudentHomePage />} />
        <Route path="/student/discusion" element={<StudentHomePage />} />
      </Routes>
    </Router>
  );
 */
  return (
    <Router>
      <Routes>
        {/* JAVNE RUTE */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* ADMIN RUTE */}
        <Route path="/admin" element={<MainLayoutAdmin />}>
         <Route index element={<AdminHomePage />} />
           <Route path="home" element={<AdminHomePage />} />
        <Route path="users" element={<AdminHomePage />} />
        <Route path="adverts" element={<AdvertsPage />} />
        <Route path="resources" element={<ResoucesPage />} />
        <Route path="discusion" element={<DiscusionPage />} />
        <Route path="reports" element={<AdminHomePage />} />
        <Route path="discusion/thread/:id" element={<ViewQuestionPage />} />
        </Route>

        {/* INSTRUCTOR RUTE */}
        <Route path="/instructor" element={<MainLayoutInstructor />}>
         <Route index element={<InstructorHomePage />} />
          <Route path="home" element={<InstructorHomePage />} />
        <Route path="users" element={<InstructorHomePage />} />
        <Route path="adverts" element={<AdvertsPage />} />
        <Route path="resources" element={<ResoucesPage />} />
        <Route path="discusion" element={<DiscusionPage />} />
        <Route path="discusion/thread/:id" element={<ViewQuestionPage />} />
        </Route>

        {/* STUDENT RUTE */}
        <Route path="/student" element={<MainLayoutStudent />}>
         <Route index element={<StudentHomePage />} />
           <Route path="home" element={<StudentHomePage />} />
        <Route path="users" element={<StudentHomePage />} />
        <Route path="adverts" element={<AdvertsPage />} />
        <Route path="resources" element={<ResoucesPage />} />
        <Route path="discusion" element={<DiscusionPage />} />
        <Route path="discusion/thread/:id" element={<ViewQuestionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
