import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminReports.css";

function AdminReports() {
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
     const response = await fetch(
  "http://localhost:5000/api/admin/reports",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  }
);

      const data = await response.json();

      if (data.success) {
        setReport(data.report);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getValue = (key) => {
    return report?.[key]?.total ?? 0;
  };

  const getAverage = () => {
    return Number(report?.averageRating?.average || 0).toFixed(1);
  };

  if (loading) {
    return (
      <div className="admin-reports-page">
        <div className="reports-message">
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">

      <div className="reports-page-header">

        <div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Reports</h1>

          <p>
            Overview of college internship management activities
          </p>

        </div>

      </div>


      {/* Main Statistics */}

      <div className="report-section">

        <h2>System Overview</h2>

        <div className="report-cards">

          <div className="report-card">
            <span>👨‍🎓</span>
            <div>
              <strong>{getValue("totalStudents")}</strong>
              <p>Total Students</p>
            </div>
          </div>


          <div className="report-card">
            <span>🏢</span>
            <div>
              <strong>{getValue("totalCompanies")}</strong>
              <p>Total Companies</p>
            </div>
          </div>


          <div className="report-card">
            <span>💼</span>
            <div>
              <strong>{getValue("totalInternships")}</strong>
              <p>Total Internships</p>
            </div>
          </div>


          <div className="report-card">
            <span>📝</span>
            <div>
              <strong>{getValue("totalApplications")}</strong>
              <p>Total Applications</p>
            </div>
          </div>

        </div>

      </div>


      {/* Application Report */}

      <div className="report-section">

        <h2>Application Report</h2>

        <div className="status-grid">

          <div className="status-card pending">
            <strong>
              {getValue("pendingApplications")}
            </strong>
            <span>Pending</span>
          </div>


          <div className="status-card shortlisted">
            <strong>
              {getValue("shortlistedApplications")}
            </strong>
            <span>Shortlisted</span>
          </div>


          <div className="status-card accepted">
            <strong>
              {getValue("acceptedApplications")}
            </strong>
            <span>Accepted</span>
          </div>


          <div className="status-card rejected">
            <strong>
              {getValue("rejectedApplications")}
            </strong>
            <span>Rejected</span>
          </div>

        </div>

      </div>


      {/* Interview Report */}

      <div className="report-section">

        <h2>Interview Report</h2>

        <div className="status-grid">

          <div className="status-card total">
            <strong>
              {getValue("totalInterviews")}
            </strong>
            <span>Total Interviews</span>
          </div>


          <div className="status-card accepted">
            <strong>
              {getValue("selectedInterviews")}
            </strong>
            <span>Selected</span>
          </div>


          <div className="status-card rejected">
            <strong>
              {getValue("rejectedInterviews")}
            </strong>
            <span>Rejected</span>
          </div>

        </div>

      </div>


      {/* Evaluation Report */}

      <div className="report-section">

        <h2>Evaluation Report</h2>

        <div className="evaluation-summary">

          <div className="evaluation-summary-card">

            <div className="evaluation-icon">
              ⭐
            </div>

            <div>
              <strong>
                {getAverage()} / 5
              </strong>

              <p>
                Average Evaluation Rating
              </p>
            </div>

          </div>


          <div className="evaluation-summary-card">

            <div className="evaluation-icon">
              📋
            </div>

            <div>
              <strong>
                {getValue("totalEvaluations")}
              </strong>

              <p>
                Total Evaluations
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminReports;