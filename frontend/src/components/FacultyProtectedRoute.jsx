import { Navigate } from "react-router-dom";

function FacultyProtectedRoute({ children }) {
  const facultyToken = localStorage.getItem("facultyToken");

  if (!facultyToken) {
    return <Navigate to="/faculty-login" replace />;
  }

  return children;
}

export default FacultyProtectedRoute;