# Multan Handyman - Professional Services Platform

A web application for connecting users with professional handymen (electricians and plumbers) in Multan city.

## Features

- User and handyman registration/authentication
- Service booking system
- Real-time handyman tracking
- Admin dashboard for managing users and handymen
- Rating and review system
- Chat system between users and handymen
- Cash on Delivery payment method

## Tech Stack

### Frontend
- React.js
- React Bootstrap
- React Router DOM
- Google Maps API
- Socket.io Client

### Backend
- PHP
- MySQL
- Socket.io (for real-time features)

## Prerequisites

- Node.js (v14 or higher)
- PHP (v7.4 or higher)
- MySQL (v5.7 or higher)
- Apache/Nginx web server
- Composer (PHP package manager)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd multan-handyman
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost/multan-handyman/backend/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Set up the database:
   - Create a MySQL database named `handyman_db`
   - Import the schema from `backend/database/schema.sql`

5. Configure the backend:
   - Update database credentials in `backend/config/database.php`
   - Ensure the backend directory is accessible through your web server

## Running the Application

1. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost/multan-handyman/backend/api

## Default Admin Credentials

- Email: admin@multanhandyman.com
- Password: password

## API Endpoints

### Authentication
- POST `/auth.php?action=register` - Register new user/handyman
- POST `/auth.php?action=login` - User login

### Services
- GET `/services.php` - Get all services
- GET `/services.php?category=electrician` - Get services by category

### Bookings
- GET `/bookings.php?user_id={id}` - Get user's bookings
- GET `/bookings.php?handyman_id={id}` - Get handyman's bookings
- POST `/bookings.php?action=create` - Create new booking
- POST `/bookings.php?action=update_status` - Update booking status

### Handymen
- GET `/handymen.php` - Get all handymen
- GET `/handymen.php?id={id}` - Get handyman details
- GET `/handymen.php?service_type=electrician` - Get handymen by service type
- POST `/handymen.php?action=update_location` - Update handyman location
- POST `/handymen.php?action=update_availability` - Update handyman availability
- POST `/handymen.php?action=verify` - Verify handyman (admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@multanhandyman.com or create an issue in the repository. 