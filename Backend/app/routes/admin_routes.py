from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.admin import AdminStats, UserManagementAction, SwapManagementAction, AdminLogResponse
from app.controllers.admin_controller import AdminController
from app.utils.auth import get_current_user, require_admin_role

router = APIRouter()

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(current_user: dict = Depends(require_admin_role)):
    """Get platform statistics"""
    return await AdminController.get_stats()

@router.get("/users", response_model=List[dict])
async def get_all_users(
    current_user: dict = Depends(require_admin_role),
    skip: int = 0,
    limit: int = 100
):
    """Get all users with pagination"""
    return await AdminController.get_all_users(skip=skip, limit=limit)

@router.post("/users/{user_id}/verify")
async def verify_user(
    user_id: str,
    current_user: dict = Depends(require_admin_role)
):
    """Verify a user account"""
    success = await AdminController.verify_user(user_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User verified successfully"}

@router.post("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    action: UserManagementAction,
    current_user: dict = Depends(require_admin_role)
):
    """Suspend a user account"""
    success = await AdminController.suspend_user(user_id, current_user["id"], action.reason)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User suspended successfully"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    action: UserManagementAction,
    current_user: dict = Depends(require_admin_role)
):
    """Delete a user account"""
    success = await AdminController.delete_user(user_id, current_user["id"], action.reason)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.get("/swaps", response_model=List[dict])
async def get_all_swaps(
    current_user: dict = Depends(require_admin_role),
    skip: int = 0,
    limit: int = 100
):
    """Get all swap requests with pagination"""
    return await AdminController.get_all_swaps(skip=skip, limit=limit)

@router.post("/swaps/{swap_id}/approve")
async def approve_swap(
    swap_id: str,
    action: SwapManagementAction,
    current_user: dict = Depends(require_admin_role)
):
    """Approve a swap request"""
    success = await AdminController.approve_swap(swap_id, current_user["id"], action.reason)
    if not success:
        raise HTTPException(status_code=404, detail="Swap request not found")
    return {"message": "Swap request approved successfully"}

@router.post("/swaps/{swap_id}/reject")
async def reject_swap(
    swap_id: str,
    action: SwapManagementAction,
    current_user: dict = Depends(require_admin_role)
):
    """Reject a swap request"""
    success = await AdminController.reject_swap(swap_id, current_user["id"], action.reason)
    if not success:
        raise HTTPException(status_code=404, detail="Swap request not found")
    return {"message": "Swap request rejected successfully"}

@router.delete("/swaps/{swap_id}")
async def delete_swap(
    swap_id: str,
    action: SwapManagementAction,
    current_user: dict = Depends(require_admin_role)
):
    """Delete a swap request"""
    success = await AdminController.delete_swap(swap_id, current_user["id"], action.reason)
    if not success:
        raise HTTPException(status_code=404, detail="Swap request not found")
    return {"message": "Swap request deleted successfully"}

@router.get("/logs", response_model=List[AdminLogResponse])
async def get_admin_logs(
    current_user: dict = Depends(require_admin_role),
    skip: int = 0,
    limit: int = 100
):
    """Get admin action logs"""
    return await AdminController.get_admin_logs(skip=skip, limit=limit) 