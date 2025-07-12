from datetime import datetime
from typing import Optional, Dict, Any
from bson import ObjectId
from pydantic import BaseModel, Field

class AdminLogSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    admin_id: str
    action: str
    target_id: str
    target_type: str  # "user" or "swap"
    reason: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class AdminLogInDB(AdminLogSchema):
    pass 