import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyInterviews.css";

function FacultyInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    application_id: "",
    interview_date: "",
    mode: "Online",
    location: ""
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    const token = localStorage.getItem("facultyToken");

    if (!token) {
      navigate("/faculty-login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/interviews",
        {
          method: "GET",
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
        setInterviews(data.interviews || []);
      } else {
        setError(data.message || "Failed to load interviews");
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
        "http://localhost:5000/api/faculty/interviews",
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
        setMessage("Interview scheduled successfully!");

        setForm({
          application_id: "",
          interview_date: "",
          mode: "Online",
          location: ""
        });

        fetchInterviews();
      } else {
        setError(data.message || "Failed to schedule interview");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  const updateResult = async (interviewId, result) => {
    const token = localStorage.getItem("facultyToken");

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/faculty/interviews/${interviewId}/result`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            result
          })
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("facultyToken");
        navigate("/faculty-login");
        return;
      }

      if (data.success) {
        setMessage(`Interview result updated to ${result}.`);
        fetchInterviews();
      } else {
        setError(data.message || "Failed to update result");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="faculty-interviews-page">

      <div className="faculty-interviews-header">
        <div>
          <h1>Interview Management</h1>
          <p>Schedule interviews and update interview results</p>
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

      <div className="faculty-interview-form-card">

        <h2>Schedule New Interview</h2>

        <form onSubmit={handleSubmit}>

          <div className="faculty-interview-form-grid">

            <div className="faculty-form-group">
              <label>Application ID</label>

              <input
                type="number"
                name="application_id"
                value={form.application_id}
                onChange={handleChange}
                placeholder="Enter application ID"
                min="1"
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Interview Date & Time</label>

              <input
                type="datetime-local"
                name="interview_date"
                value={form.interview_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="faculty-form-group">
              <label>Mode</label>

              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div className="faculty-form-group">
              <label>Location / Meeting Link</label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location or meeting link"
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="faculty-schedule-btn"
          >
            Schedule Interview
          </button>

        </form>

      </div>

      <div className="faculty-interviews-list">

        <h2>Scheduled Interviews</h2>

        {loading ? (
          <p className="faculty-loading-text">
            Loading interviews...
          </p>
        ) : interviews.length === 0 ? (
          <div className="faculty-empty-state">
            <h3>No Interviews Found</h3>
            <p>
              There are currently no scheduled interviews.
            </p>
          </div>
        ) : (
          <div className="faculty-interview-grid">

            {interviews.map((interview) => (

              <div
                className="faculty-interview-card"
                key={interview.interview_id}
              >

                <div className="faculty-interview-card-header">

                  <h3>
                    Interview #{interview.interview_id}
                  </h3>

                  <span
                    className={`faculty-interview-result ${String(
                      interview.result || "Pending"
                    ).toLowerCase()}`}
                  >
                    {interview.result || "Pending"}
                  </span>

                </div>

                <p>
                  <strong>Application ID:</strong>{" "}
                  {interview.application_id}
                </p>

                <p>
                  <strong>Student:</strong>{" "}
                  {interview.student_name || "N/A"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {interview.student_email || "N/A"}
                </p>

                <p>
                  <strong>Internship:</strong>{" "}
                  {interview.internship_title || "N/A"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {interview.interview_date
                    ? new Date(
                        interview.interview_date
                      ).toLocaleString()
                    : "N/A"}
                </p>

                <p>
                  <strong>Mode:</strong>{" "}
                  {interview.mode}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {interview.location || "N/A"}
                </p>

                {interview.result === "Pending" && (
                  <div className="faculty-result-buttons">

                    <button
                      className="faculty-select-btn"
                      onClick={() =>
                        updateResult(
                          interview.interview_id,
                          "Selected"
                        )
                      }
                    >
                      Select
                    </button>

                    <button
                      className="faculty-reject-btn"
                      onClick={() =>
                        updateResult(
                          interview.interview_id,
                          "Rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default FacultyInterviews;