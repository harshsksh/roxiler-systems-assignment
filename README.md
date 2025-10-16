# Store Rating System

A full-stack web application that allows users to submit ratings for stores registered on the platform. Built with Express.js, React, and PostgreSQL.

## Features

### System Administrator
- Add new stores, normal users, and admin users
- Dashboard with system statistics (total users, stores, ratings)
- User management with CRUD operations
- Store management with CRUD operations
- View and filter all users and stores
- Role-based access control

### Normal User
- Sign up and log in to the platform
- Update password after logging in
- View list of all registered stores
- Search stores by name and address
- Submit ratings (1-5) for individual stores
- Modify submitted ratings
- View store details with ratings

### Store Owner
- Log in to the platform
- Update password after logging in
- View dashboard with store performance
- See list of users who rated their store
- View average rating of their store

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: React.js
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roxiler-systems-assignment
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up the database**
   - Create a PostgreSQL database named `store_rating_db`
   - Update the database configuration in `server/env.example` and rename it to `.env`

4. **Configure environment variables**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=store_rating_db
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the application**

   **Option 1: Smart Startup (Recommended)**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run start-safe
   ```
   
   This will automatically:
   - Kill any existing Node.js processes
   - Free up ports 3000 and 5000 if they're in use
   - Start both backend and frontend servers
   
   **Option 2: Manual Startup**
   ```bash
   npm run dev
   ```
   
   **Option 3: Windows Batch File**
   ```bash
   start-app.bat
   ```
   
   **Option 4: PowerShell Script**
   ```powershell
   .\start-app.ps1
   ```

   All methods will start both the backend server (port 5000) and frontend development server (port 3000).

## Default Admin Account

After starting the application, you can log in with the default admin account:
- **Email**: admin@roxiler.com
- **Password**: Admin@123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### Users (Admin only)
- `GET /api/users` - Get all users with pagination and filtering
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/dashboard/stats` - Get dashboard statistics

### Stores
- `GET /api/stores` - Get all stores (public)
- `GET /api/stores/:id` - Get store by ID (public)
- `POST /api/stores` - Create store (admin only)
- `PUT /api/stores/:id` - Update store (admin only)
- `DELETE /api/stores/:id` - Delete store (admin only)
- `GET /api/stores/:id/ratings` - Get store ratings (store owner/admin)

### Ratings
- `POST /api/ratings` - Submit rating (normal user/store owner)
- `GET /api/ratings/my-ratings` - Get user's ratings
- `DELETE /api/ratings/:id` - Delete rating

## Form Validations

### Name
- Minimum 5 characters, maximum 60 characters

### Address
- Maximum 400 characters

### Password
- 8-16 characters
- Must include at least one uppercase letter
- Must include at least one special character

### Email
- Standard email validation rules

### Rating
- Must be between 1 and 5

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String, 5-60 chars)
- `email` (String, unique)
- `password` (String, hashed)
- `address` (Text, max 400 chars)
- `role` (Enum: system_admin, normal_user, store_owner)
- `isStoreOwner` (Boolean)
- `createdAt`, `updatedAt` (Timestamps)

### Stores Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, unique)
- `address` (Text)
- `ownerId` (Foreign Key to Users)
- `averageRating` (Decimal, 0-5)
- `totalRatings` (Integer)
- `createdAt`, `updatedAt` (Timestamps)

### Ratings Table
- `id` (Primary Key)
- `userId` (Foreign Key to Users)
- `storeId` (Foreign Key to Stores)
- `rating` (Integer, 1-5)
- `comment` (Text, optional)
- `createdAt`, `updatedAt` (Timestamps)
- Unique constraint on (userId, storeId)

## Features Implemented

✅ **Authentication System**
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt

✅ **User Management**
- CRUD operations for users
- Role assignment (system_admin, normal_user, store_owner)
- User profile management

✅ **Store Management**
- CRUD operations for stores
- Store owner assignment
- Store rating calculations

✅ **Rating System**
- Submit ratings (1-5 scale)
- Update existing ratings
- Delete ratings
- Average rating calculation

✅ **Dashboard & Analytics**
- System statistics for admins
- Store performance for store owners
- User activity tracking

✅ **Search & Filtering**
- Search by name, email, address
- Filter by role
- Sorting functionality
- Pagination

✅ **Form Validations**
- Client-side and server-side validation
- Real-time error feedback
- Input sanitization

✅ **Responsive Design**
- Mobile-friendly interface
- Modern UI with Tailwind CSS
- Accessible components

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention with Sequelize ORM
- XSS protection with Helmet

## Development

### Smart Startup with Port Management
The application includes intelligent port management that automatically:
- Detects if ports 3000 or 5000 are in use
- Kills processes using those ports
- Starts the application on clean ports

```bash
npm start          # Smart startup (recommended)
npm run start-safe # Same as above
```

### Manual Development
```bash
# Backend only
cd server
npm run dev

# Frontend only  
cd client
npm start

# Both (manual)
npm run dev
```

### Port Management Utilities
```bash
npm run kill-ports  # Kill processes on ports 3000 and 5000
```

### Database Migrations
The application uses Sequelize ORM with automatic table creation. Tables will be created automatically when the server starts.

## Testing

The application includes comprehensive error handling and validation. Test the following scenarios:

1. **User Registration/Login**
   - Valid and invalid email formats
   - Password strength requirements
   - Name length validation

2. **Store Management**
   - Create stores with valid/invalid data
   - Assign store owners
   - Update store information

3. **Rating System**
   - Submit ratings for stores
   - Update existing ratings
   - View rating statistics

4. **Role-based Access**
   - Admin-only features
   - User-specific functionality
   - Store owner permissions

## Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the React application: `npm run build`
2. Deploy the build folder to your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
