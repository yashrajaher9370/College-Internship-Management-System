import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">🎓</div>

        <div className="logo-text">
          <span>College Internship</span>
          <small>Management System</small>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="nav-links">

        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/internships"
          className={location.pathname === "/internships" ? "active" : ""}
        >
          Internships
        </Link>

        

        <a href="#about">
  About
</a>

        <Link
  to="/common-login"
  className={`login-link ${
    location.pathname === "/common-login" ? "active" : ""
  }`}
>
  Login
</Link>

        <Link to="/register" className="register-link">
          Register
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;