import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./StudentDashboard.css";

function StudentDashboard() {
  
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  const [applicationStats, setApplicationStats] = useState({
  totalApplications: 0,
  pendingApplications: 0,
  acceptedApplications: 0
});
const [upcomingInterviews, setUpcomingInterviews] = useState(0);
const [upcomingInterview, setUpcomingInterview] = useState(null);
const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchStudentProfile();
  fetchApplicationStats();
  fetchUpcomingInterviews();
  fetchUpcomingInterview();
  fetchRecentApplications();
}, []);

const handleLogout = () => {
  localStorage.removeItem("studentToken");
  navigate("/common-login");
};

  const fetchStudentProfile = async () => {

    try {

      const token = localStorage.getItem("studentToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/students/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStudent(data.student);
      }

    } catch (error) {

      console.error("Dashboard profile error:", error);

    }

    setLoading(false);
  };
const fetchApplicationStats = async () => {

  try {

    const token = localStorage.getItem("studentToken");

    if (!token) {
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/students/application-stats",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setApplicationStats(data.statistics);
    }

  } catch (error) {

    console.error("Application stats error:", error);

  }
};
const fetchUpcomingInterviews = async () => {

  try {

    const token = localStorage.getItem("studentToken");

    if (!token) {
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/students/upcoming-interview-count",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setUpcomingInterviews(data.upcomingInterviews);
    }

  } catch (error) {

    console.error("Upcoming interview error:", error);

  }
};
const fetchUpcomingInterview = async () => {

  try {

    const token = localStorage.getItem("studentToken");

    if (!token) {
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/students/upcoming-interview",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setUpcomingInterview(data.interview);
    }

  } catch (error) {

    console.error("Upcoming interview details error:", error);

  }
};
const fetchRecentApplications = async () => {

  try {

    const token = localStorage.getItem("studentToken");

    if (!token) {
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/students/recent-applications",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setRecentApplications(data.applications);
    }

  } catch (error) {

    console.error("Recent applications error:", error);

  }
};
  return (
    <>
      <Navbar />

      <main className="dashboard-page">
        <div className="dashboard-container">

          <div className="dashboard-header">

  <div>
    <h1>Student Dashboard</h1>
    <p>Welcome back!</p>
 
  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>

            <Link to="/internships" className="browse-btn">
              Browse Internships
            </Link>
          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              {student?.name
                ? student.name
                    .split(" ")
                    .map(word => word.charAt(0))
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "ST"}
            </div>

            <div className="profile-info">

              <h2>
                {student?.name || "Student"}
              </h2>

              <p>
                {student?.department || "Department"}
              </p>

              <p>
                {student?.email || "Email"}
              </p>

            </div>

            <Link to="/profile" className="profile-btn">
              View Profile
            </Link>

          </div>

          <div className="stats-container">

            <div className="stat-card">
              <div className="stat-icon">📋</div>

              <div>
                <h3>{applicationStats.totalApplications}</h3>
                <p>Total Applications</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>

              <div>
               <h3>{applicationStats.pendingApplications}</h3>
                <p>Pending</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>

              <div>
               <h3>{applicationStats.acceptedApplications}</h3>
                <p>Accepted</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>

              <div>
                <h3>{upcomingInterviews}</h3>
                 <p>Upcoming Interview</p>
              </div>
            </div>

          </div>

          <div className="dashboard-grid">

           <div className="dashboard-section">

  <div className="section-header">
    <h2>Recent Applications</h2>

    <Link to="/applications">
      View All
    </Link>
  </div>

  {recentApplications.length > 0 ? (

    recentApplications.map((application) => (

      <div
        className="application-item"
        key={application.application_id}
      >

        <div>
          <h3>{application.internship_title}</h3>

          <p>{application.company_name}</p>
        </div>

        <span
          className={`status ${application.status.toLowerCase()}`}
        >
          {application.status}
        </span>

      </div>

    ))

  ) : (

    <div className="application-item">
      <div>
        <h3>No Applications Yet</h3>

        <p>
          You have not applied for any internship yet.
        </p>
      </div>
    </div>

  )}

</div>

            <div className="dashboard-section">

  <div className="section-header">
    <h2>Upcoming Interview</h2>
  </div>

  {upcomingInterview ? (

    <div className="interview-card">

      <h3>
        {upcomingInterview.internship_title}
      </h3>

      <p>
        🏢 {upcomingInterview.company_name}
      </p>

      <p>
        📅{" "}
        {new Date(
          upcomingInterview.interview_date
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })}
      </p>

      <p>
        ⏰{" "}
        {new Date(
          upcomingInterview.interview_date
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        })}
      </p>

      <span className="interview-status">
        Scheduled
      </span>

    </div>

  ) : (

    <div className="interview-card">

      <h3>No Upcoming Interview</h3>

      <p>
        You currently have no scheduled interviews.
      </p>

    </div>

  )}

  <Link
    to="/interviews"
    className="view-interviews"
  >
    View Interview Schedule
  </Link>

</div>

          </div>

          <div className="quick-actions">

            <h2>Quick Actions</h2>

            <div className="action-container">

              <Link
                to="/internships"
                className="action-card"
              >
                🔍
                <span>Find Internship</span>
              </Link>

              <Link
                to="/applications"
                className="action-card"
              >
                📋
                <span>My Applications</span>
              </Link>

              <Link
                to="/interviews"
                className="action-card"
              >
                📅
                <span>Interviews</span>
              </Link>

              <Link
                to="/feedback"
                className="action-card"
              >
                ⭐
                <span>Give Feedback</span>
              </Link>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default StudentDashboard;