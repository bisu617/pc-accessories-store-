# 🚀 Byte Bazar Tech - Full Stack PC Accessories Store

Byte Bazar Tech is a premium, full-stack e-commerce platform dedicated to high-performance PC peripherals. Built with a modern tech stack, it offers a seamless shopping experience for gamers and tech enthusiasts.

![Byte Bazar Banner](https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1200)

## 🔑 Demo Admin Access
For recruiters and reviewers, you can access the full Admin Panel using the following credentials:
- **Email**: `admin@demo.com`
- **Password**: `password123`

## 🌟 Key Features

- **Dynamic Product Catalog**: Browse a wide range of keyboards, mice, headphones, and more.
- **Advanced Filtering**: Filter products by category and features.
- **User Authentication**: Secure JWT-based registration and login system.
- **Interactive Shopping Cart**: Add, update, and remove items with real-time price calculations.
- **Wishlist System**: Save favorite products for later.
- **Secure Checkout**: Streamlined checkout process for orders.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **RESTful API**: Robust backend built with Node.js and Express.

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** (App Router)
- **TypeScript**
- **CSS Modules** (Modular Styling)
- **React Icons** (Lu Icons)
- **Context API** (State Management)

### **Backend**
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (Database)
- **JWT** (Security)
- **Bcrypt.js** (Password Hashing)

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js v18 or higher
- MongoDB Atlas account

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/bisu617/pc-accessories-store-.git
   cd pc-accessories-store-
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   ```
   Run the seed script to populate products:
   ```bash
   npm run seed
   ```
   Start the dev server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   Start the dev server:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

### **Backend (Render)**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Add `MONGODB_URI`, `JWT_SECRET`, and `NODE_ENV=production`.

### **Frontend (Vercel)**
- **Root Directory**: `frontend`
- **Framework Preset**: `Next.js`
- **Environment Variables**: Add `NEXT_PUBLIC_API_URL` (pointing to your Render URL).

---

## 📜 License
This project is for portfolio purposes.

---

**Developed with ❤️ by [Bishesh Acharya](https://github.com/bisu617)**
