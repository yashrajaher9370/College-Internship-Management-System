import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminStudents.css";

function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
  "http://localhost:5000/api/admin/students",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  }
);

      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(searchText) ||
      student.email?.toLowerCase().includes(searchText) ||
      student.department?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="admin-students-page">

      {/* Header */}
      <div className="students-page-header">

        <div>
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Student Management</h1>

          <p>
            View and manage registered students
          </p>
        </div>

        <div className="student-count">
          <strong>{students.length}</strong>
          <span>Total Students</span>
        </div>

      </div>


      {/* Search */}
      <div className="students-toolbar">

        <input
          type="text"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* Students Table */}
      <div className="students-table-container">

        {loading ? (

          <div className="students-message">
            Loading students...
          </div>

        ) : filteredStudents.length === 0 ? (

          <div className="students-message">
            <div>👨‍🎓</div>

            <h3>No Students Found</h3>

            <p>
              No student records match your search.
            </p>
          </div>

        ) : (

          <table className="students-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>GPA</th>
                <th>Resume</th>
              </tr>

            </thead>

            <tbody>

              {filteredStudents.map((student) => (

                <tr key={student.student_id}>

                  <td>
                    #{student.student_id}
                  </td>

                  <td>
                    <div className="student-name">

                      <div className="student-avatar">
                        👤
                      </div>

                      <strong>
                        {student.name}
                      </strong>

                    </div>
                  </td>

                  <td>
                    {student.email}
                  </td>

                  <td>
                    {student.phone || "—"}
                  </td>

                  <td>
                    {student.department || "—"}
                  </td>

                  <td>
                    <span className="gpa-badge">
                      {student.gpa ?? "—"}
                    </span>
                  </td>

                  <td>

                    {student.resume ? (

                      <span className="resume-available">
                        Available
                      </span>

                    ) : (

                      <span className="resume-none">
                        Not Uploaded
                      </span>

                    )}

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

export default AdminStudents;