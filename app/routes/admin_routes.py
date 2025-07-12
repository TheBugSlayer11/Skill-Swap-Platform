from fastapi import APIRouter, HTTPException, Header, Depends
from typing import List
from ..controllers.admin_controller import AdminController
from ..schemas.user_schema import UserOut
from ..schemas.swap_schema import SwapOut
from ..schemas.admin_schema import AdminBroadcast, AdminUserBanRequest

router = APIRouter(prefix="/admin", tags=["admin"])
admin_controller = AdminController()

async def verify_admin(x_clerk_user_id: str = Header(...)):
    """Verify that the user is an admin"""
    is_admin = await admin_controller.is_admin(x_clerk_user_id)
    if not is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return x_clerk_user_id

@router.get("/users", response_model=List[UserOut])
async def get_all_users(admin_id: str = Depends(verify_admin)):
    """List all users (admin only)"""
    return await admin_controller.get_all_users()

@router.put("/ban/{user_id}", response_model=UserOut)
async def ban_user(ban_request: AdminUserBanRequest, admin_id: str = Depends(verify_admin)):
    """Ban a user (admin only)"""
    return await admin_controller.ban_user(ban_request)

@router.get("/swaps", response_model=List[SwapOut])
async def get_all_swaps(admin_id: str = Depends(verify_admin)):
    """View all swap requests (admin only)"""
    return await admin_controller.get_all_swaps()

@router.post("/broadcast")
async def send_broadcast(broadcast_data: AdminBroadcast, admin_id: str = Depends(verify_admin)):
    """Send a platform-wide message (admin only)"""
    return await admin_controller.send_broadcast(broadcast_data)
