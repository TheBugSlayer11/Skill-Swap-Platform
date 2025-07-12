from pydantic import BaseModel
from typing import Optional

class AdminBroadcast(BaseModel):
    title: str
    message: str

class AdminUserBanRequest(BaseModel):
    user_id: str
    reason: Optional[str] = None
