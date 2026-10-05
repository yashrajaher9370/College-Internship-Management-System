import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminApplications.css";

function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
  "http://localhost:5000/api/admin/applications",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  }
);

      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    return (
      application.student_name
        ?.toLowerCase()
        .includes(searchText) ||
      application.student_email
        ?.toLowerCase()
        .includes(searchText) ||
      application.internship_title
        ?.toLowerCase()
        .includes(searchText) ||
      application.company_name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const getStatusClass = (status) => {
    if (status === "Accepted") return "application-accepted";
    if (status === "Shortlisted") return "application-shortlisted";
    if (status === "Rejected") return "application-rejected";
    if (status === "Withdrawn") return "application-withdrawn";

    return "application-pending";
  };


const updateApplicationStatus = async (applicationId, status) => {
  try {
    setUpdatingId(applicationId);

    const response = await fetch(
  `http://localhost:5000/api/admin/applications/${applicationId}/status`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    },
    body: JSON.stringify({
      status
    })
  }
);
    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update application status");
      return;
    }

    alert(data.message);

    fetchApplications();

  } catch (error) {
    console.error(
      "Failed to update application status:",
      error
    );

    alert("Unable to connect to server");

  } finally {
    setUpdatingId(null);
  }
};

  return (
    <div className="admin-applications-page">

      <div className="applications-page-header">

        <div>
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Application Management</h1>

          <p>
            View and manage student internship applications
          </p>
        </div>

        <div className="application-count">
          <strong>{applications.length}</strong>
          <span>Total Applications</span>
        </div>

      </div>

      <div className="applications-toolbar">

        <input
          type="text"
          placeholder="Search by student, email, internship or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="applications-table-container">

        {loading ? (

          <div className="applications-message">
            Loading applications...
          </div>

        ) : filteredApplications.length === 0 ? (

          <div className="applications-message">

            <div>📄</div>

            <h3>No Applications Found</h3>

            <p>
              No application records match your search.
            </p>

          </div>

        ) : (

          <table className="applications-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Internship</th>
                <th>Company</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredApplications.map((application) => (

                <tr key={application.application_id}>

                  <td>
                    #{application.application_id}
                  </td>

                  <td>
                    <div className="application-student">

                      <div className="application-avatar">
                        👤
                      </div>

                      <div>
                        <strong>
                          {application.student_name}
                        </strong>

                        <span>
                          {application.student_email}
                        </span>
                      </div>

                    </div>
                  </td>

                  <td>
                    {application.internship_title || "—"}
                  </td>

                  <td>
                    {application.company_name || "—"}
                  </td>

                  <td>
                    {application.applied_at
                      ? new Date(
                          application.applied_at
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <span
                      className={`application-status ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td>
  <div className="application-actions">

    {application.status !== "Shortlisted" &&
      application.status !== "Accepted" &&
      application.status !== "Rejected" && (
        <>
          <button
            className="shortlist-btn"
            onClick={() =>
              updateApplicationStatus(
                application.application_id,
                "Shortlisted"
              )
            }
            disabled={
              updatingId === application.application_id
            }
          >
            Shortlist
          </button>

          <button
            className="reject-btn"
            onClick={() =>
              updateApplicationStatus(
                application.application_id,
                "Rejected"
              )
            }
            disabled={
              updatingId === application.application_id
            }
          >
            Reject
          </button>
        </>
      )}

    {application.status === "Shortlisted" && (
      <>
        <button
          className="accept-btn"
          onClick={() =>
            updateApplicationStatus(
              application.application_id,
              "Accepted"
            )
          }
          disabled={
            updatingId === application.application_id
          }
        >
          Accept
        </button>

        <button
          className="reject-btn"
          onClick={() =>
            updateApplicationStatus(
              application.application_id,
              "Rejected"
            )
          }
          disabled={
            updatingId === application.application_id
          }
        >
          Reject
        </button>
      </>
    )}

  </div>
</td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default AdminApplications;