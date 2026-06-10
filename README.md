# Eventora

Eventora is a full-stack event booking platform that allows users to browse event packages, make bookings, manage reservations, and receive email notifications. The platform also includes an admin dashboard for managing bookings and packages.

---

## Live Demo

https://eventora-mu-flame.vercel.app

---

## Features

### User Features

* User Registration
* User Login
* Forgot Password & Password Reset
* Browse Event Packages
* Book Event Packages
* View Personal Bookings
* Cancel Bookings
* Receive Email Notifications
* Responsive Design

### Admin Features

* Admin Dashboard
* View All Bookings
* Approve Bookings
* Reject Bookings
* Manage Packages
* Monitor Booking Statuses

---

## Tech Stack

### Frontend

* Next.js
* React.js
* React Bootstrap
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT Authentication

### Email Service

* SendGrid

### Deployment

* Vercel
* Render

---

## Project Structure

```bash
Eventora
│
├── eventora-frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── eventora-backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   └── server.js
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/Eventora.git
cd Eventora
```

### Backend Setup

```bash
cd eventora-backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd eventora-frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

### Frontend

```env
NEXT_PUBLIC_API_URL=https://eventora-lruv.onrender.com
```

---

## Email Notifications

Eventora integrates with SendGrid to send:

* Welcome Emails
* Booking Confirmation Emails
* Booking Status Update Emails
* Password Reset Emails

---

## Authentication

The platform uses JWT Authentication to secure protected routes and manage user sessions.
