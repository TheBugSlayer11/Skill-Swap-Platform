from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from app.models.swap import SwapCreate, SwapUpdate, SwapResponse, SwapFilter
from app.schemas.swap_schema import SwapSchema
from app.database.mongo import get_collection

class SwapController:
    @staticmethod
    async def create_swap(swap: SwapCreate, creator_id: str) -> SwapResponse:
        """Create a new swap request"""
        collection = get_collection("swaps")
        
        swap_doc = SwapSchema(
            creator_id=creator_id,
            title=swap.title,
            description=swap.description,
            offered_skill=swap.offered_skill,
            requested_skill=swap.requested_skill,
            swap_type=swap.swap_type.value,
            location=swap.location,
            tags=swap.tags,
            duration_hours=swap.duration_hours
        )
        
        result = await collection.insert_one(swap_doc.dict(by_alias=True))
        swap_doc.id = str(result.inserted_id)
        
        return SwapResponse(**swap_doc.dict())

    @staticmethod
    async def get_swap_by_id(swap_id: str) -> Optional[SwapResponse]:
        """Get swap by ID"""
        collection = get_collection("swaps")
        swap = await collection.find_one({"_id": ObjectId(swap_id)})
        if swap:
            return SwapResponse(**SwapSchema(**swap).dict())
        return None

    @staticmethod
    async def update_swap(swap_id: str, swap_update: SwapUpdate, user_id: str) -> Optional[SwapResponse]:
        """Update swap request (only by creator)"""
        collection = get_collection("swaps")
        
        # Check if user is the creator
        swap = await collection.find_one({"_id": ObjectId(swap_id)})
        if not swap or swap["creator_id"] != user_id:
            return None
        
        update_data = swap_update.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            result = await collection.update_one(
                {"_id": ObjectId(swap_id)},
                {"$set": update_data}
            )
            
            if result.modified_count:
                return await SwapController.get_swap_by_id(swap_id)
        
        return await SwapController.get_swap_by_id(swap_id)

    @staticmethod
    async def delete_swap(swap_id: str, user_id: str) -> bool:
        """Delete swap request (only by creator)"""
        collection = get_collection("swaps")
        
        # Check if user is the creator
        swap = await collection.find_one({"_id": ObjectId(swap_id)})
        if not swap or swap["creator_id"] != user_id:
            return False
        
        result = await collection.delete_one({"_id": ObjectId(swap_id)})
        return result.deleted_count > 0

    @staticmethod
    async def get_swaps(filters: SwapFilter, skip: int = 0, limit: int = 100) -> List[SwapResponse]:
        """Get swaps with filtering"""
        collection = get_collection("swaps")
        
        # Build filter query
        query = {}
        if filters.status:
            query["status"] = filters.status.value
        if filters.swap_type:
            query["swap_type"] = filters.swap_type.value
        if filters.location:
            query["location"] = {"$regex": filters.location, "$options": "i"}
        if filters.offered_skill:
            query["offered_skill"] = {"$regex": filters.offered_skill, "$options": "i"}
        if filters.requested_skill:
            query["requested_skill"] = {"$regex": filters.requested_skill, "$options": "i"}
        if filters.creator_id:
            query["creator_id"] = filters.creator_id
        
        swaps = await collection.find(query).skip(skip).limit(limit).to_list(length=limit)
        return [SwapResponse(**SwapSchema(**swap).dict()) for swap in swaps]

    @staticmethod
    async def accept_swap(swap_id: str, user_id: str) -> Optional[SwapResponse]:
        """Accept a swap request"""
        collection = get_collection("swaps")
        
        swap = await collection.find_one({"_id": ObjectId(swap_id)})
        if not swap or swap["status"] != "pending" or swap["creator_id"] == user_id:
            return None
        
        result = await collection.update_one(
            {"_id": ObjectId(swap_id)},
            {
                "$set": {
                    "status": "accepted",
                    "accepted_by": user_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count:
            return await SwapController.get_swap_by_id(swap_id)
        return None

    @staticmethod
    async def complete_swap(swap_id: str, user_id: str) -> Optional[SwapResponse]:
        """Mark a swap as completed"""
        collection = get_collection("swaps")
        
        swap = await collection.find_one({"_id": ObjectId(swap_id)})
        if not swap or swap["status"] != "accepted":
            return None
        
        # Only creator or acceptor can complete
        if swap["creator_id"] != user_id and swap["accepted_by"] != user_id:
            return None
        
        result = await collection.update_one(
            {"_id": ObjectId(swap_id)},
            {
                "$set": {
                    "status": "completed",
                    "completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count:
            return await SwapController.get_swap_by_id(swap_id)
        return None

    @staticmethod
    async def get_swaps_by_creator(creator_id: str, skip: int = 0, limit: int = 100) -> List[SwapResponse]:
        """Get swaps created by a user"""
        collection = get_collection("swaps")
        swaps = await collection.find({"creator_id": creator_id}).skip(skip).limit(limit).to_list(length=limit)
        return [SwapResponse(**SwapSchema(**swap).dict()) for swap in swaps]

    @staticmethod
    async def get_swaps_by_acceptor(acceptor_id: str, skip: int = 0, limit: int = 100) -> List[SwapResponse]:
        """Get swaps accepted by a user"""
        collection = get_collection("swaps")
        swaps = await collection.find({"accepted_by": acceptor_id}).skip(skip).limit(limit).to_list(length=limit)
        return [SwapResponse(**SwapSchema(**swap).dict()) for swap in swaps] 