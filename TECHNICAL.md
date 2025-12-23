# Technical Documentation

This document provides comprehensive technical details about the Vehicle State Tax Management System, including API endpoints, architecture, database schema, and development guidelines.

## 📁 Project Structure

```
vehicle-state-tax/
├── backend/                 # Backend Node.js application
│   ├── src/
│   │   ├── config/         # Configuration files (DB, Firebase, etc.)
│   │   │   ├── config.js           # Environment configuration
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── firebase/           # Firebase configuration
│   │   │       ├── config.json     # Firebase service account
│   │   │       └── firebaseBucket.js
│   │   ├── constants/      # Application constants
│   │   │   ├── collection.js       # MongoDB collection names
│   │   │   └── constants.js        # Application-wide constants
│   │   ├── controllers/    # Route controllers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bannerController.js
│   │   │   ├── citiesController.js
│   │   │   ├── constantsController.js
│   │   │   ├── priceController.js
│   │   │   ├── stateController.js
│   │   │   ├── taxController.js
│   │   │   └── taxModeController.js
│   │   ├── helpers/        # Helper functions
│   │   │   ├── dateHelper.js
│   │   │   ├── taxHelpers.js
│   │   │   ├── uploadHelpers.js
│   │   │   └── validators.js
│   │   ├── jobs/           # Scheduled cron jobs
│   │   │   └── taxJobs.js          # Payment verification cron
│   │   ├── managers/       # Business logic managers
│   │   │   ├── constantsManager.js # Payment gateway token management
│   │   │   └── taxManager.js       # Tax business logic
│   │   ├── middlewares/    # Express middlewares
│   │   │   ├── authMiddlewares.js  # Authentication & authorization
│   │   │   ├── catchAsyncErrors.js # Async error handler
│   │   │   ├── errorMiddleware.js  # Error handling
│   │   │   ├── notFoundMiddleware.js
│   │   │   └── Upload.js           # File upload middleware
│   │   ├── models/         # Mongoose models
│   │   │   ├── Banner.js
│   │   │   ├── Cities.js
│   │   │   ├── Constants.js
│   │   │   ├── Employee.js
│   │   │   ├── Price.js
│   │   │   ├── SignupOTP.js
│   │   │   ├── State.js
│   │   │   ├── Tax.js
│   │   │   ├── TaxMode.js
│   │   │   └── User.js
│   │   ├── routes/         # API routes
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── bannerRoutes.js
│   │   │   ├── citiesRoutes.js
│   │   │   ├── constantsRoutes.js
│   │   │   ├── index.js            # Route aggregator
│   │   │   ├── priceRoutes.js
│   │   │   ├── stateRoutes.js
│   │   │   ├── taxModeRoutes.js
│   │   │   └── taxRoutes.js
│   │   └── utils/          # Utility functions
│   │       ├── apiFeatures.js      # Query filtering, search, pagination
│   │       ├── errorHandlerUtils.js
│   │       ├── generateToken.js
│   │       ├── getDataRange.js
│   │       ├── otpUtils.js
│   │       ├── sendNotifications.js
│   │       └── sendOTP.js
│   ├── server.js           # Server entry point
│   └── package.json
│
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── actions/        # Redux actions
│   │   │   ├── bannerAction.js
│   │   │   ├── constantsAction.js
│   │   │   ├── dashboardAction.js
│   │   │   ├── employeeAction.js
│   │   │   ├── orderActions.js
│   │   │   ├── priceAction.js
│   │   │   ├── taxActions.js
│   │   │   ├── taxModeAction.js
│   │   │   ├── userActions.js
│   │   │   └── usersAction.js
│   │   ├── components/     # Reusable React components
│   │   │   ├── Form/               # Form components
│   │   │   ├── Loader/
│   │   │   ├── Modal/
│   │   │   ├── Pagination/
│   │   │   └── ...
│   │   ├── constants/      # Frontend constants
│   │   ├── helpers/        # Helper functions
│   │   ├── layout/         # Layout components
│   │   ├── reducers/       # Redux reducers
│   │   ├── routes/         # Route configurations
│   │   ├── scss/           # Stylesheets
│   │   ├── utils/          # Utility functions
│   │   └── views/          # Page components
│   ├── vite.config.mjs     # Vite configuration
│   └── package.json
│
└── README.md
```

## 🏗️ Architecture

### Backend Architecture

The backend follows an **MVC (Model-View-Controller) architecture** with additional layers:

