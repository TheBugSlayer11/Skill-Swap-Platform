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
        return NextResponse.redirect(new URL("/browse", request.url))
      }
    } catch (error) {
      // User doesn't exist, continue to create
      console.log("User doesn't exist, creating new user")
    }


    // Create new user in backend with minimal data
    const payload = {
      username: user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || `user_${user.id.slice(-6)}`,
      fullname: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
      email: user.emailAddresses[0]?.emailAddress || "",
      clerk_id: user.id,
      address: "",
      profile_url: user.imageUrl || null,
      skills_offered: [],
      skills_wanted: [],
      availability: null,
      is_public: true,
      is_banned: false,
      role: "user",
      ratings: [],
    }

    console.log("Creating user with payload:", payload)

    try {
      const createUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/`
      console.log("Making POST request to:", createUrl)

      const response = await fetch(createUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("Response headers:", Object.fromEntries(response.headers.entries()))


      if (!response.ok) {
        const errorText = await response.text()
        console.error("Failed to create user:", response.status, response.statusText)
        console.error("Error response:", errorText)


      } else {
        const result = await response.json()
        console.log("User created successfully:", result)
      }
    } catch (fetchError) {
      console.error("Network error when creating user:", fetchError)
    }

    // Redirect new users to profile completion
    return NextResponse.redirect(new URL("/profile/complete", request.url))
  } catch (error) {
    console.error("Error in after-auth:", error)
    // On any error, redirect to profile completion for safety
    return NextResponse.redirect(new URL("/profile/complete", request.url))
  }
}
