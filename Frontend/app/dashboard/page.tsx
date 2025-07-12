import { currentUser } from "@clerk/nextjs/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/app-layout"
import {
  MessageSquare,
  Star,
  Plus,
  Handshake,
  TrendingUp,
  Calendar,
  Clock,
  Search,
  UserCheck,
  Award,
  Eye,
} from "lucide-react"

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.firstName || "Swapper"}!</h1>
            <div className="text-3xl">👋</div>
          </div>
          <p className="text-gray-600 text-lg">Ready to exchange some skills? Here's your swap overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Active Swaps",
              value: "3",
              change: "+1 this week",
              icon: Handshake,
              gradient: "from-blue-500 to-blue-600",
              bgGradient: "from-blue-50 to-blue-100",
              iconBg: "bg-blue-500",
            },
            {
              title: "Skills Offered",
              value: "5",
              change: "+2 recently",
              icon: UserCheck,
              gradient: "from-emerald-500 to-emerald-600",
              bgGradient: "from-emerald-50 to-emerald-100",
              iconBg: "bg-emerald-500",
            },
            {
              title: "Profile Views",
              value: "24",
              change: "+8 this week",
              icon: Eye,
              gradient: "from-orange-500 to-orange-600",
              bgGradient: "from-orange-50 to-orange-100",
              iconBg: "bg-orange-500",
            },
            {
              title: "Rating",
              value: "4.8★",
              change: "From 12 reviews",
              icon: Star,
              gradient: "from-purple-500 to-purple-600",
              bgGradient: "from-purple-50 to-purple-100",
              iconBg: "bg-purple-500",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.bgGradient} border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg rounded-2xl`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                  <span className="text-emerald-600 font-medium">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Swap Requests */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-gray-900 text-xl font-bold flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Swap Requests
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 rounded-xl"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Skills
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah Chen",
                      skill: "Web Development",
                      wants: "Graphic Design",
                      status: "Pending",
                      time: "2 hours ago",
                      avatar: "SC",
                      color: "blue",
                    },
                    {
                      name: "Mike Johnson",
                      skill: "Photography",
                      wants: "Video Editing",
                      status: "Accepted",
                      time: "1 day ago",
                      avatar: "MJ",
                      color: "emerald",
                    },
                    {
                      name: "Emma Wilson",
                      skill: "Spanish Tutoring",
                      wants: "Piano Lessons",
                      status: "In Progress",
                      time: "3 days ago",
                      avatar: "EW",
                      color: "orange",
                    },
                    {
                      name: "Alex Kumar",
                      skill: "Digital Marketing",
                      wants: "Content Writing",
                      status: "Completed",
                      time: "1 week ago",
                      avatar: "AK",
                      color: "purple",
                    },
                  ].map((swap, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 border border-gray-200/50"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-semibold text-white ${
                            swap.color === "emerald"
                              ? "bg-emerald-500"
                              : swap.color === "blue"
                                ? "bg-blue-500"
                                : swap.color === "orange"
                                  ? "bg-orange-500"
                                  : swap.color === "purple"
                                    ? "bg-purple-500"
                                    : "bg-gray-500"
                          }`}
                        >
                          {swap.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{swap.name}</h3>
                          <p className="text-sm text-gray-500">
                            Offers: <span className="font-medium">{swap.skill}</span> • Wants:{" "}
                            <span className="font-medium">{swap.wants}</span>
                          </p>
                          <p className="text-xs text-gray-400">{swap.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            swap.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : swap.status === "Accepted" || swap.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {swap.status}
                        </span>
                        {swap.status === "Pending" && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2 py-1"
                            >
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs px-2 py-1 bg-transparent">
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg font-bold flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Skills
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Messages
                </Button>
              </CardContent>
            </Card>

            {/* Your Skills */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg font-bold flex items-center">
                  <Award className="w-5 h-5 mr-2 text-emerald-600" />
                  Your Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { skill: "React Development", level: "Expert", color: "blue" },
                    { skill: "UI/UX Design", level: "Intermediate", color: "purple" },
                    { skill: "Photography", level: "Advanced", color: "emerald" },
                  ].map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{skill.skill}</p>
                        <p className="text-xs text-gray-500">{skill.level}</p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          skill.color === "blue"
                            ? "bg-blue-500"
                            : skill.color === "purple"
                              ? "bg-purple-500"
                              : "bg-emerald-500"
                        }`}
                      ></div>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Skill
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-gray-900 text-lg font-bold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-blue-900">Web Dev Session</div>
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xs text-blue-600">Today, 3:00 PM</div>
                    <div className="text-xs text-blue-500 mt-1">with Sarah Chen</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-emerald-900">Design Review</div>
                      <Clock className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xs text-emerald-600">Tomorrow, 10:00 AM</div>
                    <div className="text-xs text-emerald-500 mt-1">with Mike Johnson</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
