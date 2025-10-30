# MongoDB Setup Guide

This guide will help you set up MongoDB for the Connect Job World application.

## Option 1: Local MongoDB Installation

### 1. Install MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Verify Installation
```bash
mongosh
```

### 3. Create Database and Admin User (Optional)
```javascript
use connectjobworld
db.createUser({
  user: "admin",
  pwd: "your_password",
  roles: [{ role: "readWrite", db: "connectjobworld" }]
})
```

## Option 2: MongoDB Atlas (Cloud - Recommended) 

### 1. Create Account
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for a free account

### 2. Create Cluster
- Click "Build a Database"
- Choose FREE tier (M0)
- Select your preferred region
- Click "Create Cluster"

### 3. Setup Database Access
- Go to "Database Access" in the left sidebar
- Click "Add New Database User"
- Create username and password
- Grant "Read and write to any database" role

### 4. Setup Network Access
- Go to "Network Access" in the left sidebar
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Or add your specific IP address

### 5. Get Connection String
- Go back to "Database"
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password
- Replace `<dbname>` with `connectjobworld`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/connectjobworld?retryWrites=true&w=majority
```

## Environment Setup

### 1. Create .env file
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Update .env file
Edit the `.env` file with your configuration:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/connectjobworld
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/connectjobworld?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
VITE_API_URL=http://localhost:5000/api
```

## Install Dependencies

```bash
npm install
```

## Database Models

The application uses three main models:

### 1. User Model
- **Fields**: name, email, password, role, isActive, lastLogin
- **Roles**: admin, agent, viewer
- **Authentication**: Bcrypt password hashing

### 2. Client Model
- **Fields**: name, email, phone, service, status, message, date, assignedTo, notes, documents
- **Statuses**: جديد, قيد المراجعة, مكتمل, مرفوض
- **Services**: القرعة الأمريكية, الهجرة إلى كندا, تأشيرة عمل, الدراسة في الخارج, لم شمل العائلة, مواهب كرة القدم

### 3. Submission Model
- **Fields**: name, email, phone, service, message, status, source, timestamp, convertedToClient, clientId
- **Statuses**: جديد, تمت المعاينة, تم التواصل, مكتمل
- **Sources**: نموذج الموقع, واتساب, مكالمة هاتفية, بريد إلكتروني

## API Routes

### Authentication Routes
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Client Routes (Protected)
- `GET /api/clients` - Get all clients (with pagination & filters)
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `POST /api/clients/:id/notes` - Add note to client
- `GET /api/clients/stats/overview` - Get client statistics

### Submission Routes
- `POST /api/submissions` - Create submission (public)
- `GET /api/submissions` - Get all submissions (protected, with pagination & filters)
- `GET /api/submissions/:id` - Get single submission (protected)
- `PUT /api/submissions/:id` - Update submission status (protected)
- `DELETE /api/submissions/:id` - Delete submission (protected)
- `POST /api/submissions/:id/convert` - Convert submission to client (protected)
- `GET /api/submissions/stats/overview` - Get submission statistics (protected)

## Running the Application

### Development Mode (Both Frontend & Backend)
```bash
npm run dev:all
```

### Run Frontend Only
```bash
npm run dev
```

### Run Backend Only
```bash
npm run server
```

### Production Build
```bash
npm run build
```

## Create First Admin User

After starting the server, you can create the first admin user using a POST request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@connectjobworld.com",
    "password": "admin123",
    "role": "admin"
  }'
```

Or use a tool like Postman/Insomnia.

**Note:** In production, you should secure the register endpoint to require admin authentication.

## Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@connectjobworld.com",
    "password": "admin123"
  }'
```

Save the returned token for authenticated requests.

### Create Client (requires token)
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "أحمد محمد",
    "phone": "+212612345678",
    "service": "القرعة الأمريكية",
    "message": "أرغب في التسجيل في القرعة الأمريكية"
  }'
```

## Troubleshooting

### Cannot connect to MongoDB
- Ensure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check your connection string in `.env`
- For Atlas, verify IP whitelist and credentials

### Authentication errors
- Verify JWT_SECRET is set in `.env`
- Check if token is correctly included in Authorization header

### Port already in use
- Change PORT in `.env` file
- Or kill the process using the port: `lsof -ti:5000 | xargs kill -9`

## Security Notes

### Production Checklist
- [ ] Change JWT_SECRET to a strong, random string
- [ ] Use environment-specific `.env` files
- [ ] Enable MongoDB authentication
- [ ] Restrict MongoDB Atlas IP whitelist
- [ ] Use HTTPS for API requests
- [ ] Implement rate limiting
- [ ] Set up proper CORS configuration
- [ ] Secure the register endpoint
- [ ] Regular database backups
- [ ] Monitor API usage and logs

## Database Indexes

Indexes are automatically created for:
- Client: name, email, phone (text search), service, status, date
- Submission: name, email, phone, message (text search), service, status, source, timestamp

These improve query performance for searches and filters.

## Backup & Restore

### Backup Database
```bash
mongodump --uri="mongodb://localhost:27017/connectjobworld" --out=/path/to/backup
```

### Restore Database
```bash
mongorestore --uri="mongodb://localhost:27017/connectjobworld" /path/to/backup/connectjobworld
```

## Next Steps

1. Install dependencies: `npm install`
2. Set up your `.env` file with MongoDB connection
3. Create first admin user
4. Start the development server: `npm run dev:all`
5. Update frontend API calls to use the MongoDB backend
6. Test all functionality
