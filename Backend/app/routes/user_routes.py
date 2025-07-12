from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.user import UserCreate, UserUpdate, UserResponse, UserLogin
from app.controllers.user_controller import UserController
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    """Register a new user"""
    return await UserController.create_user(user)

@router.post("/login")
async def login_user(user_credentials: UserLogin):
    """Login user and return access token"""
    return await UserController.login_user(user_credentials)

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return await UserController.get_user_by_id(current_user["id"])

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID"""
    user = await UserController.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user information"""
    return await UserController.update_user(current_user["id"], user_update)

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(current_user: dict = Depends(get_current_user)):
    """Delete current user account"""
    await UserController.delete_user(current_user["id"])

@router.get("/", response_model=List[UserResponse])
async def get_users(skip: int = 0, limit: int = 100):
    """Get all users with pagination"""
    return await UserController.get_users(skip=skip, limit=limit) 