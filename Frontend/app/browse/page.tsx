"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MapPin, Star, Clock, MessageSquare, User, Award, Eye, Heart } from "lucide-react"

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Web Development", "Design", "Photography", "Languages", "Music", "Marketing", "Writing"]

  const users = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "SC",
      location: "San Francisco, CA",
      rating: 4.9,
      reviews: 24,
      skillsOffered: ["React Development", "Node.js", "TypeScript"],
      skillsWanted: ["UI/UX Design", "Figma", "Graphic Design"],
      availability: "Weekends",
      lastActive: "2 hours ago",
      isOnline: true,
      profileViews: 156,
      successfulSwaps: 12,
      bio: "Full-stack developer with 5+ years experience. Love teaching and learning new technologies!",
      color: "blue",
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "MJ",
      location: "New York, NY",
      rating: 4.8,
      reviews: 18,
      skillsOffered: ["Photography", "Photo Editing", "Lightroom"],
      skillsWanted: ["Video Editing", "After Effects", "Motion Graphics"],
      availability: "Evenings",
      lastActive: "1 day ago",
      isOnline: false,
      profileViews: 89,
      successfulSwaps: 8,
      bio: "Professional photographer specializing in portraits and events. Always excited to share knowledge!",
      color: "emerald",
    },
    {
      id: 3,
      name: "Emma Wilson",
      avatar: "EW",
      location: "London, UK",
      rating: 4.7,
      reviews: 31,
      skillsOffered: ["Spanish", "French", "Language Teaching"],
      skillsWanted: ["Piano", "Music Theory", "Guitar"],
      availability: "Flexible",
      lastActive: "30 minutes ago",
      isOnline: true,
      profileViews: 203,
      successfulSwaps: 15,
      bio: "Polyglot and language teacher. I speak 6 languages and love helping others learn!",
      color: "purple",
    },
    {
      id: 4,
      name: "Alex Kumar",
      avatar: "AK",
      location: "Toronto, CA",
      rating: 4.6,
      reviews: 12,
      skillsOffered: ["Digital Marketing", "SEO", "Content Strategy"],
      skillsWanted: ["Web Development", "WordPress", "E-commerce"],
      availability: "Weekdays",
      lastActive: "5 hours ago",
      isOnline: false,
      profileViews: 67,
      successfulSwaps: 6,
      bio: "Marketing specialist with expertise in digital campaigns and brand strategy.",
      color: "orange",
    },
    {
      id: 5,
      name: "Lisa Park",
      avatar: "LP",
      location: "Seoul, KR",
      rating: 5.0,
      reviews: 8,
      skillsOffered: ["Graphic Design", "Illustrator", "Branding"],
      skillsWanted: ["3D Modeling", "Blender", "Animation"],
      availability: "Weekends",
      lastActive: "1 hour ago",
      isOnline: true,
      profileViews: 134,
      successfulSwaps: 4,
      bio: "Creative designer passionate about visual storytelling and brand identity.",
      color: "pink",
    },
    {
      id: 6,
      name: "David Brown",
      avatar: "DB",
      location: "Sydney, AU",
      rating: 4.8,
      reviews: 22,
      skillsOffered: ["Guitar", "Music Production", "Songwriting"],
      skillsWanted: ["Video Production", "YouTube", "Content Creation"],
      availability: "Evenings",
      lastActive: "3 hours ago",
      isOnline: false,
      profileViews: 98,
      successfulSwaps: 11,
      bio: "Musician and producer with 10+ years experience. Love collaborating with creative minds!",
      color: "indigo",
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === "All" ||
      user.skillsOffered.some((skill) => skill.includes(selectedCategory)) ||
      user.skillsWanted.some((skill) => skill.includes(selectedCategory))

    return matchesSearch && matchesCategory
  })

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Skills</h1>
          <p className="text-gray-600">Discover amazing people and their skills</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search skills, people, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 rounded-xl h-12"
              />
            </div>
            <Button
              variant="outline"
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 px-6"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredUsers.length}</span> skilled people
          </p>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white bg-${user.color}-500`}
                      >
                        {user.avatar}
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{user.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {user.location}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{user.rating}</span>
                    <span className="ml-1">({user.reviews})</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{user.profileViews}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    <span>{user.successfulSwaps}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills Offered</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-700 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{user.availability}</span>
                  </div>
                  <span>Active {user.lastActive}</span>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 rounded-xl"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Request Swap
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                  >
                    <User className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
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
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
