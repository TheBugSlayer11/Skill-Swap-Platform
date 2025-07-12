from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from pydantic import BaseModel, Field

class SwapSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    creator_id: str
    title: str
    description: str
    offered_skill: str
    requested_skill: str
    swap_type: str
    location: Optional[str] = None
    tags: List[str] = []
    duration_hours: Optional[int] = None
    status: str = "pending"
    accepted_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }

class SwapInDB(SwapSchema):
    pass 