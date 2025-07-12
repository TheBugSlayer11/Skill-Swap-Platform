import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Mail, MessageSquare, MoreHorizontal, Crown, Star } from "lucide-react"

export default function TeamPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Team</h1>
            <p className="text-gray-600">Manage your team members and collaborators</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Johnson",
              role: "Team Lead",
              email: "sarah@hacktemplate.com",
              avatar: "SJ",
              status: "online",
              projects: 8,
              isOwner: true,
              color: "blue",
            },
            {
              name: "Mike Chen",
              role: "Full Stack Developer",
              email: "mike@hacktemplate.com",
              avatar: "MC",
              status: "online",
              projects: 6,
              isOwner: false,
              color: "emerald",
            },
            {
              name: "Emily Rodriguez",
              role: "UI/UX Designer",
              email: "emily@hacktemplate.com",
              avatar: "ER",
              status: "away",
              projects: 4,
              isOwner: false,
              color: "purple",
            },
            {
              name: "David Kim",
              role: "Backend Developer",
              email: "david@hacktemplate.com",
              avatar: "DK",
              status: "offline",
              projects: 5,
              isOwner: false,
              color: "orange",
            },
            {
              name: "Lisa Wang",
              role: "Data Scientist",
              email: "lisa@hacktemplate.com",
              avatar: "LW",
              status: "online",
              projects: 3,
              isOwner: false,
              color: "pink",
            },
            {
              name: "Alex Thompson",
              role: "DevOps Engineer",
              email: "alex@hacktemplate.com",
              avatar: "AT",
              status: "online",
              projects: 7,
              isOwner: false,
              color: "indigo",
            },
          ].map((member, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${member.color}-100 text-${member.color}-600 font-bold`}
                    >
                      {member.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        member.status === "online"
                          ? "bg-emerald-500"
                          : member.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    {member.isOwner && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Owner
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="w-4 h-4" />
                      <span>{member.projects} projects</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === "online"
                          ? "bg-emerald-100 text-emerald-800"
                          : member.status === "away"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
