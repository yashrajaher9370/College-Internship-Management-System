# 🎓 College Internship Management System

A full-stack web application designed to manage college internships, student applications, interviews, evaluations, and internship-related activities through a centralized platform.

## 📌 Project Overview

The **College Internship Management System** provides a common platform for Students, Faculty, and Administrators to manage the complete internship process.

Students can browse internships, apply for opportunities, track application status, view interviews, and manage their profiles.

Faculty members can create internships, review applications, shortlist students, schedule interviews, and update interview results.

Administrators can manage students, companies, internships, applications, interviews, evaluations, and reports.

---

## 🎯 Objectives

- Centralize the college internship management process.
- Provide an easy platform for students to find and apply for internships.
- Allow faculty to manage internships and student applications.
- Provide administrators with complete system control.
- Track applications and interview results.
- Maintain internship evaluation and feedback records.
- Improve efficiency and reduce manual work.

---

## 👥 User Roles

### 👨‍🎓 Student

- Student registration and login
- Browse available internships
- Search and filter internships
- View internship details
- Apply for internships
- Upload resume
- Track application status
- View interview schedules and results
- Manage profile
- Submit feedback

### 👨‍🏫 Faculty

- Faculty login
- Faculty dashboard
- Create internships
- View internship applications
- Shortlist or reject applications
- Accept shortlisted candidates
- Schedule interviews
- Update interview results
- View internship-related information

### 👨‍💼 Admin

- Admin login
- Admin dashboard
- Manage students
- Manage companies
- Manage internships
- Manage applications
- Manage interviews
- Manage evaluations
- View system reports

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- React Router

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MySQL
- MySQL Workbench

### Authentication & Security

- JWT Authentication
- bcrypt Password Hashing
- Role-based Authorization
- Protected Routes
- Input Validation
- Resume File Validation

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- MySQL Workbench

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       Users          │
                    │ Student / Faculty    │
                    │       / Admin        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │      + Vite          │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express.js │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    MySQL Database    │
                    └──────────────────────┘
