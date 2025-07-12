// API utility functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface CreateUserPayload {
  username: string
  fullname: string
  clerk_id: string
  address: string
  profile_url: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Create a new user in the backend
export async function createUser(payload: CreateUserPayload): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
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

// Check if user exists in the backend
export async function checkUserExists(clerkId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${clerkId}`)

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
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error checking user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Update user information
export async function updateUser(clerkId: string, payload: Partial<CreateUserPayload>): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${clerkId}`, {
      method: "PUT",
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
      message: "User updated successfully",
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
