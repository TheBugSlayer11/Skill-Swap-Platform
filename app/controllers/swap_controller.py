# type: ignore
from fastapi import HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime
from ..database.mongo import get_collection
from ..models.swap import SwapModel
from ..schemas.swap_schema import SwapCreate, SwapUpdate, SwapOut

class SwapController:
    def __init__(self):
        self.collection_name = "swaps"
    
    @property
    def collection(self):
        return get_collection(self.collection_name)  # type: ignore

    async def create_swap_request(self, requester_id: str, swap_data: SwapCreate) -> dict:
        """Send a swap request to another user. Expects receiver_id as clerk_id (string)."""
        users_collection = get_collection("users")
        receiver = await users_collection.find_one({"clerk_id": swap_data.receiver_id})
        if not receiver:
            raise HTTPException(status_code=404, detail="Receiver not found")
        receiver_clerk_id = receiver.get("clerk_id")
        if not receiver_clerk_id:
            raise HTTPException(status_code=400, detail="Receiver has no clerk_id")
        existing_swap = await self.collection.find_one({
            "requester_id": requester_id,
            "receiver_id": receiver_clerk_id,
            "status": "pending"
        })
        if existing_swap:
            raise HTTPException(status_code=400, detail="Swap request already exists")
        swap_model = SwapModel(
            requester_id=requester_id,
            receiver_id=receiver_clerk_id,
            requester_message=swap_data.requester_message or ""
        )
        swap_dict = swap_model.to_dict()
        result = await self.collection.insert_one(swap_dict)
        swap_dict["_id"] = result.inserted_id
        # Fetch requester and receiver names
        requester = await users_collection.find_one({"clerk_id": requester_id})
        requester_name = requester.get("fullname") if requester else None
        receiver_name = receiver.get("fullname")
        swap_out = SwapOut(**SwapModel.from_dict(swap_dict).dict())
        swap_response = swap_out.dict()
        swap_response["requester_name"] = requester_name
        swap_response["receiver_name"] = receiver_name
        return swap_response

    async def get_user_swaps(self, user_id: str) -> List[dict]:
        """Get all swaps (sent & received) for user."""
        swaps = []
        cursor = self.collection.find({
            "$or": [
                {"requester_id": user_id},
                {"receiver_id": user_id}
            ]
        }).sort("created_at", -1)
        users_collection = get_collection("users")
        async for swap in cursor:
            try:
                if isinstance(swap.get("receiver_id"), ObjectId):
                    swap["receiver_id"] = str(swap["receiver_id"])
                swap_out = SwapOut(**SwapModel.from_dict(swap).dict())
                swap_dict = swap_out.dict()
                # Fetch names
                requester = await users_collection.find_one({"clerk_id": swap_out.requester_id})
                receiver = await users_collection.find_one({"clerk_id": swap_out.receiver_id})
                swap_dict["requester_name"] = requester.get("fullname") if requester else None
                swap_dict["receiver_name"] = receiver.get("fullname") if receiver else None
                swaps.append(swap_dict)
            except Exception as e:
                print(f"Error processing swap {swap.get('_id', 'unknown')}: {e}")
                continue
        return swaps

    async def accept_swap(self, swap_id: str, user_id: str) -> dict:
        """Accept a swap request."""
        try:
            swap = await self.collection.find_one({"_id": ObjectId(swap_id)})
            if not swap:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            # Handle legacy swaps where receiver_id might be ObjectId
            receiver_id = swap["receiver_id"]
            if isinstance(receiver_id, ObjectId):
                # Convert ObjectId to string for comparison
                receiver_id = str(receiver_id)
            
            if receiver_id != user_id:
                raise HTTPException(status_code=403, detail="Only receiver can accept swap")
            
            if swap["status"] != "pending":
                raise HTTPException(status_code=400, detail="Swap is not pending")
            
            result = await self.collection.update_one(
                {"_id": ObjectId(swap_id)},
                {
                    "$set": {
                        "status": "accepted",
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            # Get updated swap
            updated_swap = await self.collection.find_one({"_id": ObjectId(swap_id)})
            swap_out = SwapOut(**SwapModel.from_dict(updated_swap).dict())
            
            return {
                "message": "Swap accepted successfully",
                "swap_id": swap_out.id,
                "requester_clerk_id": swap_out.requester_id,
                "receiver_clerk_id": swap_out.receiver_id,
                "status": swap_out.status,
                "swap_details": swap_out
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid swap ID")

    async def reject_swap(self, swap_id: str, user_id: str) -> SwapOut:
        """Reject a swap request."""
        try:
            swap = await self.collection.find_one({"_id": ObjectId(swap_id)})
            if not swap:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            # Handle legacy swaps where receiver_id might be ObjectId
            receiver_id = swap["receiver_id"]
            if isinstance(receiver_id, ObjectId):
                # Convert ObjectId to string for comparison
                receiver_id = str(receiver_id)
            
            if receiver_id != user_id:
                raise HTTPException(status_code=403, detail="Only receiver can reject swap")
            
            if swap["status"] != "pending":
                raise HTTPException(status_code=400, detail="Swap is not pending")
            
            result = await self.collection.update_one(
                {"_id": ObjectId(swap_id)},
                {
                    "$set": {
                        "status": "rejected",
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            # Get updated swap
            updated_swap = await self.collection.find_one({"_id": ObjectId(swap_id)})
            return SwapOut(**SwapModel.from_dict(updated_swap).dict())
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid swap ID")

    async def cancel_swap(self, swap_id: str, user_id: str) -> dict:
        """Cancel a pending swap."""
        try:
            swap = await self.collection.find_one({"_id": ObjectId(swap_id)})
            if not swap:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            # Handle legacy swaps where requester_id might be ObjectId
            requester_id = swap["requester_id"]
            if isinstance(requester_id, ObjectId):
                # Convert ObjectId to string for comparison
                requester_id = str(requester_id)
            
            if requester_id != user_id:
                raise HTTPException(status_code=403, detail="Only requester can cancel swap")
            
            if swap["status"] != "pending":
                raise HTTPException(status_code=400, detail="Only pending swaps can be cancelled")
            
            result = await self.collection.update_one(
                {"_id": ObjectId(swap_id)},
                {
                    "$set": {
                        "status": "cancelled",
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            return {"message": "Swap cancelled successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid swap ID")

    async def submit_swap_feedback(self, swap_id: str, user_id: str, feedback: str, rating: int) -> dict:
        """Submit feedback and rating for a swap."""
        try:
            # Validate swap_id format
            if not ObjectId.is_valid(swap_id):
                raise HTTPException(status_code=400, detail="Invalid swap ID format")
            
            swap = await self.collection.find_one({"_id": ObjectId(swap_id)})
            if not swap:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            # Handle legacy swaps where IDs might be ObjectId
            requester_id = swap["requester_id"]
            receiver_id = swap["receiver_id"]
            
            if isinstance(requester_id, ObjectId):
                requester_id = str(requester_id)
            if isinstance(receiver_id, ObjectId):
                receiver_id = str(receiver_id)
            
            # Only participants can submit feedback
            if requester_id != user_id and receiver_id != user_id:
                raise HTTPException(
                    status_code=403, 
                    detail=f"Only swap participants can submit feedback. User ID: {user_id}, Requester: {requester_id}, Receiver: {receiver_id}"
                )
            
            if swap["status"] != "accepted":
                raise HTTPException(
                    status_code=400, 
                    detail=f"Only accepted swaps can receive feedback. Current status: {swap['status']}"
                )
            
            if not 1 <= rating <= 5:
                raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
            
            # Determine which feedback field to update based on user role
            update_fields = {
                "updated_at": datetime.utcnow()
            }
            
            user_role = ""
            rated_user_id = None
            if user_id == requester_id:
                # User is the requester, so they are rating the receiver
                update_fields["requester_feedback"] = feedback
                update_fields["requester_rating"] = rating
                user_role = "requester"
                rated_user_id = receiver_id
            elif user_id == receiver_id:
                # User is the receiver, so they are rating the requester
                update_fields["receiver_feedback"] = feedback
                update_fields["receiver_rating"] = rating
                user_role = "receiver"
                rated_user_id = requester_id
            
            result = await self.collection.update_one(
                {"_id": ObjectId(swap_id)},
                {"$set": update_fields}
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Swap not found")
            
            # Update the rated user's ratings array
            from_user_id = user_id
            rating_entry = {
                "from_user_id": from_user_id,
                "rating": rating,
                "feedback": feedback,
                "date": datetime.utcnow()
            }
            from ..database.mongo import get_collection
            users_collection = get_collection("users")
            await users_collection.update_one(
                {"clerk_id": rated_user_id},
                {"$push": {"ratings": rating_entry}, "$set": {"updated_at": datetime.utcnow()}}
            )

            # Recalculate and update the average rating for the rated user
            rated_user = await users_collection.find_one({"clerk_id": rated_user_id})
            ratings = rated_user.get("ratings", [])
            if ratings:
                total_rating = sum(r.get("rating", r.get("score", 0)) for r in ratings)
                avg_rating = total_rating / len(ratings)
                await users_collection.update_one(
                    {"clerk_id": rated_user_id},
                    {"$set": {"rating": round(avg_rating, 2)}}
                )
            
            # Get updated swap
            updated_swap = await self.collection.find_one({"_id": ObjectId(swap_id)})
            swap_out = SwapOut(**SwapModel.from_dict(updated_swap).dict())
            # Add names to swap_details
            users_collection = get_collection("users")
            requester = await users_collection.find_one({"clerk_id": swap_out.requester_id})
            receiver = await users_collection.find_one({"clerk_id": swap_out.receiver_id})
            swap_details = swap_out.dict()
            swap_details["requester_name"] = requester.get("fullname") if requester else None
            swap_details["receiver_name"] = receiver.get("fullname") if receiver else None
            return {
                "message": f"Feedback submitted successfully as {user_role}",
                "swap_id": swap_out.id,
                "user_role": user_role,
                "feedback": feedback,
                "rating": rating,
                "swap_details": swap_details
            }
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as e:
            print(f"Debug - Exception in submit_swap_feedback: {e}")
            raise HTTPException(status_code=400, detail=f"Error processing feedback: {str(e)}")


