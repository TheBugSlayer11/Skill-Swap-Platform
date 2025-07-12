"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { AppLayout } from "@/components/app-layout"
import { Star, MessageSquare, Users, Clock, MapPin, Plus, X, LogIn, Send, ArrowLeft, Loader2, Badge, Sparkles, Globe, Calendar } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { getUserById, requestSwap } from "@/lib/api"
import Link from "next/link"

type Rating = {
  score: number
  feedback: string
  rated_at: string
}

type UserProfile = {
  _id: string
  username: string
  fullname: string
  email: string
  clerk_id: string
  address: string
  profile_url: string
  skills_offered: string[]
  skills_wanted: string[]
  availability: string
  is_public: boolean
  is_banned: boolean
  rating: number
  role: string
  ratings: Rating[]
  rating_count?: number
  bio?: string
}

// Enhanced Skill Display Component with modern animations
const SkillDisplay = ({ skills, variant = "secondary", maxDisplay = 2 }) => {
  const [showAll, setShowAll] = useState(false)
  const displaySkills = showAll ? skills : skills.slice(0, maxDisplay)
  const hasMore = skills.length > maxDisplay

  const getSkillStyle = (variant: string) => {
    const styles = {
      secondary: "bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 border border-emerald-200/50 hover:from-emerald-500/20 hover:to-emerald-600/20 hover:border-emerald-300/70 hover:shadow-emerald-500/20",
      outline: "bg-gradient-to-r from-blue-500/10 to-indigo-600/10 text-blue-700 border border-blue-200/50 hover:from-blue-500/20 hover:to-indigo-600/20 hover:border-blue-300/70 hover:shadow-blue-500/20"
    }
    return styles[variant] || styles.secondary
  }

  return (
    <div className="flex flex-wrap gap-2 relative" onMouseLeave={() => setShowAll(false)}>
      {displaySkills.map((skill, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${getSkillStyle(variant)}`}
        >
          <Sparkles className="w-3 h-3 mr-1.5 opacity-60" />
          {skill}
        </span>
      ))}
      {hasMore && !showAll && (
        <span
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300/50 text-gray-700 cursor-pointer hover:from-gray-200 hover:to-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
          onMouseEnter={() => setShowAll(true)}
        >
          <Plus className="w-3 h-3 mr-1" />
          {skills.length - maxDisplay} more
        </span>
      )}
    </div>
  )
}

// Enhanced Login Modal with modern glassmorphism
const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Login Required
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100/80 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Join our community to request skill swaps and connect with talented individuals.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="/sign-in"
            className="group w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Get Started
          </a>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-105"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced Request Swap Modal
const RequestSwapModal = ({ isOpen, onClose, targetUser, currentUser, onSubmit }) => {
  const [message, setMessage] = useState("")
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState("")
  const [selectedWantedSkill, setSelectedWantedSkill] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedOfferedSkill || !selectedWantedSkill || !message.trim()) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        receiver_id: targetUser.clerk_id,
        requester_message: message.trim(),
        offered_skill: selectedOfferedSkill,
        wanted_skill: selectedWantedSkill,
      })
      onClose()
      setMessage("")
      setSelectedOfferedSkill("")
      setSelectedWantedSkill("")
    } catch (error) {
      console.error("Error submitting swap request:", error)
      alert("Failed to send request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !targetUser || !currentUser) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Request Skill Swap
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100/80 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
            <div className="relative">
              <img
                src={targetUser.profile_url || "/placeholder.svg"}
                alt={targetUser.fullname}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-200"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{targetUser.fullname}</h3>
              <p className="text-sm text-gray-500">@{targetUser.username}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Your Skill to Offer
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
              required
            >
              <option value="">Select a skill you want to offer</option>
              {currentUser.skills_offered?.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Skill You Want to Learn
            </label>
            <select
              value={selectedWantedSkill}
              onChange={(e) => setSelectedWantedSkill(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
              required
            >
              <option value="">Select a skill you want to learn</option>
              {targetUser.skills_offered?.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them about your skills and what you'd like to learn..."
              className="w-full p-4 border border-gray-200 rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-105"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function UserProfilePage() {
  const { userId: currentClerkUserId, isSignedIn } = useAuth()
  const router = useRouter()
  const params = useParams()
  const targetUserId = params.userId as string

  const [targetUser, setTargetUser] = useState<UserProfile | null>(null)
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedTargetUserResponse = await getUserById(targetUserId, currentClerkUserId || undefined)
        if (fetchedTargetUserResponse.success) {
          setTargetUser(fetchedTargetUserResponse.data)
        } else {
          throw new Error(fetchedTargetUserResponse.error || "Failed to fetch target user profile")
        }

        if (isSignedIn && currentClerkUserId) {
          const fetchedCurrentUserProfileResponse = await getUserById(currentClerkUserId, currentClerkUserId)
          if (fetchedCurrentUserProfileResponse.success) {
            setCurrentUserProfile(fetchedCurrentUserProfileResponse.data)
          } else {
            console.error("Failed to fetch current user profile:", fetchedCurrentUserProfileResponse.error)
            setCurrentUserProfile({
              clerk_id: currentClerkUserId,
              fullname: "Your Profile",
              skills_offered: [],
            } as UserProfile)
          }
        }
      } catch (err: any) {
        console.error("Failed to load user profile:", err)
        setError(err.message || "Failed to load user profile. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (targetUserId) {
      loadUserProfile()
    }
  }, [targetUserId, currentClerkUserId, isSignedIn])

  const getLocationFromAddress = (address: any) => {
    if (!address) return "Location not specified"
    const parts = address.split(",")
    return parts.length >= 2 ? parts[parts.length - 2].trim() + ", " + parts[parts.length - 1].trim() : address
  }

  const handleRequestSwap = () => {
    if (!isSignedIn) {
      setShowLoginModal(true)
      return
    }
    if (!currentUserProfile || !currentUserProfile.skills_offered || currentUserProfile.skills_offered.length === 0) {
      alert("Please complete your profile by adding skills you offer before requesting a swap.")
      router.push("/profile/complete")
      return
    }
    setShowRequestModal(true)
  }

  const handleSubmitSwapRequest = async (requestData: any) => {
    if (!currentClerkUserId) {
      alert("Authentication error: User ID not found.")
      return
    }
    try {
      const response = await requestSwap(requestData, currentClerkUserId)
      if (response.success) {
        alert("Swap request sent successfully!")
      } else {
        throw new Error(response.error || "Failed to send swap request.")
      }
    } catch (error) {
      console.error("Error submitting swap request:", error)
      alert("Failed to send swap request. Please try again.")
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="relative mx-auto mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-ping opacity-30"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Profile</h3>
                <p className="text-gray-600">Fetching user information...</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="text-red-500 text-8xl mb-6">⚠️</div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h3>
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <p className="text-gray-500">Please try again later</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!targetUser) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center py-20">
              <div className="text-gray-400 text-8xl mb-6">👤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">User not found</h3>
              <p className="text-gray-500 mb-8">The profile you're looking for doesn't exist.</p>
              <Link
                href="/browse"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Browse
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Link 
              href="/browse" 
              className="group inline-flex items-center text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Browse
            </Link>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          {/* Main Profile Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl p-8 mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            
            <div className="relative z-10">
              {/* Profile Header */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-200/50 shadow-xl group-hover:ring-blue-300/70 transition-all duration-300">
                    <img
                      src={targetUser.profile_url || "/placeholder.svg?height=128&width=128"}
                      alt={targetUser.fullname}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <Badge className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="text-center lg:text-left flex-1">
                  <div className="mb-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{targetUser.fullname}</h2>
                    <p className="text-xl text-gray-500 mb-3">@{targetUser.username}</p>
                    
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                        <span>{getLocationFromAddress(targetUser.address)}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1.5 text-green-500" />
                        <span>Available</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center lg:justify-start">
                      <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                        <Star className="w-5 h-5 text-yellow-500 mr-2 fill-current" />
                        <span className="font-bold text-yellow-700">{targetUser.rating}</span>
                        <span className="text-sm text-yellow-600 ml-1">
                          ({targetUser.ratings?.length || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg mr-3"></div>
                    Skills Offered
                  </h3>
                  <div className="min-h-[80px] flex items-center">
                    <SkillDisplay skills={targetUser.skills_offered || []} variant="secondary" maxDisplay={8} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3"></div>
                    Skills Wanted
                  </h3>
                  <div className="min-h-[80px] flex items-center">
                    <SkillDisplay skills={targetUser.skills_wanted || []} variant="outline" maxDisplay={8} />
                  </div>
                </div>
              </div>

              {/* Bio and Availability */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
                    About
                  </h3>
                  <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/50">
                    <p className="text-gray-700 leading-relaxed">
                      {targetUser.bio || "This user hasn't added a bio yet, but their skills speak for themselves!"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3"></div>
                    Availability
                  </h3>
                  <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/50">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-orange-500 mr-3" />
                      <p className="text-gray-700">
                        {targetUser.availability || "Flexible scheduling available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {currentClerkUserId !== targetUserId && (
                <div className="mt-8">
                  <button
                    onClick={handleRequestSwap}
                    className="group w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <MessageSquare className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Request Skill Swap
                    <div className="ml-3 w-2 h-2 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors"></div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 border-b border-yellow-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h3>
                    <p className="text-gray-600">What others say about their experience</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{targetUser.rating}</div>
                  <div className="flex items-center justify-end mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(targetUser.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {targetUser.ratings?.length || 0} reviews
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {targetUser.ratings?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h4>
                  <p className="text-gray-500 mb-6">Be the first to work with {targetUser.fullname} and leave a review!</p>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-xl border border-blue-200/50">
                    <Sparkles className="w-4 h-4 mr-2" />
                    New member
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {targetUser.ratings.map((rating, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-2xl p-6 border border-gray-200/50 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold">
                              {rating.feedback.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < rating.score ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(rating.rated_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{rating.score}</div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{rating.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        <RequestSwapModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          targetUser={targetUser}
          currentUser={currentUserProfile}
          onSubmit={handleSubmitSwapRequest}
        />
      </div>
    </AppLayout>
  )
}