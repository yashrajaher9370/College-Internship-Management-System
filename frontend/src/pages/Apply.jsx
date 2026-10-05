import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Apply.css";

function Apply() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [qualifications, setQualifications] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
const [resumeFile, setResumeFile] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login before applying.");
      return;
    }

    setLoading(true);

    try {

     const formData = new FormData();

formData.append("internshipId", Number(id));
formData.append("qualifications", qualifications);
formData.append("coverLetter", coverLetter);

if (resumeFile) {
  formData.append("resume", resumeFile);
}

const response = await fetch(
  "http://localhost:5000/api/students/applications",
  {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`
    },

    body: formData
  }
);

      const data = await response.json();

      if (response.ok) {

        setMessage(
          "Application submitted successfully!"
        );

        setTimeout(() => {
          navigate("/applications");
        }, 1000);

      } else {

        setMessage(
          data.message || "Failed to submit application"
        );

      }

    } catch (error) {

      console.error("Application error:", error);

      setMessage(
        "Unable to connect to server"
      );

    }

    setLoading(false);
  };


  return (
    <>
      <Navbar />

      <main className="apply-page">

        <div className="apply-container">

          <Link
            to={`/internship/${id}`}
            className="back-link"
          >
            ← Back to Internship Details
          </Link>


          <div className="apply-card">

            <div className="apply-header">

              <h1>
                Apply for Internship
              </h1>

              <p>
                Submit your application for this internship opportunity.
              </p>

            </div>


            <form
              className="apply-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Qualifications
                </label>

                <textarea
                  placeholder="Enter your educational qualifications"
                  rows="4"
                  value={qualifications}
                  onChange={(e) =>
                    setQualifications(e.target.value)
                  }
                  required
                ></textarea>

              </div>


              <div className="form-group">

                <label>
                  Cover Letter
                </label>

                <textarea
                  placeholder="Write a short cover letter"
                  rows="6"
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  required
                ></textarea>

              </div>


              <div className="form-group">

                <label>
                  Upload Resume
                </label>

                <input
  type="file"
  accept=".pdf"
  required
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      setResumeFile(file);
    }
  }}
/>

                <small>
                  Only PDF files are allowed.
                  Maximum size: 5 MB.
                </small>

              </div>


              <button
                type="submit"
                className="submit-application-btn"
                disabled={loading}
              >

                {loading
                  ? "Submitting..."
                  : "Submit Application"}

              </button>


              {message && (

                <p
                  style={{
                    marginTop: "15px",
                    textAlign: "center",
                    fontWeight: "600"
                  }}
                >
                  {message}
                </p>

              )}

            </form>

          </div>

        </div>

      </main>

      <Footer />

    </>
  );
}

export default Apply;