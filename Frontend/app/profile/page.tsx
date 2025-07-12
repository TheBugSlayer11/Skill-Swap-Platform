"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { updateUser, getUserById, uploadProfilePhoto } from "@/lib/api"
import { User, Mail, MapPin, Save, Edit3, Camera, Loader2, Plus, X, Clock, Globe, Lock, Star } from "lucide-react"

export default function ProfilePage() {
  const { user } = useUser()
  const { userId } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("")

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    address: "",
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: "",
    isPublic: true,
    rating: 0,
    profileUrl: "",
  })

  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")

  // Load user data from backend and Clerk
  useEffect(() => {
    if (userId && user) {
      loadUserData()
    }
  }, [userId, user])

  const loadUserData = async () => {
    if (!userId || !user) return

    setIsLoading(true)
    try {
      const response = await getUserById(userId)
      if (response.success && response.data) {
        const userData = response.data
        setFormData({
          fullname: userData.fullname || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          username: userData.username || user.username || "",
          email: userData.email || user.emailAddresses[0]?.emailAddress || "",
          address: userData.address || "",
          skillsOffered: userData.skills_offered || [],
          skillsWanted: userData.skills_wanted || [],
          availability: userData.availability || "",
          isPublic: userData.is_public ?? true,
          rating: userData.rating || 0,
          profileUrl: userData.profile_url || "",
        })
        // Use uploaded photo if available, otherwise use Clerk photo
        setProfilePhotoPreview(userData.profile_url || user.imageUrl || "")
      } else {
        // If no backend data, use Clerk data
        setFormData((prev) => ({
          ...prev,
          fullname: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          username: user.username || "",
          email: user.emailAddresses[0]?.emailAddress || "",
        }))
        setProfilePhotoPreview(user.imageUrl || "")
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      // Fallback to Clerk data
      setFormData((prev) => ({
        ...prev,
        fullname: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        username: user.username || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }))
      setProfilePhotoPreview(user.imageUrl || "")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }))
      setNewSkillOffered("")
    }
  }

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()],
      }))
      setNewSkillWanted("")
    }
  }

  const removeSkillOffered = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
    }))
  }

  const removeSkillWanted = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((s) => s !== skill),
    }))
  }

  const handleSave = async () => {
    if (!userId) {
      setError("Authentication error. Please try again.")
      return
    }

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      // Upload profile photo first if selected
      let profileUrl = formData.profileUrl
      if (profilePhoto) {
        const photoResponse = await uploadProfilePhoto(userId, profilePhoto)
        if (photoResponse.success && photoResponse.data?.profile_url) {
          profileUrl = photoResponse.data.profile_url
        }
      }

      // Prepare payload for backend
      const payload = {
        fullname: formData.fullname,
        address: formData.address,
        profile_url: profileUrl || user?.imageUrl || "",
        skills_offered: formData.skillsOffered,
        skills_wanted: formData.skillsWanted,
        availability: formData.availability,
        is_public: formData.isPublic,
      }

      const response = await updateUser(userId, payload)

      if (response.success) {
        setSuccess("Profile updated successfully!")
        setIsEditing(false)
        setProfilePhoto(null)
        loadUserData() // Reload data
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      setError("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600">Manage your skills and preferences</p>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isSaving}
              className={`${
                isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-xl shadow-lg px-6 py-3`}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isEditing ? (
                <Save className="w-4 h-4 mr-2" />
              ) : (
                <Edit3 className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
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
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Photo & Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardContent className="p-6">
                {/* Profile Photo */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg overflow-hidden">
                      {profilePhotoPreview ? (
                        <img
                          src={profilePhotoPreview || "/placeholder.svg"}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-white text-gray-700 hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold text-gray-900">{formData.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>

                {/* Profile Status */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    {formData.isPublic ? (
                      <>
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-600">Public Profile</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">Private Profile</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.isPublic ? "Discoverable by other users" : "Hidden from search"}
                  </p>
                </div>

                {/* Username Display */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900">{formData.fullname || "No name set"}</h3>
                    <p className="text-sm text-gray-500">@{formData.username || "No username"}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{formData.skillsOffered.length}</div>
                      <div className="text-xs text-gray-500">Skills Offered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{formData.skillsWanted.length}</div>
                      <div className="text-xs text-gray-500">Skills Wanted</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <Input
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="bg-gray-50 border-gray-200 rounded-xl"
                      />
                    ) : (
                      <div className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900">
                        {formData.fullname || "Not set"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </label>
                    <div className="py-3 px-4 bg-gray-100 rounded-xl text-gray-600">{formData.email}</div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Location
                  </label>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="bg-gray-50 border-gray-200 rounded-xl"
                    />
                  ) : (
                    <div className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900">{formData.address || "Not set"}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Availability
                  </label>
                  {isEditing ? (
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="">Select availability</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Evenings">Evenings</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  ) : (
                    <div className="py-3 px-4 bg-gray-50 rounded-xl text-gray-900">
                      {formData.availability || "Not set"}
                    </div>
                  )}
                </div>

                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Make my profile public</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Public profiles can be discovered by other users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills Offered */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Skills I Can Offer</label>
                  {isEditing && (
                    <div className="flex space-x-2 mb-4">
                      <Input
                        value={newSkillOffered}
                        onChange={(e) => setNewSkillOffered(e.target.value)}
                        placeholder="e.g., Web Development"
                        className="bg-gray-50 border-gray-200 rounded-xl"
                        onKeyPress={(e) => e.key === "Enter" && addSkillOffered()}
                      />
                      <Button
                        type="button"
                        onClick={addSkillOffered}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsOffered.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSkillOffered(skill)}
                            className="ml-1 hover:text-emerald-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {formData.skillsOffered.length === 0 && (
                      <p className="text-gray-500 text-sm py-2">No skills added yet</p>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Skills I Want to Learn</label>
                  {isEditing && (
                    <div className="flex space-x-2 mb-4">
                      <Input
                        value={newSkillWanted}
                        onChange={(e) => setNewSkillWanted(e.target.value)}
                        placeholder="e.g., Graphic Design"
                        className="bg-gray-50 border-gray-200 rounded-xl"
                        onKeyPress={(e) => e.key === "Enter" && addSkillWanted()}
                      />
                      <Button
                        type="button"
                        onClick={addSkillWanted}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.skillsWanted.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-blue-200 text-blue-700 px-3 py-1 text-sm flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeSkillWanted(skill)}
                            className="ml-1 hover:text-blue-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {formData.skillsWanted.length === 0 && (
                      <p className="text-gray-500 text-sm py-2">No skills added yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setProfilePhoto(null)
                    loadUserData() // Reset form data
                  }}
                  className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg border-0 rounded-xl px-6 py-3"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
