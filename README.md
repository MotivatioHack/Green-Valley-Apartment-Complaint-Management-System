# 🏢 GREEN Valley Apartment Management System

A full-stack web application designed to digitally manage apartment society operations such as resident management, complaints, notices, amenities, admin control, and communication.

---

## 📌 Project Overview

GREEN Valley Apartment Management System is a centralized platform that simplifies apartment society operations. It provides role-based dashboards for Residents and Administrators, enabling secure access, smooth communication, and efficient management.

This project is developed as a college-level full-stack application following real-world software development practices.

---

## 🎯 Objectives

- Digitize apartment society operations  
- Reduce manual paperwork  
- Improve communication between residents and admin  
- Provide role-based access control  
- Build a scalable and maintainable system  

---

## 👥 User Roles

### 👤 Resident (User)
- Register and Login
- View and update profile
- Raise complaints
- Track complaint status
- View notices and announcements
- Access emergency contacts
- Book amenities (optional)

### 🛠️ Administrator (Admin)
- Admin dashboard access
- Manage residents
- View, assign, and update complaints
- Publish notices and announcements
- Manage amenities
- View reports and statistics

---

## 🧩 Features

### 🔐 Authentication & Authorization
- Secure login and registration
- JWT-based authentication
- Role-based route protection

### 🧾 Complaint Management
- Complaint raising by residents
- Complaint assignment by admin
- Status tracking (Pending, In-Progress, Resolved)

### 📢 Notices & Announcements
- Admin can publish notices
- Residents can view updates in real time

### 🏠 Resident Management
- Tower and flat-based resident organization
- Admin-controlled resident data

### 📊 Dashboards
- Separate dashboards for Admin and Users
- Dynamic data rendering
- Responsive and clean UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication

### Database
- MySQL

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend folder:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=green_valley_apartment
JWT_SECRET=your_secret_key

---

## 🚀 Installation & Setup

### Backend Setup

cd backend
npm install
node server.js

Backend runs on:
http://localhost:5000


### Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:
http://localhost:8080


---

## 🔒 Security Features

- Password hashing
- JWT authentication
- Protected routes
- Role-based authorization
- Environment variable protection

---

## 📈 Future Enhancements

- Maintenance payment system
- Email and SMS notifications
- Visitor management
- Mobile application
- Advanced reporting and analytics

---

## 🎓 Academic Relevance

- Demonstrates full-stack development
- Implements real-world use cases
- Uses RESTful APIs
- Follows MVC architecture
- Includes authentication and authorization

---

## 👨‍💻 Developer Information

Project Name: GREEN Valley Apartment Management System  
Developer: Prathamesh Gadekar  
Project Type: College Full-Stack Project  
Technology Stack: React, Node.js, Express, MySQL  

---

## 📜 License

This project is created for educational purposes and can be freely used and modified for learning and academic submissions.

---

⭐ “Smart living begins with smart management.”

