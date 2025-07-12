from datetime import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field

class SwapModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    requester_id: str
    receiver_id: str
    requester_message: str = ""
    status: str = "pending"  # pending, accepted, rejected, cancelled
    # Requester feedback
    requester_feedback: Optional[str] = None
    requester_rating: Optional[int] = None  # 1–5
    # Receiver feedback
    receiver_feedback: Optional[str] = None
    receiver_rating: Optional[int] = None  # 1–5
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
        model_data = data.copy()
        
        if "_id" in model_data:
            model_data["id"] = str(model_data["_id"])
            del model_data["_id"]
        
        # Remove legacy fields if they exist
        if "feedback" in model_data:
            del model_data["feedback"]
        if "rating" in model_data:
            del model_data["rating"]
        
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
