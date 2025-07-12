"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getMySwaps, acceptSwap, rejectSwap, cancelSwap } from "@/lib/api"
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  User,
  Handshake,
  AlertCircle,
  Loader2,
} from "lucide-react"

interface Swap {
  id: string
  requester_id: string
  receiver_id: string
  requester_message: string
  status: string
  feedback?: string
  rating?: number
  created_at: string
  updated_at?: string
  requester_name?: string
  receiver_name?: string
  requester_skills?: string[]
  receiver_skills?: string[]
}

export default function SwapsPage() {
  const { userId } = useAuth()
  const [swaps, setSwaps] = useState<Swap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received")

  useEffect(() => {
    loadSwaps()
  }, [])

  const loadSwaps = async () => {
    setIsLoading(true)
    try {
      const response = await getMySwaps()
      if (response.success) {
        setSwaps(response.data || [])
      } else {
        setError(response.error || "Failed to load swaps")
      }
    } catch (error) {
      console.error("Error loading swaps:", error)
      setError("Failed to load swaps")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptSwap = async (swapId: string) => {
    try {
      const response = await acceptSwap(swapId)
      if (response.success) {
        loadSwaps() // Reload swaps
      } else {
        setError(response.error || "Failed to accept swap")
      }
    } catch (error) {
      console.error("Error accepting swap:", error)
      setError("Failed to accept swap")
    }
  }

  const handleRejectSwap = async (swapId: string) => {
    try {
      const response = await rejectSwap(swapId)
      if (response.success) {
        loadSwaps() // Reload swaps
      } else {
        setError(response.error || "Failed to reject swap")
      }
    } catch (error) {
      console.error("Error rejecting swap:", error)
      setError("Failed to reject swap")
    }
  }

  const handleCancelSwap = async (swapId: string) => {
    try {
      const response = await cancelSwap(swapId)
      if (response.success) {
        loadSwaps() // Reload swaps
      } else {
        setError(response.error || "Failed to cancel swap")
      }
    } catch (error) {
      console.error("Error cancelling swap:", error)
      setError("Failed to cancel swap")
    }
  }

  const receivedSwaps = swaps.filter((swap) => swap.receiver_id === userId)
  const sentSwaps = swaps.filter((swap) => swap.requester_id === userId)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />
      case "completed":
        return <Star className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your swaps...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-gray-600">Manage your skill exchange requests and offers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("received")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "received" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Received ({receivedSwaps.length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "sent" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sent ({sentSwaps.length})
            </button>
          </div>
        </div>

        {/* Swaps List */}
        <div className="space-y-6">
          {(activeTab === "received" ? receivedSwaps : sentSwaps).map((swap) => (
            <Card
              key={swap.id}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {activeTab === "received"
                          ? swap.requester_name || "Unknown User"
                          : swap.receiver_name || "Unknown User"}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(swap.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getStatusColor(swap.status)} flex items-center space-x-1`}>
                      {getStatusIcon(swap.status)}
                      <span className="capitalize">{swap.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {swap.requester_message && (
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </h4>
                    <p className="text-gray-700">{swap.requester_message}</p>
                  </div>
                )}

                {/* Skills */}
                {(swap.requester_skills || swap.receiver_skills) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {swap.requester_skills && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills Offered</h4>
                        <div className="flex flex-wrap gap-1">
                          {swap.requester_skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {swap.receiver_skills && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills Wanted</h4>
                        <div className="flex flex-wrap gap-1">
                          {swap.receiver_skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback and Rating */}
                {swap.feedback && (
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      Feedback {swap.rating && `(${swap.rating}/5 stars)`}
                    </h4>
                    <p className="text-gray-700">{swap.feedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {activeTab === "received" && swap.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleAcceptSwap(swap.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectSwap(swap.id)}
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}

                  {activeTab === "sent" && swap.status === "pending" && (
                    <Button
                      onClick={() => handleCancelSwap(swap.id)}
                      variant="outline"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Request
                    </Button>
                  )}

                  {swap.status === "accepted" && (
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl bg-transparent"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  )}

                  {swap.status === "completed" && !swap.feedback && (
                    <Button
                      variant="outline"
                      className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 rounded-xl bg-transparent"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Leave Feedback
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(activeTab === "received" ? receivedSwaps : sentSwaps).length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {activeTab} swaps yet</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "received"
                ? "When others request to swap skills with you, they'll appear here."
                : "Start browsing skills and send your first swap request!"}
            </p>
            <Button
              onClick={() => (window.location.href = "/browse")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Browse Skills
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
