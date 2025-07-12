"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { updateUser, uploadProfilePhoto } from "@/lib/api"
import {
  User,
  MapPin,
  Camera,
  Plus,
  X,
  Clock,
  Globe,
  Lock,
  Loader2,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react"

export default function CompleteProfilePage() {
  const { user } = useUser()
  const { userId } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>(user?.imageUrl || "")

  const [formData, setFormData] = useState({
    fullname: user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "",
    address: "",
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: "",
    isPublic: true,
  })

  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")

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

  const handleComplete = async () => {
    if (!userId) {
      setError("Authentication error. Please try again.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Upload profile photo first if selected
      let profileUrl = user?.imageUrl || ""
      if (profilePhoto) {
        const photoResponse = await uploadProfilePhoto(userId, profilePhoto)
        if (photoResponse.success && photoResponse.data?.profile_url) {
          profileUrl = photoResponse.data.profile_url
        }
      }

      // Update user profile
      const payload = {
        fullname: formData.fullname,
        address: formData.address,
        profile_url: profileUrl,
        skills_offered: formData.skillsOffered,
        skills_wanted: formData.skillsWanted,
        availability: formData.availability,
        is_public: formData.isPublic,
      }

      const response = await updateUser(userId, payload)

      if (response.success) {
        router.push("/dashboard")
      } else {
        setError(response.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error completing profile:", error)
      setError("Failed to complete profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Welcome to SkillSwap!</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Complete Your Profile</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help others discover your skills and find the perfect learning opportunities for you.
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Set Up Your Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Profile Photo */}
              <div className="text-center">
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
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white text-gray-700 hover:bg-gray-50 shadow-lg rounded-full w-10 h-10 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to upload profile photo</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location (Optional)
                    </label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select availability</option>
                      <option value="Weekdays">Weekdays</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Evenings">Evenings</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        {formData.isPublic ? (
                          <Globe className="w-4 h-4 mr-1 text-emerald-600" />
                        ) : (
                          <Lock className="w-4 h-4 mr-1 text-gray-600" />
                        )}
                        Make my profile public
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 ml-7 mt-1">Public profiles can be discovered by other users</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills I Can Offer</label>
                    <div className="flex space-x-2 mb-2">
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
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skillsOffered.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800 flex items-center space-x-1"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkillOffered(skill)}
                            className="ml-1 hover:text-emerald-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills I Want to Learn</label>
                    <div className="flex space-x-2 mb-2">
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
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skillsWanted.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-blue-200 text-blue-700 flex items-center space-x-1"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkillWanted(skill)}
                            className="ml-1 hover:text-blue-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg shadow-lg border-0 rounded-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  )}
                  {isLoading ? "Completing..." : "Complete Profile"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg rounded-xl"
                >
                  Skip for Now
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                <p>You can always update your profile later from the settings page.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
