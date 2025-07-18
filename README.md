# Banking Fraud Detection - Technical Documentation

## Overview

This project is a full-stack authentication system with email verification and password reset features. It consists of a **Backend** (Node.js, Express, MongoDB) and a **Frontend** (React, Vite, TailwindCSS).

---

## Project Structure

    Banking-Fraud-Detection/
    │
    ├── Backend/
    │   ├── .env
    │   ├── index.js
    │   ├── package.json
    │   └── ... (controllers, models, routes, utils, etc.)
    │
    └── Frontend/
        ├── package.json
        ├── vite.config.js
        └── src/
            └── ... (React components, pages, assets, etc.)

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB Atlas account (or local MongoDB instance)

---

## Backend Initialization

1. **Navigate to the Backend directory:**
   ```sh
   cd Backend
2. **Install dependencies:**
   ```sh
   npm install
3. **Create a .env file in the Backend directory:**
    See the Example .env section below.

4. **Start the backend server:**
    ```sh
    npm run dev
The app will run on http://localhost:5173 by default.

## Example .env File
Create a .env file in the Backend directory with the following content:

    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:5173
    MAIL_USER=your_smtp_user
    MAIL_PASS=your_smtp_password
    NODE_ENV=development
    RECAPTCHA_SECRET_KEY=your_recaptcha_key_here

### Additional Notes
- The backend uses JWT for authentication and cookies for session management.
- Email features use SMTP.
- Update .env with your own credentials for production use.

For more details, see the code in index.js and App.jsx.

## Flask Mouse Analysis Service Setup

If you are using the mouse movement anomaly detection service (`app.py` in `ML-Models`):

1. **Install Python dependencies:**
   ```sh
   pip install flask flask-cors pandas joblib scikit-learn

2. **Run the Flask service:**
    ```sh
    python app.py
