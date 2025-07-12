from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.models.swap import SwapCreate, SwapUpdate, SwapResponse, SwapFilter
from app.controllers.swap_controller import SwapController
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=SwapResponse, status_code=status.HTTP_201_CREATED)
async def create_swap(
    swap: SwapCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new swap request"""
    return await SwapController.create_swap(swap, current_user["id"])

@router.get("/", response_model=List[SwapResponse])
async def get_swaps(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None),
    swap_type: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    offered_skill: Optional[str] = Query(None),
    requested_skill: Optional[str] = Query(None)
):
    """Get all swap requests with optional filtering"""
    filters = SwapFilter(
        status=status,
        swap_type=swap_type,
        location=location,
        offered_skill=offered_skill,
        requested_skill=requested_skill
    )
    return await SwapController.get_swaps(filters, skip=skip, limit=limit)

@router.get("/{swap_id}", response_model=SwapResponse)
async def get_swap(swap_id: str):
    """Get a specific swap request by ID"""
    swap = await SwapController.get_swap_by_id(swap_id)
    if not swap:
        raise HTTPException(status_code=404, detail="Swap request not found")
    return swap

@router.put("/{swap_id}", response_model=SwapResponse)
async def update_swap(
    swap_id: str,
    swap_update: SwapUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a swap request (only by creator)"""
    swap = await SwapController.update_swap(swap_id, swap_update, current_user["id"])
    if not swap:
        raise HTTPException(status_code=404, detail="Swap request not found or unauthorized")
    return swap

@router.delete("/{swap_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_swap(
    swap_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a swap request (only by creator)"""
    success = await SwapController.delete_swap(swap_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Swap request not found or unauthorized")

@router.post("/{swap_id}/accept", response_model=SwapResponse)
async def accept_swap(
    swap_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Accept a swap request"""
    swap = await SwapController.accept_swap(swap_id, current_user["id"])
    if not swap:
        raise HTTPException(status_code=400, detail="Cannot accept this swap request")
    return swap

@router.post("/{swap_id}/complete", response_model=SwapResponse)
async def complete_swap(
    swap_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark a swap as completed"""
    swap = await SwapController.complete_swap(swap_id, current_user["id"])
    if not swap:
        raise HTTPException(status_code=400, detail="Cannot complete this swap request")
    return swap

@router.get("/my/created", response_model=List[SwapResponse])
async def get_my_created_swaps(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """Get swap requests created by current user"""
    return await SwapController.get_swaps_by_creator(current_user["id"], skip=skip, limit=limit)

@router.get("/my/accepted", response_model=List[SwapResponse])
async def get_my_accepted_swaps(
    current_user: dict = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
):
    """Get swap requests accepted by current user"""
    return await SwapController.get_swaps_by_acceptor(current_user["id"], skip=skip, limit=limit) 