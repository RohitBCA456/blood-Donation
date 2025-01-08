
# Blood Donation Backend

## Overview
The Blood Donation Backend is a simple project built using Node.js, Express, and MongoDB. It facilitates the registration of users as recipients or donors and provides features for searching nearby donors based on the user's location. Additionally, it incorporates SMS notifications to connect donors and recipients seamlessly.

## Features
- User registration as recipient or donor.
- User authentication with login, logout, and password change functionality.
- Token-based authentication with refresh token support.
- Search for donors nearby using location-based filtering.
- SMS notifications to connect recipients and donors for blood donation.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: Database for storing user and donor data.
- **Twilio (or similar)**: SMS service to send notifications.

## API Endpoints
### 1. **User Authentication**
- **POST /register**: Register as a recipient or donor.
- **POST /login**: Log in to the system.
- **POST /logout**: Log out of the system.
- **POST /change-password**: Change the user’s password.
- **POST /refresh-Token**: Generate a new authentication token using a refresh token.

### 2. **Donor Requests**
- **POST /request-donor**: Request a donor. An SMS is sent to the donor with the recipient’s contact details.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RohitBCA456/blood-Donation.git
   cd blood-Donation
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` by default.

## Usage
1. Register as a recipient or donor using the `/register` endpoint.
2. Log in using the `/login` endpoint to obtain an access token.
3. Use the `/request-donor` endpoint to search for donors and send SMS notifications.

## Project Structure
```
.
├── controllers
├── models
├── routes
├── middlewares
├── utils
├── .env
├── server.js
└── package.json
```
- **controllers**: Handles the logic for each route.
- **models**: Defines MongoDB schemas.
- **routes**: API routes.
- **middlewares**: Authentication and other middleware functions.
- **utils**: Helper functions, e.g., for sending SMS.
- **server.js**: Entry point of the application.

## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a meaningful message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---
Feel free to contribute and enhance the Blood Donation Backend project!
