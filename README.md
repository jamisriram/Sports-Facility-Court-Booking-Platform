# Sports Facility Court Booking Platform

A full-stack web application for managing sports facility bookings with multi-resource scheduling and dynamic pricing.

🔗 **Live Demo**: [Coming Soon]

## Features

- 🏟️ Multi-resource scheduling (Courts, Coaches, Equipment)
- 💰 Dynamic pricing engine with configurable rules
- 📅 Real-time availability checking
- 🎨 Premium UI with glassmorphism design
- 📱 Fully responsive mobile-first design
- 👨‍💼 Admin dashboard for management

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Axios, React Router  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Deployment:** Vercel (Frontend), Render (Backend)

## Quick Start

### Prerequisites
- Node.js v14+
- MongoDB Atlas account

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/sports-facility-booking.git
cd sports-facility-booking
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables
```bash
# Backend: Create backend/.env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Frontend: Create frontend/.env.local (optional for local dev)
REACT_APP_API_URL=http://localhost:5000/api
```

4. Seed database (one-time)
```bash
cd backend
node seedData.js
```

5. Run the application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Visit `http://localhost:3000` 🚀

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel and Render.

## Project Structure

```
├── backend/          # Node.js API
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── models/       # MongoDB schemas
│   └── routes/       # API endpoints
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── services/    # API service layer
└── DEPLOYMENT.md     # Deployment guide
```

---

Built with ❤️ for Acorn Globus Assignment