- **Models**: Mongoose schemas defining data structure
- **Controllers**: Handle HTTP requests and responses
- **Managers**: Business logic layer (separated from controllers)
- **Routes**: Define API endpoints and middleware chain
- **Middlewares**: Authentication, authorization, error handling
- **Utils**: Reusable utility functions
- **Helpers**: Domain-specific helper functions

### Frontend Architecture

The frontend uses a **component-based architecture** with:

- **Redux**: Centralized state management
- **React Router**: Client-side routing
- **Component Library**: CoreUI React components
- **Actions/Reducers**: Redux pattern for state updates

## 📡 API Endpoints

All API endpoints are prefixed with `/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/v1/auth/send-otp` | Send OTP to user's mobile number | No | - |
| POST | `/api/v1/auth/verify-otp` | Verify OTP and authenticate user | No | - |
| GET | `/api/v1/auth/me` | Get current authenticated user details | Yes | All |
| POST | `/api/v1/auth/login` | Employee/Manager login | No | - |
| GET | `/api/v1/auth/logout` | Logout user | Yes | All |

### Tax Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/api/v1/tax/new` | Create a new tax entry | Yes | All |
| POST | `/api/v1/tax/payment_url/` | Create tax entry with payment URL | Yes | All |
| GET | `/api/v1/tax/` | Get all taxes (with filters, search, pagination) | No | - |
| GET | `/api/v1/tax/:id` | Get tax by ID | Yes | All |
| GET | `/api/v1/tax/history/:userId` | Get user's tax history | Yes | All |
| PUT | `/api/v1/tax/:id` | Update tax entry | Yes | Admin, Manager |
| POST | `/api/v1/tax/upload_tax` | Upload tax document | Yes | Admin, Manager |
| GET | `/api/v1/tax/payment_status/:orderId` | Check payment status | Yes | All |
| GET | `/api/v1/tax/paymentRedirect` | Payment gateway redirect handler | No | - |

**Query Parameters for GET `/api/v1/tax/`:**
- `perPage`: Number of results per page (default: 10)
- `page`: Page number
- `sort`: Sort order (`asc` or `desc`, default: `desc`)
- `search`: Search term (searches vehicleNumber, mobileNumber, orderId)
- `status`: Filter by order status
- `category`: Filter by tax category
- `taxMode`: Filter by tax mode
- `state`: Filter by state
- `isCompleted`: Filter by completion status (boolean)

### Admin Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/v1/admin/dashboard` | Get dashboard analytics | Yes | Admin, Manager |
| GET | `/api/v1/admin/users` | Search and get users | Yes | Admin |
| POST | `/api/v1/admin/employee/create` | Create employee/manager | Yes | Admin |
| GET | `/api/v1/admin/employee` | View all managers/employees | Yes | Admin |
| PUT | `/api/v1/admin/employee/:id` | Update employee | Yes | Admin |
| DELETE | `/api/v1/admin/employee/:id` | Delete employee | Yes | Admin |
| POST | `/api/v1/admin/tax/send-whatsapp` | Resend tax via WhatsApp | Yes | Admin, Manager |
| POST | `/api/v1/admin/users/export` | Trigger user export job | Yes | Admin |

### State Management Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/v1/state/` | Get all states | Yes | All |
| POST | `/api/v1/state/` | Create state | Yes | Admin |
| PUT | `/api/v1/state/:id` | Update state | Yes | Admin |

### Tax Mode Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/v1/taxMode/` | Get all tax modes | Yes | All |
| POST | `/api/v1/taxMode/` | Create tax mode | Yes | Admin |
| PUT | `/api/v1/taxMode/:id` | Update tax mode | Yes | Admin |
| DELETE | `/api/v1/taxMode/:id` | Delete tax mode | Yes | Admin |

### Price Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/v1/price/` | Get all prices | Yes | All |
| POST | `/api/v1/price/` | Create price | Yes | Admin |
| PUT | `/api/v1/price/:id` | Update price | Yes | Admin |
| DELETE | `/api/v1/price/:id` | Delete price | Yes | Admin |

### Banner Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/v1/banner/all` | Get all banners | Yes | All |
| POST | `/api/v1/banner/new` | Create banner | Yes | Admin |
| DELETE | `/api/v1/banner/delete/:id` | Delete banner | Yes | Admin |

### Constants Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/v1/constants/:key` | Get constant by key | Yes | All |
| POST | `/api/v1/constants/new` | Create constant | Yes | Admin |
| PUT | `/api/v1/constants/:key` | Update constant | Yes | Admin |

