import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    // Check if this is a new user by trying to fetch from backend
    try {
      const checkUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`
      console.log("Checking if user exists at:", checkUrl)

      const checkResponse = await fetch(checkUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (checkResponse.ok) {
        // User already exists, redirect to dashboard
        console.log("User already exists, redirecting to dashboard")
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      // User doesn't exist, continue to create
      console.log("User doesn't exist, creating new user")
    }

    // Create new user in backend
    const payload = {
      username: user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || `user_${user.id.slice(-6)}`,
      fullname: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
      clerk_id: user.id,
      address: "", // Empty for now, can be updated later in profile
      profile_url:
        user.imageUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=3b82f6&color=fff&size=200`,
    }

    console.log("Creating user with payload:", payload)

    try {
      const createUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`
      console.log("Making POST request to:", createUrl)

      const response = await fetch(createUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to create user:", response.status, response.statusText)
        console.error("Error response:", errorText)

        // Try to parse error as JSON
        try {
          const errorJson = JSON.parse(errorText)
          console.error("Parsed error:", errorJson)
        } catch (e) {
          console.error("Could not parse error as JSON")
        }
      } else {
        const result = await response.json()
        console.log("User created successfully:", result)
      }
    } catch (fetchError) {
      console.error("Network error when creating user:", fetchError)
      console.error("Backend URL:", process.env.NEXT_PUBLIC_API_URL)
    }

    // Always redirect to dashboard (even if backend fails)
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Error in after-auth:", error)
    // On any error, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
}
