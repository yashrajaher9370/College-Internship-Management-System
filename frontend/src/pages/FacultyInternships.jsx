import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyInternships.css";

function FacultyInternships() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company_id: "",
    title: "",
    description: "",
    domain: "",
    location: "",
    duration_weeks: "",
    stipend: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    const token = localStorage.getItem("facultyToken");

    if (!token) {
      navigate("/faculty-login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/internships",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("facultyToken");
        navigate("/faculty-login");
        return;
      }

      if (data.success) {
        setInternships(data.internships || []);
      } else {
        setError(data.message || "Failed to load internships");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("facultyToken");

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/internships",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("facultyToken");
        navigate("/faculty-login");
        return;
      }

      if (data.success) {
        setMessage("Internship created successfully!");

        setForm({
          company_id: "",
          title: "",
          description: "",
          domain: "",
          location: "",
          duration_weeks: "",
          stipend: "",
          start_date: "",
          end_date: ""
        });

        fetchInternships();
      } else {
        setError(data.message || "Failed to create internship");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="faculty-internships-page">

      <div className="faculty-internships-header">
        <div>
          <h1>Manage Internships</h1>
          <p>Create and manage internship opportunities</p>
        </div>

        <button
          className="faculty-back-btn"
          onClick={() => navigate("/faculty-dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {message && (
        <div className="faculty-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="faculty-error-message">
          {error}
        </div>
      )}

      <div className="faculty-internship-form-card">
        <h2>Create New Internship</h2>

        <form onSubmit={handleSubmit}>

          <div className="faculty-form-grid">

            <div className="faculty-form-group">
              <label>Company ID</label>
              <input
                type="number"
                name="company_id"
                value={form.company_id}
                onChange={handleChange}
                placeholder="Enter company ID"
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Internship Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Java Developer Intern"
                required
              />
            </div>

            <div className="faculty-form-group faculty-full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter internship description"
                rows="4"
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Domain</label>
              <input
                type="text"
                name="domain"
                value={form.domain}
                onChange={handleChange}
                placeholder="e.g. Java, Python, Web Development"
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Pune"
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Duration (Weeks)</label>
              <input
                type="number"
                name="duration_weeks"
                value={form.duration_weeks}
                onChange={handleChange}
                placeholder="e.g. 12"
                min="4"
                max="26"
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Stipend (₹)</label>
              <input
                type="number"
                name="stipend"
                value={form.stipend}
                onChange={handleChange}
                placeholder="e.g. 10000"
                min="0"
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="faculty-create-btn"
          >
            Create Internship
          </button>

        </form>
      </div>

      <div className="faculty-internships-list">
        <h2>Existing Internships</h2>

        {loading ? (
          <p>Loading internships...</p>
        ) : internships.length === 0 ? (
          <p>No internships found.</p>
        ) : (
          <div className="faculty-internship-grid">

            {internships.map((internship) => (
              <div
                className="faculty-internship-card"
                key={internship.internship_id}
              >
                <div className="faculty-internship-card-header">
                  <h3>{internship.title}</h3>

                  <span
                    className={`faculty-status ${String(
                      internship.status
                    ).toLowerCase()}`}
                  >
                    {internship.status}
                  </span>
                </div>

                <p>
                  <strong>Company:</strong>{" "}
                  {internship.company_name || internship.company_id}
                </p>

                <p>
                  <strong>Domain:</strong>{" "}
                  {internship.domain}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {internship.location}
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {internship.duration_weeks} weeks
                </p>

                <p>
                  <strong>Stipend:</strong>{" "}
                  ₹{internship.stipend}
                </p>

                <p>
                  <strong>Start:</strong>{" "}
                  {String(internship.start_date).split("T")[0]}
                </p>

                <p>
                  <strong>End:</strong>{" "}
                  {String(internship.end_date).split("T")[0]}
                </p>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  );
}

export default FacultyInternships;