### Cities Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/api/v1/cities/:state` | Get cities of a state | Yes | All |
| POST | `/api/v1/cities/new` | Create cities | Yes | Admin |

## 🔄 Order Status Flow

```
CREATED → CONFIRMED → CLOSED
    ↓
CANCELLED
```

1. **CREATED**: Order created, payment pending
2. **CONFIRMED**: Payment successful, order confirmed
3. **CLOSED**: Order completed with document uploaded
4. **CANCELLED**: Order cancelled

## 🤖 Automated Jobs

### Payment Status Verification Cron Job

- **Schedule**: Runs every 5 minutes (`*/5 * * * *`)
- **Function**: `TaxManager.updateTaxStatusViaCron()`
- **Purpose**: 
  - Finds all taxes from last 1 hour stuck in CREATED status
  - Checks payment status with payment gateway
  - Automatically updates status to CONFIRMED if payment is successful

## 🔐 Authentication & Authorization

### Authentication Flow

1. User requests OTP via `/api/v1/auth/send-otp`
2. OTP is sent via SMS
3. User verifies OTP via `/api/v1/auth/verify-otp`
4. JWT token is generated and set as HTTP-only cookie
5. Subsequent requests include JWT token in cookies

### Authorization

- **JWT Middleware**: `isAuthenticatedUser` - Verifies JWT token
- **Role Middleware**: `authorizeRoles([roles])` - Checks user role
- **Roles**: `admin`, `manager`

### Employee Login

- Separate login endpoint for employees/managers
- Uses username/email and password
- Returns JWT token on successful authentication

## 💳 Payment Integration

### Payment Flow

1. User creates tax entry with payment details
2. System calls `TaxManager.createPaymentLink()`
3. Payment gateway token is retrieved/refreshed (valid for 30 days)
4. Payment page URL is generated
5. User redirected to payment gateway
6. After payment, redirects to `/api/v1/tax/paymentRedirect`
7. Cron job verifies payment status every 5 minutes

### Payment Gateway Token Management

- Token stored in Constants collection
- Auto-refreshed when older than 25 days
- Managed by `ConstantsManager.getValidPaymentGatewayToken()`

## 📝 Tax Categories

- `road_tax`: State-specific road tax
- `border_tax`: Border crossing tax
- `all_india_permit`: Permit for all-India travel
- `all_india_tax`: All-India tax
- `loading_vehicle`: Loading vehicle tax

## 🚗 Vehicle Types

- `light goods vehicle`
- `medium goods vehicle`
- `heavy goods vehicle`

## 📊 Tax Modes

- `days`: Custom date range (with commission based on duration)
- `weekly`: Weekly tax
- `monthly`: Monthly tax
- `quarterly`: Quarterly tax
- `yearly`: Yearly tax

For other modes, commission is set from `serviceCharge` field in Price model.

## 🔔 Notifications

### WhatsApp Notifications

- Sent when tax is completed
- Uses WhatsApp Business API
- Configurable via environment variables
- Can be resent via admin endpoint

### SMS Notifications

- OTP delivery via SMS
- Configurable sender name and API key

### Email Notifications

- Email alerts via Nodemailer
- Configurable recipients and BCC

## 🛡️ Security Features

### Backend Security

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **CORS**: Configurable CORS policy
- **Input Validation**: Validator library for input sanitization
- **Soft Delete**: Data recovery capability
- **Role-Based Access Control**: Granular permissions
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Environment Variables**: Sensitive data in .env

### Frontend Security

- **Protected Routes**: Route-level authentication checks
- **Token Persistence**: Redux Persist for token storage
- **Axios Interceptors**: Automatic token attachment

## 🧪 Development Guidelines

### Code Structure

- **Backend**: MVC architecture with managers for business logic
- **Frontend**: Component-based architecture with Redux
- **Error Handling**: Centralized error handling middleware
- **Async Operations**: Express async handler for async routes

### Best Practices

- ES6+ JavaScript features
- Modular code organization
- Reusable components
- Consistent naming conventions
- Error handling and validation
- Soft delete for data recovery
- Environment-based configuration

### Error Handling

- Centralized error middleware (`errorMiddleware.js`)
- Custom error handler utility (`ErrorHandler` class)
- Async error wrapper (`catchAsyncErrors`)
- Consistent error response format

### Database Operations

- Mongoose ODM for MongoDB
- Soft delete plugin (`mongoose-delete`)
- Timestamps enabled on all models
- Indexes on frequently queried fields

---

For general project overview and setup instructions, see [README.md](README.md).

