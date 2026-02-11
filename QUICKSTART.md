# Event Management System - Quick Start Guide

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] npm or yarn installed

## Quick Setup (5 minutes)

### Option 1: Automated Setup
```bash
cd event-management-system
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Backend runs on: http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
✅ Frontend runs on: http://localhost:3000

## First Time Usage

### 1. Register Admin Account
- Go to: http://localhost:3000/register
- Username: `admin`
- Password: `admin123` (min 6 chars)
- Role: Select **Admin**
- Click **Register**

### 2. Register User Account
- Go to: http://localhost:3000/register
- Username: `user`
- Password: `user123` (min 6 chars)
- Role: Select **User**
- Click **Register**

### 3. Login & Explore
- Login with admin account
- Access all features including Maintenance
- Try adding a membership
- Update membership
- View reports

## Key Features to Test

### As Admin:
1. **Add Membership**
   - Dashboard → Maintenance → Add Membership
   - Fill all fields (all mandatory)
   - Select membership type (default: 6 months)
   - Submit

2. **Update Membership**
   - Dashboard → Maintenance → Update Membership
   - Enter membership number (e.g., MEM000001)
   - Search → Extend or Cancel

3. **View Reports**
   - Dashboard → Reports
   - Check membership, events, registration reports

### As User:
1. **Limited Access**
   - Cannot access Maintenance
   - Can access Transactions and Reports

2. **View Dashboard**
   - See statistics
   - Navigate to allowed sections

## Common Issues & Solutions

### MongoDB not running
```bash
# Start MongoDB
sudo service mongod start

# Check status
sudo service mongod status
```

### Port 5000 already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Cannot login after registration
- Check MongoDB is running
- Check backend console for errors
- Verify .env file has correct MONGODB_URI

## Project Structure Overview

```
event-management-system/
├── backend/          # Express.js API
│   ├── models/      # Database models
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth middleware
│   └── server.js    # Entry point
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/   # All pages
│   │   ├── context/ # Auth context
│   │   └── utils/   # API utility
│   └── public/
└── README.md        # Full documentation
```

## Default Validations

### Add Membership:
- ✅ All fields mandatory
- ✅ Contact: 10 digits only
- ✅ Email: Valid format
- ✅ Membership type: 6 months default

### Login/Register:
- ✅ Password: Min 6 characters
- ✅ Username: Required
- ✅ Role: Radio button selection

## Access Control

| Feature | Admin | User |
|---------|-------|------|
| Maintenance | ✅ | ❌ |
| Transactions | ✅ | ✅ |
| Reports | ✅ | ✅ |

## Next Steps

1. ✅ Complete setup
2. ✅ Create admin and user accounts
3. ✅ Test all features
4. 📖 Read full README.md for detailed information
5. 🚀 Start building!

## Need Help?

- Check the main README.md for detailed documentation
- Review troubleshooting section
- Check API endpoints in README
- Verify all environment variables

## Application Flow

```
Login/Register → Dashboard
    ↓
Admin: Maintenance → Add/Update Membership/Events
    ↓
Both: Transactions → Register/Cancel Events
    ↓
Both: Reports → View All Reports
```

---

**Remember**: 
- All passwords are hidden during input ✅
- Radio buttons = single selection ✅
- Session management is active ✅
- Form validations are implemented ✅

Happy Coding! 🎉
