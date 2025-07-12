"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAllUsersAdmin, getAllSwapsAdmin, banUser } from "@/lib/api"
import {
  Shield,
  Users,
  MessageSquare,
  Ban,
  Send,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Download,
} from "lucide-react"

interface AdminUser {
  id: string
  username: string
  fullname: string
  email: string
  is_banned: boolean
  is_public: boolean
  rating?: number
  skills_offered: string[]
  skills_wanted: string[]
}

interface AdminSwap {
  id: string
  requester_id: string
  receiver_id: string
  status: string
  created_at: string
  requester_message?: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [swaps, setSwaps] = useState<AdminSwap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState<"users" | "swaps" | "broadcast">("users")

  // Broadcast form
  const [broadcastTitle, setBroadcastTitle] = useState("")
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Ban user form
  const [banReason, setBanReason] = useState("")
  const [userToBan, setUserToBan] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [usersResponse, swapsResponse] = await Promise.all([getAllUsersAdmin(), getAllSwapsAdmin()])

      if (usersResponse.success) {
        setUsers(usersResponse.data || [])
      }

      if (swapsResponse.success) {
        setSwaps(swapsResponse.data || [])
      }

      if (!usersResponse.success || !swapsResponse.success) {
        setError("Failed to load some admin data")
      }
    } catch (error) {
      console.error("Error loading admin data:", error)
      setError("Failed to load admin data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBanUser = async (userId: string) => {
    try {
      const response = await banUser(userId, banReason)
      if (response.success) {
        setSuccess("User banned successfully")
        setUserToBan(null)
        setBanReason("")
        loadData() // Reload data
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.error || "Failed to ban user")
      }
    } catch (error) {
      console.error("Error banning user:", error)
      setError("Failed to ban user")
    }
  }

  const handleBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      setError("Please fill in both title and message")
      return
    }

    setIsSending(true)
    try {
      const response = await broadcastMessage(broadcastTitle, broadcastMessage)
      if (response.success) {
        setSuccess("Broadcast sent successfully!")
        setBroadcastTitle("")
        setBroadcastMessage("")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.error || "Failed to send broadcast")
      }
    } catch (error) {
      console.error("Error sending broadcast:", error)
      setError("Failed to send broadcast")
    } finally {
      setIsSending(false)
    }
  }

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
        return <AlertTriangle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
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
            <p className="text-gray-600">Loading admin dashboard...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-red-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage users, monitor swaps, and send platform updates</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-emerald-600 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-900">{users.length}</p>
                </div>
                <Users className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Total Swaps</p>
                  <p className="text-3xl font-bold text-emerald-900">{swaps.length}</p>
                </div>
                <MessageSquare className="w-12 h-12 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Banned Users</p>
                  <p className="text-3xl font-bold text-red-900">{users.filter((user) => user.is_banned).length}</p>
                </div>
                <Ban className="w-12 h-12 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "users" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("swaps")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "swaps" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Swaps ({swaps.length})
            </button>
            <button
              onClick={() => setActiveTab("broadcast")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "broadcast" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Broadcast
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <Button variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export Users
              </Button>
            </div>

            <div className="grid gap-4">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-bold">{user.fullname.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{user.fullname}</h3>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            {user.is_public ? (
                              <Badge className="bg-emerald-100 text-emerald-800">Public</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Private</Badge>
                            )}
                            {user.is_banned && <Badge className="bg-red-100 text-red-800">Banned</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">{user.skills_offered.length} skills offered</p>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {!user.is_banned && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setUserToBan(user.id)}
                              className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl"
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Ban
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ban User Modal */}
                    {userToBan === user.id && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <h4 className="font-semibold text-red-900 mb-2">Ban User: {user.fullname}</h4>
                        <Input
                          placeholder="Reason for ban (optional)"
                          value={banReason}
                          onChange={(e) => setBanReason(e.target.value)}
                          className="mb-3"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleBanUser(user.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Confirm Ban
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUserToBan(null)
                              setBanReason("")
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "swaps" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Swap Monitoring</h2>
              <Button variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export Swaps
              </Button>
            </div>

            <div className="grid gap-4">
              {swaps.map((swap) => (
                <Card
                  key={swap.id}
                  className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Swap Request</h3>
                          <p className="text-sm text-gray-500">
                            From: {swap.requester_id} → To: {swap.receiver_id}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(swap.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(swap.status)} flex items-center space-x-1`}>
                          {getStatusIcon(swap.status)}
                          <span className="capitalize">{swap.status}</span>
                        </Badge>

                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>

                    {swap.requester_message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-700">{swap.requester_message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "broadcast" && (
          <div className="max-w-2xl">
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Send className="w-6 h-6 mr-2 text-blue-600" />
                  Platform Broadcast
                </CardTitle>
                <p className="text-gray-600">Send important updates to all users</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g., Platform Maintenance Update"
                    className="bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={6}
                    placeholder="Enter your message to all users..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button
                  onClick={handleBroadcast}
                  disabled={isSending || !broadcastTitle.trim() || !broadcastMessage.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 rounded-xl"
                >
                  {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {isSending ? "Sending..." : "Send Broadcast"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
