import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CommonLogin.css";

function CommonLogin() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    let loginUrl = "";

    if (role === "student") {
      loginUrl = "http://localhost:5000/api/students/login";
    } else if (role === "faculty") {
      loginUrl = "http://localhost:5000/api/faculty/login";
    } else if (role === "admin") {
      loginUrl = "http://localhost:5000/api/admin/login";
    }

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Student Login
      if (role === "student") {
        localStorage.setItem("studentToken", data.token);
        navigate("/student-dashboard");
      }

      // Faculty Login
      else if (role === "faculty") {
        localStorage.setItem("facultyToken", data.token);
        navigate("/faculty-dashboard");
      }

      // Admin Login
      else if (role === "admin") {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin-dashboard");
      }

    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="common-login-page">

      <div className="common-login-card">

        <div className="common-login-header">
          <div className="common-login-icon">
            🎓
          </div>

          <h1>Welcome Back</h1>

          <p>
            College Internship Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="common-form-group">
            <label>Login As</label>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setMessage("");
              }}
            >
              <option value="student">
                Student
              </option>

              <option value="faculty">
                Faculty
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <div className="common-form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="common-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <div className="common-login-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="common-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="common-login-footer">

  <p>
    Don't have a student account?
  </p>

  <button
    type="button"
    onClick={() => navigate("/register")}
  >
    Create Student Account
  </button>

  <button
    type="button"
    className="back-home-btn"
    onClick={() => navigate("/")}
  >
    ← Back to Home
  </button>

</div>

      </div>

    </div>
  );
}

export default CommonLogin;