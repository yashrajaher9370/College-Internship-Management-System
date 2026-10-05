import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./InterviewSchedule.css";

function InterviewSchedule() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/students/interviews",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setInterviews(data.interviews || []);
      } else {
        setMessage(data.message || "Failed to load interviews");
      }

    } catch (error) {
      console.error("Interview error:", error);
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatus = (result) => {
    if (result === "Pending") {
      return "Scheduled";
    }

    if (result === "Selected" || result === "Rejected") {
      return "Completed";
    }

    return "Scheduled";
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="interviews-page">
          <div className="interviews-container">
            <h2>Loading interviews...</h2>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="interviews-page">
        <div className="interviews-container">

          <div className="interviews-header">
            <div>
              <h1>Interview Schedule</h1>
              <p>
                View your upcoming and completed interviews.
              </p>
            </div>

            <Link
              to="/student-dashboard"
              className="dashboard-btn"
            >
              ← Dashboard
            </Link>
          </div>

          {message && (
            <div className="interview-message">
              {message}
            </div>
          )}

          {interviews.length === 0 && !message && (
            <div className="no-interviews">
              <div className="no-interviews-icon">
                📅
              </div>

              <h2>No Interviews Scheduled</h2>

              <p>
                You currently have no scheduled interviews.
              </p>

              <Link
                to="/internships"
                className="browse-interviews-btn"
              >
                Browse Internships
              </Link>
            </div>
          )}

          <div className="interview-list">

            {interviews.map((interview) => {

              const status = getStatus(interview.result);

              return (
                <div
                  className="interview-item"
                  key={interview.interview_id}
                >

                  <div className="interview-date">
                    <span>📅</span>

                    <strong>
                      {formatDate(interview.interview_date)}
                    </strong>

                    <small>
                      {formatTime(interview.interview_date)}
                    </small>
                  </div>

                  <div className="interview-info">

                    <h2>
                      {interview.internship_title}
                    </h2>

                    <p className="company-name">
                      🏢 {interview.company_name}
                    </p>

                    <div className="interview-details">

                      <span>
                        💻 {interview.mode}
                      </span>

                      <span>
                        📍 {interview.location || "Not specified"}
                      </span>

                    </div>

                    <div className="interview-result">
                      <strong>Result:</strong>{" "}
                      {interview.result}
                    </div>

                    {interview.notes && (
                      <div className="interview-notes">
                        <strong>Notes:</strong>{" "}
                        {interview.notes}
                      </div>
                    )}

                  </div>

                  <div className="interview-status">

                    <span
                      className={`interview-badge ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default InterviewSchedule;