import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminInternships.css";

function AdminInternships() {
  const navigate = useNavigate();

const [updatingId, setUpdatingId] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
const [companies, setCompanies] = useState([]);
const [addingInternship, setAddingInternship] = useState(false);
const [internshipMessage, setInternshipMessage] = useState("");

const [internshipForm, setInternshipForm] = useState({
  company_id: "",
  title: "",
  description: "",
  domain: "",
  location: "",
  duration_weeks: "",
  stipend: "",
  start_date: "",
  end_date: ""
});

  useEffect(() => {
    fetchInternships();
     fetchCompanies();
  }, []);

  const fetchInternships = async () => {
    try {
     const response = await fetch(
  "http://localhost:5000/api/admin/internships",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
  }
);

      const data = await response.json();

      if (data.success) {
        setInternships(data.internships);
      }
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/companies",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      }
    );

    const data = await response.json();

    if (data.success) {
      setCompanies(data.companies);
    }
  } catch (error) {
    console.error("Failed to fetch companies:", error);
  }
};

const handleInternshipChange = (e) => {
  const { name, value } = e.target;

  setInternshipForm({
    ...internshipForm,
    [name]: value
  });
};

const handleAddInternship = async (e) => {
  e.preventDefault();

  setAddingInternship(true);
  setInternshipMessage("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/internships",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(internshipForm)
      }
    );

    const data = await response.json();

    if (data.success) {
      setInternshipMessage("Internship added successfully!");

      setInternshipForm({
        company_id: "",
        title: "",
        description: "",
        domain: "",
        location: "",
        duration_weeks: "",
        stipend: "",
        start_date: "",
        end_date: ""
      });

      setShowAddForm(false);

      fetchInternships();
    } else {
      setInternshipMessage(
        data.message || "Failed to add internship"
      );
    }

  } catch (error) {
    console.error("Add internship error:", error);
    setInternshipMessage("Something went wrong");
  } finally {
    setAddingInternship(false);
  }
};

  const updateInternshipStatus = async (internshipId, status) => {
  try {
    setUpdatingId(internshipId);

    const response = await fetch(
  `http://localhost:5000/api/admin/internships/${internshipId}/status`,
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
      alert(data.message || "Failed to update status");
      return;
    }

    alert(data.message);

    fetchInternships();

  } catch (error) {
    console.error(
      "Failed to update internship status:",
      error
    );

    alert("Unable to connect to server");

  } finally {
    setUpdatingId(null);
  }
};

  const filteredInternships = internships.filter((internship) => {
    const searchText = search.toLowerCase();

    return (
      internship.title?.toLowerCase().includes(searchText) ||
      internship.domain?.toLowerCase().includes(searchText) ||
      internship.company_name?.toLowerCase().includes(searchText) ||
      internship.location?.toLowerCase().includes(searchText)
    );
  });

  const getStatusClass = (status) => {
    if (status === "Approved") return "status-approved";
    if (status === "Rejected") return "status-rejected";
    return "status-pending";
  };

  return (
    <div className="admin-internships-page">

      <div className="internships-page-header">

        <div>
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Internship Management</h1>

          <p>
            View and manage internship opportunities
          </p>
        </div>

        <div className="internship-count">
          <strong>{internships.length}</strong>
          <span>Total Internships</span>
        </div>
<button
  className="add-internship-btn"
  onClick={() => setShowAddForm(!showAddForm)}
>
  + Add Internship
</button>
      </div>

{showAddForm && (
  <div className="add-internship-form-container">

    <h2>Add New Internship</h2>

    <form onSubmit={handleAddInternship}>

      <div className="internship-form-grid">

        <div className="form-group">
          <label>Company *</label>

          <select
            name="company_id"
            value={internshipForm.company_id}
            onChange={handleInternshipChange}
            required
          >
            <option value="">Select Company</option>

            {companies.map((company) => (
              <option
                key={company.company_id}
                value={company.company_id}
              >
                {company.company_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Internship Title *</label>

          <input
            type="text"
            name="title"
            placeholder="e.g. Java Developer Intern"
            value={internshipForm.title}
            onChange={handleInternshipChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>

          <textarea
            name="description"
            placeholder="Enter internship description"
            value={internshipForm.description}
            onChange={handleInternshipChange}
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Domain *</label>

          <input
            type="text"
            name="domain"
            placeholder="e.g. Java, Python, Web Development"
            value={internshipForm.domain}
            onChange={handleInternshipChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>

          <input
            type="text"
            name="location"
            placeholder="e.g. Pune"
            value={internshipForm.location}
            onChange={handleInternshipChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Duration (Weeks) *</label>

          <input
            type="number"
            name="duration_weeks"
            placeholder="e.g. 12"
            value={internshipForm.duration_weeks}
            onChange={handleInternshipChange}
            min="4"
            max="26"
            required
          />
        </div>

        <div className="form-group">
          <label>Stipend (₹)</label>

          <input
            type="number"
            name="stipend"
            placeholder="e.g. 10000"
            value={internshipForm.stipend}
            onChange={handleInternshipChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Start Date *</label>

          <input
            type="date"
            name="start_date"
            value={internshipForm.start_date}
            onChange={handleInternshipChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date *</label>

          <input
            type="date"
            name="end_date"
            value={internshipForm.end_date}
            onChange={handleInternshipChange}
            required
          />
        </div>

      </div>

      <div className="internship-form-actions">

        <button
          type="button"
          className="cancel-internship-btn"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-internship-btn"
          disabled={addingInternship}
        >
          {addingInternship
            ? "Adding..."
            : "Add Internship"}
        </button>

      </div>

    </form>

    {internshipMessage && (
      <p className="internship-form-message">
        {internshipMessage}
      </p>
    )}

  </div>
)}

      <div className="internships-toolbar">

        <input
          type="text"
          placeholder="Search by title, company, domain or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="internships-table-container">

        {loading ? (

          <div className="internships-message">
            Loading internships...
          </div>

        ) : filteredInternships.length === 0 ? (

          <div className="internships-message">

            <div>💼</div>

            <h3>No Internships Found</h3>

            <p>
              No internship records match your search.
            </p>

          </div>

        ) : (

          <table className="internships-table">

            <thead>
  <tr>
    <th>ID</th>
    <th>Internship</th>
    <th>Company</th>
    <th>Domain</th>
    <th>Location</th>
    <th>Duration</th>
    <th>Stipend</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>

            <tbody>

              {filteredInternships.map((internship) => (

                <tr key={internship.internship_id}>

                  <td>
                    #{internship.internship_id}
                  </td>

                  <td>
                    <div className="internship-name">

                      <div className="internship-avatar">
                        💼
                      </div>

                      <strong>
                        {internship.title}
                      </strong>

                    </div>
                  </td>

                  <td>
                    {internship.company_name || "—"}
                  </td>

                  <td>
                    {internship.domain || "—"}
                  </td>

                  <td>
                    {internship.location || "—"}
                  </td>

                  <td>
                    {internship.duration_weeks
                      ? `${internship.duration_weeks} weeks`
                      : "—"}
                  </td>

                  <td>
                    {internship.stipend
                      ? `₹${internship.stipend}`
                      : "Unpaid"}
                  </td>

                  <td>
                    <span
                      className={`internship-status ${getStatusClass(
                        internship.status
                      )}`}
                    >
                      {internship.status}
                    </span>
                  </td>
                  <td>

  <div className="internship-actions">

    {internship.status !== "Approved" && (
      <button
        className="approve-btn"
        onClick={() =>
          updateInternshipStatus(
            internship.internship_id,
            "Approved"
          )
        }
        disabled={updatingId === internship.internship_id}
      >
        {updatingId === internship.internship_id
          ? "Updating..."
          : "Approve"}
      </button>
    )}

    {internship.status !== "Rejected" && (
      <button
        className="reject-btn"
        onClick={() =>
          updateInternshipStatus(
            internship.internship_id,
            "Rejected"
          )
        }
        disabled={updatingId === internship.internship_id}
      >
        {updatingId === internship.internship_id
          ? "Updating..."
          : "Reject"}
      </button>
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

export default AdminInternships;