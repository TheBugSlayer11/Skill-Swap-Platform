from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from pydantic import BaseModel, Field

class UserModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    username: str
    fullname: str
    email: str
    clerk_id: str
    address: Optional[str] = None
    profile_url: Optional[str] = None
    skills_offered: List[str] = []
    skills_wanted: List[str] = []
    availability: Optional[str] = None
    is_public: bool = True
    is_banned: bool = False
    rating: Optional[float] = None
    role: str = "user"
    ratings: List[dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

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
        # Create a copy to avoid modifying the original data
        model_data = data.copy()
        
        # Convert ObjectId to string if present
        if "_id" in model_data:
            if isinstance(model_data["_id"], ObjectId):
                model_data["id"] = str(model_data["_id"])
            else:
                model_data["id"] = str(model_data["_id"])
            # Remove the _id key since we're using 'id' in our model
            del model_data["_id"]
        
        # Handle datetime fields
        if "created_at" in model_data and isinstance(model_data["created_at"], str):
            try:
                model_data["created_at"] = datetime.fromisoformat(model_data["created_at"].replace('Z', '+00:00'))
            except:
                model_data["created_at"] = datetime.utcnow()
        
        if "updated_at" in model_data and isinstance(model_data["updated_at"], str):
            try:
                model_data["updated_at"] = datetime.fromisoformat(model_data["updated_at"].replace('Z', '+00:00'))
            except:
                model_data["updated_at"] = datetime.utcnow()
        
        return cls(**model_data)
