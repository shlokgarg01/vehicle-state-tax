# Vehicle State Tax Management System

A comprehensive full-stack web application for managing vehicle state taxes, permits, and related documentation across different Indian states. This system facilitates the processing of various tax types including road tax, border tax, all-India permits, and loading vehicle taxes with integrated payment processing and automated notifications.

## 🚀 Features

### Core Functionality
- **Multi-Tax Type Management**: Support for Road Tax, Border Tax, All India Permit, All India Tax, and Loading Vehicle Tax
- **State-wise Tax Processing**: Manage taxes for different Indian states with state-specific configurations
- **Flexible Tax Modes**: Support for daily, weekly, monthly, quarterly, and yearly tax periods
- **Order Management**: Complete order lifecycle management (Created → Confirmed → Closed/Cancelled)
- **Payment Integration**: Secure payment gateway integration with automatic payment status verification
- **Document Management**: Upload and manage tax documents with Firebase Storage integration

### User Management
- **Role-Based Access Control**: Admin and Manager roles with granular permissions
- **User Authentication**: JWT-based authentication with secure password hashing
- **Employee Management**: Create and manage employees/managers with state and category-specific access
- **User History**: Track user tax history and order details

### Administrative Features
- **Dashboard**: Comprehensive admin dashboard with statistics and analytics
- **State Management**: Add, edit, and manage states for tax processing
- **Tax Mode Configuration**: Configure tax modes (days, weekly, monthly, quarterly, yearly) per state
- **Pricing Management**: Set and manage pricing for different tax categories, modes, and vehicle types
- **Banner Management**: Manage promotional banners for the application
- **Constants Management**: System-wide configuration and constants management

### Automation & Notifications
- **Automated Payment Verification**: Cron job runs every 5 minutes to verify payment status
- **WhatsApp Notifications**: Automated WhatsApp notifications for tax completion
- **SMS Integration**: SMS notifications via Twilio integration
- **Email Notifications**: Email alerts for important events

### Advanced Features
- **Search & Filter**: Advanced search and filtering capabilities for taxes, orders, and users
- **Pagination**: Efficient pagination for large datasets
- **Soft Delete**: Soft delete functionality for data recovery
- **Audit Trail**: Track changes and user activities
- **File Upload**: Secure file upload with Cloudinary and Firebase Storage support

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Firebase Storage & Cloudinary
- **Payment Gateway**: Custom payment gateway integration
- **Scheduling**: node-cron for automated tasks
- **Notifications**: Twilio (SMS), WhatsApp API, Nodemailer (Email)
- **Security**: bcryptjs for password hashing, CORS, cookie-parser

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux with Redux Thunk & Redux Persist
- **UI Library**: CoreUI React Components
- **Routing**: React Router DOM v7
- **Charts**: Chart.js with React Chart.js wrapper
- **Styling**: SCSS with CoreUI styles
- **HTTP Client**: Axios
- **Notifications**: React Toastify

## 📁 Project Structure

The project is organized into two main directories:

- **`backend/`**: Node.js/Express.js REST API server
- **`frontend/`**: React.js single-page application

For detailed project structure and architecture information, see [TECHNICAL.md](TECHNICAL.md#project-structure).

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Firebase account (for storage)
- Payment gateway credentials
- Twilio account (for SMS)
- WhatsApp API credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vehicle-state-tax.git
   cd vehicle-state-tax
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev  # Development mode with nodemon
   # OR
   npm start    # Production mode
   ```

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start    # Runs on http://localhost:3000
   ```

4. **Build Frontend for Production**
   ```bash
   cd frontend
   npm run build
   ```

   The built files will be in `frontend/build/` directory, which the backend serves statically in production.

## 📚 API Documentation

For complete API documentation including all endpoints, request/response formats, and authentication details, see [TECHNICAL.md](TECHNICAL.md#api-endpoints).

## 🔐 User Roles

### Admin
- Full system access
- User and employee management
- System configuration
- View all orders and taxes
- Manage states, tax modes, and pricing

### Manager
- Limited access based on assigned states and categories
- Can process taxes for assigned states/categories
- View and manage orders within permissions

For detailed information about order status flow, tax categories, vehicle types, tax modes, automated jobs, and security features, see [TECHNICAL.md](TECHNICAL.md).

## 📖 Documentation

- **[TECHNICAL.md](TECHNICAL.md)**: Comprehensive technical documentation including:
  - Complete API endpoint reference
  - Database schema details
  - Architecture overview
  - Order status flow
  - Payment integration details
  - Security implementation
  - Development guidelines
  - Deployment considerations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@yourdomain.com or open an issue in the GitHub repository.

## 🙏 Acknowledgments

- CoreUI for the React UI components
- MongoDB for the database solution
- Firebase for storage services
- All contributors and maintainers

---

**Note**: Make sure to update all placeholder values (URLs, credentials, etc.) with your actual configuration before deploying to production.

