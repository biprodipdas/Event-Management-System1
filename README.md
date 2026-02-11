# Event Management System - MERN Stack

A comprehensive Event Management System built with MongoDB, Express.js, React, and Node.js (MERN Stack).

## Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Admin and User roles)
- Password encryption using bcrypt
- Session management
- Protected routes

### Admin Features (Maintenance Module)
- **Add Membership**: Create new memberships with all mandatory fields
  - Member Name, Contact Number (10 digits), Email, Address
  - Membership types: 6 months (default), 1 year, 2 years
  - Auto-generated membership numbers
  
- **Update Membership**: Search by membership number and:
  - Extend membership (6 months, 1 year, or 2 years)
  - Cancel membership
  - View complete membership details

- **Add Event**: Create new events with details
- **Update Event**: Modify existing events

### User & Admin Features
- **Transactions Module**:
  - Register for events
  - Cancel registrations
  
- **Reports Module**:
  - Membership reports with statistics
  - Events reports with registration counts
  - Registration reports with filters
  - Dashboard with overview statistics

### Technical Features
- Form validations on all input fields
- Radio buttons for single selection (e.g., membership type)
- Checkboxes for yes/no options
- Password masking on login/register pages
- Responsive design
- Error handling and user feedback
- RESTful API architecture

## Project Structure

```
event-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Membership.js
│   │   ├── Event.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── memberships.js
│   │   ├── events.js
│   │   ├── registrations.js
│   │   └── reports.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── AddMembership.js
    │   │   ├── UpdateMembership.js
    │   │   └── Flowchart.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
cd /path/to/your/workspace
# The project is already created at: /home/claude/event-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created) and update if needed
# The .env file should contain:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/event-management
# JWT_SECRET=your_jwt_secret_key_here_change_in_production
# NODE_ENV=development

# Start MongoDB (if not running)
# On Linux/Mac:
sudo service mongod start
# On Windows:
net start MongoDB

# Start the backend server
npm run dev
# Or for production:
npm start
```

Backend will run on: http://localhost:5000

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

Frontend will run on: http://localhost:3000

## Default Users

After starting the application, you can register new users. Here's how to create test accounts:

### Creating Admin User:
1. Go to http://localhost:3000/register
2. Username: admin
3. Password: admin123 (or your choice, minimum 6 characters)
4. Select Role: Admin
5. Click Register

### Creating Regular User:
1. Go to http://localhost:3000/register
2. Username: user
3. Password: user123 (or your choice, minimum 6 characters)
4. Select Role: User
5. Click Register

## Usage Guide

### Admin Workflow

1. **Login as Admin**
   - Navigate to http://localhost:3000/login
   - Enter admin credentials
   - Click Login

2. **Add Membership**
   - From Dashboard, click "Add Membership" under Maintenance
   - Fill all mandatory fields:
     - Member Name
     - Contact Number (10 digits)
     - Email (valid format)
     - Address
     - Select Membership Type (6 months is default)
   - Click "Add Membership"
   - Membership number will be auto-generated

3. **Update Membership**
   - From Dashboard, click "Update Membership" under Maintenance
   - Enter Membership Number
   - Click "Search"
   - View membership details
   - To extend: Select extension period (default 6 months) and click "Extend Membership"
   - To cancel: Click "Cancel Membership"

4. **View Reports**
   - Access Membership, Events, or Registration reports from Dashboard
   - View statistics and detailed data

### User Workflow

1. **Login as User**
   - Users cannot access Maintenance module
   - Can access Transactions and Reports

2. **Register for Events**
   - Navigate to Transactions → Register for Event
   - Enter membership number and select event
   - Submit registration

3. **View Reports**
   - Access all reports like admin
   - View personal registrations and event details

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (Protected)

### Memberships (Admin Only)
- POST `/api/memberships` - Add new membership
- GET `/api/memberships` - Get all memberships
- GET `/api/memberships/:membershipNumber` - Get membership by number
- PUT `/api/memberships/:membershipNumber` - Update membership
- DELETE `/api/memberships/:id` - Delete membership

### Events (Admin Only for Create/Update)
- POST `/api/events` - Create event
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get event by ID
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event

### Registrations
- POST `/api/registrations` - Register for event
- GET `/api/registrations` - Get all registrations
- GET `/api/registrations/member/:membershipNumber` - Get by member
- GET `/api/registrations/event/:eventId` - Get by event
- PUT `/api/registrations/:id` - Update registration
- DELETE `/api/registrations/:id` - Cancel registration

### Reports
- GET `/api/reports/memberships` - Membership report
- GET `/api/reports/events` - Events report
- GET `/api/reports/registrations` - Registration report
- GET `/api/reports/dashboard` - Dashboard statistics

## Validation Rules

### Add Membership Form:
- All fields are mandatory
- Contact Number: Exactly 10 digits
- Email: Valid email format
- Membership Type: One of 6months/1year/2years (radio button)
- Default: 6 months selected

### Update Membership:
- Membership Number: Mandatory for search
- Extension Type: Default 6 months (radio button)
- Action: Either extend or cancel

### Registration:
- Username: Required, minimum 3 characters
- Password: Required, minimum 6 characters
- Role: User or Admin (radio button)

## Important Notes

1. **Maintenance Module**: Only accessible by Admin users
2. **Session Management**: JWT tokens expire after 30 days
3. **Password Security**: Passwords are hashed before storage
4. **Radio Buttons**: Only one option can be selected at a time
5. **Checkboxes**: Checked = Yes, Unchecked = No
6. **Auto-generation**: Membership numbers and registration numbers are auto-generated
7. **Flow Chart**: Available on all pages for navigation reference

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
sudo service mongod status
sudo service mongod start
```

### Port Already in Use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Cannot Access Maintenance
- Make sure you're logged in as Admin
- Check your role in the dashboard header
- Regular users cannot access maintenance module

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd frontend
npm run build

# This creates a 'build' folder with optimized production files
```

## Technologies Used

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

### Frontend:
- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- CSS for styling

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based access control
- Input validation
- XSS protection
- CORS configuration

## Future Enhancements

- Email notifications
- Payment integration
- Advanced filtering in reports
- Export reports to PDF/Excel
- Event capacity management
- Attendance tracking
- Multi-language support
- Mobile app version

## License

This project is created for educational purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API endpoints
3. Check browser console for errors
4. Verify MongoDB connection
5. Ensure all environment variables are set correctly
