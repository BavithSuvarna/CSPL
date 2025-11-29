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