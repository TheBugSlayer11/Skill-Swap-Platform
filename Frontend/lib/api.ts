// API utility functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface CreateUserPayload {
  username: string
  fullname: string
  email: string
  clerk_id: string
  address?: string
  profile_url?: string | null
  skills_offered?: string[]
  skills_wanted?: string[]
  availability?: string | null
  is_public?: boolean
  is_banned?: boolean
  role?: string
  ratings?: RatingEntry[]
}

export interface UpdateUserPayload {
  fullname?: string
  address?: string
  profile_url?: string | null
  skills_offered?: string[]
  skills_wanted?: string[]
  availability?: string
  is_public?: boolean
}

export interface RatingEntry {
  score: number
  feedback?: string
  rated_at: string
}

export interface SwapRequest {
  receiver_id: string
  requester_message?: string
}

export interface SwapUpdate {
  status?: string
  feedback?: string
  rating?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// User API Functions
export async function createUser(payload: CreateUserPayload): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "User created successfully",
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getAllUsers(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getUserById(userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        data,
        message: "User found",
      }
    } else if (response.status === 404) {
      return {
        success: false,
        message: "User not found",
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function updateUser(userId: string, payload: UpdateUserPayload): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        data,
        message: "User updated successfully",
      }
    } else {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteUser(userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      message: "User deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function rateUser(userId: string, rating: { score: number; feedback?: string }): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rating),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Rating submitted successfully",
    }
  } catch (error) {
    console.error("Error rating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function uploadProfilePhoto(userId: string, photoFile: File): Promise<ApiResponse> {
  try {
    const formData = new FormData()
    formData.append("photo", photoFile)

    const response = await fetch(`${API_BASE_URL}/users/${userId}/upload-photo`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Profile photo updated successfully",
    }
  } catch (error) {
    console.error("Error uploading photo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Swap API Functions
export async function requestSwap(swapData: SwapRequest, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/swaps/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": userId,
      },
      body: JSON.stringify(swapData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Swap request sent successfully",
    }
  } catch (error) {
    console.error("Error requesting swap:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getMySwaps(userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/swaps/my-swaps`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": userId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error fetching swaps:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function acceptSwap(swapId: string, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/swaps/accept/${swapId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": userId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Swap accepted successfully",
    }
  } catch (error) {
    console.error("Error accepting swap:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function rejectSwap(swapId: string, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/swaps/reject/${swapId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": userId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Swap rejected successfully",
    }
  } catch (error) {
    console.error("Error rejecting swap:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function cancelSwap(swapId: string, userId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/swaps/cancel/${swapId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": userId,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      message: "Swap cancelled successfully",
    }
  } catch (error) {
    console.error("Error cancelling swap:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function submitSwapFeedback(
  swapId: string,
  feedback: { feedback?: string; rating?: number },
  userId: string,
): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/swaps/feedback/${swapId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": userId,
      },
      body: JSON.stringify(feedback),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Feedback submitted successfully",
    }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Admin API Functions - Updated to include admin user's Clerk ID
export async function getAllUsersAdmin(adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Fetching all users for admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Users fetched successfully",
    }
  } catch (error) {
    console.error("Error fetching admin users:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function banUser(userId: string, adminUserId: string, reason?: string): Promise<ApiResponse> {
  try {
    console.log("Banning user:", userId, "by admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/ban/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
      body: JSON.stringify({
        user_id: userId,
        reason: reason || "No reason provided",
        admin_id: adminUserId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "User banned successfully",
    }
  } catch (error) {
    console.error("Error banning user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function unbanUser(userId: string, adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Unbanning user:", userId, "by admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/unban/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
      body: JSON.stringify({
        user_id: userId,
        admin_id: adminUserId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "User unbanned successfully",
    }
  } catch (error) {
    console.error("Error unbanning user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getAllSwapsAdmin(adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Fetching all swaps for admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/swaps`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Swaps fetched successfully",
    }
  } catch (error) {
    console.error("Error fetching admin swaps:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function broadcastMessage(title: string, message: string, adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Broadcasting message by admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
      body: JSON.stringify({
        title,
        message,
        admin_id: adminUserId,
        timestamp: new Date().toISOString(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Broadcast sent successfully",
    }
  } catch (error) {
    console.error("Error broadcasting message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Additional Admin Functions
export async function getAdminStats(adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Fetching admin stats for:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      data,
      message: "Admin stats fetched successfully",
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteSwapAdmin(swapId: string, adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Deleting swap:", swapId, "by admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/swaps/${swapId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    return {
      success: true,
      message: "Swap deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting swap:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function exportUsersData(adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Exporting users data by admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/export/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    // Handle file download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return {
      success: true,
      message: "Users data exported successfully",
    }
  } catch (error) {
    console.error("Error exporting users data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function exportSwapsData(adminUserId: string): Promise<ApiResponse> {
  try {
    console.log("Exporting swaps data by admin:", adminUserId)
    const response = await fetch(`${API_BASE_URL}/admin/export/swaps`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-user-id": adminUserId,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }

    // Handle file download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `swaps_export_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return {
      success: true,
      message: "Swaps data exported successfully",
    }
  } catch (error) {
    console.error("Error exporting swaps data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
