from fastapi import HTTPException, Header
from typing import Optional

async def get_current_user_id(x_clerk_user_id: str = Header(...)) -> str:
    """
    Extract user ID from Clerk header.
    In a real implementation, you would verify the Clerk token here.
    """
    if not x_clerk_user_id:
        raise HTTPException(status_code=401, detail="User ID required")
    
    return x_clerk_user_id

async def get_optional_user_id(x_clerk_user_id: Optional[str] = Header(None)) -> Optional[str]:
    """
    Extract optional user ID from Clerk header.
    """
    return x_clerk_user_id
