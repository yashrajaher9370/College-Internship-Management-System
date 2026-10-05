import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Feedback.css";

function Feedback() {
 const [applicationId, setApplicationId] = useState("");
const [applications, setApplications] = useState([]);
const [loadingApplications, setLoadingApplications] = useState(true);
const [submittedFeedback, setSubmittedFeedback] = useState([]);

  const [ratings, setRatings] = useState({
    technicalSkills: 0,
    communicationSkills: 0,
    teamwork: 0,
    problemSolving: 0,
    overallRating: 0
  });

  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  fetchApplications();
}, []);

const fetchApplications = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      setLoadingApplications(false);
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/students/applications",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setApplications(data.applications || []);

      if (data.applications && data.applications.length > 0) {
        setApplicationId(data.applications[0].application_id);
      }
    } else {
      setMessage(
        data.message || "Failed to load applications."
      );
    }

  } catch (error) {
    console.error("Applications error:", error);
    setMessage("Unable to connect to server.");
  }

  setLoadingApplications(false);
};const fetchSubmittedFeedback = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/students/feedback",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setSubmittedFeedback(data.feedback || []);
    }

  } catch (error) {
    console.error("Submitted feedback error:", error);
  }
};
  const handleRating = (field, value) => {
    setRatings({
      ...ratings,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      ratings.technicalSkills === 0 ||
      ratings.communicationSkills === 0 ||
      ratings.teamwork === 0 ||
      ratings.problemSolving === 0 ||
      ratings.overallRating === 0
    ) {
      setMessage("Please provide all ratings.");
      return;
    }

    if (!feedback.trim()) {
      setMessage("Please write your feedback.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            applicationId: Number(applicationId),
            technicalSkills: ratings.technicalSkills,
            communicationSkills: ratings.communicationSkills,
            teamwork: ratings.teamwork,
            problemSolving: ratings.problemSolving,
            overallRating: ratings.overallRating,
            feedback: feedback
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Feedback submitted successfully!");

        setRatings({
          technicalSkills: 0,
          communicationSkills: 0,
          teamwork: 0,
          problemSolving: 0,
          overallRating: 0
        });

        setFeedback("");
      } else {
        setMessage(data.message || "Failed to submit feedback.");
      }

    } catch (error) {
      console.error("Feedback error:", error);
      setMessage("Unable to connect to server.");
    }

    setSubmitting(false);
  };

  const RatingStars = ({ field }) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className={
              star <= ratings[field]
                ? "star active"
                : "star"
            }
            onClick={() => handleRating(field, star)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <main className="feedback-page">
        <div className="feedback-container">

          <div className="feedback-header">
            <h1>Internship Feedback</h1>

            <p>
              Share your experience and help improve the internship program.
            </p>
          </div>

          <div className="feedback-card">

            <div className="internship-info">

              <div className="feedback-logo">
                T
              </div>

              <div>
               {applications.length > 0 ? (
  <>
    <h2>
      {applications.find(
        (app) => app.application_id === Number(applicationId)
      )?.internship_title || "Internship"}
    </h2>

    <p>
      {applications.find(
        (app) => app.application_id === Number(applicationId)
      )?.company_name || "Company"}
    </p>
  </>
) : (
  <>
    <h2>No Application Found</h2>
    <p>Please apply for an internship first.</p>
  </>
)}
              </div>

            </div>

            <form onSubmit={handleSubmit}>
              {applications.length > 0 && (
  <div className="form-group">
    <label>Select Internship</label>

    <select
      value={applicationId}
      onChange={(e) =>
        setApplicationId(Number(e.target.value))
      }
      required
    >
      {applications.map((application) => (
        <option
          key={application.application_id}
          value={application.application_id}
        >
          {application.internship_title} -{" "}
          {application.company_name}
        </option>
      ))}
    </select>
  </div>
)}

              {/* Technical Skills */}

              <div className="rating-section">

                <label>Technical Skills</label>

                <RatingStars field="technicalSkills" />

                <p className="rating-text">
                  {ratings.technicalSkills === 0
                    ? "Select a rating"
                    : `${ratings.technicalSkills} out of 5 stars`}
                </p>

              </div>

              {/* Communication Skills */}

              <div className="rating-section">

                <label>Communication Skills</label>

                <RatingStars field="communicationSkills" />

                <p className="rating-text">
                  {ratings.communicationSkills === 0
                    ? "Select a rating"
                    : `${ratings.communicationSkills} out of 5 stars`}
                </p>

              </div>

              {/* Teamwork */}

              <div className="rating-section">

                <label>Teamwork</label>

                <RatingStars field="teamwork" />

                <p className="rating-text">
                  {ratings.teamwork === 0
                    ? "Select a rating"
                    : `${ratings.teamwork} out of 5 stars`}
                </p>

              </div>

              {/* Problem Solving */}

              <div className="rating-section">

                <label>Problem Solving</label>

                <RatingStars field="problemSolving" />

                <p className="rating-text">
                  {ratings.problemSolving === 0
                    ? "Select a rating"
                    : `${ratings.problemSolving} out of 5 stars`}
                </p>

              </div>

              {/* Overall Rating */}

              <div className="rating-section">

                <label>Overall Rating</label>

                <RatingStars field="overallRating" />

                <p className="rating-text">
                  {ratings.overallRating === 0
                    ? "Select a rating"
                    : `${ratings.overallRating} out of 5 stars`}
                </p>

              </div>

              {/* Feedback */}

              <div className="form-group">

                <label>Write Your Feedback</label>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your internship experience..."
                  rows="7"
                  required
                ></textarea>

              </div>

              {/* Message */}

              {message && (
                <div className="feedback-message">
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="submit-feedback-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Feedback"}
              </button>

            </form>

          </div>

          <Link
            to="/student-dashboard"
            className="back-dashboard"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default Feedback;