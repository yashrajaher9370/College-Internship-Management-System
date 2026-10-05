import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/login",
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

      if (response.ok) {

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save student information
        localStorage.setItem(
          "student",
          JSON.stringify(data.student)
        );

        setMessage("Login successful!");

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/student-dashboard");
        }, 500);

      } else {
        setMessage(data.message || "Invalid email or password");
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your internship management account</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">Forgot Password?</a>

          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        <div className="register-text">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </div>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Login;