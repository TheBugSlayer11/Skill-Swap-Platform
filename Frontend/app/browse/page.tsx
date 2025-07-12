"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Star, MessageSquare, User, Plus, Loader2, X, LogIn, Send } from "lucide-react"

// Static fallback users data
const STATIC_USERS = [
  {
    _id: "1",
    fullname: "Sarah Chen",
    username: "sarahdesigns",
    profile_url: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
    address: "Downtown District, San Francisco, CA",
    skills_offered: ["UI/UX Design", "Figma", "Adobe Creative Suite", "User Research"],
    skills_wanted: ["React", "JavaScript", "Frontend Development"],
    availability: "Weekends",
    rating: 4.8,
    is_public: true,
    is_banned: false
  },
  {
    _id: "2",
    fullname: "Marcus Rodriguez",
    username: "marcusdev",
    profile_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    address: "Tech Hub, Austin, TX",
    skills_offered: ["React", "Node.js", "Python", "AWS"],
    skills_wanted: ["Mobile Development", "Swift", "Flutter"],
    availability: "Evenings",
    rating: 4.9,
    is_public: true,
    is_banned: false
  },
  {
    _id: "3",
    fullname: "Elena Kowalski",
    username: "elenashots",
    profile_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    address: "Arts Quarter, Portland, OR",
    skills_offered: ["Photography", "Lightroom", "Photoshop", "Wedding Photography"],
    skills_wanted: ["Video Editing", "After Effects", "Cinematography"],
    availability: "Flexible",
    rating: 4.7,
    is_public: true,
    is_banned: false
  },
  {
    _id: "4",
    fullname: "David Kim",
    username: "davidwrites",
    profile_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    address: "Financial District, New York, NY",
    skills_offered: ["Content Writing", "SEO", "Marketing Strategy", "Copywriting"],
    skills_wanted: ["Data Analysis", "Excel", "Google Analytics"],
    availability: "Weekdays",
    rating: 4.6,
    is_public: true,
    is_banned: false
  },
  {
    _id: "5",
    fullname: "Maya Patel",
    username: "mayacodes",
    profile_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    address: "Silicon Valley, San Jose, CA",
    skills_offered: ["Machine Learning", "Python", "Data Science", "TensorFlow"],
    skills_wanted: ["Mobile Development", "React Native", "iOS Development"],
    availability: "Weekends",
    rating: 4.9,
    is_public: true,
    is_banned: false
  },
  {
    _id: "6",
    fullname: "James Wilson",
    username: "jamesmusic",
    profile_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face",
    address: "Music District, Nashville, TN",
    skills_offered: ["Guitar", "Music Production", "Audio Engineering", "Songwriting"],
    skills_wanted: ["Piano", "Music Theory", "Violin"],
    availability: "Evenings",
    rating: 4.5,
    is_public: true,
    is_banned: false
  }
]

// Mock current user data
const MOCK_CURRENT_USER = {
  id: "current_user",
  name: "Current User",
  skills_offered: ["JavaScript", "React", "Node.js", "Python"]
}

