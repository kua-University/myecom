# ShopCart - Full Stack E-Commerce

A complete e-commerce web application built with React, Node.js, Express, and MySQL. Browse products, manage a shopping cart, place orders, and handle everything with an admin panel.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?logo=linux&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)


---

## What Can It Do?

### For Customers
- Browse products with search, category filters, and price range
- View product details with images, descriptions, and stock status
- Add items to cart and adjust quantities
- Checkout in 2 steps - enter shipping address, review order, place it
- Track orders in your personal dashboard
- Edit your profile - change name or password

### For Admins
- Manage products - add, edit, delete products
- Process orders - update status (pending → shipped → delivered)
- View all users in one place
- Sales reports - see revenue, order count, and top-selling products

---

## How It's Built

```text
┌──────────────────┐      ┌──────────────────┐      ┌──────────┐
│   React + Vite   │─────▶│  Node/Express    │─────▶│  MySQL   │
│   (Frontend)     │◀─────│  (REST API)      │◀─────│  (Data)  │
└──────────────────┘      └──────────────────┘      └──────────┘
Port 3000                 Port 5000              Port 3306
```

- Frontend: React 18 with Vite, Context API for state, React Router for navigation
- Backend: Express.js with JWT authentication and bcrypt password hashing
- Database: MySQL with 8 tables, foreign keys, and transactions
- Security: Protected routes, role-based access (user/admin), and input validation

---

## Quick Start (Docker)

The easiest way to run everything:

```bash
# Clone the repo
git clone https://github.com/kua-University/myecom.git 
cd myecom

# Start all services
docker-compose up -d

# Open your browser:
# Frontend: http://localhost
# API:      http://localhost:5000
```

To stop everything:

```bash
docker-compose down
```

---

## Manual Setup (Development)

### Requirements

- Node.js v18 or higher
- MySQL v8 or higher
- npm

---

### Step 1: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create the database and tables
SOURCE schema.sql;
```

---

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend API runs on:

```text
http://localhost:5000
```

---

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at:

```text
http://localhost:3000
```

---

## First Admin Setup

1. Register a new account at:

```text
http://localhost:3000/register
```

2. Open MySQL and promote yourself to admin:

```sql
USE ecommerce;

UPDATE users
SET role = 'admin'
WHERE email = 'you@example.com';
```

3. Log out and log back in. You will now see the Admin link in the navbar.

---