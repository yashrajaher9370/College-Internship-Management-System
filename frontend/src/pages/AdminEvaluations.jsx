import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminEvaluations.css";

function AdminEvaluations() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
const [applications, setApplications] = useState([]);
const [addingEvaluation, setAddingEvaluation] = useState(false);
const [evaluationMessage, setEvaluationMessage] = useState("");

const [evaluationForm, setEvaluationForm] = useState({
  application_id: "",
  technical_skills: "",
  communication_skills: "",
  teamwork: "",
  problem_solving: "",
  overall_rating: "",
  feedback: ""
});

  useEffect(() => {
    fetchEvaluations();
    fetchApplications();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await fetch(
  "http://localhost:5000/api/admin/evaluations",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  }
);

      const data = await response.json();

      if (data.success) {
        setEvaluations(data.evaluations);
      }
    } catch (error) {
      console.error("Failed to fetch evaluations:", error);
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
    console.log("APPLICATION API RESPONSE:", data);

    if (data.success) {
      setApplications(data.applications);
    }
  } catch (error) {
    console.error("Failed to fetch applications:", error);
  }
};
const handleEvaluationChange = (e) => {
  const { name, value } = e.target;

  setEvaluationForm({
    ...evaluationForm,
    [name]: value
  });
};

const handleAddEvaluation = async (e) => {
  e.preventDefault();

  setAddingEvaluation(true);
  setEvaluationMessage("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/evaluations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(evaluationForm)
      }
    );

    const data = await response.json();


    if (data.success) {

      setEvaluationMessage(
        "Evaluation added successfully!"
      );

      setEvaluationForm({
        application_id: "",
        technical_skills: "",
        communication_skills: "",
        teamwork: "",
        problem_solving: "",
        overall_rating: "",
        feedback: ""
      });

      setShowAddForm(false);

      fetchEvaluations();

    } else {

      setEvaluationMessage(
        data.message || "Failed to add evaluation"
      );

    }

  } catch (error) {

    console.error(
      "Add evaluation error:",
      error
    );

    setEvaluationMessage(
      "Something went wrong"
    );

  } finally {

    setAddingEvaluation(false);

  }
};

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const searchText = search.toLowerCase();

    return (
      evaluation.student_name
        ?.toLowerCase()
        .includes(searchText) ||
      evaluation.student_email
        ?.toLowerCase()
        .includes(searchText) ||
      evaluation.internship_title
        ?.toLowerCase()
        .includes(searchText) ||
      evaluation.company_name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="admin-evaluations-page">

      <div className="evaluations-page-header">

        <div>

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Evaluation Management</h1>

          <p>
            View student internship evaluations and feedback
          </p>

        </div>

        <div className="evaluation-count">

          <strong>{evaluations.length}</strong>

          <span>Total Evaluations</span>

        </div>
<button
  className="add-evaluation-btn"
  onClick={() => setShowAddForm(!showAddForm)}
>
  + Add Evaluation
</button>
      </div>
      {showAddForm && (
  <div className="add-evaluation-form-container">

    <h2>Add New Evaluation</h2>

    <form onSubmit={handleAddEvaluation}>

      <div className="evaluation-form-grid">

        <div className="form-group full-width">
          <label>Application *</label>

          <select
            name="application_id"
            value={evaluationForm.application_id}
            onChange={handleEvaluationChange}
            required
          >
            <option value="">
              Select Application
            </option>

            {applications.map((application) => (
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
          <label>Technical Skills *</label>

          <input
            type="number"
            name="technical_skills"
            min="1"
            max="5"
            value={evaluationForm.technical_skills}
            onChange={handleEvaluationChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Communication Skills *</label>

          <input
            type="number"
            name="communication_skills"
            min="1"
            max="5"
            value={evaluationForm.communication_skills}
            onChange={handleEvaluationChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teamwork *</label>

          <input
            type="number"
            name="teamwork"
            min="1"
            max="5"
            value={evaluationForm.teamwork}
            onChange={handleEvaluationChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Problem Solving *</label>

          <input
            type="number"
            name="problem_solving"
            min="1"
            max="5"
            value={evaluationForm.problem_solving}
            onChange={handleEvaluationChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Overall Rating *</label>

          <input
            type="number"
            name="overall_rating"
            min="1"
            max="5"
            value={evaluationForm.overall_rating}
            onChange={handleEvaluationChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Feedback</label>

          <textarea
            name="feedback"
            placeholder="Enter evaluation feedback..."
            value={evaluationForm.feedback}
            onChange={handleEvaluationChange}
            rows="4"
          ></textarea>
        </div>

      </div>

      <div className="evaluation-form-actions">

        <button
          type="button"
          className="cancel-evaluation-btn"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-evaluation-btn"
          disabled={addingEvaluation}
        >
          {addingEvaluation
            ? "Adding..."
            : "Add Evaluation"}
        </button>

      </div>

    </form>

    {evaluationMessage && (
      <p className="evaluation-form-message">
        {evaluationMessage}
      </p>
    )}

  </div>
)}

      <div className="evaluations-toolbar">

        <input
          type="text"
          placeholder="Search by student, email, internship or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="evaluations-table-container">

        {loading ? (

          <div className="evaluations-message">
            Loading evaluations...
          </div>

        ) : filteredEvaluations.length === 0 ? (

          <div className="evaluations-message">

            <div>⭐</div>

            <h3>No Evaluations Found</h3>

            <p>
              No evaluation records match your search.
            </p>

          </div>

        ) : (

          <table className="evaluations-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Internship</th>
                <th>Company</th>
                <th>Technical</th>
                <th>Communication</th>
                <th>Teamwork</th>
                <th>Problem Solving</th>
                <th>Overall</th>
                <th>Feedback</th>
                <th>Evaluated On</th>
              </tr>

            </thead>

            <tbody>

              {filteredEvaluations.map((evaluation) => (

                <tr key={evaluation.evaluation_id}>

                  <td>
                    #{evaluation.evaluation_id}
                  </td>

                  <td>

                    <div className="evaluation-student">

                      <div className="evaluation-avatar">
                        👤
                      </div>

                      <div>

                        <strong>
                          {evaluation.student_name}
                        </strong>

                        <span>
                          {evaluation.student_email}
                        </span>

                      </div>

                    </div>

                  </td>

                  <td>
                    {evaluation.internship_title || "—"}
                  </td>

                  <td>
                    {evaluation.company_name || "—"}
                  </td>

                  <td>
                    <span className="rating-badge">
                      {evaluation.technical_skills}/5
                    </span>
                  </td>

                  <td>
                    <span className="rating-badge">
                      {evaluation.communication_skills}/5
                    </span>
                  </td>

                  <td>
                    <span className="rating-badge">
                      {evaluation.teamwork}/5
                    </span>
                  </td>

                  <td>
                    <span className="rating-badge">
                      {evaluation.problem_solving}/5
                    </span>
                  </td>

                  <td>
                    <span className="overall-rating">
                      ⭐ {evaluation.overall_rating}/5
                    </span>
                  </td>

                  <td>
                    <div className="evaluation-feedback">
                      {evaluation.feedback || "—"}
                    </div>
                  </td>

                  <td>
                    {evaluation.evaluated_at
                      ? new Date(
                          evaluation.evaluated_at
                        ).toLocaleDateString()
                      : "—"}
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

export default AdminEvaluations;