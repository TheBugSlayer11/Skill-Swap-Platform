from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class SwapStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class SwapType(str, Enum):
    SKILL_FOR_SKILL = "skill_for_skill"
    SKILL_FOR_SERVICE = "skill_for_service"
    SERVICE_FOR_SERVICE = "service_for_service"

class SwapBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=10, max_length=1000)
    offered_skill: str = Field(..., min_length=2, max_length=100)
    requested_skill: str = Field(..., min_length=2, max_length=100)
    swap_type: SwapType
    location: Optional[str] = None
    tags: List[str] = []
    duration_hours: Optional[int] = Field(None, ge=1, le=24)

class SwapCreate(SwapBase):
    pass

class SwapUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=100)
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    offered_skill: Optional[str] = Field(None, min_length=2, max_length=100)
    requested_skill: Optional[str] = Field(None, min_length=2, max_length=100)
    swap_type: Optional[SwapType] = None
    location: Optional[str] = None
    tags: Optional[List[str]] = None
    duration_hours: Optional[int] = Field(None, ge=1, le=24)

class SwapResponse(SwapBase):
    id: str
    creator_id: str
    status: SwapStatus = SwapStatus.PENDING
    created_at: datetime
    updated_at: datetime
    accepted_by: Optional[str] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class SwapFilter(BaseModel):
    status: Optional[SwapStatus] = None
    swap_type: Optional[SwapType] = None
    location: Optional[str] = None
    offered_skill: Optional[str] = None
    requested_skill: Optional[str] = None
    creator_id: Optional[str] = None 