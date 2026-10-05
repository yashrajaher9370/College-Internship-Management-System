import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CommonLogin from "./pages/CommonLogin";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Internships from "./pages/Internships";
import InternshipDetails from "./pages/InternshipDetails";
import Apply from "./pages/Apply";
import StudentDashboard from "./pages/StudentDashboard";
import Applications from "./pages/Applications";
import InterviewSchedule from "./pages/InterviewSchedule";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";

import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminCompanies from "./pages/AdminCompanies";
import AdminInternships from "./pages/AdminInternships";
import AdminApplications from "./pages/AdminApplications";
import AdminInterviews from "./pages/AdminInterviews";
import AdminEvaluations from "./pages/AdminEvaluations";
import AdminReports from "./pages/AdminReports";

import FacultyLogin from "./pages/FacultyLogin";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyInternships from "./pages/FacultyInternships";
import FacultyApplications from "./pages/FacultyApplications";
import FacultyInterviews from "./pages/FacultyInterviews";
import FacultyProtectedRoute from "./components/FacultyProtectedRoute";


import "./App.css";
function ProtectedRoute({ children }) {
  const studentToken = localStorage.getItem("studentToken");

  if (!studentToken) {
    return <Navigate to="/common-login" replace />;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/common-login" element={<CommonLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="/admin-login" element={<AdminLogin />} />
  <Route
  path="/admin-dashboard"
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin-students"
  element={
    <AdminProtectedRoute>
      <AdminStudents />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin-companies"
  element={
    <AdminProtectedRoute>
      <AdminCompanies />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin-internships"
  element={
    <AdminProtectedRoute>
      <AdminInternships />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin-applications"
  element={
    <AdminProtectedRoute>
      <AdminApplications />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin-interviews"
  element={
    <AdminProtectedRoute>
      <AdminInterviews />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin-evaluations"
  element={
    <AdminProtectedRoute>
      <AdminEvaluations />
    </AdminProtectedRoute>
  }
/>

<Route
  path="/admin-reports"
  element={
    <AdminProtectedRoute>
      <AdminReports />
    </AdminProtectedRoute>
  }
/>
        <Route
          path="/internship/:id"
          element={<InternshipDetails />}
        />

        <Route
  path="/student-dashboard"
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
         <Route
  path="/applications"
  element={
    <ProtectedRoute>
      <Applications />
    </ProtectedRoute>
  }
/>
<Route
  path="/interviews"
  element={
    <ProtectedRoute>
      <InterviewSchedule />
    </ProtectedRoute>
  }
/>
<Route
  path="/feedback"
  element={
    <ProtectedRoute>
      <Feedback />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/faculty-login"
  element={<FacultyLogin />}
/>
<Route
  path="/faculty-dashboard"
  element={
    <FacultyProtectedRoute>
      <FacultyDashboard />
    </FacultyProtectedRoute>
  }
/>
<Route
  path="/faculty-internships"
  element={
    <FacultyProtectedRoute>
      <FacultyInternships />
    </FacultyProtectedRoute>
  }
/>
<Route
  path="/faculty-applications"
  element={
    <FacultyProtectedRoute>
      <FacultyApplications />
    </FacultyProtectedRoute>
  }
/>
<Route
  path="/faculty-interviews"
  element={
    <FacultyProtectedRoute>
      <FacultyInterviews />
    </FacultyProtectedRoute>
  }
/>
    </Routes>
      
    </BrowserRouter>
  );
}


export default App;