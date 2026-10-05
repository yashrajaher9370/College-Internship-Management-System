import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gpa, setGpa] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");

    // Check password
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            department,
            gpa: Number(gpa)
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");

        // Go to login page
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMessage(data.message || "Registration failed");
      }

    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="register-page">

      <div className="register-container">

        <div className="register-header">
          <h1>Create Account</h1>
          <p>Register as a student</p>
        </div>

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-row">

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>GPA</label>

              <input
                type="number"
                placeholder="0.0 - 4.0"
                min="0"
                max="4"
                step="0.01"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Department</label>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>

              <option value="Computer Engineering">
                Computer Engineering
              </option>

              <option value="Information Technology">
                Information Technology
              </option>

              <option value="AI & Data Science">
                AI & Data Science
              </option>

              <option value="Electronics & Computer">
                Electronics & Computer
              </option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {message && (
          <p className="register-message">
            {message}
          </p>
        )}

        <div className="login-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Register;