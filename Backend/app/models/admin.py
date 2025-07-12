from datetime import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field

class AdminModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    clerk_id: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str
        }

    def to_dict(self):
        """Convert model to dictionary for MongoDB."""
        data = self.dict(by_alias=True, exclude={"id"})
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data

    @classmethod
    def from_dict(cls, data: dict):
        """Create model from dictionary."""
        if "_id" in data:
            data["id"] = str(data["_id"])
        return cls(**data)
