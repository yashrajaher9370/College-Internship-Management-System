import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InternshipCard from "../components/InternshipCard";
import "./Internships.css";

function Internships() {

const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
const [location, setLocation] = useState("");
const [company, setCompany] = useState("");
const [maxStipend, setMaxStipend] = useState("");
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/students/internships"
      );

      const data = await response.json();

      if (response.ok) {

        setInternships(data.internships);

      } else {

        setMessage(
          data.message || "Failed to load internships"
        );

      }

    } catch (error) {

      console.error("Internships error:", error);

      setMessage("Unable to connect to server");

    }

    setLoading(false);
  };


  const filteredInternships = internships.filter(
    (internship) => {

      const matchesSearch =
        internship.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        internship.company_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (internship.location || "")
          .toLowerCase()
          .includes(search.toLowerCase());


      const matchesDomain =
  domain === "" ||
  internship.domain === domain;

const matchesLocation =
  location === "" ||
  (internship.location || "").toLowerCase() === location.toLowerCase();

const matchesCompany =
  company === "" ||
  internship.company_name === company;

const matchesStipend =
  maxStipend === "" ||
  Number(internship.stipend || 0) <= Number(maxStipend);

return (
  matchesSearch &&
  matchesDomain &&
  matchesLocation &&
  matchesCompany &&
  matchesStipend
);
    }
  );


  if (loading) {

    return (
      <>
        <Navbar />

        <main className="internships-page">

          <div className="internships-header">

            <h1>Available Internships</h1>

            <p>
              Loading internships...
            </p>

          </div>

        </main>

        <Footer />
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="internships-page">

  <button
    className="back-dashboard-btn"
    onClick={() => navigate("/student-dashboard")}
  >
    ← Back to Dashboard
  </button>

  <div className="internships-header">

          <h1>Available Internships</h1>

          <p>
            Find the right internship opportunity for your career.
          </p>

        </div>


       <div className="filters">

  {/* Search */}
  <input
    type="text"
    placeholder="Search internship, company or location..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
  />

  {/* Domain */}
  <select
    value={domain}
    onChange={(e) =>
      setDomain(e.target.value)
    }
  >
    <option value="">
      All Domains
    </option>

    <option value="Java">
      Java
    </option>

    <option value="Python">
      Python
    </option>

    <option value="Web Development">
      Web Development
    </option>

    <option value="Data Science">
      Data Science
    </option>

    <option value="Cloud Computing">
      Cloud Computing
    </option>
  </select>

  {/* Location */}
  <select
    value={location}
    onChange={(e) =>
      setLocation(e.target.value)
    }
  >
    <option value="">
      All Locations
    </option>

    <option value="Pune">
      Pune
    </option>

    <option value="Mumbai">
      Mumbai
    </option>

    <option value="Nashik">
      Nashik
    </option>

    <option value="Ahmednagar">
      Ahmednagar
    </option>
  </select>

  {/* Company */}
  <select
    value={company}
    onChange={(e) =>
      setCompany(e.target.value)
    }
  >
    <option value="">
      All Companies
    </option>

    <option value="Tech Solutions Pvt. Ltd.">
      Tech Solutions Pvt. Ltd.
    </option>
  </select>

  {/* Maximum Stipend */}
  <select
    value={maxStipend}
    onChange={(e) =>
      setMaxStipend(e.target.value)
    }
  >
    <option value="">
      Any Stipend
    </option>

    <option value="5000">
      Up to ₹5,000
    </option>

    <option value="10000">
      Up to ₹10,000
    </option>

    <option value="15000">
      Up to ₹15,000
    </option>

    <option value="20000">
      Up to ₹20,000
    </option>
  </select>

</div>

        {message && (
          <p className="no-results">
            {message}
          </p>
        )}


        <div className="internship-list">

          {filteredInternships.length > 0 ? (

            filteredInternships.map(
              (internship) => (

                <InternshipCard
                  key={internship.internship_id}
                  internship={{
                    id: internship.internship_id,
                    title: internship.title,
                    company: internship.company_name,
                    location: internship.location,
                    domain: internship.domain,
                    duration:
                      internship.duration_weeks
                        ? `${internship.duration_weeks} Weeks`
                        : "Not specified",
                    stipend:
                      internship.stipend
                        ? internship.stipend
                        : "0",
                    description:
                      internship.description
                  }}
                />

              )
            )

          ) : (

            !message && (
              <p className="no-results">
                No internships found.
              </p>
            )

          )}

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Internships;