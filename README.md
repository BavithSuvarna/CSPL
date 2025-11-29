<<<<<<< HEAD
CSPL 2k25 Auction Platform 🏆
A comprehensive auction management platform for cricket player auctions with real-time bidding, team management, and results tracking.

🚀 Features
🔧 Core Functionality
Player Management: Upload players with serial numbers and photos

Team Management: Create teams with custom logos and point systems

Live Auction: Real-time bidding system with timer

Phase Management: Normal auction and unsold player rounds

Results Tracking: Comprehensive team squads and statistics

Admin Controls: Secure admin panel with token-based authentication

🎨 User Interface
Modern Design: Clean, professional interface with glass morphism effects

Responsive Layout: Works seamlessly on desktop and mobile devices

Real-time Updates: Live team points and player status updates

Visual Feedback: Interactive buttons with hover effects and animations

Professional Theme: Light background with gradient accents

📋 Prerequisites
Before running this project, ensure you have the following installed:

Node.js (v14 or higher)

MongoDB (v4.4 or higher)

npm or yarn

🛠️ Installation
1. Clone the Repository
bash
git clone <repository-url>
cd cspl-auction
2. Backend Setup
bash
cd backend
npm install
Environment Variables
Create a .env file in the backend directory:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cspl-auction
ADMIN_TOKEN=your-secret-admin-token-here
NODE_ENV=development
Start Backend Server
bash
npm run dev
The backend will run on http://localhost:5000

3. Frontend Setup
bash
cd frontend
npm install
Environment Variables
Create a .env file in the frontend directory:

env
VITE_API_BASE=http://localhost:5000/api
Start Frontend Development Server
bash
npm run dev
The frontend will run on http://localhost:3000

🏗️ Project Structure
text
cspl-auction/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auctionController.js
│   │   │   ├── playersController.js
│   │   │   └── teamController.js
│   │   ├── models/
│   │   │   ├── Auction.js
│   │   │   ├── Player.js
│   │   │   └── Team.js
│   │   ├── routes/
│   │   │   ├── auction.js
│   │   │   ├── players.js
│   │   │   └── teams.js
│   │   ├── middleware/
│   │   │   └── adminAuth.js
│   │   └── app.js
│   ├── uploads/
│   │   ├── thumbs/
│   │   └── teams/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminLogin.jsx
    │   │   └── ...
    │   ├── pages/
    │   │   ├── AuctionPage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── ResultsPage.jsx
    │   │   ├── TeamDetailsPage.jsx
    │   │   └── UnsoldPage.jsx
    │   ├── api/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
📊 API Endpoints
Authentication
Headers: x-admin-token: <admin-token>

Players
GET /api/players - Get all players

GET /api/players?status=available|assigned|unsold - Filter players by status

POST /api/players - Create new player (Admin only)

DELETE /api/players/:id - Delete player (Admin only)

DELETE /api/players/clear/all - Clear all players (Admin only)

Teams
GET /api/teams - Get all teams with players

GET /api/teams/:id - Get specific team details

POST /api/teams - Create new team (Admin only)

DELETE /api/teams/:id - Delete team (Admin only)

Auction
GET /api/auction/next - Get next player in queue

POST /api/auction/start?phase=normal|unsold - Start auction phase (Admin only)

POST /api/auction/assign - Assign player to team or mark unsold (Admin only)

POST /api/auction/advance - Advance auction pointer (Admin only)

🎯 Usage Guide
1. Initial Setup
Access Admin Portal: Navigate to the Upload page

Admin Login: Use the admin token configured in backend environment variables

Upload Teams: Create teams with names and optional logos

Upload Players: Add players with names and serial numbers

2. Running the Auction
Start Auction: Click "Start Auction" on the Auction page

Bid Process:

Select a team from the dropdown

Enter bid amount (must be within team's remaining points)

Click "Assign to Team" or "Mark Unsold"

Phase Management:

Normal Phase: All available players

Unsold Phase: Previously unsold players reactivated

3. Viewing Results
Team Squads: Click on any team card to view detailed squad

Player Details: See purchase prices and player information

Statistics: View auction statistics and team summaries

Unsold Players: Access complete list of unsold players

🔧 Configuration
Team Points System
Default starting points: 10,000 per team

Configurable via team creation API

Real-time point deduction during bidding

Image Handling
Player Photos: Automatic thumbnail generation (300x300)

Team Logos: Base64 encoding with compression (200x200)

File Limits: 2MB maximum file size

Supported Formats: JPG, PNG, WebP

Auction Rules
Players are shuffled randomly at phase start

Teams cannot bid more than their remaining points

Players can be marked unsold and reactivated in unsold phase

One player at a time in the auction queue

🎨 Customization
Styling
The project uses Tailwind CSS with custom configurations:

Primary Colors: Blue to purple gradients

Status Colors: Green (available), Blue (assigned), Yellow (unsold)

Glass Morphism: Modern card effects

Responsive Breakpoints: Mobile-first design

Point System
Modify default points in teamController.js:

javascript
points: req.body.points ? Number(req.body.points) : 10000
Admin Security
Change admin token in backend .env file:

env
ADMIN_TOKEN=your-new-secure-token
🚀 Deployment
Backend Deployment (Render/Railway/Heroku)
Set environment variables in deployment platform

Ensure MongoDB connection string is configured

Deploy from backend directory

Frontend Deployment (Vercel/Netlify)
Set VITE_API_BASE to your deployed backend URL

Build command: npm run build

Output directory: dist

Environment Variables for Production
env
# Backend
MONGODB_URI=your-production-mongodb-uri
ADMIN_TOKEN=your-production-admin-token
NODE_ENV=production

# Frontend
VITE_API_BASE=https://your-backend-url.com/api
🐛 Troubleshooting
Common Issues
413 Payload Too Large

Solution: Images are automatically compressed, ensure they're under 2MB

Admin Token Not Working

Solution: Verify token matches between frontend localStorage and backend .env

MongoDB Connection Issues

Solution: Check connection string and ensure MongoDB is running

Images Not Displaying

Solution: Check file permissions in uploads directory and CORS settings

Debug Mode
Enable detailed logging by setting:

env
NODE_ENV=development
📈 Future Enhancements
Real-time WebSocket connections for live updates

Bid history and audit trails

Player statistics and performance metrics

Multi-session auction support

Export functionality for results

Mobile app companion

Advanced team analytics

🤝 Contributing
Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Commit changes: git commit -m 'Add amazing feature'

Push to branch: git push origin feature/amazing-feature

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Team
Developed for CSPL 2k25 Cricket Tournament Management

Note: This platform is designed for cricket player auctions but can be adapted for other auction-based systems with minimal modifications.

For support or questions, please contact the development team or create an issue in the repository.
=======
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
>>>>>>> 4fa649f9e4cb60a7ca5aeab9c66ef557dd78633a
