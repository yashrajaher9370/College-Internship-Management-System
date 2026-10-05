import { Link } from "react-router-dom";
import "./InternshipCard.css";

function InternshipCard({ internship }) {
  return (
    <div className="internship-card">

      <div className="company-logo">
        {internship.company.charAt(0)}
      </div>

      <div className="internship-info">

        <h3>{internship.title}</h3>

        <p className="company-name">
          {internship.company}
        </p>

        <div className="internship-details">
          <span>📍 {internship.location}</span>
          <span>💼 {internship.domain}</span>
          <span>⏱️ {internship.duration}</span>
          <span>💰 ₹{internship.stipend}/month</span>
        </div>

        <p className="internship-description">
          {internship.description}
        </p>

        <Link
          to={`/internship/${internship.id}`}
          className="view-details-btn"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}

export default InternshipCard;