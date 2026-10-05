import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyLogin.css";

function FacultyLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("facultyToken", data.token);

        navigate("/faculty-dashboard");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="faculty-login-page">
      <div className="faculty-login-card">

        <h1>Faculty Login</h1>

        <p className="faculty-login-subtitle">
          Login to manage internships, applications and interviews
        </p>

        <form onSubmit={handleLogin}>

          <div className="faculty-form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter faculty email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="faculty-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className="faculty-login-message">
              {message}
            </p>
          )}

          <button type="submit" className="faculty-login-btn">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default FacultyLogin;