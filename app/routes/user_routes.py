from fastapi import APIRouter, HTTPException, UploadFile, File, Header
from typing import List, Optional
from ..controllers.user_controller import UserController
from ..schemas.user_schema import UserCreate, UserUpdate, UserOut, RatingEntry

router = APIRouter(prefix="/users", tags=["users"])
user_controller = UserController()

@router.post("/", response_model=UserOut)
async def create_user(user_data: UserCreate):
    """Create/register a new user"""
    return await user_controller.create_user(user_data)

@router.get("/", response_model=List[UserOut])
async def get_all_users():
    """Get all users"""
    return await user_controller.get_all_users()

@router.get("/{clerk_id}", response_model=UserOut)
async def get_user_by_clerk_id(clerk_id: str):
    """Get single user by Clerk ID"""
    return await user_controller.get_user_by_id(clerk_id)

@router.put("/{clerk_id}", response_model=UserOut)
async def update_user(clerk_id: str, user_data: UserUpdate):
    """Update user profile by Clerk ID"""
    return await user_controller.update_user(clerk_id, user_data)

@router.delete("/{clerk_id}")
async def delete_user(clerk_id: str):
    """Delete a user by Clerk ID"""
    return await user_controller.delete_user(clerk_id)

# @router.post("/{user_id}/rate", response_model=UserOut)
# async def rate_user(user_id: str, rating_data: RatingEntry):
#     """Add rating & feedback for a user"""
#     return await user_controller.rate_user(user_id, rating_data)

@router.post("/{clerk_id}/upload-photo", response_model=UserOut)
async def upload_profile_photo(clerk_id: str, file: UploadFile = File(...)):
    """Upload or update profile picture via Cloudinary (by Clerk ID)"""
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    return await user_controller.upload_profile_photo(clerk_id, file)
