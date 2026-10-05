import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./InternshipDetails.css";

function InternshipDetails() {

  const { id } = useParams();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/students/internships/${id}`
      );

      const data = await response.json();

      if (response.ok) {

        const databaseInternship = data.internship;

        setInternship({
          id: databaseInternship.internship_id,
          title: databaseInternship.title,
          company: databaseInternship.company_name,
          location: databaseInternship.location,
          domain: databaseInternship.domain,
          duration: databaseInternship.duration_weeks
            ? `${databaseInternship.duration_weeks} Weeks`
            : "Not specified",
          stipend: databaseInternship.stipend,
          description: databaseInternship.description,
          qualifications: []
        });

      } else {

        setMessage(
          data.message || "Internship not found"
        );

      }

    } catch (error) {

      console.error("Internship details error:", error);

      setMessage("Unable to connect to server");

    }

    setLoading(false);
  };


  if (loading) {

    return (
      <>
        <Navbar />

        <div className="not-found">
          <h2>Loading internship...</h2>
        </div>

        <Footer />
      </>
    );
  }


  if (!internship) {

    return (
      <>
        <Navbar />

        <div className="not-found">

          <h2>
            {message || "Internship Not Found"}
          </h2>

          <Link to="/internships">
            ← Back to Internships
          </Link>

        </div>

        <Footer />
      </>
    );
  }


  return (
    <>
      <Navbar />

      <main className="internship-details-page">

        <div className="details-container">

          <Link
            to="/internships"
            className="back-link"
          >
            ← Back to Internships
          </Link>


          <div className="details-card">


            <div className="details-header">

              <div className="details-logo">

                {internship.company
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div>

                <h1>
                  {internship.title}
                </h1>

                <p>
                  {internship.company}
                </p>

              </div>

            </div>


            <div className="details-info">


              <div className="info-box">

                <span>
                  📍 Location
                </span>

                <strong>
                  {internship.location}
                </strong>

              </div>


              <div className="info-box">

                <span>
                  💼 Domain
                </span>

                <strong>
                  {internship.domain}
                </strong>

              </div>


              <div className="info-box">

                <span>
                  ⏱️ Duration
                </span>

                <strong>
                  {internship.duration}
                </strong>

              </div>


              <div className="info-box">

                <span>
                  💰 Stipend
                </span>

                <strong>
                  ₹{internship.stipend}/month
                </strong>

              </div>

            </div>


            <section className="details-section">

              <h2>
                Internship Description
              </h2>

              <p>
                {internship.description}
              </p>

            </section>


            {internship.qualifications.length > 0 && (

              <section className="details-section">

                <h2>
                  Required Qualifications
                </h2>

                <ul>

                  {internship.qualifications.map(
                    (qualification, index) => (

                      <li key={index}>
                        {qualification}
                      </li>

                    )
                  )}

                </ul>

              </section>

            )}


            <div className="apply-section">

              <Link
                to={`/apply/${internship.id}`}
                className="apply-btn"
              >
                Apply Now
              </Link>

            </div>


          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}

export default InternshipDetails;