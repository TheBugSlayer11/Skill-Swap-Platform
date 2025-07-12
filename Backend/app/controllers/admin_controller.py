# type: ignore
from fastapi import HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime
from ..database.mongo import get_collection
from ..models.user import UserModel
from ..models.swap import SwapModel
from ..schemas.user_schema import UserOut
from ..schemas.swap_schema import SwapOut
from ..schemas.admin_schema import AdminBroadcast, AdminUserBanRequest

class AdminController:
    def __init__(self):
        self.users_collection_name = "users"
        self.swaps_collection_name = "swaps"
    
    @property
    def users_collection(self):
        return get_collection(self.users_collection_name)  # type: ignore
    
    @property
    def swaps_collection(self):
        return get_collection(self.swaps_collection_name)  # type: ignore

    async def get_all_users(self) -> List[UserOut]:
        """List all users (admin only)."""
        users = []
        cursor = self.users_collection.find()
        
        async for user in cursor:
            try:
                user_model = UserModel.from_dict(user)
                user_dict = user_model.dict()
                
                # Skip admin users
                user_role = user_dict.get("role", "user").lower()
                if user_role in ["admin", "administrator"]:
                    continue
                
                # Ensure all required fields are present
                user_out_data = {
                    "id": user_dict.get("id", ""),
                    "username": user_dict.get("username", ""),
                    "fullname": user_dict.get("fullname", ""),
                    "email": user_dict.get("email", ""),
                    "clerk_id": user_dict.get("clerk_id", ""),
                    "address": user_dict.get("address"),
                    "profile_url": user_dict.get("profile_url"),
                    "skills_offered": user_dict.get("skills_offered", []),
                    "skills_wanted": user_dict.get("skills_wanted", []),
                    "availability": user_dict.get("availability"),
                    "is_public": user_dict.get("is_public", True),
                    "is_banned": user_dict.get("is_banned", False),
                    "rating": user_dict.get("rating"),
                    "role": user_dict.get("role", "user"),
                    "ratings": user_dict.get("ratings", [])
                }
                
                user_out = UserOut(**user_out_data)
                users.append(user_out)
            except Exception as e:
                # Skip users with invalid data
                print(f"Error processing user {user.get('_id', 'unknown')}: {e}")
                continue
        
        return users

    async def ban_user(self, ban_request: AdminUserBanRequest) -> UserOut:
        """Ban a user (admin only)."""
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(ban_request.user_id)})
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            update_data = {
                "is_banned": True,
                "updated_at": datetime.utcnow()
            }
            
            if ban_request.reason:
                update_data["ban_reason"] = ban_request.reason
            
            result = await self.users_collection.update_one(
                {"_id": ObjectId(ban_request.user_id)},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
            
            # Get updated user
            updated_user = await self.users_collection.find_one({"_id": ObjectId(ban_request.user_id)})
            if not updated_user:
                raise HTTPException(status_code=404, detail="User not found after update")
            
            user_model = UserModel.from_dict(updated_user)
            user_dict = user_model.dict()
            
            # Ensure all required fields are present
            user_out_data = {
                "id": user_dict.get("id", ""),
                "username": user_dict.get("username", ""),
                "fullname": user_dict.get("fullname", ""),
                "email": user_dict.get("email", ""),
                "clerk_id": user_dict.get("clerk_id", ""),
                "address": user_dict.get("address"),
                "profile_url": user_dict.get("profile_url"),
                "skills_offered": user_dict.get("skills_offered", []),
                "skills_wanted": user_dict.get("skills_wanted", []),
                "availability": user_dict.get("availability"),
                "is_public": user_dict.get("is_public", True),
                "is_banned": user_dict.get("is_banned", False),
                "rating": user_dict.get("rating"),
                "role": user_dict.get("role", "user"),
                "ratings": user_dict.get("ratings", [])
            }
            
            return UserOut(**user_out_data)
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid user ID")

    async def get_all_swaps(self) -> List[SwapOut]:
        """View all swap requests (admin only)."""
        swaps = []
        cursor = self.swaps_collection.find().sort("created_at", -1)
        
        async for swap in cursor:
            try:
                swap_model = SwapModel.from_dict(swap)
                swap_dict = swap_model.dict()
                
                # Ensure all required fields are present
                swap_out_data = {
                    "id": swap_dict.get("id", ""),
                    "requester_id": swap_dict.get("requester_id", ""),
                    "receiver_id": swap_dict.get("receiver_id", ""),
                    "requester_message": swap_dict.get("requester_message", ""),
                    "status": swap_dict.get("status", "pending"),
                    "requester_feedback": swap_dict.get("requester_feedback"),
                    "requester_rating": swap_dict.get("requester_rating"),
                    "receiver_feedback": swap_dict.get("receiver_feedback"),
                    "receiver_rating": swap_dict.get("receiver_rating"),
                    "created_at": swap_dict.get("created_at"),
                    "updated_at": swap_dict.get("updated_at")
                }
                
                swap_out = SwapOut(**swap_out_data)
                swaps.append(swap_out)
            except Exception as e:
                # Skip swaps with invalid data
                print(f"Error processing swap {swap.get('_id', 'unknown')}: {e}")
                continue
        
        return swaps

    async def send_broadcast(self, broadcast_data: AdminBroadcast) -> dict:
        """Send a platform-wide message (admin only)."""
        # In a real implementation, this would send notifications to all users
        # For now, we'll just store it in a broadcasts collection
        broadcasts_collection = get_collection("broadcasts")
        
        broadcast = {
            "title": broadcast_data.title,
            "message": broadcast_data.message,
            "created_at": datetime.utcnow(),
            "sent_by": "admin"  # In real app, this would be the admin's ID
        }
        
        result = await broadcasts_collection.insert_one(broadcast)
        
        return {
            "message": "Broadcast sent successfully",
            "broadcast_id": str(result.inserted_id),
            "title": broadcast_data.title
        }

    async def is_admin(self, clerk_id: str) -> bool:
        """Check if a user is an admin."""
        admin = await self.users_collection.find_one({
            "clerk_id": clerk_id,
            "role": {"$in": ["admin", "Admin"]}
        })
        return admin is not None
