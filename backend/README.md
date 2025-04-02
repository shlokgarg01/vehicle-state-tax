node-jwt-auth/
│
├── config/
│ └── db.js # MongoDB connection
│
├── controllers/
│ └── authController.js # Handles login, registration, and JWT generation
│
├── middlewares/
│ └── authMiddleware.js # Verifies JWT and handles role-based access
│
├── models/
│ └── userModel.js # User schema for MongoDB
│
├── routes/
│ └── authRoutes.js # Routes for authentication
│
├── .env # Environment variables
└── server.js # Main entry point for the server

# state tax

- register
- login
  role based access
  admin
  user
  manager(created by admin)

1. discriminators are used to add a field to a schema that helps distinguish between different types of documents stored in the same MongoDB collection


clone the repository
create new branch 
new branch --> cmd -> npm install
