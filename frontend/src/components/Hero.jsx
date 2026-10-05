import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <h1>
          Find Your Perfect
          <span> Internship Opportunity</span>
        </h1>

        <p>
          Discover internships, apply for opportunities,
          and track your application status in one place.
        </p>

        <div className="hero-buttons">

          <a href="/internships" className="primary-btn">
            Explore Internships
          </a>

          <a href="/register" className="secondary-btn">
            Get Started
          </a>

        </div>

      </div>

    </section>
  );
}

export default Hero;