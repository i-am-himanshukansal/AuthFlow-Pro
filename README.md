





LANDING PAGE OF THE AUTHENTICATION SYSTEM WEBSITE
<img width="1695" height="879" alt="image" src="https://github.com/user-attachments/assets/ea7dc565-2ef9-4faf-b00e-839b57946d08" />
# 🔐 MERN Authentication System

A comprehensive full-stack authentication system built with MongoDB, Express.js, React, and Node.js. This project implements secure user authentication with multiple verification methods, password reset functionality, and automated account management.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Authentication Flow](#-authentication-flow)
- [API Routes](#-api-routes)
- [Data Flow](#-data-flow)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Usage](#-usage)

## ✨ Features

### Authentication & Security
- **User Registration** with multi-channel OTP verification (Email/Phone)
- **Email Verification** via OTP sent through Nodemailer
- **Phone Verification** via voice call using Twilio
- **Secure Login** with JWT-based authentication
- **Password Reset** functionality with email token verification
- **Protected Routes** with middleware authentication
- **HTTP-only Cookies** for secure token storage
- **Password Hashing** using bcrypt

### User Management
- **Account Verification System** with 10-minute OTP expiration
- **Automated Cleanup** - Removes unverified accounts after 15 minutes (cron job)
- **Duplicate Prevention** - Limits registration attempts to 3 per phone number
- **User Profile Retrieval** for authenticated users

### Additional Features
- **E.164 Phone Number Validation**
- **Rate Limiting** on registration attempts
- **Token Expiration** handling
- **Comprehensive Error Handling**
- **CORS Configuration** for cross-origin requests

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Twilio** - SMS and voice call service
- **node-cron** - Task scheduling
- **cookie-parser** - Cookie parsing middleware

### Frontend
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Toastify** - Toast notifications
- **Vite** - Build tool and dev server

## 🔒 Authentication Flow

### 1. Registration Flow
```
User submits registration → Validates input → Checks for existing user 
→ Limits registration attempts (max 3) → Creates user in DB 
→ Generates 5-digit OTP → Sends OTP via Email/Phone 
→ OTP expires in 10 minutes
```

### 2. OTP Verification Flow
```
User submits OTP → Validates OTP format → Finds latest unverified user entry 
→ Deletes duplicate entries → Verifies OTP code → Checks expiration 
→ Marks account as verified → Issues JWT token → Sets HTTP-only cookie
```

### 3. Login Flow
```
User submits credentials → Validates email/password → Finds verified user 
→ Compares hashed password → Issues JWT token → Sets HTTP-only cookie 
→ Returns user data
```

### 4. Password Reset Flow
```
User requests reset → Validates email → Generates reset token 
→ Hashes token → Sends reset link via email → Token expires in 15 minutes 
→ User submits new password → Validates token → Updates password 
→ Issues new JWT token
```

### 5. Authentication Middleware
```
Request with cookie → Extracts JWT token → Verifies token 
→ Decodes user ID → Fetches user from DB → Attaches user to request 
→ Proceeds to protected route
```

## 🚀 API Routes

### Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| **POST** | `/user/register` | Register new user | ❌ Public |
| **POST** | `/user/otp-verification` | Verify OTP code | ❌ Public |
| **POST** | `/user/login` | User login | ❌ Public |
| **GET** | `/user/logout` | User logout | ✅ Required |
| **GET** | `/user/getUser` | Get user profile | ✅ Required |
| **POST** | `/user/password/forgot` | Request password reset | ❌ Public |
| **POST** | `/user/password/reset/:token` | Reset password with token | ❌ Public |

### Health Check Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/` | Welcome message |
| **GET** | `/healthcheck` | Server health status |
| **GET** | `/api/v1/healthcheck` | API health status |

## 📊 Data Flow

### Registration & Verification
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│   Server    │─────▶│  MongoDB    │
│  (React)    │      │  (Express)  │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
      │                      │                     │
      │  1. Submit Form      │                     │
      ├─────────────────────▶│  2. Validate Data   │
      │                      ├────────────────────▶│
      │                      │  3. Create User     │
      │                      │◀────────────────────┤
      │                      │  4. Generate OTP    │
      │                      │  5. Send Email/SMS  │
      │◀─────────────────────┤                     │
      │  6. Return Success   │                     │
      │                      │                     │
      │  7. Submit OTP       │                     │
      ├─────────────────────▶│  8. Verify OTP      │
      │                      ├────────────────────▶│
      │                      │  9. Update User     │
      │                      │◀────────────────────┤
      │  10. JWT + Cookie    │                     │
      │◀─────────────────────┤                     │
```

### Authenticated Requests
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │ Middleware  │      │  Controller │
└─────────────┘      └─────────────┘      └─────────────┘
      │                      │                     │
      │  Request + Cookie    │                     │
      ├─────────────────────▶│  Verify JWT         │
      │                      │  Decode Token       │
      │                      │  Fetch User from DB │
      │                      ├────────────────────▶│
      │                      │  Process Request    │
      │                      │◀────────────────────┤
      │  Response            │                     │
      │◀─────────────────────┤                     │
```

### Password Reset Flow
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │   Server    │      │   Email     │
└─────────────┘      └─────────────┘      └─────────────┘
      │                      │                     │
      │  1. Forgot Password  │                     │
      ├─────────────────────▶│  2. Generate Token  │
      │                      │  3. Send Email      │
      │                      ├────────────────────▶│
      │                      │                     │
      │  4. Click Link       │                     │
      ├─────────────────────▶│  5. Validate Token  │
      │  6. New Password     │  7. Hash & Save     │
      ├─────────────────────▶│  8. Issue JWT       │
      │◀─────────────────────┤                     │
```

## 📥 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Twilio account (for phone verification)
- Email service (Gmail or other SMTP)

### Clone Repository
```bash
git clone https://github.com/yourusername/mern-authentication.git
cd mern-authentication
```

### Backend Setup
```bash
cd server
npm install
```

Create a `config.env` file in the server directory:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

FRONTEND_URL=http://localhost:5173

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Twilio Configuration
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

Start the backend server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 🔑 Environment Variables

### Backend (server/config.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | ✅ |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET_KEY` | Secret key for JWT signing | ✅ |
| `JWT_EXPIRE` | JWT expiration time | ✅ |
| `COOKIE_EXPIRE` | Cookie expiration (days) | ✅ |
| `FRONTEND_URL` | Frontend application URL | ✅ |
| `SMTP_HOST` | Email service host | ✅ |
| `SMTP_PORT` | Email service port | ✅ |
| `SMTP_MAIL` | Sender email address | ✅ |
| `SMTP_PASSWORD` | Email app password | ✅ |
| `TWILIO_SID` | Twilio account SID | ✅ |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | ✅ |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | ✅ |

## 📁 Project Structure

```
MERN_AUTHENTICATION/
├── client/                    # Frontend React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── assets/           # Images and media
│   │   ├── components/       # React components
│   │   │   ├── Creator.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Technologies.jsx
│   │   ├── layout/           # Layout components
│   │   │   └── Footer.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Auth.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── OtpVerification.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── styles/           # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                    # Backend Node.js application
    ├── automation/           # Scheduled tasks
    │   └── removeUnverifiedAccounts.js
    ├── controllers/          # Request handlers
    │   └── userController.js
    ├── database/             # Database configuration
    │   └── dbConnection.js
    ├── middlewares/          # Express middlewares
    │   ├── auth.js           # JWT authentication
    │   ├── catchAsyncErrors.js
    │   └── error.js          # Error handling
    ├── models/               # Mongoose models
    │   └── userModel.js
    ├── routes/               # API routes
    │   └── userRouter.js
    ├── utils/                # Utility functions
    │   ├── sendEmail.js      # Email service
    │   └── sendToken.js      # JWT token utility
    ├── app.js                # Express app setup
    ├── server.js             # Server entry point
    ├── config.env            # Environment variables
    └── package.json
```

## 💻 Usage

REGISTRATION FORM PAGE
<img width="1225" height="794" alt="image" src="https://github.com/user-attachments/assets/cb0c96b9-4102-49e6-a659-67af69cd4373" />

### Register a New User
1. Navigate to the registration page
2. Fill in your name, email, phone number, and password
3. Select verification method (Email or Phone)
4. Submit the form
5. Enter the OTP received via email or voice call
6. Account will be verified and logged in automatically




LOGIN PAGE
<img width="1661" height="794" alt="image" src="https://github.com/user-attachments/assets/2e5566ca-e8be-423b-83d4-92d16cb06724" />
### Login
1. Navigate to the login page
2. Enter your email and password
3. Submit the form
4. You'll be redirected to the home page

### Forgot Password
1. Click on "Forgot Password" on the login page
2. Enter your registered email
3. Check your email for the reset link
4. Click the link and enter your new password
5. Submit to reset and login automatically

### Logout
1. Click the logout button in the navigation
2. You'll be redirected to the authentication page

## 🔧 Key Implementation Details




OTP SENDING PAGE
<img width="1497" height="736" alt="image" src="https://github.com/user-attachments/assets/de122661-a0fe-41b6-81ce-a82641bf71f2" />
MOBILE OTP COMING FORM TWILKIO SERVICE 
### OTP Generation
- 5-digit random number generation
- 10-minute expiration window
- Stored securely in the database


![TWILIO_OTP_SEND](https://github.com/user-attachments/assets/55b5b0b4-569b-4413-bd56-ee658b8a37b1)
### Phone Verification
- Uses Twilio voice calls
- Speaks out the OTP digit by digit
- E.164 phone number format validation

### Email Verification
- HTML-formatted email templates
- Nodemailer with SMTP configuration
- Secure app password authentication

### Automated Cleanup
- Cron job runs every 15 minutes
- Removes unverified accounts older than 15 minutes
- Prevents database clutter

### Security Measures
- Passwords hashed with bcrypt (10 rounds)
- JWT stored in HTTP-only cookies
- CORS configured for specific origins
- Reset tokens hashed with SHA-256
- Token expiration handling
- Protected routes with authentication middleware

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

## 👨‍💻 Author

Your Name - [HIMANSHU KANSAL](https://github.com/i-am-himanshukansal)

## 🙏 Acknowledgments

- MongoDB for the database
- Express.js for the web framework
- React for the frontend library
- Node.js for the runtime environment
- Twilio for phone verification services
- Nodemailer for email services
