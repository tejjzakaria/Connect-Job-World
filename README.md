# 🌍 Connect Job World

> **A comprehensive immigration services management platform** that connects clients with professional immigration services for US Lottery, Canada Immigration, Work Visas, Study Abroad programs, Family Reunion, and Soccer Talent migration.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Admin Dashboard](#-admin-dashboard)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Connect Job World** is a full-stack web application designed to streamline immigration services management. The platform provides:

- 🌐 **Public Website**: Informative landing page with service details, country comparisons, testimonials, and contact forms
- 🔐 **Admin Dashboard**: Secure management portal for handling clients, submissions, documents, and employees
- 📱 **Multi-language Support**: Available in Arabic, French, and English with RTL support
- 📄 **Document Management**: Upload, review, and verify client documents with status tracking
- 📊 **Analytics**: Real-time insights into submissions, conversion rates, and performance metrics
- 🔔 **Notifications**: Automated WhatsApp notifications via Twilio integration
- 🔍 **Application Tracking**: Public-facing application status checker

---

## ✨ Key Features

### 🌟 Public Website Features

- **Hero Section**: Eye-catching landing with call-to-action buttons
- **Service Showcase**: Detailed information about 6 immigration services
  - 🎰 US Lottery (DV Lottery Program)
  - 🍁 Canada Immigration
  - 💼 Work Visa Services
  - 🎓 Study Abroad Programs
  - 👨‍👩‍👧‍👦 Family Reunion
  - ⚽ Soccer Talent Migration
- **Country Comparison**: Interactive comparison between USA, Canada, and European countries
- **Document Checklist**: Required documents for each service type
- **Process Flow**: Step-by-step guide for application process
- **Testimonials**: Client success stories with ratings
- **FAQ Section**: Frequently asked questions with answers
- **Contact Form**: Lead capture with Google Sheets integration
- **Application Tracker**: Public page to check submission status

### 🛠️ Admin Dashboard Features

#### 📊 Dashboard
- Overview statistics (total clients, submissions, completion rate)
- Recent submissions table with quick actions
- Success rate analytics

#### 👥 Client Management
- Add, edit, and delete clients
- Client detail pages with document preview
- Status tracking (New, In Review, Completed, Rejected)
- Filter by service type and status
- Export capabilities

#### 📝 Submission Management
- View all incoming submissions
- Filter by service, status, and source (Google Sheets, Website)
- Generate secure document upload links
- Convert submissions to clients
- Call confirmation tracking
- WhatsApp notification integration

#### 📑 Document Management
- Upload and organize client documents
- Document verification system (Verified, Rejected, Needs Replacement)
- Document preview (PDF and images)
- Download capabilities
- Add verification notes and rejection reasons
- Document status tracking

#### 👔 Employee Management
- Create and manage admin users
- Role-based access control (Admin, Manager, Employee)
- Employee activity tracking

#### 📈 Analytics
- Service-wise breakdown charts
- Submission trends over time
- Conversion rate metrics
- Source analysis (Google Sheets vs Website)

#### ⚙️ Settings
- System information
- Database connection status
- Server health monitoring
- Configuration management

#### 📖 Documentation
- Built-in user guide
- Feature explanations
- Quick reference guides

#### 👤 Profile Management
- Update personal information
- Change password
- View last login details

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool & dev server
- **React Router 6** - Client-side routing
- **TanStack Query** - Data fetching & caching
- **Tailwind CSS 3.4** - Utility-first CSS
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **i18next** - Internationalization
- **Recharts** - Analytics charts
- **date-fns** - Date manipulation

### Backend
- **Node.js** - Runtime environment
- **Express 4.19** - Web framework
- **MongoDB 6** - NoSQL database
- **Mongoose 8.4** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Twilio** - WhatsApp notifications
- **CORS** - Cross-origin resource sharing

### DevOps & Tools
- **PM2** - Process manager for production
- **Nodemon** - Development auto-reload
- **Concurrently** - Run multiple commands
- **ESLint** - Code linting
- **Vercel Analytics** - Usage analytics

---

## 📁 Project Structure

```
Connect Job World/
├── 📂 src/                          # Frontend source code
│   ├── 📂 components/               # React components
│   │   ├── 📂 admin/               # Admin-specific components
│   │   │   ├── DashboardLayout.tsx # Admin layout wrapper
│   │   │   ├── DocumentPreview.tsx # Document viewer
│   │   │   └── NotificationsDropdown.tsx
│   │   ├── 📂 ui/                  # shadcn/ui components
│   │   ├── ContactForm.tsx         # Lead capture form
│   │   ├── Countries.tsx           # Country showcase
│   │   ├── CountryComparison.tsx   # Interactive comparison
│   │   ├── DocumentChecklist.tsx   # Required docs list
│   │   ├── FAQ.tsx                 # Questions & answers
│   │   ├── Footer.tsx              # Site footer
│   │   ├── Header.tsx              # Site navigation
│   │   ├── Hero.tsx                # Landing hero section
│   │   ├── LanguageSwitcher.tsx    # i18n language switcher
│   │   ├── Process.tsx             # Application process
│   │   ├── Services.tsx            # Service cards
│   │   ├── Testimonials.tsx        # Client reviews
│   │   └── WhyChooseUs.tsx         # Value propositions
│   │
│   ├── 📂 pages/                    # Page components
│   │   ├── 📂 admin/               # Admin pages
│   │   │   ├── AddClient.tsx       # Create new client
│   │   │   ├── Analytics.tsx       # Analytics dashboard
│   │   │   ├── ClientDetail.tsx    # Client details view
│   │   │   ├── Clients.tsx         # Client list
│   │   │   ├── Dashboard.tsx       # Admin home
│   │   │   ├── Documentation.tsx   # User guide
│   │   │   ├── EditClient.tsx      # Edit client form
│   │   │   ├── Employees.tsx       # Employee management
│   │   │   ├── Profile.tsx         # User profile
│   │   │   ├── Settings.tsx        # System settings
│   │   │   ├── SignIn.tsx          # Admin login
│   │   │   ├── SubmissionDocuments.tsx # Document manager
│   │   │   └── Submissions.tsx     # Submission list
│   │   ├── 📂 public/              # Public pages
│   │   │   └── TrackApplication.tsx # Track submission
│   │   ├── DocumentUpload.tsx      # Public doc upload
│   │   ├── Index.tsx               # Homepage
│   │   └── NotFound.tsx            # 404 page
│   │
│   ├── 📂 lib/                      # Utilities & config
│   │   ├── api.ts                  # API client functions
│   │   ├── dateUtils.ts            # Date formatting
│   │   ├── i18n.ts                 # Translations (AR/FR/EN)
│   │   └── utils.ts                # Helper functions
│   │
│   ├── 📂 contexts/                 # React contexts
│   │   └── AuthContext.tsx         # Authentication state
│   │
│   ├── 📂 hooks/                    # Custom hooks
│   │   └── use-toast.ts            # Toast notifications
│   │
│   ├── App.tsx                     # App entry & routing
│   └── main.tsx                    # React DOM entry
│
├── 📂 server/                       # Backend source code
│   ├── 📂 config/                   # Configuration files
│   │   └── database.js             # MongoDB connection
│   │
│   ├── 📂 models/                   # Mongoose schemas
│   │   ├── ActivityLog.js          # Activity logging
│   │   ├── Client.js               # Client schema
│   │   ├── Document.js             # Document schema
│   │   ├── DocumentLink.js         # Upload link schema
│   │   ├── Notification.js         # Notification schema
│   │   ├── Submission.js           # Submission schema
│   │   └── User.js                 # User/Employee schema
│   │
│   ├── 📂 routes/                   # API endpoints
│   │   ├── analytics.js            # Analytics routes
│   │   ├── auth.js                 # Authentication
│   │   ├── clients.js              # Client CRUD
│   │   ├── contacts.js             # Contact form
│   │   ├── documents.js            # Document management
│   │   ├── notifications.js        # Notifications
│   │   ├── submissions.js          # Submission CRUD
│   │   └── users.js                # User management
│   │
│   ├── 📂 middleware/               # Express middleware
│   │   └── auth.js                 # JWT verification
│   │
│   ├── 📂 services/                 # Business logic
│   │   └── twilioService.js        # WhatsApp messaging
│   │
│   ├── 📂 utils/                    # Utilities
│   │   └── logger.js               # Logging utility
│   │
│   ├── 📂 uploads/                  # File storage
│   │
│   ├── server.js                   # Development server
│   └── server.production.js        # Production server
│
├── 📂 public/                       # Static assets
├── .env                            # Environment variables
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind CSS config
├── vite.config.ts                  # Vite configuration
├── ecosystem.config.cjs            # PM2 configuration
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm)
- **npm** or **yarn** package manager
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud) or local installation
- **Git** - For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd "Connect Job World"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables) section):
   ```bash
   cp .env.example .env
   # Then edit .env with your actual values
   ```

4. **Start the development server**

   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev:all
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Frontend (Vite dev server)
   npm run dev

   # Terminal 2 - Backend (Express API)
   npm run server
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5001/api
   - Admin Dashboard: http://localhost:8080/admin

### Default Admin Credentials

**⚠️ Important**: Change these credentials after first login!

```
Email: admin@connectjobworld.com
Password: admin123
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (used for CORS)
FRONTEND_URL=http://localhost:8080

# API URL (used by frontend to connect to backend)
VITE_API_URL=http://localhost:5001/api

# Google Sheets Integration (optional)
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Twilio Configuration (for WhatsApp notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Environment Variable Details

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT token generation | ✅ Yes |
| `PORT` | Backend server port | ✅ Yes |
| `NODE_ENV` | Environment (development/production) | ✅ Yes |
| `FRONTEND_URL` | Frontend application URL | ✅ Yes |
| `VITE_API_URL` | Backend API URL | ✅ Yes |
| `VITE_GOOGLE_SHEETS_URL` | Google Sheets webhook URL | ❌ Optional |
| `TWILIO_ACCOUNT_SID` | Twilio account identifier | ❌ Optional |
| `TWILIO_AUTH_TOKEN` | Twilio authentication token | ❌ Optional |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp number | ❌ Optional |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication
Most admin endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### 🔐 Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

#### 👥 Clients
- `GET /api/clients` - Get all clients (with filters)
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

#### 📝 Submissions
- `GET /api/submissions` - Get all submissions (with filters)
- `GET /api/submissions/:id` - Get submission by ID
- `POST /api/submissions` - Create submission
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission
- `POST /api/submissions/:id/convert` - Convert to client
- `POST /api/submissions/:id/generate-link` - Generate upload link

#### 📄 Documents
- `GET /api/documents/submission/:submissionId` - Get submission documents
- `GET /api/documents/:id/preview` - Preview document
- `GET /api/documents/:id/download` - Download document
- `POST /api/documents/upload` - Upload documents
- `PUT /api/documents/:id/verify` - Verify document
- `DELETE /api/documents/:id` - Delete document

#### 👔 Users/Employees
- `GET /api/users` - Get all employees
- `POST /api/users` - Create employee
- `PUT /api/users/:id` - Update employee
- `DELETE /api/users/:id` - Delete employee

#### 📊 Analytics
- `GET /api/analytics/stats` - Get dashboard statistics
- `GET /api/analytics/submissions-by-service` - Service breakdown
- `GET /api/analytics/submissions-over-time` - Time-based trends

#### 🔔 Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/clear-read` - Clear read notifications

#### 📞 Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all contact submissions

---

## 🎛️ Admin Dashboard

### Access & Login
1. Navigate to `/admin` or `/admin/login`
2. Enter credentials
3. Upon successful login, redirected to dashboard

### Main Sections

#### 📊 Dashboard (`/admin/dashboard`)
- Quick statistics overview
- Recent submissions table
- Quick actions

#### 👥 Clients (`/admin/clients`)
- **List View**: Searchable, filterable client table
- **Add Client**: Form to manually add clients
- **Client Details**: View full client information and documents
- **Edit Client**: Update client information
- **Delete Client**: Remove client (with confirmation)

#### 📝 Submissions (`/admin/submissions`)
- **List View**: All incoming submissions
- **Filters**: By service, status, source
- **Actions**:
  - Generate upload link
  - Convert to client
  - Mark as called
  - Delete submission
- **Document Management**: Navigate to submission documents

#### 📑 Documents (`/admin/submissions/:id/documents`)
- **View Documents**: All documents for a submission
- **Preview**: PDF and image preview
- **Download**: Download original files
- **Verify**: Mark as verified/rejected/needs replacement
- **Add Notes**: Verification notes and rejection reasons

#### 👔 Employees (`/admin/employees`)
- **List View**: All admin users
- **Create**: Add new employees
- **Edit**: Update employee details
- **Delete**: Remove employees
- **Roles**: Admin, Manager, Employee

#### 📈 Analytics (`/admin/analytics`)
- Service distribution charts
- Submission trends
- Conversion metrics
- Source analysis

#### ⚙️ Settings (`/admin/settings`)
- System information
- Database status
- Server health
- Configuration

#### 📖 Documentation (`/admin/documentation`)
- User guide
- Feature documentation
- Quick reference

#### 👤 Profile (`/admin/profile`)
- Update name and email
- Change password
- View last login

---

## 🌐 Multi-language Support

The application supports three languages:

- 🇸🇦 **Arabic** (العربية) - RTL layout
- 🇫🇷 **French** (Français)
- 🇬🇧 **English**

### Language Switcher
- Available on all public pages
- Admin dashboard inherits system language
- Automatic RTL/LTR layout switching
- Persists in localStorage

### Adding Translations
Edit `/src/lib/i18n.ts`:

```typescript
const resources = {
  ar: { translation: { ... } },
  fr: { translation: { ... } },
  en: { translation: { ... } }
};
```

---

## 🚢 Deployment

### Production Build

1. **Build the frontend**
   ```bash
   npm run build:prod
   ```

2. **Set environment to production**
   ```bash
   export NODE_ENV=production
   ```

3. **Start with PM2** (recommended)
   ```bash
   npm run pm2:start
   ```

### PM2 Commands

```bash
# Start application
npm run pm2:start

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# View logs
npm run pm2:logs

# Monitor
npm run pm2:monit

# Full deploy (build + restart)
npm run deploy
```

### Environment-Specific Scripts

- `npm run dev` - Development frontend only
- `npm run server` - Development backend only
- `npm run dev:all` - Both frontend and backend
- `npm run build` - Production build
- `npm start` - Production server
- `npm run start:prod` - Production with NODE_ENV set

### Deployment Platforms

#### Vercel (Frontend)
```bash
npm run vercel-build
```

#### Heroku / Railway / Render (Full-stack)
- Set environment variables
- Use `npm start` as start command
- Ensure `PORT` is set correctly

#### VPS / EC2 (Self-hosted)
- Use PM2 for process management
- Set up nginx reverse proxy
- Enable firewall rules
- Set up SSL with Let's Encrypt

---

## 📦 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (frontend only) |
| `npm run server` | Start Express server (backend only) |
| `npm run dev:all` | Start both frontend and backend |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run build:prod` | Build for production with env |
| `npm start` | Start production server |
| `npm run start:prod` | Start production with NODE_ENV |
| `npm run pm2:start` | Start with PM2 |
| `npm run pm2:stop` | Stop PM2 process |
| `npm run pm2:restart` | Restart PM2 process |
| `npm run pm2:logs` | View PM2 logs |
| `npm run pm2:monit` | Monitor with PM2 |
| `npm run deploy` | Full production deployment |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## 🔧 Configuration Files

### `vite.config.ts`
Frontend build configuration

### `tsconfig.json`
TypeScript compiler options

### `tailwind.config.ts`
Tailwind CSS customization

### `ecosystem.config.cjs`
PM2 process manager configuration

### `.env`
Environment variables (not committed to Git)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Follow TypeScript best practices
- Use ESLint for linting
- Format with Prettier
- Write meaningful commit messages

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cannot connect to MongoDB
- **Solution**: Check MONGODB_URI in .env file
- Ensure IP is whitelisted in MongoDB Atlas

**Issue**: JWT authentication fails
- **Solution**: Verify JWT_SECRET is set
- Check token expiration

**Issue**: File uploads not working
- **Solution**: Ensure `uploads/` folder exists
- Check file size limits in multer config

**Issue**: WhatsApp notifications not sent
- **Solution**: Verify Twilio credentials
- Check WhatsApp sandbox setup

**Issue**: Port already in use
- **Solution**: Change PORT in .env
- Kill process using the port

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Development Team

Built with ❤️ by tejjzakaria

---

## 📞 Support

For support and queries:
- 📧 Email: support@connectjobworld.com
- 🌐 Website: [connectjobworld.com](https://connectjobworld.com)
- 📱 WhatsApp: +31682057991

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting & analytics

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star!**

Made with ❤️ for seamless immigration services

</div>
