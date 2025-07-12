from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class SwapBase(BaseModel):
    requester_id: str
    receiver_id: str
    requester_message: Optional[str] = ""
    status: str = Field(default="pending")  # pending, accepted, rejected, cancelled
    # Requester feedback
    requester_feedback: Optional[str] = None
    requester_rating: Optional[int] = None  # 1–5
    # Receiver feedback
    receiver_feedback: Optional[str] = None
    receiver_rating: Optional[int] = None  # 1–5

class SwapCreate(BaseModel):
    receiver_id: str
    requester_message: Optional[str] = ""

class SwapUpdate(BaseModel):
    status: Optional[str]
    requester_feedback: Optional[str]
    requester_rating: Optional[int]
    receiver_feedback: Optional[str]
    receiver_rating: Optional[int]

class SwapOut(SwapBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime]

class SwapOutWithNames(SwapOut):
    requester_name: Optional[str] = None
    receiver_name: Optional[str] = None

class SwapFeedbackResponse(BaseModel):
    message: str
    swap_id: str
    user_role: str
    feedback: str
    rating: int
    swap_details: SwapOutWithNames
