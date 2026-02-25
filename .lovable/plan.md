

# LEONI Internship Management Platform — Implementation Plan

## Overview
A modern, enterprise-grade web application for managing the complete internship lifecycle at LEONI. Built with React + Vite (frontend first), then connected to Supabase for authentication, database, storage, and RBAC.

---

## Phase 1: Foundation & Authentication Pages

### 🎨 Design System & Branding
- LEONI corporate color palette (dark navy #1a1a2e, cyan #00d4ff accents for auth; clean light theme for dashboards)
- Poppins font family throughout
- LEONI branding: logo at top, "LEONI Internship Management Platform" footer
- Smooth animations and professional hover effects

### 🔐 Login Page (Dark Theme)
- Recreate the exact Figma design: split panel with animated welcome section + credential form
- Email/Password login fields with icons
- "Login with Google" button
- Smooth slide animation when toggling between Login and Sign Up
- "Forgot password" link

### 📝 Sign Up Page (Dark Theme)
- Role selector tabs: RH Manager, Intern, Encadrant
- Fields: First Name, Last Name, Email, Phone, Password, Confirm Password
- Animated panel transition from Login
- "Already have an account? Sign In" link

---

## Phase 2: Landing Page & Public Pages

### 🏠 Home/Landing Page (Light Theme)
- Hero section with LEONI factory background image, headline: "Smart Internship & Recruitment Management"
- Feature highlights: QR Attendance, Auto Certificates, Badge Generation
- Navigation: Home, Features, About, Contact, Sign In, Get Started
- Dark/light mode toggle
- Professional animations and scroll effects

### 📖 Public PFE Book Page
- Publicly shareable page listing all published internship subjects
- Cards showing: Title, Description, Required Skills, Department, Supervisor, Duration, Type
- "Postuler" (Apply) button on each subject
- Filterable by internship type (PFE, PFA, Summer, Perfectionnement)

### 📋 Application Form Page
- Candidate fills: Full Name, Email, Phone, University, CV Upload, Motivation Letter
- Clean form validation
- Success confirmation after submission

---

## Phase 3: RH/Admin Dashboard

### 📊 Admin Dashboard
- Welcome banner with stats cards: Total Interns, Total Applicants, Total Projects
- Attendance overview chart (recharts)
- Recent activity feed
- Sidebar navigation: Dashboard, All Interns, Departments, Internships, Candidates, Calendar, Settings

### 📚 PFE Book Management
- Create/edit PFE Books
- Add internship subjects with all fields (title, description, skills, department, supervisor, type, duration)
- Publish PFE Book and copy public shareable link
- Status indicators (draft/published)

### 👥 Recruitment Pipeline
- List of all applications with filters (university, status, department)
- Kanban or list view of application statuses: Pending → Preselected → Interview Scheduled → Accepted → Rejected
- Status update actions
- View candidate details and uploaded CV

### 🏢 Intern Management
- Full intern list with search, filter by university/position
- Intern detail view with assigned subject, supervisor, period
- Add/edit/remove interns

---

## Phase 4: Intern & Supervisor Dashboards

### 🎓 Intern Dashboard
- View assigned internship subject and details
- Supervisor info and internship period
- Weekly progress submission: description field + file upload
- View supervisor feedback and comments
- Download personal badge

### 👨‍🏫 Supervisor (Encadrant) Dashboard
- List of assigned interns
- View intern progress submissions
- Add evaluation comments
- Request corrections / validate tasks
- Progress tracking overview

---

## Phase 5: Badge Generation & Documents

### 🪪 Intern Badge Generator
- Auto-generated badge matching LEONI standard format (based on the badge photo reference)
- Badge content: LEONI logo, intern name, department, supervisor, matricule, internship period, type, QR code
- QR code linking to intern ID in system
- Export badge as PDF
- Supports all internship types

### 📄 Certificate/Attestation
- Auto-generate internship attestation PDF when stage is validated

---

## Phase 6: Backend Integration (Supabase)

### 🔧 Database & Auth
- Supabase authentication (email/password + Google OAuth)
- PostgreSQL tables: profiles, user_roles, pfe_books, internship_subjects, applications, interns, progress_updates, evaluations, badges
- Row-Level Security policies per role (RH, Encadrant, Stagiaire)
- Storage buckets for CVs, progress files, and badge PDFs

### 📧 Notifications
- Email notifications on acceptance (via Supabase Edge Functions)
- Account creation flow for accepted candidates

---

## Future Phase: Attendance System (Prepared)
- QR-based check-in/check-out scanning
- Real-time attendance tracking
- Attendance history visible by RH and Encadrant
- UI pages prepared, backend connected when ready

