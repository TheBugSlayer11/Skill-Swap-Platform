from fastapi import APIRouter, HTTPException, Header
from typing import List, Optional
from ..controllers.swap_controller import SwapController
from ..schemas.swap_schema import SwapCreate, SwapOut, SwapOutWithNames, SwapFeedbackResponse

router = APIRouter(prefix="/swaps", tags=["swaps"])
swap_controller = SwapController()

@router.post("/request", response_model=SwapOutWithNames)
async def create_swap_request(swap_data: SwapCreate, x_clerk_user_id: str = Header(...)):
    """Send a swap request to another user"""
    return await swap_controller.create_swap_request(x_clerk_user_id, swap_data)

@router.get("/my-swaps", response_model=List[SwapOutWithNames])
async def get_my_swaps(x_clerk_user_id: str = Header(...)):
    """Get all swaps (sent & received) for user"""
    return await swap_controller.get_user_swaps(x_clerk_user_id)

@router.put("/accept/{swap_id}")
async def accept_swap(swap_id: str, x_clerk_user_id: str = Header(...)):
    """Accept a swap request"""
    return await swap_controller.accept_swap(swap_id, x_clerk_user_id)

@router.put("/reject/{swap_id}", response_model=SwapOut)
async def reject_swap(swap_id: str, x_clerk_user_id: str = Header(...)):
    """Reject a swap request"""
    return await swap_controller.reject_swap(swap_id, x_clerk_user_id)

@router.delete("/cancel/{swap_id}")
async def cancel_swap(swap_id: str, x_clerk_user_id: str = Header(...)):
    """Cancel a pending swap"""
    return await swap_controller.cancel_swap(swap_id, x_clerk_user_id)





@router.post("/feedback/{swap_id}", response_model=SwapFeedbackResponse)
async def submit_swap_feedback(
    swap_id: str, 
    feedback: str, 
    rating: int, 
    x_clerk_user_id: str = Header(...)
):
    """Submit feedback and rating for a swap. 
    Both requester and receiver can submit their own feedback.
    The system will automatically determine which feedback field to update based on the user's role in the swap.
    
    The system will:
    - If user_id matches requester_id → update requester_feedback and requester_rating
    - If user_id matches receiver_id → update receiver_feedback and receiver_rating
    
    Note: Feedback can only be submitted for swaps with status "accepted"
    """
    if not 1 <= rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    return await swap_controller.submit_swap_feedback(swap_id, x_clerk_user_id, feedback, rating)


