# DonateTrack 🌟

A comprehensive donation tracking and management platform connecting donors with verified NGOs across India. Built with modern web technologies to ensure transparency, security, and seamless user experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

DonateTrack is a full-stack donation management platform designed to bridge the gap between generous donors and impactful NGOs across India. The platform ensures transparency, provides real-time tracking, and offers comprehensive analytics for both donors and organizations.

### Key Objectives

- **Transparency**: Complete visibility into donation usage and impact
- **Security**: Secure payment processing and data protection
- **Verification**: Rigorous NGO verification process
- **Analytics**: Detailed insights and reporting capabilities
- **User Experience**: Intuitive interfaces for all user types

## ✨ Features

### For Donors

- 🔍 **Project Discovery**: Browse and search verified donation projects
- 💳 **Secure Payments**: Multiple payment gateway integration
- 📊 **Donation Tracking**: Real-time updates on donation usage
- 🏆 **Leaderboards**: Community engagement and recognition
- 📱 **Mobile Responsive**: Seamless experience across all devices

### For NGOs

- ✅ **Verification System**: Comprehensive organization verification
- 📈 **Project Management**: Create and manage fundraising campaigns
- 📊 **Analytics Dashboard**: Detailed performance metrics
- 💬 **Donor Communication**: Direct interaction with supporters
- 📋 **Compliance Tools**: Automated reporting and documentation

### For Administrators

- 🛡️ **User Management**: Complete user lifecycle management
- 🔍 **Verification Queue**: NGO application review and approval
- 📊 **System Analytics**: Platform-wide performance metrics
- ⚙️ **System Settings**: Platform configuration and maintenance
- 🚨 **Monitoring Tools**: Real-time system health monitoring

## 🛠️ Tech Stack

### Frontend

- **React.js** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js** - Data visualization

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing

### Admin Panel

- **React.js** - Separate admin interface
- **Tailwind CSS** - Consistent styling
- **Chart.js** - Analytics visualization
- **React Router** - Admin routing

### DevOps & Tools

- **Git** - Version control
- **npm** - Package management
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
DonateTrack/
├── frontend/          # User-facing React application
├── backend/           # Node.js API server
├── admin/            # Admin panel React application
├── docs/             # Documentation files
├── README.md         # Main project documentation
└── package.json      # Root package configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/venkatesh/donatetrack.git
   cd donatetrack
   ```

2. **Install dependencies for all modules**

   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install

   # Admin Panel
   cd ../admin && npm install
   ```

3. **Complete setup (environment + database)**
   ```bash
   npm run setup
   ```

4. **Or setup manually:**
   ```bash
   # Copy environment templates
   npm run setup:env
   
   # Configure your environment files (see Configuration section)
   # Then seed the database with test users
   cd backend && npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   Or start individually:
   ```bash
   # Terminal 1 - Backend (Port 5000)
   cd backend && npm run dev

   # Terminal 2 - Frontend (Port 3000)
   cd frontend && npm start

   # Terminal 3 - Admin Panel (Port 3001)
   cd admin && npm start
   ```

## ⚙️ Configuration

### Backend Configuration

Update `backend/.env` with your settings:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/donatetrack

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Admin Panel Configuration

Update `admin/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_TITLE=DonateTrack Admin Panel
PORT=3001
```

## 📖 Usage

### Accessing the Applications

1. **User Frontend**: http://localhost:3000

   - Register as a donor
   - Browse projects
   - Make donations
   - Track contributions

2. **Admin Panel**: http://localhost:3001

   - Login: admin@donatetrack.com
   - Password: admin123
   - Manage users and projects
   - Review NGO applications
   - Monitor system analytics

3. **API Endpoints**: http://localhost:5000/api
   - RESTful API for all operations

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

### 🚀 **Quick Start (No Database Required)**

**Want to test immediately?** See [QUICK_START.md](QUICK_START.md) for instant access with test credentials!

### 🔧 **Troubleshooting Login Issues**

If you can't login with the test credentials:

1. **Quick fix** - Use development mode (no database required):
   ```bash
   cd backend && npm run start:dev
   ```

2. **Test authentication**:
   ```bash
   cd backend && npm run test:auth
   ```

3. **For more help**, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
   - JWT-based authentication
   - Comprehensive error handling

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Password reset

### Project Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project

### Donation Endpoints

- `POST /api/donations` - Create donation
- `GET /api/donations/user/:userId` - Get user donations
- `GET /api/donations/project/:projectId` - Get project donations

For complete API documentation, see [API_DOCS.md](docs/API_DOCS.md)

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Venkatesh**

- Email: lahorivenkatesh709@gmail.com
- GitHub: [@venkatesh](https://github.com/venkatesh)

### Project Links

- Repository: https://github.com/venkatesh/donatetrack
- Issues: https://github.com/venkatesh/donatetrack/issues
- Documentation: https://github.com/venkatesh/donatetrack/wiki

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this platform
- Special recognition to the NGO community for their valuable feedback
- Appreciation for the open-source community and the tools that made this possible

---

**Made with ❤️ for the NGO ecosystem across India**
