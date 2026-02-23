# 🚗 Car Rental System

A comprehensive web-based platform designed to streamline vehicle rental operations. This system provides a seamless experience for customers to book rides and a robust dashboard for administrators to manage their fleet.

## 🌟 Key Features

### 👤 Customer Side
- **User Authentication**: Secure [User Registration and Login] with profile management.
- **Car Catalog**: Browse available vehicles by brand, model, and category (e.g., Luxury, Economy).
- **Real-time Booking**: Check availability for specific dates and book instantly.
- **Payment Integration**: Secure online transactions via integrated gateways like [Stripe].
- **Booking History**: Track past and upcoming reservations.

### 🛠 Admin Side
- **Fleet Management**: [Add, Update, or Delete] vehicles from the inventory.
- **Booking Oversight**: Approve, cancel, or modify customer reservations.
- **User Management**: Monitor registered users and their rental history.
- **Analytics Dashboard**: View total bookings, revenue, and fleet utilization.

## 💻 Tech Stack
- **Frontend**: React.js / CSS3
- **Backend**: Node.js / Express.js 
- **Database**: MongoDB 
- **Authentication**: JWT 

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- Database MongoDB instance

### Installation
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Felicien407/car-rental-system/]
   cd car-rental-system
   # For backend
   cd backend && npm install
   npm run seed // for installing seed data {default admin users data}
   npm run dev
   # For frontend
   cd ../frontend && npm install
   npm run dev

