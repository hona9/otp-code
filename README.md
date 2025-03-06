# Verification App

A small application for user verification where users input a 6-digit code. The frontend is built with React, and the backend is powered by Express.js with TypeScript.

## Features
- Users can manually enter or paste a 6-digit code.
- Automatic focus shifts to the next input field.
- Client-side validation for non-numeric values and empty fields.
- API verification that rejects codes that are not exactly 6 digits or end in '7'.
- Displays an error message for invalid codes and redirects on success.

## Tech Stack
### Frontend
- React (Next with TypeScript)
- Vercel (for deployment)

### Backend
- Express.js (with TypeScript)
- AWS EC2 (for deployment)

## Setup Instructions

### Backend Setup
1. Clone the repository:
   ```sh
   git clone <repo_url>
   cd api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
5. To build and start the production server:
   ```sh
   npm run build && npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd web
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. To deploy the frontend to Vercel:
   ```sh
   vercel
   ```

## API Endpoints
### `POST /verify`
- **Request Body:**
  ```json
  {
    "code": "123456"
  }
  ```
- **Response:**
  - Success (200): `{ "success": true, "message": "Verification Successful" }`
  - Error (400): `{ "success": false, "message": "Verification Error" }`

## Deployment
- **Frontend:** Hosted on Vercel
- **Backend:** Deployed on AWS EC2
