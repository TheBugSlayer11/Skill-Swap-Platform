from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from passlib.context import CryptContext
from app.models.user import UserCreate, UserUpdate, UserResponse, UserLogin
from app.schemas.user_schema import UserSchema
from app.database.mongo import get_collection
from app.utils.auth import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserController:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    async def create_user(user: UserCreate) -> UserResponse:
        """Create a new user"""
        collection = get_collection("users")
        
        # Check if user already exists
        existing_user = await collection.find_one({"email": user.email})
        if existing_user:
            raise ValueError("User with this email already exists")
        
        existing_username = await collection.find_one({"username": user.username})
        if existing_username:
            raise ValueError("Username already taken")
        
        # Create user document
        user_doc = UserSchema(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            password_hash=UserController.get_password_hash(user.password),
            bio=user.bio,
            skills=user.skills,
            interests=user.interests,
            location=user.location,
            profile_image_url=user.profile_image_url
        )
        
        result = await collection.insert_one(user_doc.dict(by_alias=True))
        user_doc.id = str(result.inserted_id)
        
        return UserResponse(**user_doc.dict())

    @staticmethod
    async def login_user(user_credentials: UserLogin) -> dict:
        """Authenticate user and return access token"""
        collection = get_collection("users")
        
        user = await collection.find_one({"email": user_credentials.email})
        if not user or not UserController.verify_password(user_credentials.password, user["password_hash"]):
            raise ValueError("Invalid email or password")
        
        if user.get("is_suspended", False):
            raise ValueError("Account is suspended")
        
        access_token = create_access_token(data={"sub": str(user["_id"])})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse(**UserSchema(**user).dict())
        }

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[UserResponse]:
        """Get user by ID"""
        collection = get_collection("users")
        user = await collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserResponse(**UserSchema(**user).dict())
        return None

    @staticmethod
    async def update_user(user_id: str, user_update: UserUpdate) -> Optional[UserResponse]:
        """Update user information"""
        collection = get_collection("users")
        
        update_data = user_update.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            result = await collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            if result.modified_count:
                return await UserController.get_user_by_id(user_id)
        
        return await UserController.get_user_by_id(user_id)

    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete user account"""
        collection = get_collection("users")
        result = await collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    @staticmethod
    async def get_users(skip: int = 0, limit: int = 100) -> List[UserResponse]:
        """Get all users with pagination"""
        collection = get_collection("users")
        users = await collection.find().skip(skip).limit(limit).to_list(length=limit)
        return [UserResponse(**UserSchema(**user).dict()) for user in users] 