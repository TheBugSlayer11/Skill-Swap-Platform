# type: ignore
from fastapi import HTTPException, UploadFile
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from ..database.mongo import get_collection
from ..models.user import UserModel
from ..schemas.user_schema import UserCreate, UserUpdate, UserOut, RatingEntry
from ..services.cloudinary_service import CloudinaryService
from ..config import settings

class UserController:
    def __init__(self):
        self.collection_name = "users"
    
    @property
    def collection(self):
        return get_collection(self.collection_name)  # type: ignore

    async def create_user(self, user_data: UserCreate) -> UserOut:
        """Create a new user."""
        # Check if user already exists with same clerk_id or email
        existing_user = await self.collection.find_one({  # type: ignore
            "$or": [
                {"clerk_id": user_data.clerk_id},
                {"email": user_data.email}
            ]
        })
        
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        user_data_dict = user_data.dict()
        # Convert HttpUrl to string if present
        if user_data_dict.get("profile_url"):
            user_data_dict["profile_url"] = str(user_data_dict["profile_url"])
        
        # Set default values for fields not in UserCreate
        user_data_dict.update({
            "is_banned": False,
            "rating": 0.0,
            "role": "user",
            "ratings": []
        })
        
        user_model = UserModel(**user_data_dict)
        user_dict = user_model.to_dict()
        
        result = await self.collection.insert_one(user_dict)
        
        # Get the created user with proper ID conversion
        created_user = await self.collection.find_one({"_id": result.inserted_id})
        return UserOut(**UserModel.from_dict(created_user).dict())

    async def get_all_users(self) -> List[UserOut]:
        """Get all users."""
        users = []
        cursor = self.collection.find({"is_banned": False})  # type: ignore
        
        async for user in cursor:  # type: ignore
            users.append(UserOut(**UserModel.from_dict(user).dict()))
        
        return users

    async def get_user_by_id(self, clerk_id: str) -> UserOut:
        user = await self.collection.find_one({"clerk_id": clerk_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserOut(**UserModel.from_dict(user).dict())

    async def update_user(self, user_id: str, user_data: UserUpdate) -> UserOut:
        """Update user profile."""
        try:
            update_data = user_data.dict(exclude_unset=True)
            # Convert HttpUrl to string if present
            if update_data.get("profile_url"):
                update_data["profile_url"] = str(update_data["profile_url"])
            update_data["updated_at"] = datetime.utcnow()
            
            # Match by clerk_id instead of _id
            result = await self.collection.update_one(
                {"clerk_id": user_id},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Get updated user
            updated_user = await self.collection.find_one({"clerk_id": user_id})
            return UserOut(**UserModel.from_dict(updated_user).dict())
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def delete_user(self, user_id: str) -> dict:
        """Delete a user."""
        try:
            result = await self.collection.delete_one({"_id": ObjectId(user_id)})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
            
            return {"message": "User deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid user ID")

    async def rate_user(self, user_id: str, rating_data: RatingEntry, from_user_id: str = None) -> UserOut:
        """Add rating and feedback for a user."""
        try:
            # Add the rating to the user's ratings list
            rating_dict = {
                "from_user_id": from_user_id if from_user_id else None,
                "rating": rating_data.score,
                "feedback": rating_data.feedback,
                "date": rating_data.rated_at if hasattr(rating_data, 'rated_at') else datetime.utcnow()
            }
            result = await self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$push": {"ratings": rating_dict},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
            # Calculate new average rating
            user = await self.collection.find_one({"_id": ObjectId(user_id)})
            ratings = user.get("ratings", [])
            if ratings:
                total_rating = sum(r.get("rating", r.get("score", 0)) for r in ratings)
                avg_rating = total_rating / len(ratings)
                await self.collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {"rating": round(avg_rating, 2)}}
                )
            # Get updated user
            updated_user = await self.collection.find_one({"_id": ObjectId(user_id)})
            return UserOut(**UserModel.from_dict(updated_user).dict())
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid user ID")

    async def upload_profile_photo(self, user_id: str, file: UploadFile) -> UserOut:
        """Upload or update profile picture."""
        try:
            # Check if Cloudinary is configured
            if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY:
                # Fallback to local/mock storage for testing
                file_content = await file.read()
                if len(file_content) == 0:
                    raise HTTPException(status_code=400, detail="Empty file")
                
                # Create a mock profile URL for testing
                mock_profile_url = f"https://example.com/profile_photos/{user_id}_{file.filename}"
                
                # Update user profile with mock URL
                result = await self.collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {
                        "$set": {
                            "profile_url": mock_profile_url,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
            else:
                # Use Cloudinary if configured
                upload_result = await CloudinaryService.update_profile_picture(file, user_id)
                
                # Update user profile with Cloudinary URL
                result = await self.collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {
                        "$set": {
                            "profile_url": upload_result["url"],
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Get updated user
            updated_user = await self.collection.find_one({"_id": ObjectId(user_id)})
            return UserOut(**UserModel.from_dict(updated_user).dict())
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