// API Service for backend integration
const apiService = {
  baseURL: 'http://localhost:8000',

  async getAllUsers() {
    try {
      const response = await fetch(`${this.baseURL}/users/`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  async createSwapRequest(requestData) {
    try {
      const response = await fetch(`${this.baseURL}/swap-requests/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating swap request:', error)
      throw error
    }
  }
}

// Auth Service
const authService = {
  getCurrentUser() {
    return MOCK_CURRENT_USER
  },
  
  isAuthenticated() {
    return !!this.getCurrentUser()
  },
  
  login() {
    alert('Redirecting to login page...')
  }
}

// App Layout Component
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">SkillSwap</h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
              Profile
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Login
            </button>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

// Skill Display Component
const SkillDisplay = ({ skills, variant = "secondary", maxDisplay = 2 }) => {
  const [showAll, setShowAll] = useState(false)
  const displaySkills = showAll ? skills : skills.slice(0, maxDisplay)
  const hasMore = skills.length > maxDisplay

  return (
    <div 
      className="flex flex-wrap gap-1 relative"
      onMouseLeave={() => setShowAll(false)}
    >
      {displaySkills.map((skill, index) => (
        <span 
          key={index} 
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            variant === "secondary" 
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
              : "bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100"
          }`}
        >
          {skill}
        </span>
      ))}
      {hasMore && !showAll && (
        <span 
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-200"
          onMouseEnter={() => setShowAll(true)}
        >
          <Plus className="w-3 h-3 mr-1" />
          {skills.length - maxDisplay}
        </span>
      )}
    </div>
  )
}

// Login Modal Component
const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-6">
            Please login to request skill swaps and connect with other users.
          </p>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={authService.login}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login / Sign Up
          </button>
          <button 
            onClick={onClose}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

// Request Swap Modal Component
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
        target_user_id: targetUser._id,
        message: message.trim(),
        offered_skill: selectedOfferedSkill,
        wanted_skill: selectedWantedSkill
      })
      onClose()
      setMessage("")
      setSelectedOfferedSkill("")
      setSelectedWantedSkill("")
    } catch (error) {
      console.error('Error submitting swap request:', error)
      alert('Failed to send request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !targetUser || !currentUser) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Request Skill Swap</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={targetUser.profile_url} 
              alt={targetUser.fullname}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{targetUser.fullname}</h3>
              <p className="text-sm text-gray-500">@{targetUser.username}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Choose one of your skills to offer
            </label>
            <select
              value={selectedOfferedSkill}
              onChange={(e) => setSelectedOfferedSkill(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Choose one skill you want to learn
            </label>
            <select
              value={selectedWantedSkill}
              onChange={(e) => setSelectedWantedSkill(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them about your skills and what you'd like to learn..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
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
        </div>
      </div>
    </div>
  )
}

// User Card Component
const UserCard = ({ user, onRequestSwap, onViewProfile }) => {
  const getLocationFromAddress = (address) => {
    const parts = address.split(',')
    return parts.length >= 2 ? parts[parts.length - 2].trim() + ', ' + parts[parts.length - 1].trim() : address
  }

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-blue-300">
      <div className="p-4 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-gray-100">
            <img 
              src={user.profile_url} 
              alt={user.fullname}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user.fullname}</h3>
            <p className="text-sm text-gray-500 truncate">@{user.username}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span className="truncate">{getLocationFromAddress(user.address)}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
            <span className="text-sm font-medium text-gray-900">{user.rating}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-1">Offers</h4>
          <SkillDisplay skills={user.skills_offered} variant="secondary" maxDisplay={2} />
        </div>

        <div>
          <h4 className="text-xs font-semibold text-gray-900 mb-1">Wants</h4>
          <SkillDisplay skills={user.skills_wanted} variant="outline" maxDisplay={2} />
        </div>

        <div className="text-xs text-gray-500 py-2 border-t border-gray-100">
          <span className="font-medium">Available:</span> {user.availability}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onRequestSwap(user)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Request Swap
          </button>
          <button
            onClick={() => onViewProfile(user._id)}
            className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <User className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Component
export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const categories = ["All", "Web Development", "Design", "Photography", "Languages", "Music", "Marketing", "Writing"]

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        setUsingFallback(false)
        
        const userData = await apiService.getAllUsers()
        const filteredUsers = userData.filter(user => user.is_public && !user.is_banned)
        setUsers(filteredUsers)
      } catch (err) {
        console.warn('Backend not available, using static data:', err)
        setUsers(STATIC_USERS)
        setUsingFallback(true)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filter users based on search and category
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skills_offered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skills_wanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === "All" ||
      user.skills_offered.some((skill) => skill.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      user.skills_wanted.some((skill) => skill.toLowerCase().includes(selectedCategory.toLowerCase()))

    return matchesSearch && matchesCategory
  })

  const handleRequestSwap = async (user) => {
    if (!authService.isAuthenticated()) {
      setShowLoginModal(true)
      return
    }
    
    setSelectedUser(user)
    setShowRequestModal(true)
  }

  const handleSubmitSwapRequest = async (requestData) => {
    try {
      await apiService.createSwapRequest(requestData)
      alert('Swap request sent successfully!')
    } catch (error) {
      console.error('Error submitting swap request:', error)
      alert('Failed to send swap request. Please try again.')
    }
  }

  const handleViewProfile = (userId) => {
    console.log('Viewing profile:', userId)
    alert(`Opening profile for user: ${userId}`)
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading skilled people...</p>
            </div>
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Browse Skills
          </h1>
          <p className="text-gray-600">
            Discover talented people ready to share their skills
            {usingFallback && (
              <span className="ml-2 text-amber-600 text-sm">
                (Demo mode - showing sample users)
              </span>
            )}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills, people, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button className="flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{filteredUsers.length}</span> skilled people
          </p>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onRequestSwap={handleRequestSwap}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or filters</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Modals */}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
        
        <RequestSwapModal 
          isOpen={showRequestModal} 
          onClose={() => setShowRequestModal(false)}
          targetUser={selectedUser}
          currentUser={authService.getCurrentUser()}
          onSubmit={handleSubmitSwapRequest}
        />
      </div>
    </AppLayout>
  )
}