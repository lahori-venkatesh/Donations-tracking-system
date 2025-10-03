# 🔧 DonateTrack Admin Panel

A comprehensive admin dashboard for managing the DonateTrack donation platform with complete oversight of users, projects, donations, and system operations.

## 🚀 Features

- **Dashboard Overview**: Real-time metrics, growth analytics, and system alerts
- **User Management**: Complete user database with role-based management
- **Project Management**: Project oversight with approval workflows
- **Donation Management**: Transaction monitoring with fraud detection
- **Verification Queue**: NGO and project verification system
- **Advanced Analytics**: Performance metrics and trend analysis
- **Reports & Exports**: Custom report generation in multiple formats
- **System Settings**: Platform configuration and security settings

## 🏗️ Architecture

### Separate Deployment
This admin panel is designed to be deployed separately from the main frontend, allowing for:
- Independent scaling and updates
- Enhanced security isolation
- Dedicated admin infrastructure
- Separate domain/subdomain hosting

### Technology Stack
- **React 18+** with modern hooks and context
- **Tailwind CSS** for responsive styling
- **Chart.js** for data visualization
- **Heroicons** for consistent iconography
- **React Router** for client-side routing

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Access to the DonateTrack backend API
- Admin user credentials

### Setup Steps

1. **Clone and Install**:
   ```bash
   cd admin
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ADMIN_TITLE=DonateTrack Admin Panel
   ```

3. **Install Tailwind CSS**:
   ```bash
   npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
   npx tailwindcss init -p
   ```

4. **Start Development Server**:
   ```bash
   npm start
   ```

5. **Access Admin Panel**:
   ```
   http://localhost:3001
   ```

### 🔐 **Admin Login**

Use these credentials to access the admin panel:

- **Email**: `admin@donatetrack.com`
- **Password**: `admin123`

#### **Quick Access Steps**
1. Navigate to http://localhost:3001
2. Click "Login" or you'll be redirected automatically
3. Enter the admin credentials above
4. Explore the admin dashboard features

> **Note**: This is a development-only admin account for testing purposes.

## 🔐 Authentication

### Admin Login
- Navigate to `/login` (or root `/`)
- Use admin credentials from your backend
- Only users with `role: 'admin'` can access

### Security Features
- JWT token-based authentication
- Automatic token validation
- Session timeout handling
- Role-based route protection

## 📊 Components Overview

### Core Components
```
src/
├── components/
│   ├── AdminStats.js          # Dashboard overview
│   ├── UserManagement.js      # User administration
│   ├── ProjectManagement.js   # Project oversight
│   ├── DonationManagement.js  # Transaction management
│   ├── VerificationQueue.js   # Approval workflows
│   ├── AnalyticsPanel.js      # Advanced analytics
│   ├── ReportsPanel.js        # Report generation
│   └── SystemSettings.js      # Configuration panel
├── contexts/
│   └── AuthContext.js         # Authentication state
├── pages/
│   ├── AdminDashboard.js      # Main dashboard
│   └── LoginPage.js           # Admin login
└── App.js                     # Root component
```

### API Integration
The admin panel connects to your existing backend:
```javascript
// Example API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Dashboard data
GET /api/admin/dashboard
GET /api/admin/analytics
GET /api/admin/users
PUT /api/admin/users/:id/status
```

## 🎨 Customization

### Branding
Update `tailwind.config.js` for custom colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#your-primary-color',
        700: '#your-primary-dark',
      }
    }
  }
}
```

### Environment Variables
```env
REACT_APP_API_URL=https://api.yourcompany.com/api
REACT_APP_ADMIN_TITLE=Your Company Admin
REACT_APP_COMPANY_NAME=Your Company
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel)
```bash
# Build and deploy
npm run build
# Upload dist folder to your hosting provider
```

#### 2. Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name admin.yourcompany.com;
    
    location / {
        root /var/www/admin/build;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://your-backend-server:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Configuration

### Backend Integration
Ensure your backend has the admin routes:
```javascript
// backend/src/routes/admin.js
router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.put('/users/:userId/status', adminController.manageUserStatus);
// ... other admin routes
```

### CORS Configuration
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',  // Main frontend
    'http://localhost:3001',  // Admin panel
    'https://admin.yourcompany.com'  // Production admin
  ]
}));
```

## 📱 Responsive Design

The admin panel is fully responsive:
- **Mobile**: Stacked layouts, touch-optimized
- **Tablet**: Grid layouts, collapsible navigation
- **Desktop**: Full feature set, multi-column layouts

## 🔒 Security Best Practices

### Implemented Security
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- XSS protection
- CSRF protection

### Recommended Additional Security
- HTTPS enforcement
- Rate limiting
- IP whitelisting for admin access
- Two-factor authentication
- Regular security audits

## 📈 Performance Optimization

### Built-in Optimizations
- Code splitting with React.lazy
- Component memoization
- Debounced search inputs
- Lazy loading for large datasets
- Optimized chart rendering

### Production Optimizations
```javascript
// webpack.config.js optimizations
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Testing
```bash
# Install Cypress
npm install --save-dev cypress

# Run tests
npx cypress open
```

## 📚 API Documentation

### Required Backend Endpoints
```
GET  /api/admin/dashboard           # Dashboard metrics
GET  /api/admin/analytics           # Analytics data
GET  /api/admin/users               # User management
PUT  /api/admin/users/:id/status    # User status management
GET  /api/admin/projects            # Project management
PUT  /api/admin/projects/:id/status # Project status management
GET  /api/admin/donations           # Donation management
GET  /api/admin/verification-queue  # Verification queue
GET  /api/admin/reports             # Report generation
GET  /api/admin/settings            # System settings
PUT  /api/admin/settings            # Update settings
```

## 🔄 Updates and Maintenance

### Regular Updates
- Security patches
- Dependency updates
- Feature enhancements
- Bug fixes

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User activity analytics
- System health checks

## 🆘 Troubleshooting

### Common Issues

1. **API Connection Failed**
   ```bash
   # Check API URL in .env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. **Authentication Issues**
   ```javascript
   // Clear localStorage and retry
   localStorage.removeItem('adminToken');
   ```

3. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

### Getting Help
- Check the troubleshooting section
- Review backend API logs
- Verify admin user permissions
- Check network connectivity

### Development
- Use browser dev tools for debugging
- Check console for error messages
- Verify API responses in Network tab

## 🎯 Future Enhancements

### Planned Features
- Real-time notifications with WebSocket
- Advanced fraud detection with ML
- Multi-language support
- Dark mode theme
- Mobile app version

### Integration Opportunities
- Third-party analytics platforms
- External verification services
- Email marketing integration
- Social media management

---

## 📄 License

This admin panel is part of the DonateTrack platform. Please refer to the main project license.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for transparent and efficient platform management**

*Last Updated: January 2024*