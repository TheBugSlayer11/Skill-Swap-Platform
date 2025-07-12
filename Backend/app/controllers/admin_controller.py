from datetime import datetime, timedelta
from typing import List, Optional
from bson import ObjectId
from app.models.admin import AdminStats, AdminLogResponse
from app.schemas.admin_schema import AdminLogSchema
from app.database.mongo import get_collection

class AdminController:
    @staticmethod
    async def get_stats() -> AdminStats:
        """Get platform statistics"""
        users_collection = get_collection("users")
        swaps_collection = get_collection("swaps")
        
        # Basic counts
        total_users = await users_collection.count_documents({})
        total_swaps = await swaps_collection.count_documents({})
        pending_swaps = await swaps_collection.count_documents({"status": "pending"})
        completed_swaps = await swaps_collection.count_documents({"status": "completed"})
        
        # Monthly stats
        one_month_ago = datetime.utcnow() - timedelta(days=30)
        active_users_this_month = await users_collection.count_documents({
            "created_at": {"$gte": one_month_ago}
        })
        total_swaps_this_month = await swaps_collection.count_documents({
            "created_at": {"$gte": one_month_ago}
        })
        
        return AdminStats(
            total_users=total_users,
            total_swaps=total_swaps,
            pending_swaps=pending_swaps,
            completed_swaps=completed_swaps,
            active_users_this_month=active_users_this_month,
            total_swaps_this_month=total_swaps_this_month
        )

    @staticmethod
    async def get_all_users(skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all users with pagination"""
        collection = get_collection("users")
        users = await collection.find().skip(skip).limit(limit).to_list(length=limit)
        return users

    @staticmethod
    async def verify_user(user_id: str, admin_id: str) -> bool:
        """Verify a user account"""
        users_collection = get_collection("users")
        logs_collection = get_collection("admin_logs")
        
        result = await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count:
            # Log the action
            log = AdminLogSchema(
                admin_id=admin_id,
                action="verify_user",
                target_id=user_id,
                target_type="user"
            )
            await logs_collection.insert_one(log.dict(by_alias=True))
            return True
        
        return False

    @staticmethod
    async def suspend_user(user_id: str, admin_id: str, reason: Optional[str] = None) -> bool:
        """Suspend a user account"""
        users_collection = get_collection("users")
        logs_collection = get_collection("admin_logs")
        
        result = await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_suspended": True, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count:
            # Log the action
            log = AdminLogSchema(
                admin_id=admin_id,
                action="suspend_user",
                target_id=user_id,
                target_type="user",
                reason=reason
            )
            await logs_collection.insert_one(log.dict(by_alias=True))
            return True
        
        return False

    @staticmethod
    async def delete_user(user_id: str, admin_id: str, reason: Optional[str] = None) -> bool:
        """Delete a user account"""
        users_collection = get_collection("users")
        logs_collection = get_collection("admin_logs")
        
        result = await users_collection.delete_one({"_id": ObjectId(user_id)})
        
        if result.deleted_count:
            # Log the action
            log = AdminLogSchema(
                admin_id=admin_id,
                action="delete_user",
                target_id=user_id,
                target_type="user",
                reason=reason
            )
            await logs_collection.insert_one(log.dict(by_alias=True))
            return True
        
        return False

    @staticmethod
    async def get_all_swaps(skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all swap requests with pagination"""
        collection = get_collection("swaps")
        swaps = await collection.find().skip(skip).limit(limit).to_list(length=limit)
        return swaps

    @staticmethod
    async def approve_swap(swap_id: str, admin_id: str, reason: Optional[str] = None) -> bool:
        """Approve a swap request"""
        swaps_collection = get_collection("swaps")
        logs_collection = get_collection("admin_logs")
        
        result = await swaps_collection.update_one(
            {"_id": ObjectId(swap_id)},
            {"$set": {"status": "approved", "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count:
            # Log the action
            log = AdminLogSchema(
                admin_id=admin_id,
                action="approve_swap",
                target_id=swap_id,
                target_type="swap",
                reason=reason
            )
            await logs_collection.insert_one(log.dict(by_alias=True))
            return True
        
        return False

    @staticmethod
    async def reject_swap(swap_id: str, admin_id: str, reason: Optional[str] = None) -> bool:
        """Reject a swap request"""
        swaps_collection = get_collection("swaps")
        logs_collection = get_collection("admin_logs")
        
        result = await swaps_collection.update_one(
            {"_id": ObjectId(swap_id)},
            {"$set": {"status": "rejected", "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count:
            # Log the action
            log = AdminLogSchema(
                admin_id=admin_id,
                action="reject_swap",
                target_id=swap_id,
                target_type="swap",
                reason=reason
            )
            await logs_collection.insert_one(log.dict(by_alias=True))
            return True
        
        return False

    @staticmethod
    async def delete_swap(swap_id: str, admin_id: str, reason: Optional[str] = None) -> bool:
        """Delete a swap request"""
        swaps_collection = get_collection("swaps")
        logs_collection = get_collection("admin_logs")
        
        result = await swaps_collection.delete_one({"_id": ObjectId(swap_id)})
        
        if result.deleted_count:
            # Log the action
            log = AdminLogSchema(
                admin_id=admin_id,
                action="delete_swap",
                target_id=swap_id,
                target_type="swap",
                reason=reason
            )
            await logs_collection.insert_one(log.dict(by_alias=True))
            return True
        
        return False

    @staticmethod
    async def get_admin_logs(skip: int = 0, limit: int = 100) -> List[AdminLogResponse]:
        """Get admin action logs"""
        collection = get_collection("admin_logs")
        logs = await collection.find().sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        return [AdminLogResponse(**AdminLogSchema(**log).dict()) for log in logs] 