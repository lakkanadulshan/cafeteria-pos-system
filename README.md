```
# ☕ Bloom Café - Full Stack MERN POS System

Bloom Café is a modern, responsive, and full-featured Point of Sale (POS) application designed to streamline cafeteria ordering, inventory tracking, and sales management. Built using the MERN stack (MongoDB/MySQL, Express, React, Node.js), it includes secure JWT authentication, transactional email delivery, Cloudinary media storage, and an interactive UI.

---

## 🚀 Live Demo & Links

- **Frontend (Client):** [cafeteria-pos-system-lac.vercel.app](https://cafeteria-pos-system-lac.vercel.app)
- **Backend (API):** [cafeteria-pos-system.onrender.com](https://cafeteria-pos-system.onrender.com)

---

## ✨ Key Features

- 🔐 **Authentication & Authorization:** Secure user registration, JWT-based login, password reset via OTP, and email verification.
- 📧 **Transactional Email Service:** Integrated Brevo HTTP REST API to bypass host network/SMTP port restrictions for instant delivery.
- 🍔 **Menu & Inventory Management:** Add, update, and manage café menu items with Cloudinary image uploads.
- 🛒 **POS & Order Processing:** Real-time cart calculation, order submission, and transaction handling.
- 📊 **Dashboard Analytics:** Sales summaries, revenue statistics, and inventory monitoring.
- ⚡ **Responsive UI:** Fully responsive and clean user interface built with React.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Styling:** CSS3 / Modern UI Frameworks
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MySQL (Hosted on Aiven Cloud) / Prisma / ORM
- **Email Delivery:** Brevo HTTP REST API
- **Media Hosting:** Cloudinary API
- **Deployment:** Render

---

## 📂 Project Structure


```

cafeteria-pos/
├── Backend/
│   ├── config/             # Database and third-party API configs
│   ├── controllers/        # Request handlers & business logic
│   ├── middleware/         # Auth verification and rate limiters
│   ├── models/             # Database schemas/models
│   ├── routes/             # REST API endpoints
│   ├── utils/              # Helper functions (Brevo API sendEmail.js)
│   ├── .env                # Environment variables (Git-ignored)
│   └── server.js           # Express app entry point
│
└── Frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application views/pages
│   ├── context/        # State management / Auth context
│   └── services/       # API call utilities
└── public/

```
---

## 🚦 Local Installation & Setup

### Prerequisites

* Node.js (v18+)
* Git
* MySQL Database or Aiven Cloud Instance

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/cafeteria-pos.git](https://github.com/your-username/cafeteria-pos.git)
cd cafeteria-pos

```

### 2. Backend Setup

```bash
cd Backend
npm install
npm start

```

*Backend will run on `http://localhost:3000*`

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
npm start

```

*Frontend will run on `http://localhost:3000` or `http://localhost:5173*`

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user & trigger email verification |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token |
| `GET` | `/api/auth/verify-email` | Verify email token |
| `POST` | `/api/auth/forgot-password` | Send 6-digit reset OTP via Brevo API |
| `POST` | `/api/auth/reset-password` | Reset account password using OTP |

---
