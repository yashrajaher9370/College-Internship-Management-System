import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyDashboard.css";

function FacultyDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    internships: 0,
    applications: 0,
    interviews: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("facultyToken");

    if (!token) {
      navigate("/faculty-login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/faculty/dashboard-stats",
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
        setStats(data.stats);
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("facultyToken");
  navigate("/common-login");
};

  if (loading) {
    return (
      <div className="faculty-dashboard-loading">
        <div className="faculty-loader"></div>
        <p>Loading Faculty Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">

      {/* Top Navigation */}
      <header className="faculty-topbar">

        <div className="faculty-brand">
          <div className="faculty-brand-icon">
            🎓
          </div>

          <div>
            <h2>InternHub</h2>
            <span>Faculty Portal</span>
          </div>
        </div>

        <div className="faculty-topbar-right">

          <div className="faculty-profile-mini">
            <div className="faculty-avatar">
              A
            </div>

            <div className="faculty-profile-text">
              <strong>Anuj Sir</strong>
              <span>Faculty</span>
            </div>
          </div>

          <button
            className="faculty-logout-btn"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </header>

      {/* Main Content */}
      <main className="faculty-main-content">

        {/* Welcome Section */}
        <section className="faculty-welcome-section">

          <div className="faculty-welcome-text">

            <span className="faculty-welcome-badge">
              Faculty Dashboard
            </span>

            <h1>
              Welcome back, <span>Anuj Sir!</span> 👋
            </h1>

            <p>
              Manage internships, student applications and interviews
              from one place.
            </p>

          </div>

          <div className="faculty-welcome-icon">
            🎓
          </div>

        </section>

        {error && (
          <div className="faculty-dashboard-error">
            ⚠️ {error}
          </div>
        )}

        {/* Statistics */}
        <section className="faculty-section">

          <div className="faculty-section-heading">
            <div>
              <h2>Overview</h2>
              <p>Current internship management statistics</p>
            </div>
          </div>

          <div className="faculty-stats-grid">

            <div className="faculty-stat-card students-card">

              <div className="faculty-stat-icon">
                👨‍🎓
              </div>

              <div className="faculty-stat-content">
                <span>Total Students</span>
                <h3>{stats.totalStudents ?? 0}</h3>
                <small>Registered students</small>
              </div>

            </div>

            <div className="faculty-stat-card internships-card">

              <div className="faculty-stat-icon">
                💼
              </div>

              <div className="faculty-stat-content">
                <span>Internships</span>
                <h3>{stats.totalInternships ?? 0}</h3>
                <small>Available opportunities</small>
              </div>

            </div>

            <div className="faculty-stat-card applications-card">

              <div className="faculty-stat-icon">
                📄
              </div>

              <div className="faculty-stat-content">
                <span>Applications</span>
                <h3>{stats.totalApplications ?? 0}</h3>
                <small>Student applications</small>
              </div>

            </div>

            <div className="faculty-stat-card interviews-card">

              <div className="faculty-stat-icon">
                🎤
              </div>

              <div className="faculty-stat-content">
                <span>Interviews</span>
                <h3>{stats.totalInterviews ?? 0}</h3>
                <small>Scheduled interviews</small>
              </div>

            </div>

          </div>

        </section>

        {/* Management */}
        <section className="faculty-section">

          <div className="faculty-section-heading">
            <div>
              <h2>Faculty Management</h2>
              <p>Quick access to your management tools</p>
            </div>
          </div>

          <div className="faculty-management-grid">

            <button
              className="faculty-management-card"
              onClick={() => navigate("/faculty-internships")}
            >

              <div className="faculty-management-icon">
                💼
              </div>

              <div className="faculty-management-content">
                <h3>Manage Internships</h3>
                <p>
                  Create and manage internship opportunities
                  for students.
                </p>
              </div>

              <span className="faculty-card-arrow">
                →
              </span>

            </button>

            <button
              className="faculty-management-card"
              onClick={() => navigate("/faculty-applications")}
            >

              <div className="faculty-management-icon">
                📋
              </div>

              <div className="faculty-management-content">
                <h3>Student Applications</h3>
                <p>
                  Review applications and update student
                  application status.
                </p>
              </div>

              <span className="faculty-card-arrow">
                →
              </span>

            </button>

            <button
              className="faculty-management-card"
              onClick={() => navigate("/faculty-interviews")}
            >

              <div className="faculty-management-icon">
                🎤
              </div>

              <div className="faculty-management-content">
                <h3>Interview Management</h3>
                <p>
                  Schedule interviews and update interview
                  results.
                </p>
              </div>

              <span className="faculty-card-arrow">
                →
              </span>

            </button>

          </div>

        </section>

        {/* Quick Actions */}
        <section className="faculty-quick-section">

          <div className="faculty-quick-card">

            <div className="faculty-quick-icon">
              🚀
            </div>

            <div className="faculty-quick-content">
              <h3>Quick Actions</h3>

              <p>
                Start managing your internship activities quickly.
              </p>
            </div>

            <button
              onClick={() => navigate("/faculty-internships")}
              className="faculty-quick-btn"
            >
              Create Internship
              <span>→</span>
            </button>

          </div>

        </section>

      </main>

     

    </div>
  );
}

export default FacultyDashboard;