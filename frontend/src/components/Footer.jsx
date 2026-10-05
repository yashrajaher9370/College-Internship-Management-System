import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">

          <div className="footer-logo">
            <div className="footer-logo-icon">🎓</div>

            <div>
              <h2>College Internship</h2>
              <span>Management System</span>
            </div>
          </div>

          <p>
            A centralized platform that makes internship management
            simple, transparent, and efficient for students and
            institutions.
          </p>

          <div className="footer-badge">
            🚀 Build Skills. Gain Experience. Grow.
          </div>

        </div>


        {/* Quick Links */}
        <div className="footer-column">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/internships">
            Internships
          </Link>

          <Link to="/student-dashboard">
            Dashboard
          </Link>

          <a href="#about">
            About Us
          </a>

        </div>


        {/* Student Services */}
        <div className="footer-column">

          <h3>Student Services</h3>

          <Link to="/internships">
            Find Internships
          </Link>

          <Link to="/applications">
            My Applications
          </Link>

          <Link to="/interviews">
            Interview Schedule
          </Link>

          <Link to="/feedback">
            Feedback
          </Link>

        </div>


        {/* Contact Section */}
        <div className="footer-column contact-column">

          <h3>Get In Touch</h3>

          <p>📧 support@collegeinternship.com</p>

          <p>📞 +91 98765 43210</p>

          <p>📍 Maharashtra, India</p>

          <div className="footer-socials">

            <a href="#" aria-label="LinkedIn">
              in
            </a>

            <a href="#" aria-label="GitHub">
              Git
            </a>

            <a href="#" aria-label="Email">
              @
            </a>

          </div>

        </div>

      </div>


      {/* Footer Bottom */}
      <div className="footer-bottom">

        <p>
          © 2026 College Internship Management System.
          All Rights Reserved.
        </p>

        <p>
          Designed for Students & Institutions
        </p>

      </div>

    </footer>
  );
}

export default Footer;