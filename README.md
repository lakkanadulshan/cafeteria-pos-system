# ☕ Bloom Café POS System

A modern, responsive, and full-stack Point of Sale (POS) application designed for cafés and small businesses. Bloom Café POS streamlines order processing, inventory management, staff administration, and sales tracking through a clean and intuitive interface.

Built with **React**, **Node.js**, **Express.js**, **MySQL**, and **Prisma ORM**, the system provides secure authentication, image uploads, email notifications, and a seamless user experience.

---

# 🚀 Live Demo

### 🌐 Frontend

https://cafeteria-pos-system-lac.vercel.app

### ⚙️ Backend API

https://cafeteria-pos-system.onrender.com

---

# ✨ Features

## 🔐 Authentication & Authorization

- JWT Authentication
- Secure Login & Registration
- Email Verification
- Forgot Password with OTP
- Password Reset
- Protected Routes
- Role-Based Authorization (Admin / Staff)

---

## ☕ Café Management

- Menu Management
- Category Management
- Product Image Upload
- Cloudinary Integration
- Inventory Management
- Stock Monitoring

---

## 🛒 POS System

- Add Items to Cart
- Real-time Price Calculation
- Checkout Process
- Order Management
- Sales Recording

---

## 📊 Dashboard

- Sales Overview
- Revenue Statistics
- Inventory Monitoring
- Order Analytics
- Business Insights

---

## 📧 Email Service

- Brevo HTTP REST API
- Email Verification
- OTP Delivery
- Password Recovery

---

## 🎨 User Interface

- Modern UI Design
- Fully Responsive
- Mobile Friendly
- Smooth Navigation
- Clean Dashboard
- User-Friendly Experience

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- CSS3
- Lucide React

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Multer
- Cloudinary SDK
- Brevo REST API

---

## Database

- MySQL
- Aiven Cloud

---

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Aiven Cloud |
| Images | Cloudinary |

---

# 📁 Project Structure

```text
Bloom-Cafe-POS/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/bloom-cafe-pos.git

cd bloom-cafe-pos
```

---

## 2. Install Backend Dependencies

```bash
cd Backend

npm install
```

Run the backend server

```bash
npm run dev
```

or

```bash
npm start
```

Backend runs at

```
http://localhost:3000
```

---

## 3. Install Frontend Dependencies

```bash
cd ../Frontend

npm install
```

Run the frontend

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 🗄 Prisma Commands

Generate Prisma Client

```bash
npx prisma generate
```

Run Migrations

```bash
npx prisma migrate dev
```

Open Prisma Studio

```bash
npx prisma studio
```

Reset Database

```bash
npx prisma migrate reset
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/verify-email` | Verify User Email |
| POST | `/api/auth/forgot-password` | Send Password Reset OTP |
| POST | `/api/auth/reset-password` | Reset Password |

---

## Products

| Method | Endpoint |
|---------|----------|
| GET | `/api/products` |
| POST | `/api/products` |
| PUT | `/api/products/:id` |
| DELETE | `/api/products/:id` |

---

## Categories

| Method | Endpoint |
|---------|----------|
| GET | `/api/categories` |
| POST | `/api/categories` |
| PUT | `/api/categories/:id` |
| DELETE | `/api/categories/:id` |

---

## Orders

| Method | Endpoint |
|---------|----------|
| GET | `/api/orders` |
| POST | `/api/orders` |

---

# 📷 Screenshots

Include screenshots of:

- Home Page
- Login Page
- Dashboard
- Products
- Categories
- Orders
- Inventory
- User Management

---

# 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected API Routes
- Role-Based Authorization
- Secure File Uploads
- Environment Variables
- Input Validation

---

**Bloom Café POS System**

Designed & Developed with using

- React.js
- Node.js
- Express.js
- Prisma ORM
- MySQL
- Cloudinary
- Brevo REST API
