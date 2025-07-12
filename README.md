# Skill Swap Platform API

A FastAPI backend for the Skill Swap Platform with MongoDB integration and Clerk authentication.

## Features

- User management (CRUD operations)
- Skill swap requests and management
- Admin functionality
- Profile picture uploads via Cloudinary
- Rating and feedback system
- MongoDB database integration

## Setup

### Prerequisites

- Python 3.8+
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the Backend directory:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=skill_swap_platform
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DEBUG=True
```

3. Run the application:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Users

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/users/` | Create/register a new user |
| `GET` | `/users/` | Get all users |
| `GET` | `/users/{user_id}` | Get single user by ID |
| `PUT` | `/users/{user_id}` | Update user profile |
| `DELETE` | `/users/{user_id}` | Delete a user |
| `POST` | `/users/{user_id}/rate` | Add rating & feedback for a user |
| `POST` | `/users/{user_id}/upload-photo` | Upload or update profile picture |

### Swaps

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/swaps/request` | Send a swap request to another user |
| `GET` | `/swaps/my-swaps` | Get all swaps (sent & received) for user |
| `PUT` | `/swaps/accept/{swap_id}` | Accept a swap request |
| `PUT` | `/swaps/reject/{swap_id}` | Reject a swap request |
| `DELETE` | `/swaps/cancel/{swap_id}` | Cancel a pending swap |
| `POST` | `/swaps/feedback/{swap_id}` | Submit feedback and rating for a swap |

### Admin

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/admin/users` | List all users |
| `PUT` | `/admin/ban/{user_id}` | Ban a user |
| `GET` | `/admin/swaps` | View all swap requests |
| `POST` | `/admin/broadcast` | Send a platform-wide message |

## Authentication

The API uses Clerk for authentication. Include the user ID in the `X-Clerk-User-Id` header for protected endpoints.

Example:
```bash
curl -H "X-Clerk-User-Id: user_123" http://localhost:8000/users/
```

## Database Schema

### Users Collection
- `_id`: ObjectId
- `username`: String
- `fullname`: String
- `email`: String
- `clerk_id`: String
- `address`: String (optional)
- `profile_url`: String (optional)
- `skills_offered`: Array of strings
- `skills_wanted`: Array of strings
- `availability`: String (optional)
- `is_public`: Boolean
- `is_banned`: Boolean
- `rating`: Float (optional)
- `role`: String
- `ratings`: Array of rating objects
- `created_at`: DateTime
- `updated_at`: DateTime

### Swaps Collection
- `_id`: ObjectId
- `requester_id`: String
- `receiver_id`: String
- `requester_message`: String
- `status`: String (pending, accepted, rejected, cancelled)
- `feedback`: String (optional)
- `rating`: Integer (optional)
- `created_at`: DateTime
- `updated_at`: DateTime

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Project Structure
```
Backend/
├── app/
│   ├── controllers/     # Business logic
│   ├── database/        # Database connection
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # External services
│   ├── utils/           # Utilities
│   ├── config.py        # Configuration
│   └── main.py          # FastAPI app
├── requirements.txt     # Dependencies
└── README.md           # This file
```

### Adding New Features

1. Create schemas in `app/schemas/`
2. Create models in `app/models/`
3. Implement business logic in `app/controllers/`
4. Add routes in `app/routes/`
5. Update main.py if needed

## Testing

Run tests (when implemented):
```bash
pytest
```

## Deployment

1. Set environment variables for production
2. Use a production ASGI server like Gunicorn
3. Set up MongoDB Atlas or similar
4. Configure Cloudinary for production
5. Set up proper CORS origins

Example deployment command:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
