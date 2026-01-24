# BGC Bus Tracking System

A comprehensive real-time bus tracking system designed for BGC Trust University Bangladesh that enables students to track buses in real-time, allows drivers to share their location, and provides administrators with tools to manage routes, users, and applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Dataflow](#dataflow)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)

## 🎯 Overview

The BGC Bus Tracking System is a full-stack web application that provides real-time bus location tracking using GPS, WebSocket connections, and interactive maps. The system supports three types of users:

- **Students**: Can view real-time bus locations, track their assigned routes, send messages, manage profile and receive email notifications
- **Drivers**: Can share their location in real-time via map and message, view routes, and manage their profile
- **Administrators**: Can manage user applications, approve/reject registrations, create/edit routes, and manage users

## ✨ Features

### User Features

- **Real-time Location Tracking**: Live GPS tracking of buses on an interactive map
- **Route Management**: View and select assigned bus routes
- **Profile Management**: Update profile information, change password, upload profile photos
- **Chat System**: Real-time messaging between users
- **Email Notifications**: Receive email alerts when buses reach specific locations
- **Distance Calculation**: View distance between user location and bus location
- **Responsive Design**: Works on desktop and mobile devices

### Admin Features

- **User Application Management**: Review and approve/reject user registration requests
- **User Management**: View all registered users, remove users
- **Route Management**: Create, update, and delete bus routes with custom colors
- **Route Visualization**: Set route paths and bus stop locations on map
- **Dashboard**: Overview of system statistics

### Technical Features

- **Real-time Communication**: WebSocket (Socket.IO) for instant location updates
- **Authentication**: JWT-based authentication with secure cookies
- **File Upload**: Cloudinary integration for profile and ID photo storage
- **Email Service**: Nodemailer for sending location notifications
- **Map Integration**: Leaflet.js with OpenStreetMap for interactive maps
- **State Management**: Redux Toolkit for centralized state management
- **Geolocation API**: Browser geolocation API for tracking

## 🛠 Technologies Used

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database (via Mongoose)
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Cloudinary**: Cloud-based image storage
- **Nodemailer**: Email service
- **Multer**: File upload handling
- **Axios**: HTTP client for external APIs
- **CORS**: Cross-origin resource sharing

### Frontend

- **React 19**: UI library
- **Vite**: Build tool and dev server
- **React Router DOM**: Client-side routing
- **Redux Toolkit**: State management
- **Redux Persist**: State persistence
- **Socket.IO Client**: Real-time communication client
- **Leaflet & React-Leaflet**: Interactive maps
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library
- **Axios**: HTTP client
- **Lucide React**: Icon library

## 📁 Project Structure

```
BGC_Bus_Tracking_System/
│
├── backend/                          # Backend server
│   ├── controllers/                  # Request handlers
│   │   ├── admin.controller.js       # Admin operations
│   │   ├── location.controller.js    # Location tracking
│   │   ├── message.controller.js     # Messaging
│   │   └── user.controller.js        # User operations
│   │
│   ├── middlewares/                  # Custom middleware
│   │   ├── common/
│   │   │   ├── errorHandler.js       # Error handling
│   │   │   └── isAuthenticated.js    # Auth middleware
│   │   ├── multer.js                 # File upload config
│   │   └── nodeMailer/
│   │       └── nodeMailer.js         # Email service
│   │
│   ├── models/                       # Database schemas
│   │   ├── admin.model.js            # Admin schema
│   │   ├── location.model.js         # Location schema
│   │   ├── message.model.js          # Message schema
│   │   ├── route.model.js            # Route schema
│   │   ├── user.model.js             # User schema
│   │   └── userapplication.model.js  # Application schema
│   │
│   ├── router/                       # API routes
│   │   ├── admin.route.js            # Admin routes
│   │   ├── index.route.js            # Main router
│   │   ├── location.route.js         # Location routes
│   │   ├── message.route.js          # Message routes
│   │   └── user.route.js             # User routes
│   │
│   ├── SocketIO/
│   │   └── socket.js                 # Socket.IO configuration
│   │
│   ├── utils/                        # Utility functions
│   │   ├── cloudinary.js             # Cloudinary config
│   │   ├── datauri.js                # File conversion
│   │   └── db.js                     # Database connection
│   │
│   ├── server.js                     # Entry point
│   └── package.json                  # Dependencies
│
├── frontend/                         # Frontend application
│   ├── public/                       # Static assets
│   │   └── user-profile-photo.jpg
│   │
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── Admin/                # Admin components
│   │   │   │   ├── AddRouteDialog.jsx
│   │   │   │   ├── auth/
│   │   │   │   │   └── Login.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   │
│   │   │   ├── auth/                 # Authentication
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   │
│   │   │   ├── ui/                   # UI components (Radix UI)
│   │   │   │   ├── alert-dialog.jsx
│   │   │   │   ├── avatar.jsx
│   │   │   │   ├── badge.jsx
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── popover.jsx
│   │   │   │   ├── radio-group.jsx
│   │   │   │   ├── scroll-area.jsx
│   │   │   │   ├── sonner.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   └── textarea.jsx
│   │   │   │
│   │   │   ├── AlertDialogBox.jsx
│   │   │   ├── Chatbox.jsx
│   │   │   ├── DistanceSidebar.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ProfileNav.jsx
│   │   │   └── UpdateProfileDialog.jsx
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useConnectSocket.jsx
│   │   │   ├── useDeleteProfile.jsx
│   │   │   ├── useGetLocation.jsx
│   │   │   ├── useGetMessages.jsx
│   │   │   ├── useGetRoutes.jsx
│   │   │   ├── useGetUserApplication.jsx
│   │   │   ├── useGetUserList.jsx
│   │   │   ├── useLogout.jsx
│   │   │   └── useTracker.jsx        # GPS tracking hook
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── Admin/
│   │   │   │   ├── BusRoutes.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── UserApplications.jsx
│   │   │   │   └── Users.jsx
│   │   │   │
│   │   │   ├── Home.jsx
│   │   │   ├── Map.jsx               # Main map view
│   │   │   ├── Profile.jsx
│   │   │   └── SelectRoute.jsx
│   │   │
│   │   ├── redux/                    # Redux store & slices
│   │   │   ├── authSlice.js
│   │   │   ├── locationSlice.js
│   │   │   ├── messageSlice.js
│   │   │   ├── routeSlice.js
│   │   │   ├── store.js
│   │   │   ├── userApplicationSlice.js
│   │   │   └── userListSlice.js
│   │   │
│   │   ├── socket/
│   │   │   └── socket.js             # Socket.IO client
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js          # API endpoints
│   │   │   └── getDistance.js        # Distance calculation
│   │   │
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── ScreenShots/                      # Project screenshots
└── README.md                         # This file
```

## 🗄 Database Design

The system uses MongoDB with Mongoose ODM. Below are the database schemas:

### User Model

```javascript
{
  fullname: String (required),
  email: String (required, unique),
  phoneNumber: String (required),
  password: String (required, hashed),
  role: String (enum: ["student", "driver"], required),
  profilePhoto: String,
  profilePhotoCloudId: String,
  idPhoto: String,
  idPhotoCloudId: String,
  id: String,
  address: String,
  route: [Number],  // Array of route numbers assigned to user
  timestamps: true
}
```

### Admin Model

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

### Location Model

```javascript
{
  locations: [[Number]],  // Array of [lat, lng] coordinates
  color: String,          // Route color for visualization
  sender: ObjectId (ref: "User", required),
  timestamps: true
}
```

### Route Model

```javascript
{
  no: Number (required, unique),           // Route number
  route: [String] (required),              // Route name/description array
  routeLocation: [[Number]],               // Route path coordinates
  stopLocation: [[Number]],                // Bus stop coordinates
  color: String (required, default: "#3b82f6"),
  timestamps: true
}
```

### Message Model

```javascript
{
  text: String (required),
  sender: ObjectId (ref: "User", required),
  timestamps: true
}
```

### UserApplication Model

```javascript
{
  fullname: String (required),
  email: String (required, unique),
  phoneNumber: String (required),
  password: String (required, hashed),
  role: String (enum: ["student", "driver"], required),
  idPhoto: String (required),
  idPhotoCloudId: String (required),
  timestamps: true
}
```

### Relationships

- **Location → User**: One-to-One (each location entry belongs to one user)
- **Message → User**: Many-to-One (many messages from one user)
- **User → Route**: Many-to-Many (users can have multiple routes via route array)

## 🔄 Dataflow

### Authentication Flow

```
1. User Registration:
   User → Frontend (Signup Form)
   → Backend (POST /user/signup)
   → Upload ID Photo to Cloudinary
   → Save to UserApplication Collection
   → Response: "Wait for confirmation"

2. Admin Approval:
   Admin → Frontend (User Applications Page)
   → Backend (POST /admin/registeruser)
   → Create User from Application
   → Delete Application
   → Response: "Account created"

3. User Login:
   User → Frontend (Login Form)
   → Backend (POST /user/login)
   → Verify Credentials
   → Generate JWT Token
   → Set HttpOnly Cookie
   → Delete Old Location Data
   → Response: User Data + Token
```

### Location Tracking Flow

```
1. Driver Shares Location:
   Driver Device → GPS (Browser Geolocation API)
   → useTracker Hook (Frontend)
   → Check Distance & Time Thresholds
   → POST /location (Backend)
   → Save to Location Collection
   → Emit "receive_location" via Socket.IO
   → All Connected Clients Receive Update
   → Update Redux Store
   → Map Component Re-renders with New Location

2. Student Views Location:
   Student → Frontend (Map Page)
   → GET /location (Backend)
   → Receive All Locations
   → Connect to Socket.IO
   → Listen for "receive_location" events
   → Display on Map with Markers/Polylines
```

### Real-time Communication Flow

```
Socket.IO Connection:
1. Client → Connect to Server
2. Server → Initialize Socket Connection
3. Location Update:
   - Driver sends location
   - Server saves to DB
   - Server emits "receive_location" to all clients
   - All connected clients receive update
4. Message:
   - User sends message
   - Server saves to DB
   - Server emits "receive_message" to all clients
   - Chatbox updates in real-time
5. Logout:
   - User logs out
   - Server deletes location
   - Server emits "remove_location" to all clients
```

### Route Management Flow

```
1. Admin Creates Route:
   Admin → Frontend (Add Route Dialog)
   → Select Route Path on Map
   → Select Bus Stops
   → Choose Color
   → POST /admin/createRoute
   → Save to Route Collection
   → Response: Route Data

2. User Selects Route:
   User → Frontend (Select Route Page)
   → GET /admin/getRoutes (Public/Admin endpoint)
   → Display Available Routes
   → User Selects Route
   → Update Profile with Route Number
   → POST /user/profile/update
```

### Email Notification Flow

```
1. Driver Sends Location:
   Driver → Location Update
   → Check if Route ID exists
   → POST /location/send-location-mail
   → Reverse Geocode (Nominatim API)
   → Get Address from Coordinates
   → Find All Users with Matching Route
   → Send Email to Each User (Nodemailer)
   → Response: Success
```

## 🔌 API Endpoints

### User Endpoints

- `POST /user/signup` - Register new user (requires ID photo upload)
- `POST /user/login` - User login
- `GET /user/logout` - User logout (requires authentication)
- `POST /user/profile/update` - Update user profile (requires authentication)
- `POST /user/profile/delete` - Delete user account (requires authentication)

### Location Endpoints

- `GET /location` - Get all active locations (requires authentication)
- `POST /location` - Update/send location (requires authentication)
- `POST /location/send-location-mail` - Send location email notification (requires authentication)

### Message Endpoints

- `GET /message` - Get all messages (requires authentication)
- `POST /message` - Send message (requires authentication)

### Admin Endpoints

- `POST /admin/login` - Admin login
- `GET /admin/logout` - Admin logout
- `GET /admin/userapplication` - Get all user applications (requires authentication)
- `GET /admin/user` - Get all registered users (requires authentication)
- `POST /admin/registeruser` - Approve and register user (requires authentication)
- `POST /admin/removeapplication` - Reject user application (requires authentication)
- `POST /admin/removeuser` - Delete user (requires authentication)
- `GET /admin/getRoutes` - Get all routes (requires authentication)
- `POST /admin/createRoute` - Create new route (requires authentication)
- `POST /admin/updateRoute` - Update existing route (requires authentication)
- `POST /admin/removeRoute` - Delete route (requires authentication)

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- Cloudinary account (for image storage)
- Email service credentials (for Nodemailer)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=your_cloudinary_folder_name
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

4. Start the development server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Update API endpoints in `src/utils/constants.js`:

```javascript
export const API_END_POINT = "http://localhost:5000";
export const USER_API_END_POINT = "http://localhost:5000/user";
export const LOCATION_API_END_POINT = "http://localhost:5000/location";
export const MESSAGE_API_END_POINT = "http://localhost:5000/message";
export const ADMIN_API_END_POINT = "http://localhost:5000/admin";
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

## 🔐 Environment Variables

### Backend (.env)

| Variable                | Description               | Example                                 |
| ----------------------- | ------------------------- | --------------------------------------- |
| `PORT`                  | Server port number        | `5000`                                  |
| `MONGODB_URI`           | MongoDB connection string | `mongodb://localhost:27017/bus-tracker` |
| `JWT_SECRET`            | Secret key for JWT tokens | `your-secret-key-here`                  |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     | `your-cloud-name`                       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        | `your-api-key`                          |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     | `your-api-secret`                       |
| `FOLDER_NAME`           | Cloudinary folder name    | `bus-tracker`                           |
| `EMAIL_HOST`            | SMTP server host          | `smtp.gmail.com`                        |
| `EMAIL_PORT`            | SMTP server port          | `587`                                   |
| `EMAIL_USER`            | Email address for sending | `your-email@gmail.com`                  |
| `EMAIL_PASS`            | Email app password        | `your-app-password`                     |

## 📱 Usage

### For Students

1. **Sign Up**: Register with email, password, role (student), and upload ID photo
2. **Wait for Approval**: Admin must approve your registration
3. **Login**: After approval, login with your credentials
4. **Select Route**: Choose your bus route from available routes
5. **View Map**: See real-time bus locations on the interactive map
6. **Chat**: Send messages to other users
7. **Receive Notifications**: Get email alerts when bus reaches locations

### For Drivers

1. **Sign Up**: Register with email, password, role (driver), and upload ID photo
2. **Wait for Approval**: Admin must approve your registration
3. **Login**: After approval, login with your credentials
4. **Select Route**: Choose your assigned bus route
5. **Share Location**: Your location is automatically tracked and shared
6. **View Map**: See your route and location on the map

### For Administrators

1. **Login**: Access admin panel at `/admin/login`
2. **Manage Applications**: Review and approve/reject user registrations
3. **Manage Users**: View all users and remove if necessary
4. **Manage Routes**: Create, edit, and delete bus routes
5. **Set Route Paths**: Draw route paths and mark bus stops on map

## 📸 Screenshots

The project includes screenshots in the `ScreenShots/` directory showing:

- User landing page
- Login/Signup pages
- Admin dashboard
- Bus route management
- User applications
- Map view with real-time tracking
- Profile management
- Chat interface

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HttpOnly Cookies**: Prevents XSS attacks
- **Password Hashing**: Bcrypt with salt rounds
- **CORS Configuration**: Restricted origins
- **Input Validation**: Server-side validation for all inputs
- **File Upload Validation**: Secure file handling via Multer and Cloudinary
- **Environment Variables**: Sensitive data stored in environment variables

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Instant location and message updates
- **Interactive Maps**: Leaflet.js with custom markers and polylines
- **Toast Notifications**: User feedback via Sonner
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

## 🚧 Future Enhancements

Potential improvements for the system:

- Route optimization algorithms
- Bus arrival time predictions
- Historical route data analytics
- Mobile app (React Native)
- Advanced filtering and search
- Route scheduling system

## 📝 License

This project is proprietary software. All rights reserved.

## 👥 Contributors

Developed for BGC Bus Tracking System.

---

**Note**: Make sure to configure all environment variables correctly before running the application. The system requires active internet connection for map tiles, Cloudinary, and email services.
