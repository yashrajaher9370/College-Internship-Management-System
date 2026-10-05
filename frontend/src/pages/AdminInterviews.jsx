import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminInterviews.css";

function AdminInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [showScheduleForm, setShowScheduleForm] = useState(false);
const [applications, setApplications] = useState([]);
const [schedulingInterview, setSchedulingInterview] = useState(false);
const [interviewMessage, setInterviewMessage] = useState("");

const [interviewForm, setInterviewForm] = useState({
  application_id: "",
  interview_date: "",
  mode: "Online",
  location: "",
  notes: ""
});

  useEffect(() => {
    fetchInterviews();
    fetchApplications();
  }, []);

  const fetchInterviews = async () => {
    try {
     const response = await fetch(
  "http://localhost:5000/api/admin/interviews",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  }
);

      const data = await response.json();

      if (data.success) {
        setInterviews(data.interviews);
      }
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

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
  }
};
const handleInterviewChange = (e) => {
  const { name, value } = e.target;

  setInterviewForm({
    ...interviewForm,
    [name]: value
  });
};

const handleScheduleInterview = async (e) => {
  e.preventDefault();

  setSchedulingInterview(true);
  setInterviewMessage("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/interviews",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(interviewForm)
      }
    );

    const data = await response.json();

    if (data.success) {
      setInterviewMessage(
        "Interview scheduled successfully!"
      );

      setInterviewForm({
        application_id: "",
        interview_date: "",
        mode: "Online",
        location: "",
        notes: ""
      });

      setShowScheduleForm(false);

      fetchInterviews();

    } else {
      setInterviewMessage(
        data.message || "Failed to schedule interview"
      );
    }

  } catch (error) {
    console.error(
      "Schedule interview error:",
      error
    );

    setInterviewMessage("Something went wrong");

  } finally {
    setSchedulingInterview(false);
  }
};
  const updateInterviewResult = async (interviewId, result) => {
    try {
      setUpdatingId(interviewId);

      const response = await fetch(
        `http://localhost:5000/api/admin/interviews/${interviewId}/result`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          },
          body: JSON.stringify({
            result
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update interview result");
        return;
      }

      alert(data.message);

      fetchInterviews();

    } catch (error) {
      console.error(
        "Failed to update interview result:",
        error
      );

      alert("Unable to connect to server");

    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const searchText = search.toLowerCase();

    return (
      interview.student_name
        ?.toLowerCase()
        .includes(searchText) ||
      interview.student_email
        ?.toLowerCase()
        .includes(searchText) ||
      interview.internship_title
        ?.toLowerCase()
        .includes(searchText) ||
      interview.company_name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const getResultClass = (result) => {
    if (result === "Selected") return "interview-selected";
    if (result === "Rejected") return "interview-rejected";

    return "interview-pending";
  };

  return (
    <div className="admin-interviews-page">

      <div className="interviews-page-header">

        <div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Interview Management</h1>

          <p>
            View and manage student internship interviews
          </p>

        </div>

        <div className="interview-count">

          <strong>{interviews.length}</strong>

          <span>Total Interviews</span>

        </div>
        <button
  className="schedule-interview-btn"
  onClick={() => setShowScheduleForm(!showScheduleForm)}
>
  + Schedule Interview
</button>

      </div>

{showScheduleForm && (
  <div className="schedule-interview-form-container">

    <h2>Schedule New Interview</h2>

    <form onSubmit={handleScheduleInterview}>

      <div className="interview-form-grid">

        <div className="form-group">
          <label>Application *</label>

          <select
            name="application_id"
            value={interviewForm.application_id}
            onChange={handleInterviewChange}
            required
          >
            <option value="">
              Select Application
            </option>

            {applications
              .filter(
                (application) =>
                  application.status === "Shortlisted" ||
                  application.status === "Accepted"
              )
              .map((application) => (
                <option
                  key={application.application_id}
                  value={application.application_id}
                >
                  #{application.application_id} -{" "}
                  {application.student_name} -{" "}
                  {application.internship_title}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Interview Date & Time *</label>

          <input
            type="datetime-local"
            name="interview_date"
            value={interviewForm.interview_date}
            onChange={handleInterviewChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mode *</label>

          <select
            name="mode"
            value={interviewForm.mode}
            onChange={handleInterviewChange}
            required
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Location / Meeting Link *
          </label>

          <input
            type="text"
            name="location"
            placeholder="Google Meet / Office location"
            value={interviewForm.location}
            onChange={handleInterviewChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Notes</label>

          <textarea
            name="notes"
            placeholder="Enter interview instructions..."
            value={interviewForm.notes}
            onChange={handleInterviewChange}
            rows="4"
          ></textarea>
        </div>

      </div>

      <div className="interview-form-actions">

        <button
          type="button"
          className="cancel-interview-btn"
          onClick={() => setShowScheduleForm(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-interview-btn"
          disabled={schedulingInterview}
        >
          {schedulingInterview
            ? "Scheduling..."
            : "Schedule Interview"}
        </button>

      </div>

    </form>

    {interviewMessage && (
      <p className="interview-form-message">
        {interviewMessage}
      </p>
    )}

  </div>
)}
      <div className="interviews-toolbar">

        <input
          type="text"
          placeholder="Search by student, email, internship or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="interviews-table-container">

        {loading ? (

          <div className="interviews-message">
            Loading interviews...
          </div>

        ) : filteredInterviews.length === 0 ? (

          <div className="interviews-message">

            <div>📅</div>

            <h3>No Interviews Found</h3>

            <p>
              No interview records match your search.
            </p>

          </div>

        ) : (

          <table className="interviews-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Internship</th>
                <th>Company</th>
                <th>Date & Time</th>
                <th>Mode</th>
                <th>Location</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredInterviews.map((interview) => (

                <tr key={interview.interview_id}>

                  <td>
                    #{interview.interview_id}
                  </td>

                  <td>

                    <div className="interview-student">

                      <div className="interview-avatar">
                        👤
                      </div>

                      <div>

                        <strong>
                          {interview.student_name}
                        </strong>

                        <span>
                          {interview.student_email}
                        </span>

                      </div>

                    </div>

                  </td>

                  <td>
                    {interview.internship_title || "—"}
                  </td>

                  <td>
                    {interview.company_name || "—"}
                  </td>

                  <td>

                    {interview.interview_date
                      ? new Date(
                          interview.interview_date
                        ).toLocaleString()
                      : "—"}

                  </td>

                  <td>
                    {interview.mode || "—"}
                  </td>

                  <td>
                    {interview.location || "—"}
                  </td>

                  <td>

                    <span
                      className={`interview-result ${getResultClass(
                        interview.result
                      )}`}
                    >
                      {interview.result}
                    </span>

                  </td>

                  <td>

                    <div className="interview-actions">

                      {interview.result === "Pending" && (
                        <>

                          <button
                            className="select-btn"
                            onClick={() =>
                              updateInterviewResult(
                                interview.interview_id,
                                "Selected"
                              )
                            }
                            disabled={
                              updatingId ===
                              interview.interview_id
                            }
                          >
                            Select
                          </button>

                          <button
                            className="reject-interview-btn"
                            onClick={() =>
                              updateInterviewResult(
                                interview.interview_id,
                                "Rejected"
                              )
                            }
                            disabled={
                              updatingId ===
                              interview.interview_id
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

export default AdminInterviews;