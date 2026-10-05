import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCompanies.css";

function AdminCompanies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
const [showAddForm, setShowAddForm] = useState(false);

const [companyForm, setCompanyForm] = useState({
  company_name: "",
  email: "",
  phone: "",
  location: "",
  description: ""
});

const [addingCompany, setAddingCompany] = useState(false);
const [companyMessage, setCompanyMessage] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const searchText = search.toLowerCase();

    return (
      company.company_name?.toLowerCase().includes(searchText) ||
      company.email?.toLowerCase().includes(searchText) ||
      company.location?.toLowerCase().includes(searchText)
    );
  });

  const handleCompanyChange = (e) => {
  const { name, value } = e.target;

  setCompanyForm({
    ...companyForm,
    [name]: value
  });
};

const handleAddCompany = async (e) => {
  e.preventDefault();

  setAddingCompany(true);
  setCompanyMessage("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/companies",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
        body: JSON.stringify(companyForm)
      }
    );

    const data = await response.json();

    if (data.success) {
      setCompanyMessage("Company added successfully!");

      setCompanyForm({
        company_name: "",
        email: "",
        phone: "",
        location: "",
        description: ""
      });

      setShowAddForm(false);

      fetchCompanies();
    } else {
      setCompanyMessage(data.message || "Failed to add company");
    }

  } catch (error) {
    console.error("Add company error:", error);
    setCompanyMessage("Something went wrong");
  } finally {
    setAddingCompany(false);
  }
};

  return (
    <div className="admin-companies-page">

      <div className="companies-page-header">

        <div>
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Company Management</h1>

          <p>
            View and manage registered companies
          </p>
        </div>

        <div className="company-count">
          <strong>{companies.length}</strong>
          <span>Total Companies</span>
        </div>
        <button
  className="add-company-btn"
  onClick={() => setShowAddForm(!showAddForm)}
>
  + Add Company
</button>

      </div>

{showAddForm && (
  <div className="add-company-form-container">

    <h2>Add New Company</h2>

    <form onSubmit={handleAddCompany}>

      <div className="company-form-grid">

        <div className="form-group">
          <label>Company Name *</label>

          <input
            type="text"
            name="company_name"
            placeholder="Enter company name"
            value={companyForm.company_name}
            onChange={handleCompanyChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>

          <input
            type="email"
            name="email"
            placeholder="company@example.com"
            value={companyForm.email}
            onChange={handleCompanyChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>

          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            value={companyForm.phone}
            onChange={handleCompanyChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>

          <input
            type="text"
            name="location"
            placeholder="Enter company location"
            value={companyForm.location}
            onChange={handleCompanyChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Enter company description"
            value={companyForm.description}
            onChange={handleCompanyChange}
            rows="4"
          ></textarea>
        </div>

      </div>

      <div className="company-form-actions">

        <button
          type="button"
          className="cancel-company-btn"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-company-btn"
          disabled={addingCompany}
        >
          {addingCompany ? "Adding..." : "Add Company"}
        </button>

      </div>

    </form>

    {companyMessage && (
      <p className="company-form-message">
        {companyMessage}
      </p>
    )}

  </div>
)}
      <div className="companies-toolbar">

        <input
          type="text"
          placeholder="Search by company, email or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="companies-table-container">

        {loading ? (
          <div className="companies-message">
            Loading companies...
          </div>

        ) : filteredCompanies.length === 0 ? (

          <div className="companies-message">
            <div>🏢</div>

            <h3>No Companies Found</h3>

            <p>
              No company records match your search.
            </p>
          </div>

        ) : (

          <table className="companies-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>

              {filteredCompanies.map((company) => (

                <tr key={company.company_id}>

                  <td>
                    #{company.company_id}
                  </td>

                  <td>
                    <div className="company-name">

                      <div className="company-avatar">
                        🏢
                      </div>

                      <strong>
                        {company.company_name}
                      </strong>

                    </div>
                  </td>

                  <td>
                    {company.email || "—"}
                  </td>

                  <td>
                    {company.phone || "—"}
                  </td>

                  <td>
                    {company.location || "—"}
                  </td>

                  <td>
                    <div className="company-description">
                      {company.description || "—"}
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

export default AdminCompanies;