from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Optional, List
import uuid
import datetime


class RatingEntry(BaseModel):
    from_clerk_id: Optional[str] = None
    rating: int = Field(..., ge=1, le=5)
    feedback: Optional[str] = None
    date: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)


class UserBase(BaseModel):
    username: str
    fullname: str
    email: EmailStr
    clerk_id: str
    address: Optional[str] = None
    profile_url: Optional[HttpUrl] = None
    skills_offered: List[str] = []
    skills_wanted: List[str] = []
    availability: Optional[str] = None
    is_public: bool = True
    is_banned: bool = False
    rating: Optional[float] = None
    role: str = "user"
    ratings: List[RatingEntry] = []

class UserCreate(BaseModel):
    username: str
    fullname: str
    email: EmailStr
    clerk_id: str
    address: Optional[str] = None
    profile_url: Optional[HttpUrl] = None
    skills_offered: List[str] = []
    skills_wanted: List[str] = []
    availability: Optional[str] = None
    is_public: bool = True

class UserUpdate(BaseModel):
    fullname: Optional[str]
    address: Optional[str]
    profile_url: Optional[HttpUrl]
    skills_offered: Optional[List[str]]
    skills_wanted: Optional[List[str]]
    availability: Optional[str]
    is_public: Optional[bool]

class UserOut(UserBase):
    id: str
