# 🚀 DonateTrack Backend API

A comprehensive Node.js backend API for the DonateTrack donation management platform. Built with Express.js, MongoDB, and designed to perfectly match your frontend requirements.

## 🏗️ **Architecture Overview**

### **Technology Stack**
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **File Upload**: Multer with Cloudinary integration
- **Logging**: Winston for structured logging
- **Security**: Helmet, CORS, Rate limiting

### **Project Structure**
```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/             # Route controllers
│   │   ├── authController.js    # Authentication logic
│   │   ├── donorController.js   # Donor-specific operations
│   │   ├── ngoController.js     # NGO-specific operations
│   │   ├── projectController.js # Project management
│   │   └── adminController.js   # Admin operations
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js     # Global error handling
│   │   └── validate.js         # Input validation
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js             # User model with roles
│   │   ├── Project.js          # Project model
│   │   ├── Donation.js         # Donation model
│   │   ├── Beneficiary.js      # Beneficiary model
│   │   ├── Proof.js            # Proof/evidence model
│   │   └── Notification.js     # Notification model
│   ├── routes/                 # API routes
│   │   ├── index.js            # Route aggregator
│   │   ├── auth.js             # Authentication routes
│   │   ├── donor.js            # Donor routes
│   │   ├── ngo.js              # NGO routes
│   │   ├── projects.js         # Project routes
│   │   └── admin.js            # Admin routes
│   ├── utils/                  # Utility functions
│   │   └── logger.js           # Winston logger setup
│   └── server.js               # Application entry point
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.0 or higher
- MongoDB 5.0 or higher
- npm or yarn package manager

### **Installation**

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Run the application**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

### 🔐 **Test Users Setup**

The backend includes seeded test users for development:

#### **Test Accounts**
- **Donor**: `donor@test.com` / `donor123`
- **NGO**: `ngo@test.com` / `ngo123`
- **Admin**: `admin@donatetrack.com` / `admin123`

#### **Database Seeding**
```bash
# Seed database with test users and sample data
npm run db:seed

# Reset database (removes all data)
npm run db:reset
```

> **Note**: Test users are automatically created when the server starts in development mode.

## 🔧 **Environment Configuration**

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/donatetrack

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📚 **API Documentation**

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication**

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### **Core Endpoints**

#### **Authentication**
```http
POST /auth/register          # User registration
POST /auth/login            # User login
POST /auth/logout           # User logout
GET  /auth/profile          # Get current user profile
PUT  /auth/profile          # Update user profile
```

#### **Donor Routes**
```http
GET  /donor/dashboard       # Get donor dashboard data
GET  /donor/donations       # Get donor's donations with pagination
GET  /donor/impact/:donationId # Get donation impact details
GET  /donor/notifications   # Get donor notifications
PUT  /donor/notifications/:id/read # Mark notification as read
POST /donor/donate          # Create new donation
```

#### **NGO Routes**
```http
GET    /ngo/dashboard       # Get NGO dashboard data
GET    /ngo/projects        # Get NGO's projects
POST   /ngo/projects        # Create new project
PUT    /ngo/projects/:id    # Update project
DELETE /ngo/projects/:id    # Delete project
POST   /ngo/proof-upload    # Upload proof/evidence
GET    /ngo/beneficiaries   # Get beneficiaries
POST   /ngo/beneficiaries   # Create beneficiary
PUT    /ngo/beneficiaries/:id # Update beneficiary
DELETE /ngo/beneficiaries/:id # Delete beneficiary
```

#### **Projects (Public)**
```http
GET  /projects              # Get all active projects (public)
GET  /projects/:id          # Get single project details (public)
POST /projects/:id/donate   # Donate to project (authenticated)
```

#### **Admin Routes**
```http
GET    /admin/analytics     # Get platform analytics
GET    /admin/users         # Get all users with pagination
PUT    /admin/users/:id     # Update user
DELETE /admin/users/:id     # Delete user
GET    /admin/reports       # Get reports
GET    /admin/reports/export/:type # Export reports
```

### **Response Format**

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // For validation errors
}
```

## 🗄️ **Database Models**

### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: ['donor', 'ngo', 'admin'],
  organization: String (required for NGOs),
  avatar: String,
  isActive: Boolean,
  emailVerified: Boolean,
  lastLogin: Date,
  // ... timestamps
}
```

### **Project Model**
```javascript
{
  name: String,
  description: String,
  ngoId: ObjectId (ref: User),
  category: ['water', 'education', 'food', 'medical', 'shelter', 'environment'],
  targetAmount: Number,
  currentAmount: Number,
  location: String,
  status: ['active', 'completed', 'cancelled', 'paused'],
  endDate: Date,
  images: [{ url, caption }],
  beneficiaries: [ObjectId],
  proofs: [ObjectId],
  urgency: ['low', 'medium', 'high', 'critical'],
  // ... timestamps and virtuals
}
```

### **Donation Model**
```javascript
{
  donorId: ObjectId (ref: User),
  projectId: ObjectId (ref: Project),
  amount: Number,
  currency: String,
  status: ['pending', 'allocated', 'used', 'refunded'],
  purpose: String,
  transactionId: String (unique),
  paymentMethod: String,
  message: String,
  isAnonymous: Boolean,
  usedAt: Date,
  allocatedAt: Date,
  proofs: [ObjectId],
  // ... timestamps
}
```

### **Beneficiary Model**
```javascript
{
  projectId: ObjectId (ref: Project),
  name: String,
  age: Number,
  location: String,
  category: ['individual', 'family', 'community'],
  isAnonymized: Boolean,
  aidReceived: [{
    donationId: ObjectId,
    amount: Number,
    date: Date,
    type: String,
    description: String
  }],
  photos: [{ url, caption, uploadedAt }],
  story: String,
  contactInfo: { phone, email, address },
  // ... timestamps and virtuals
}
```

### **Proof Model**
```javascript
{
  projectId: ObjectId (ref: Project),
  donationIds: [ObjectId],
  type: ['photo', 'receipt', 'document', 'video'],
  title: String,
  description: String,
  fileUrl: String,
  thumbnailUrl: String,
  uploadedBy: ObjectId (ref: User),
  verificationStatus: ['pending', 'verified', 'rejected'],
  verifiedBy: ObjectId,
  verifiedAt: Date,
  rejectionReason: String,
  metadata: { fileSize, mimeType, originalName },
  tags: [String],
  location: String,
  beneficiaries: [ObjectId],
  // ... timestamps
}
```

### **Notification Model**
```javascript
{
  userId: ObjectId (ref: User),
  type: ['proof_uploaded', 'impact_update', 'donation_used', ...],
  title: String,
  message: String,
  donationId: ObjectId,
  projectId: ObjectId,
  proofId: ObjectId,
  isRead: Boolean,
  readAt: Date,
  priority: ['low', 'medium', 'high'],
  actionUrl: String,
  metadata: Mixed,
  // ... timestamps
}
```

## 🔐 **Security Features**

### **Authentication & Authorization**
- JWT-based authentication with secure token generation
- Role-based access control (Donor, NGO, Admin)
- Password hashing with bcrypt
- Protected routes with middleware

### **Security Middleware**
- **Helmet**: Security headers protection
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Request rate limiting per IP
- **Input Validation**: Comprehensive input sanitization using express-validator

### **Data Protection**
- Sensitive data encryption
- Secure password handling
- Input validation and sanitization

## 📊 **Key Features Implemented**

### **For Donors**
- Complete dashboard with donation statistics
- Donation history with impact tracking
- Real-time notifications for proof uploads
- Donation impact visualization
- Anonymous donation support

### **For NGOs**
- Project management (CRUD operations)
- Proof/evidence upload system
- Beneficiary management
- Dashboard with project statistics
- Donation tracking and allocation

### **For Admins**
- Platform-wide analytics
- User management
- Report generation
- System monitoring

### **Transparency Features**
- Proof upload and verification system
- Beneficiary tracking
- Donation allocation and usage tracking
- Real-time notifications
- Impact measurement

## 🚀 **Deployment**

### **Production Setup**

1. **Environment Configuration**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
# ... other production variables
```

2. **Process Management**
```bash
# Using PM2
npm install -g pm2
pm2 start src/server.js --name "donatetrack-api"
pm2 startup
pm2 save
```

3. **Health Monitoring**
- Health check endpoint: `GET /health`
- Application logging with Winston
- Error tracking and monitoring

## 🧪 **Testing**

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📈 **Performance Features**

- Database indexing for optimal query performance
- Pagination for large datasets
- Efficient aggregation pipelines
- Request rate limiting
- Response compression

## 🔄 **API Integration with Frontend**

This backend is specifically designed to work seamlessly with your existing frontend:

1. **Authentication**: Matches your AuthContext implementation
2. **Data Structure**: Aligns with your mockApi and mockData
3. **Endpoints**: Supports all frontend features including:
   - Donor dashboard with statistics
   - Project browsing and donation
   - NGO project management
   - Proof upload and verification
   - Beneficiary tracking
   - Notification system

## 📝 **Getting Started with Frontend Integration**

1. **Update your frontend API configuration**:
```javascript
// In your frontend .env
REACT_APP_API_URL=http://localhost:5000
```

2. **Replace mock API calls** with real API calls:
```javascript
// Instead of mockApi, use the real API endpoints
import api from './services/api';
```

3. **Test the integration**:
```bash
# Start backend
cd backend && npm run dev

# Start frontend (in another terminal)
cd frontend && npm start
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Follow coding standards and add tests
4. Submit pull request with detailed description

## 📄 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ to perfectly complement your DonateTrack frontend**

*Ready for production deployment and seamless frontend integration*