import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));

const [statistics, setStatistics] = useState({
  students: 0,
  companies: 0,
  internships: 0,
  applications: 0
});
useEffect(() => {

  const fetchStatistics = async () => {

    try {

      const response = await fetch(
  "http://localhost:5000/api/admin/dashboard-stats",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  }
);

      const data = await response.json();

      if (data.success) {
        setStatistics(data.statistics);
      }

    } catch (error) {

      console.error(
        "Failed to fetch dashboard statistics:",
        error
      );

    } finally {

      setLoadingStats(false);

    }
  };

  fetchStatistics();

}, []);

const [loadingStats, setLoadingStats] = useState(true);

const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");

  navigate("/common-login");
};

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">🎓</div>

          <div>
            <h2>College Internship</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-menu">
          <button className="admin-menu-item active">
            📊 Dashboard
          </button>

          <button
  className="admin-menu-item"
  onClick={() => navigate("/admin-students")}
>
  👨‍🎓 Students
</button>

         <button
  className="admin-menu-item"
  onClick={() => navigate("/admin-companies")}
>
  🏢 Companies
</button>

          <button
  className="admin-menu-item"
  onClick={() => navigate("/admin-internships")}
>
  💼 Internships
</button>

          <button
  className="admin-menu-item"
  onClick={() => navigate("/admin-applications")}
>
  📄 Applications
</button>

          <button
  className="admin-menu-item"
  onClick={() => navigate("/admin-interviews")}
>
  📅 Interviews
</button>

        <button 
    className="admin-menu-item"
   onClick={() => navigate("/admin-evaluations")}
>
  🌟Evaluations
</button>

          <button className="admin-menu-item"
           onClick={() => navigate("/admin-reports")}>
  📃Reports
</button>
        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* Main Content */}
      <main className="admin-main">

        {/* Header */}
        <header className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Manage the College Internship Management System
            </p>
          </div>

          <div className="admin-user">

            <div className="admin-user-icon">
              👤
            </div>

            <div>
              <strong>
                {admin?.name || "System Admin"}
              </strong>

              <span>
                Administrator
              </span>
            </div>

          </div>

        </header>


        {/* Welcome */}
        <section className="admin-welcome">

          <div>
            <span>WELCOME BACK 👋</span>

            <h2>
              Hello, {admin?.name || "Admin"}!
            </h2>

            <p>
              Here's an overview of your internship management system.
            </p>
          </div>

          <div className="admin-welcome-icon">
            📊
          </div>

        </section>


        {/* Statistics */}
        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="stat-icon students">
              👨‍🎓
            </div>

            <div>
              <span>Total Students</span>
             <strong>
  {loadingStats ? "..." : statistics.students}
</strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="stat-icon companies">
              🏢
            </div>

            <div>
              <span>Total Companies</span>
             <strong>
  {loadingStats ? "..." : statistics.companies}
</strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="stat-icon internships">
              💼
            </div>

            <div>
              <span>Total Internships</span>
             <strong>
  {loadingStats ? "..." : statistics.internships}
</strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="stat-icon applications">
              📄
            </div>

            <div>
              <span>Total Applications</span>
              <strong>
  {loadingStats ? "..." : statistics.applications}
</strong>
            </div>

          </div>

        </section>

{/* Quick Actions */}
<section className="admin-section">

  <div className="admin-section-header">

    <div>
      <h2>Quick Actions</h2>

      <p>
        Manage important system activities
      </p>
    </div>

  </div>


  <div className="admin-actions">

    <button onClick={() => navigate("/admin-students")}>
      👨‍🎓
      <span>Manage Students</span>
    </button>

    <button onClick={() => navigate("/admin-companies")}>
      🏢
      <span>Manage Companies</span>
    </button>

    <button onClick={() => navigate("/admin-internships")}>
      💼
      <span>Manage Internships</span>
    </button>

    <button onClick={() => navigate("/admin-applications")}>
      📄
      <span>View Applications</span>
    </button>

    <button onClick={() => navigate("/admin-interviews")}>
      📅
      <span>Interview Management</span>
    </button>
    
    <button onClick={() => navigate("/admin-evaluations")}>
      🌟
      <span>Evaluation Management</span>
    </button>

    <button onClick={() => navigate("/admin-reports")}>
      📃
      <span>View Reports</span>
    </button>

  </div>

</section>


        {/* Recent Activity */}
        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Latest system activities will appear here
              </p>
            </div>

          </div>


          <div className="admin-empty">

            <div>📋</div>

            <h3>No Recent Activity</h3>

            <p>
              System activity will be displayed here
              once users start using the platform.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;