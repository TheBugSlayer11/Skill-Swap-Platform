"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  getAllUsersAdmin,
  getAllSwapsAdmin,
  banUser,
  deleteSwapAdmin,
  exportUsersData,
  exportSwapsData,
  getAdminStats,
} from "@/lib/api"
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
  Trash2,
  UserCheck,
  BarChart3,
  RefreshCw,
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
  created_at?: string
  last_active?: string
}

interface AdminSwap {
  id: string
  requester_id: string
  receiver_id: string
  status: string
  created_at: string
  updated_at?: string
  requester_message?: string
  requester_name?: string
  receiver_name?: string
}

interface AdminStats {
  total_users: number
  active_users: number
  banned_users: number
  total_swaps: number
  pending_swaps: number
  completed_swaps: number
  recent_signups: number
}

export default function AdminPage() {
  const { userId } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [swaps, setSwaps] = useState<AdminSwap[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "swaps" | "broadcast">("overview")

  // Loading states for individual actions
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Broadcast form
  const [broadcastTitle, setBroadcastTitle] = useState("")
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  // Ban user form
  const [banReason, setBanReason] = useState("")
  const [userToBan, setUserToBan] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      loadData()
    }
  }, [userId])

  const setLoadingState = (key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }))
  }

  const loadData = async () => {
    if (!userId) {
      setError("Admin authentication required")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("Loading admin data for user:", userId)

      const [usersResponse, swapsResponse, statsResponse] = await Promise.all([
        getAllUsersAdmin(userId),
        getAllSwapsAdmin(userId),
        getAdminStats(userId).catch(() => ({ success: false, data: null })), // Optional stats
      ])

      if (usersResponse.success) {
        console.log("Users loaded:", usersResponse.data?.length || 0)
        setUsers(usersResponse.data || [])
      } else {
        console.error("Failed to load users:", usersResponse.error)
        setError((prev) => prev + (prev ? "; " : "") + "Failed to load users")
      }

      if (swapsResponse.success) {
        console.log("Swaps loaded:", swapsResponse.data?.length || 0)
        setSwaps(swapsResponse.data || [])
      } else {
        console.error("Failed to load swaps:", swapsResponse.error)
        setError((prev) => prev + (prev ? "; " : "") + "Failed to load swaps")
      }

      if (statsResponse.success) {
        console.log("Stats loaded:", statsResponse.data)
        setStats(statsResponse.data)
      }
    } catch (error) {
      console.error("Error loading admin data:", error)
      setError("Failed to load admin data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBanUser = async (targetUserId: string) => {
    if (!userId) {
      setError("Admin authentication required")
      return
    }

    setLoadingState(`ban-${targetUserId}`, true)
    try {
      console.log("Attempting to ban user:", targetUserId, "by admin:", userId, "with reason:", banReason)
      const response = await banUser(targetUserId, userId, banReason)
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
    } finally {
      setLoadingState(`ban-${targetUserId}`, false)
    }
  }

  // Removed handleUnbanUser function as per request

  const handleBroadcast = async () => {
    if (!userId) {
      setError("Admin authentication required")
      return
    }

    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      setError("Please fill in both title and message")
      return
    }

    setIsSending(true)
    setError("") // Clear previous errors
    setSuccess("") // Clear previous success messages

    try {
      console.log(
        "Sending broadcast message with title:",
        broadcastTitle,
        "and message:",
        broadcastMessage,
        "by admin:",
        userId,
      )
      const response = await broadcastMessage(broadcastTitle, broadcastMessage, userId)
      if (response.success) {
        setSuccess("Broadcast sent successfully!")
        setBroadcastTitle("")
        setBroadcastMessage("")
        console.log("Broadcast successful:", response.data)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        console.error("Failed to send broadcast:", response.error)
        setError(response.error || "Failed to send broadcast")
      }
    } catch (error) {
      console.error("Error sending broadcast:", error)
      setError("Failed to send broadcast")
    } finally {
      setIsSending(false)
    }
  }

  const handleDeleteSwap = async (swapId: string) => {
    if (!userId) {
      setError("Admin authentication required")
      return
    }

    if (!confirm("Are you sure you want to delete this swap? This action cannot be undone.")) {
      return
    }

    setLoadingState(`delete-swap-${swapId}`, true)
    try {
      console.log("Attempting to delete swap:", swapId, "by admin:", userId)
      const response = await deleteSwapAdmin(swapId, userId)
      if (response.success) {
        setSuccess("Swap deleted successfully")
        loadData() // Reload data
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.error || "Failed to delete swap")
      }
    } catch (error) {
      console.error("Error deleting swap:", error)
      setError("Failed to delete swap")
    } finally {
      setLoadingState(`delete-swap-${swapId}`, false)
    }
  }

  const handleExportUsers = async () => {
    if (!userId) {
      setError("Admin authentication required")
      return
    }

    setLoadingState("export-users", true)
    try {
      console.log("Attempting to export users data by admin:", userId)
      const response = await exportUsersData(userId)
      if (response.success) {
        setSuccess("Users data exported successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.error || "Failed to export users data")
      }
    } catch (error) {
      console.error("Error exporting users:", error)
      setError("Failed to export users data")
    } finally {
      setLoadingState("export-users", false)
    }
  }

  const handleExportSwaps = async () => {
    if (!userId) {
      setError("Admin authentication required")
      return
    }

    setLoadingState("export-swaps", true)
    try {
      console.log("Attempting to export swaps data by admin:", userId)
      const response = await exportSwapsData(userId)
      if (response.success) {
        setSuccess("Swaps data exported successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.error || "Failed to export swaps data")
      }
    } catch (error) {
      console.error("Error exporting swaps:", error)
      setError("Failed to export swaps data")
    } finally {
      setLoadingState("export-swaps", false)
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
            <p className="text-sm text-gray-500 mt-1">Admin ID: {userId}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!userId) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h3>
            <p className="text-gray-600">Please sign in with admin credentials to access this dashboard.</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-red-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage users, monitor swaps, and send platform updates</p>
              <p className="text-sm text-gray-500 mt-1">Admin ID: {userId}</p>
            </div>
            <Button
              onClick={loadData}
              disabled={isLoading}
              variant="outline"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Refresh Data
            </Button>
          </div>
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
            <Button onClick={loadData} size="sm" className="mt-2 bg-red-600 hover:bg-red-700 text-white">
              Retry
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-900">{stats?.total_users || users.length}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {stats?.banned_users || users.filter((u) => u.is_banned).length} banned
                  </p>
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
                  <p className="text-3xl font-bold text-emerald-900">{stats?.total_swaps || swaps.length}</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {stats?.pending_swaps || swaps.filter((s) => s.status === "pending").length} pending
                  </p>
                </div>
                <MessageSquare className="w-12 h-12 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Active Users</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {stats?.active_users || users.filter((u) => !u.is_banned).length}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">{stats?.recent_signups || 0} recent signups</p>
                </div>
                <UserCheck className="w-12 h-12 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Completed Swaps</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {stats?.completed_swaps || swaps.filter((s) => s.status === "completed").length}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Success rate</p>
                </div>
                <BarChart3 className="w-12 h-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "overview" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
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
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {user.fullname.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullname}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        {user.is_banned && <Badge className="bg-red-100 text-red-800">Banned</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Swaps */}
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-emerald-600" />
                    Recent Swaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {swaps.slice(0, 5).map((swap) => (
                      <div key={swap.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">
                            {swap.requester_name || swap.requester_id} → {swap.receiver_name || swap.receiver_id}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(swap.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className={`${getStatusColor(swap.status)} flex items-center space-x-1`}>
                          {getStatusIcon(swap.status)}
                          <span className="capitalize">{swap.status}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <Button
                onClick={handleExportUsers}
                disabled={loadingStates["export-users"]}
                variant="outline"
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                {loadingStates["export-users"] ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
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
                          <p className="text-xs text-gray-400">ID: {user.id}</p>
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
                          <p className="text-sm text-gray-500">{user.skills_wanted.length} skills wanted</p>
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
                          {user.is_banned ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled // Disable if already banned
                              className="border-red-200 text-red-700 rounded-xl cursor-not-allowed bg-transparent"
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Banned
                            </Button>
                          ) : (
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
                            disabled={loadingStates[`ban-${user.id}`]}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {loadingStates[`ban-${user.id}`] ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Ban className="w-4 h-4 mr-1" />
                            )}
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
              <Button
                onClick={handleExportSwaps}
                disabled={loadingStates["export-swaps"]}
                variant="outline"
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                {loadingStates["export-swaps"] ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
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
                            From: {swap.requester_name || swap.requester_id} → To:{" "}
                            {swap.receiver_name || swap.receiver_id}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(swap.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">ID: {swap.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(swap.status)} flex items-center space-x-1`}>
                          {getStatusIcon(swap.status)}
                          <span className="capitalize">{swap.status}</span>
                        </Badge>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSwap(swap.id)}
                            disabled={loadingStates[`delete-swap-${swap.id}`]}
                            className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl"
                          >
                            {loadingStates[`delete-swap-${swap.id}`] ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            Delete
                          </Button>
                        </div>
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
