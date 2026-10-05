import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [editMode, setEditMode] = useState(false);
const [formData, setFormData] = useState({
  name: "",
  phone: "",
  department: "",
  gpa: ""
});
  useEffect(() => {
    fetchProfile();
  }, []);



  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/students/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
  setStudent(data.student);

  setFormData({
    name: data.student.name || "",
    phone: data.student.phone || "",
    department: data.student.department || "",
    gpa: data.student.gpa || ""
  });
} else {
        setMessage(data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Profile error:", error);
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };


  const handleProfileUpdate = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setMessage("Please login first");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/students/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
          gpa: formData.gpa
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
  setEditMode(false);

  setMessage("");

  // Get updated profile from database
  await fetchProfile();
} else {
      setMessage(
        data.message || "Failed to update profile"
      );
    }

  } catch (error) {
    console.error("Profile update error:", error);
    setMessage("Unable to connect to server");
  }
};
const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: value
  });
};


const handleResumeUpload = async () => {
  if (!resumeFile) {
    setMessage("Please select a PDF resume first");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    setMessage("Please login first");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile);

  try {
    const response = await fetch(
      "http://localhost:5000/api/students/upload-resume",
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
  setMessage("");
  setResumeFile(null);
  await fetchProfile();
} else {
      setMessage(
        data.message || "Failed to upload resume"
      );
    }

  } catch (error) {
    console.error("Resume upload error:", error);

    setMessage(
      "Unable to connect to server"
    );
  }
};
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>{message}</h2>
        </div>
      </div>
    );
  }

    return (
    <div className="profile-page">

      <div className="profile-container">

        {/* Header */}

        <div className="profile-header">

          <div>
            <h1>My Profile</h1>
            <p>Manage your student information</p>
          </div>

          <Link
            to="/student-dashboard"
            className="dashboard-btn"
          >
            ← Dashboard
          </Link>

        </div>

        {/* Profile Card */}

        <div className="profile-card">

          {/* Profile Top */}

          <div className="profile-top">

            <div className="profile-avatar-large">
              {student?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-name">

              <h2>{student?.name}</h2>

              <p>{student?.email}</p>

              <span>Student</span>

            </div>

            <button
              className="edit-btn"
              type="button"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>

          </div>

          {/* Information */}

          <div className="profile-form">

            <div className="form-section">

              <h2>Personal Information</h2>

              <div className="form-grid">

                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={
                      editMode
                        ? formData.name
                        : student?.name || ""
                    }
                    onChange={handleInputChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    value={student?.email || ""}
                    disabled
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      editMode
                        ? formData.phone
                        : student?.phone || ""
                    }
                    onChange={handleInputChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>

                  <input
                    type="text"
                    name="department"
                    value={
                      editMode
                        ? formData.department
                        : student?.department || ""
                    }
                    onChange={handleInputChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>GPA</label>

                  <input
                    type="number"
                    name="gpa"
                    value={
                      editMode
                        ? formData.gpa
                        : student?.gpa || ""
                    }
                    onChange={handleInputChange}
                    disabled={!editMode}
                    readOnly={!editMode}
                    min="0"
                    max="4"
                    step="0.01"
                  />
                </div>

              </div>

              {/* Edit Mode Buttons */}

              {editMode && (
                <div className="edit-actions">

                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditMode(false);

                      setFormData({
                        name: student?.name || "",
                        phone: student?.phone || "",
                        department: student?.department || "",
                        gpa: student?.gpa || ""
                      });
                    }}
                  >
                    Cancel
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* Resume */}

<div className="form-section">

  <h2>Resume</h2>

  <div className="resume-box">

    <div className="resume-icon">
      📄
    </div>

    <div className="resume-info">

      <h3>
        {student?.resume
          ? "Resume Uploaded"
          : "No Resume Uploaded"}
      </h3>

      <p>
        {resumeFile
          ? resumeFile.name
          : student?.resume
            ? "Your resume is ready to use for internship applications."
            : "Upload your resume in PDF format (maximum 5 MB)."}
      </p>

      <div className="resume-actions">

        <label
          htmlFor="resume-upload"
          className="choose-resume-btn"
        >
          📁 Choose PDF
        </label>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setResumeFile(file);
            }
          }}
        />

        {student?.resume && (
          <a
            href={`http://localhost:5000${student.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-view-btn"
          >
            👁 View Resume
          </a>
        )}

        {resumeFile && (
          <button
            type="button"
            className="resume-upload-btn"
            onClick={handleResumeUpload}
          >
            ⬆ Upload Resume
          </button>
        )}

      </div>

    </div>

  </div>

</div>

        </div>

      </div>

    </div>
  );
}

export default Profile;