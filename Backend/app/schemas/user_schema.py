from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from pydantic import BaseModel, Field

class UserSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    email: str
    username: str
    full_name: str
    password_hash: str
    bio: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    location: Optional[str] = None
    profile_image_url: Optional[str] = None
    role: str = "user"
    is_verified: bool = False
    is_suspended: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class UserInDB(UserSchema):
    pass 