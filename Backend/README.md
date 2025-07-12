# Skill Swap Platform Backend

A FastAPI-based backend for the Skill Swap Platform, enabling users to exchange skills and services.

## Features

- **User Management**: Registration, authentication, and profile management
- **Skill Swapping**: Create, accept, and manage skill swap requests
- **Admin Panel**: User verification, content moderation, and platform statistics
- **Image Upload**: Cloudinary integration for profile images
- **JWT Authentication**: Secure token-based authentication
- **MongoDB**: NoSQL database for flexible data storage

## Project Structure

```
skill_swap_backend/
├── app/
│   ├── main.py                  # FastAPI entry point
│   ├── config.py                # Environment and Cloudinary config
│   ├── database/
│   │   └── mongo.py             # MongoDB connection setup
│   ├── models/
│   │   ├── user.py              # User Pydantic models
│   │   ├── swap.py              # Swap request models
│   │   └── admin.py             # Admin models
│   ├── schemas/
│   │   ├── user_schema.py       # MongoDB user document schema
│   │   ├── swap_schema.py       # MongoDB swap schema
│   │   └── admin_schema.py      # MongoDB admin schema
│   ├── routes/
│   │   ├── user_routes.py       # User API endpoints
│   │   ├── swap_routes.py       # Swap API endpoints
│   │   └── admin_routes.py      # Admin API endpoints
│   ├── controllers/
│   │   ├── user_controller.py   # User business logic
│   │   ├── swap_controller.py   # Swap business logic
│   │   └── admin_controller.py  # Admin business logic
│   ├── services/
│   │   └── cloudinary_service.py # Cloudinary image uploads
│   └── utils/
│       └── auth.py              # JWT authentication utilities
├── .env                         # Environment variables
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skill_swap_backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=skill_swap_db

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # JWT Configuration
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   JWT_ALGORITHM=HS256
   JWT_EXPIRE_MINUTES=30

   # App Configuration
   DEBUG=True
   APP_NAME=Skill Swap Platform
   ```

5. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Ensure MongoDB is running on the configured URL

6. **Set up Cloudinary** (optional)
   - Create a Cloudinary account
   - Get your cloud name, API key, and API secret
   - Update the `.env` file with your credentials

## Running the Application

1. **Start the server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Access the API**
   - API Documentation: http://localhost:8000/docs
   - Alternative Docs: http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## API Endpoints

### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login user

### Users
- `GET /users/me` - Get current user info
- `PUT /users/me` - Update current user
- `DELETE /users/me` - Delete current user
- `GET /users/{user_id}` - Get user by ID
- `GET /users/` - Get all users

### Swaps
- `POST /swap_requests/` - Create a new swap request
- `GET /swap_requests/` - Get all swaps with filtering
- `GET /swap_requests/{swap_id}` - Get specific swap
- `PUT /swap_requests/{swap_id}` - Update swap (creator only)
- `DELETE /swap_requests/{swap_id}` - Delete swap (creator only)
- `POST /swap_requests/{swap_id}/accept` - Accept a swap
- `POST /swap_requests/{swap_id}/complete` - Complete a swap
- `GET /swap_requests/my/created` - Get user's created swaps
- `GET /swap_requests/my/accepted` - Get user's accepted swaps

### Admin (Admin role required)
- `GET /admin/stats` - Get platform statistics
- `GET /admin/users` - Get all users
- `POST /admin/users/{user_id}/verify` - Verify user
- `POST /admin/users/{user_id}/suspend` - Suspend user
- `DELETE /admin/users/{user_id}` - Delete user
- `GET /admin/swaps` - Get all swaps
- `POST /admin/swaps/{swap_id}/approve` - Approve swap
- `POST /admin/swaps/{swap_id}/reject` - Reject swap
- `DELETE /admin/swaps/{swap_id}` - Delete swap
- `GET /admin/logs` - Get admin action logs

## Database Collections

- **users**: User accounts and profiles
- **swaps**: Skill swap requests
- **admin_logs**: Admin action audit trail

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Add docstrings to functions and classes

### Testing
```bash
# Run tests (when implemented)
pytest

# Run with coverage
pytest --cov=app
```

### Database Migrations
Currently using MongoDB, so no traditional migrations are needed. Schema changes should be handled in the application layer.

## Deployment

### Production Considerations
1. Change `DEBUG=False` in `.env`
2. Use a strong `JWT_SECRET_KEY`
3. Configure proper CORS origins
4. Set up MongoDB with authentication
5. Use a production ASGI server like Gunicorn
6. Set up proper logging
7. Configure Cloudinary for production

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 