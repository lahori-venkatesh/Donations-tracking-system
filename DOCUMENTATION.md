# DonateTrack - Complete Documentation 📚

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Module Documentation](#module-documentation)
5. [API Reference](#api-reference)
6. [Deployment Guide](#deployment-guide)
7. [Development Guidelines](#development-guidelines)
8. [Troubleshooting](#troubleshooting)

## Project Overview

DonateTrack is a comprehensive donation management platform that connects donors with verified NGOs across India. The platform ensures transparency, security, and accountability in the donation process through advanced verification systems and real-time tracking.

### Key Features

- **Multi-tier Architecture**: Separate frontend, backend, and admin applications
- **Comprehensive Verification**: NGO and project verification workflows
- **Real-time Tracking**: Live donation tracking and impact measurement
- **Advanced Analytics**: Detailed insights and reporting capabilities
- **Secure Payments**: Multiple payment gateway integration
- **Mobile Responsive**: Optimized for all device types

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Admin Panel   │    │   Backend API   │
│   (Port 3000)   │    │   (Port 3001)   │    │   (Port 5000)   │
│                 │    │                 │    │                 │
│ - User Interface│    │ - Admin Dashboard│    │ - REST API      │
│ - Donor Portal  │    │ - User Management│    │ - Authentication│
│ - Project Browse│    │ - Analytics     │    │ - Database      │
│ - Donations     │    │ - Reports       │    │ - File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   Database      │
                    │                 │
                    │ - Users         │
                    │ - Projects      │
                    │ - Donations     │
                    │ - Verification  │
                    └─────────────────┘
```

### Technology Stack

#### Frontend (User Interface)

- **React.js 18** - Modern UI library
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **Axios** - HTTP client

#### Backend (API Server)

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

#### Admin Panel (Management Interface)

- **React.js 18** - Admin interface
- **Tailwind CSS** - Consistent styling
- **Chart.js** - Analytics visualization
- **React Router** - Admin routing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager
- Git for version control

### Quick Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/venkatesh/donatetrack.git
   cd donatetrack
   ```

2. **Install All Dependencies**

   ```bash
   npm run install:all
   ```

3. **Setup Environment Variables**

   ```bash
   npm run setup:env
   ```

4. **Configure Environment Files**

   **Backend (.env)**:

   ```env
   MONGODB_URI=mongodb://localhost:27017/donatetrack
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

   **Admin (.env)**:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   PORT=3001
   ```

5. **Start All Services**

   ```bash
   npm run dev
   ```

6. **Access Applications**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3001
   - Backend API: http://localhost:5000

### 🔐 **Test Credentials**

For easy testing and development, use these dummy credentials:

#### **Frontend (User Portal)**

- **Donor Account**: `donor@test.com` / `donor123`
- **NGO Account**: `ngo@test.com` / `ngo123`

#### **Admin Panel**

- **Admin Account**: `admin@donatetrack.com` / `admin123`

#### **Quick Testing Steps**

1. **Test Donor Experience**:

   - Go to http://localhost:3000
   - Login with `donor@test.com` / `donor123`
   - Explore donation features and dashboard

2. **Test NGO Experience**:

   - Login with `ngo@test.com` / `ngo123`
   - Create and manage projects

3. **Test Admin Panel**:
   - Go to http://localhost:3001
   - Login with `admin@donatetrack.com` / `admin123`
   - Manage users, projects, and system settings

> **Note**: These are development-only credentials for testing purposes.

### Development Workflow

```bash
# Start all services in development mode
npm run dev

# Start individual services
npm run start:backend    # Backend only
npm run start:frontend   # Frontend only
npm run start:admin      # Admin panel only

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## Module Documentation

### Frontend Module

**Location**: `/frontend`
**Port**: 3000
**Purpose**: User-facing donation platform

#### Key Features

- User registration and authentication
- Project discovery and browsing
- Donation processing
- Personal dashboard
- Donation tracking
- Leaderboards and community features

#### Main Components

- `DonorDashboard.js` - Personal donor dashboard
- `ProjectBrowser.js` - Project discovery interface
- `DonationForm.js` - Donation processing
- `LeaderboardCard.js` - Community leaderboards

### Backend Module

**Location**: `/backend`
**Port**: 5000
**Purpose**: API server and business logic

#### Key Features

- RESTful API endpoints
- User authentication and authorization
- Database operations
- Payment processing
- Email notifications
- File upload handling

#### Main Components

- `server.js` - Application entry point
- `models/` - Database schemas
- `controllers/` - Business logic
- `routes/` - API endpoints
- `middleware/` - Authentication and validation

### Admin Module

**Location**: `/admin`
**Port**: 3001
**Purpose**: Administrative interface

#### Key Features

- User management
- Project oversight
- Donation monitoring
- NGO verification
- System analytics
- Report generation

#### Main Components

- `AdminDashboard.js` - Main admin interface
- `UserManagement.js` - User administration
- `ProjectManagement.js` - Project oversight
- `VerificationQueue.js` - NGO verification

## API Reference

### Authentication Endpoints

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/refresh      # Token refresh
POST /api/auth/logout       # User logout
```

### User Endpoints

```
GET  /api/users/profile     # Get user profile
PUT  /api/users/profile     # Update profile
GET  /api/users/donations   # Get user donations
```

### Project Endpoints

```
GET  /api/projects          # Get all projects
POST /api/projects          # Create project
GET  /api/projects/:id      # Get project details
PUT  /api/projects/:id      # Update project
```

### Donation Endpoints

```
POST /api/donations         # Create donation
GET  /api/donations/:id     # Get donation details
GET  /api/donations/user/:id # Get user donations
```

### Admin Endpoints

```
GET  /api/admin/dashboard   # Admin dashboard data
GET  /api/admin/users       # Get all users
PUT  /api/admin/users/:id   # Update user status
GET  /api/admin/analytics   # Platform analytics
```

## Deployment Guide

### Development Deployment

1. **Local Development**

   ```bash
   npm run dev
   ```

2. **Environment Configuration**
   - Configure `.env` files for each module
   - Set up MongoDB connection
   - Configure email service
   - Set up payment gateways

### Production Deployment

#### Option 1: Traditional Server Deployment

1. **Server Setup**

   ```bash
   # Install Node.js and MongoDB
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs mongodb
   ```

2. **Application Deployment**

   ```bash
   # Clone and build
   git clone https://github.com/venkatesh/donatetrack.git
   cd donatetrack
   npm run install:all
   npm run build
   ```

3. **Process Management**

   ```bash
   # Install PM2
   npm install -g pm2

   # Start backend
   cd backend && pm2 start src/server.js --name "donatetrack-api"

   # Serve frontend and admin
   pm2 serve frontend/build 3000 --name "donatetrack-frontend"
   pm2 serve admin/build 3001 --name "donatetrack-admin"
   ```

#### Option 2: Docker Deployment

1. **Create Docker Compose**

   ```yaml
   version: "3.8"
   services:
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - MONGODB_URI=mongodb://mongo:27017/donatetrack
       depends_on:
         - mongo

     frontend:
       build: ./frontend
       ports:
         - "3000:3000"

     admin:
       build: ./admin
       ports:
         - "3001:3001"

     mongo:
       image: mongo:5.0
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db

   volumes:
     mongo_data:
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

#### Option 3: Cloud Deployment

**Backend (Heroku/Railway)**

```bash
# Deploy backend to Heroku
heroku create donatetrack-api
git subtree push --prefix backend heroku main
```

**Frontend (Netlify/Vercel)**

```bash
# Build and deploy frontend
cd frontend && npm run build
# Upload build folder to Netlify
```

**Admin (Netlify/Vercel)**

```bash
# Build and deploy admin
cd admin && npm run build
# Upload build folder to Netlify
```

### Environment Configuration

#### Production Environment Variables

**Backend**:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-production-email
EMAIL_PASS=your-production-password
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

**Frontend**:

```env
REACT_APP_API_URL=https://api.donatetrack.com
REACT_APP_RAZORPAY_KEY=your-razorpay-public-key
```

**Admin**:

```env
REACT_APP_API_URL=https://api.donatetrack.com
REACT_APP_ADMIN_TITLE=DonateTrack Admin Panel
PORT=3001
```

## Development Guidelines

### Code Standards

#### JavaScript/React

- Use ES6+ features
- Follow React hooks patterns
- Use functional components
- Implement proper error boundaries
- Use PropTypes for type checking

#### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use semantic HTML elements

#### API Design

- Follow RESTful conventions
- Use proper HTTP status codes
- Implement consistent error responses
- Use proper authentication middleware

### Git Workflow

1. **Branch Naming**

   ```
   feature/user-authentication
   bugfix/donation-calculation
   hotfix/security-patch
   ```

2. **Commit Messages**

   ```
   feat: add user authentication system
   fix: resolve donation calculation bug
   docs: update API documentation
   style: improve responsive design
   ```

3. **Pull Request Process**
   - Create feature branch
   - Make changes with tests
   - Submit pull request
   - Code review and approval
   - Merge to main branch

### Testing Guidelines

#### Unit Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Admin tests
cd admin && npm test
```

#### Integration Testing

```bash
# Test API endpoints
npm run test:integration

# Test user workflows
npm run test:e2e
```

### Security Best Practices

1. **Authentication**

   - Use JWT tokens with expiration
   - Implement refresh token rotation
   - Hash passwords with bcrypt
   - Validate all inputs

2. **API Security**

   - Use HTTPS in production
   - Implement rate limiting
   - Validate and sanitize inputs
   - Use CORS properly

3. **Database Security**
   - Use environment variables for credentials
   - Implement proper indexing
   - Regular backups
   - Monitor for suspicious activity

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string
echo $MONGODB_URI
```

#### 2. Port Conflicts

```bash
# Check what's running on ports
lsof -i :3000
lsof -i :3001
lsof -i :5000

# Kill processes if needed
kill -9 <PID>
```

#### 3. Environment Variable Issues

```bash
# Check if .env files exist
ls -la backend/.env
ls -la admin/.env

# Verify environment variables are loaded
node -e "console.log(process.env.MONGODB_URI)"
```

#### 4. Build Issues

```bash
# Clear node_modules and reinstall
npm run clean
npm run install:all

# Clear npm cache
npm cache clean --force
```

#### 5. Authentication Issues

```bash
# Check JWT secret is set
echo $JWT_SECRET

# Verify token format in browser localStorage
# Should be: Bearer <token>
```

### Debug Mode

#### Backend Debug

```bash
cd backend
DEBUG=* npm run dev
```

#### Frontend Debug

```bash
cd frontend
REACT_APP_DEBUG=true npm start
```

### Logging

#### Backend Logs

```bash
# View application logs
tail -f backend/logs/app.log

# View error logs
tail -f backend/logs/error.log
```

#### Database Logs

```bash
# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Performance Monitoring

#### Database Performance

```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2);

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(5);
```

#### Application Performance

```bash
# Monitor Node.js performance
npm install -g clinic
clinic doctor -- node src/server.js
```

### Health Checks

#### API Health Check

```bash
curl http://localhost:5000/api/health
```

#### Database Health Check

```bash
mongo --eval "db.adminCommand('ping')"
```

### Backup and Recovery

#### Database Backup

```bash
# Create backup
mongodump --db donatetrack --out /backup/$(date +%Y%m%d)

# Restore backup
mongorestore --db donatetrack /backup/20240101/donatetrack
```

#### Application Backup

```bash
# Backup application files
tar -czf donatetrack-backup-$(date +%Y%m%d).tar.gz donatetrack/
```

## Support and Contact

### Getting Help

1. **Documentation**: Check this documentation first
2. **Issues**: Create GitHub issues for bugs
3. **Discussions**: Use GitHub discussions for questions
4. **Email**: Contact lahorivenkatesh709@gmail.com for urgent issues

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Built with ❤️ for the NGO ecosystem across India**

_Last Updated: January 2024_
