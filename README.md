CSPL – Auction Management System

A full-stack MERN application built for managing live cricket auctions, player listings, team budgets, admin-controlled auction operations, and real-time updates.

This project includes:
✔ Player management
✔ Team management
✔ Real-time auctioning
✔ Image uploads
✔ Secure admin token system
✔ Fully responsive UI
✔ Backend API with MongoDB
✔ Authentication using Admin Token (without changing original flow)

📌 Table of Contents

Overview

Features

Tech Stack

Project Architecture

Screenshots

Folder Structure

Environment Variables

Installation

Running the Project

API Endpoints

Admin Token Authentication Flow

Deployment Notes

Troubleshooting

Credits

📘 Overview

This is a complete Auction Management System designed specifically for CSPL Cricket League.
Admins can run auctions, upload players, assign players to teams, track budgets, update player status, and manage an entire auction event online.

The frontend interacts with the backend using REST APIs, and an admin token is required for protected operations like uploading or editing players.

⭐ Features
👨‍💻 Admin Features

Admin login using secure token verification

Add players with image upload

Edit player details

Delete player

Conduct auction (mark sold/unsold)

Assign to teams

Update team budgets

👥 Team Features

Create teams

View team budget & purchased players

Team-wise player filtering

👤 Player Features

Name, base price, sold price

Player image

Category/role

Status: Available / Sold / Unsold

🎨 UI Features

Responsive design

Player cards & team cards

Filter + search

Smooth admin login/logout

Upload preview

🧰 Tech Stack
Frontend

React

Tailwind CSS

Axios

React Hooks & Context

Vite

Backend

Node.js

Express.js

MongoDB + Mongoose

Multer for file uploads

CORS-enabled API

Environment-based configuration

🏗 Project Architecture
Frontend (React)  --->  Backend API (Express)  --->  MongoDB
                 <---                   (returns responses)


Admin token is verified through:

POST /api/admin/verify
Header: x-admin-token: <token>

🖼 Screenshots

(Add images here later after pushing screenshots to GitHub.)
Example:

![Dashboard](./screenshots/dashboard.png)

📂 Folder Structure
CSPL/
│
├── backend/
│   ├── server.js
│   ├── .env
│   ├── uploads/
│   └── src/
│       ├── models/
│       ├── routes/
│       └── controllers/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── assets/
    ├── .env
    └── vite.config.js

🔐 Environment Variables
Backend (backend/.env)
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_TOKEN=your_secret_admin_token

Frontend (frontend/.env)
VITE_API_BASE=https://your-backend-url.com/api

⚙ Installation
1️⃣ Clone the repository
git clone https://github.com/BavithSuvarna/CSPL.git
cd CSPL

2️⃣ Install backend dependencies
cd backend
npm install

3️⃣ Install frontend dependencies
cd ../frontend
npm install

▶ Running the Project
Start Backend
cd backend
npm start

Start Frontend
cd frontend
npm run dev


Backend runs on PORT 5000 by default.
Frontend runs on 5173 unless changed.

📡 API Endpoints
Admin
Method	Endpoint	Purpose
POST	/api/admin/verify	Verify admin token
Players
Method	Endpoint	Purpose
GET	/api/players/	Get all players
POST	/api/players/	Add player
PUT	/api/players/:id	Update player
DELETE	/api/players/:id	Delete player
Teams
Method	Endpoint	Purpose
GET	/api/teams/	Get teams
POST	/api/teams/	Add team
PUT	/api/teams/:id	Update team
DELETE	/api/teams/:id	Delete team
Auction
Method	Endpoint	Purpose
PUT	/api/auction/sell/:id	Mark player as sold
PUT	/api/auction/unsold/:id	Mark unsold
PUT	/api/auction/team/:id	Assign to team
🔐 Admin Token Authentication Flow

Admin enters token in the frontend

Frontend sends request:

POST /api/admin/verify
Header: x-admin-token: <token>


Backend checks token against process.env.ADMIN_TOKEN

If valid → store in localStorage

If invalid → deny access

Any protected API request includes:

x-admin-token: <admin_token>


This ensures secure admin-only access with zero UI changes.

🚀 Deployment Notes
Backend

Can be deployed on Render / Railway / AWS / DigitalOcean

Make sure environment variables are added

Set CORS origin to your frontend URL

Frontend

Deploy on Vercel

Set:

VITE_API_BASE=https://your-live-backend/api


Rebuild after changing .env

❗ Troubleshooting
❌ Admin login not working

✔ Check ADMIN_TOKEN in backend .env
✔ Restart backend
✔ Ensure frontend .env has correct API URL

❌ CORS errors

✔ Make sure backend allows your frontend URL
✔ Vercel URL must be added in backend CORS

❌ Images not loading

✔ Ensure /uploads is publicly exposed
✔ Use absolute API base path

🙌 Credits

Developed by Bavith L Suvarna
Final-year CSE • MERN Developer • CSPL Auction Project Owner
