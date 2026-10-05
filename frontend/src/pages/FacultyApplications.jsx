import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyApplications.css";

function FacultyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const token = localStorage.getItem("facultyToken");

    if (!token) {
      navigate("/faculty-login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/applications",
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
        setApplications(data.applications || []);
      } else {
        setError(data.message || "Failed to load applications");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    const token = localStorage.getItem("facultyToken");

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/faculty/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status
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
        setMessage(`Application status updated to ${status}.`);
        fetchApplications();
      } else {
        setError(data.message || "Failed to update application");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    }
  };

  const getStatusClass = (status) => {
    return String(status || "").toLowerCase();
  };

  return (
    <div className="faculty-applications-page">

      <div className="faculty-applications-header">
        <div>
          <h1>Student Applications</h1>
          <p>View and manage internship applications</p>
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

      <div className="faculty-applications-container">

        {loading ? (
          <p className="faculty-loading-text">
            Loading applications...
          </p>
        ) : applications.length === 0 ? (
          <div className="faculty-empty-state">
            <h3>No Applications Found</h3>
            <p>
              There are currently no student applications.
            </p>
          </div>
        ) : (
          <div className="faculty-applications-table-wrapper">

            <table className="faculty-applications-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Internship</th>
                  <th>Company</th>
                  <th>Qualifications</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.application_id}>

                    <td>
                      {application.application_id}
                    </td>

                    <td>
                      <strong>
                        {application.student_name}
                      </strong>
                    </td>

                    <td>
                      {application.student_email}
                    </td>

                    <td>
                      {application.internship_title}
                    </td>

                    <td>
                      {application.company_name || "N/A"}
                    </td>

                    <td>
                      {application.qualifications || "N/A"}
                    </td>

                    <td>
                      {application.applied_at
                        ? new Date(
                            application.applied_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      <span
                        className={`faculty-application-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td>
                      <div className="faculty-action-buttons">

                        {application.status === "Pending" && (
                          <>
                            <button
                              className="faculty-shortlist-btn"
                              onClick={() =>
                                updateStatus(
                                  application.application_id,
                                  "Shortlisted"
                                )
                              }
                            >
                              Shortlist
                            </button>

                            <button
                              className="faculty-reject-btn"
                              onClick={() =>
                                updateStatus(
                                  application.application_id,
                                  "Rejected"
                                )
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {application.status === "Shortlisted" && (
                          <button
                            className="faculty-accept-btn"
                            onClick={() =>
                              updateStatus(
                                application.application_id,
                                "Accepted"
                              )
                            }
                          >
                            Accept
                          </button>
                        )}

                        {application.status === "Accepted" && (
                          <span className="faculty-completed-text">
                            Accepted
                          </span>
                        )}

                        {application.status === "Rejected" && (
                          <span className="faculty-completed-text">
                            Rejected
                          </span>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default FacultyApplications;