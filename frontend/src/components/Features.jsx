import "./Features.css";

function Features() {
  return (
    <section className="features" id="about">

      <h2>Why Use Our System?</h2>

      <div className="feature-container">

        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Find Internships</h3>
          <p>
            Search and explore available internship
            opportunities from different companies.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Easy Application</h3>
          <p>
            Apply for internships and submit your
            resume and application details easily.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Track Applications</h3>
          <p>
            Track your application status and
            interview schedule from your dashboard.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;