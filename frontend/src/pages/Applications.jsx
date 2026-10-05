import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Applications.css";

function Applications() {
const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setLoading(false);
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

        setApplications(data.applications);

      } else {

        setMessage(
          data.message || "Failed to load applications"
        );

      }

    } catch (error) {

      console.error("Applications error:", error);

      setMessage("Unable to connect to server");

    }

    setLoading(false);
  };

  const pendingCount = applications.filter(
    (application) => application.status === "Pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "Accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "Rejected"
  ).length;


  if (loading) {
    return (
      <>
        <Navbar />

        <main className="applications-page">
          <div className="applications-container">
            <h2>Loading applications...</h2>
          </div>
        </main>

        <Footer />
      </>
    );
  }


  if (message) {
    return (
      <>
        <Navbar />

        <main className="applications-page">
          <div className="applications-container">
            <h2>{message}</h2>

            <Link
              to="/login"
              className="browse-internships-btn"
            >
              Go to Login
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }


  return (
    <>
      <Navbar />

     <main className="applications-page">

  <div className="applications-container">

    <button
      className="back-dashboard-btn"
      onClick={() => navigate("/student-dashboard")}
    >
      ← Back to Dashboard
    </button>

    <div className="applications-header">

            <div>

              <h1>My Applications</h1>

              <p>
                Track all your internship applications.
              </p>

            </div>

            <Link
              to="/internships"
              className="browse-internships-btn"
            >
              Find Internships
            </Link>

          </div>


          <div className="application-summary">

            <div className="summary-card">

              <span>📋</span>

              <div>

                <h3>
                  {applications.length}
                </h3>

                <p>
                  Total Applications
                </p>

              </div>

            </div>


            <div className="summary-card">

              <span>⏳</span>

              <div>

                <h3>
                  {pendingCount}
                </h3>

                <p>
                  Pending
                </p>

              </div>

            </div>


            <div className="summary-card">

              <span>✅</span>

              <div>

                <h3>
                  {acceptedCount}
                </h3>

                <p>
                  Accepted
                </p>

              </div>

            </div>


            <div className="summary-card">

              <span>❌</span>

              <div>

                <h3>
                  {rejectedCount}
                </h3>

                <p>
                  Rejected
                </p>

              </div>

            </div>

          </div>


          <div className="applications-list">

            {applications.length > 0 ? (

              applications.map((application) => (

                <div
                  className="application-card"
                  key={application.application_id}
                >

                  <div className="application-main">

                    <div className="application-logo">

                      {application.company_name
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>


                    <div className="application-info">

                      <h2>
                        {application.internship_title}
                      </h2>

                      <p className="company">

                        {application.company_name}

                      </p>


                      <div className="application-details">

                        <span>

                          📍 {application.location}

                        </span>


                        <span>

                          📅 Applied:{" "}

                          {new Date(
                            application.applied_at
                          ).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            }
                          )}

                        </span>

                      </div>

                    </div>

                  </div>


                  <div className="application-status">

                    <span
                      className={`status-badge ${application.status.toLowerCase()}`}
                    >

                      {application.status}

                    </span>


                    <Link
                      to={`/internship/${application.internship_id}`}
                      className="view-application-btn"
                    >
                      View Internship
                    </Link>

                  </div>

                </div>

              ))

            ) : (

              <div className="application-card">

                <div className="application-main">

                  <div className="application-logo">
                    📋
                  </div>

                  <div className="application-info">

                    <h2>
                      No Applications Yet
                    </h2>

                    <p className="company">

                      You have not applied for any
                      internship yet.

                    </p>

                  </div>

                </div>

                <div className="application-status">

                  <Link
                    to="/internships"
                    className="view-application-btn"
                  >
                    Find Internships
                  </Link>

                </div>

              </div>

            )}

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}

export default Applications;