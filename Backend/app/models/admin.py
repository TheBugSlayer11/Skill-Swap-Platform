from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class AdminAction(str, Enum):
    VERIFY_USER = "verify_user"
    SUSPEND_USER = "suspend_user"
    DELETE_USER = "delete_user"
    APPROVE_SWAP = "approve_swap"
    REJECT_SWAP = "reject_swap"
    DELETE_SWAP = "delete_swap"

class AdminLogBase(BaseModel):
    action: AdminAction
    target_id: str
    target_type: str  # "user" or "swap"
    reason: Optional[str] = None
    details: Optional[dict] = None

class AdminLogCreate(AdminLogBase):
    pass

class AdminLogResponse(AdminLogBase):
    id: str
    admin_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_users: int
    total_swaps: int
    pending_swaps: int
    completed_swaps: int
    active_users_this_month: int
    total_swaps_this_month: int

class UserManagementAction(BaseModel):
    user_id: str
    action: AdminAction
    reason: Optional[str] = None

class SwapManagementAction(BaseModel):
    swap_id: str
    action: AdminAction
    reason: Optional[str] = None 