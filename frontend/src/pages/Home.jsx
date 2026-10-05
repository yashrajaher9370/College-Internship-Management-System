import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <Features />

      {/* About Section */}
      <section className="about-section" id="about">

        <div className="about-container">

          <div className="about-content">

            <span className="about-label">ABOUT OUR SYSTEM</span>

            <h2>
              Making Internship Management
              <span> Simple & Efficient</span>
            </h2>

            <p>
              The College Internship Management System is a centralized
              platform designed to simplify the internship process for
              students, faculty, companies, and administrators.
            </p>

            <p>
              Students can discover suitable internship opportunities,
              apply online, upload their resumes, track application status,
              view interview schedules, and receive feedback from a single
              platform.
            </p>

            <div className="about-points">

              <div className="about-point">
                <div className="about-icon">🎓</div>
                <div>
                  <h3>For Students</h3>
                  <p>
                    Find internships, apply online and track your progress.
                  </p>
                </div>
              </div>

              <div className="about-point">
                <div className="about-icon">🏢</div>
                <div>
                  <h3>For Organizations</h3>
                  <p>
                    Manage internship opportunities and student applications.
                  </p>
                </div>
              </div>

              <div className="about-point">
                <div className="about-icon">📊</div>
                <div>
                  <h3>For Administration</h3>
                  <p>
                    Manage users, internships, applications and reports.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <div className="about-card">

            <div className="about-card-icon">💼</div>

            <h3>One Platform</h3>

            <p>
              Everything you need to manage the college internship journey
              in one centralized system.
            </p>

            <div className="about-stats">

              <div>
                <strong>01</strong>
                <span>Centralized Platform</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Easy Access</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Digital Process</span>
              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Home;