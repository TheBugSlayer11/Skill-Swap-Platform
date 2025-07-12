import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Folder, Calendar, Users, MoreHorizontal } from "lucide-react"

export default function ProjectsPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">Manage and track all your hackathon projects</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "AI Chat Bot",
              description: "Intelligent chatbot using OpenAI GPT-4",
              status: "In Progress",
              progress: 75,
              team: 4,
              dueDate: "Dec 15, 2024",
              color: "blue",
            },
            {
              name: "E-commerce Platform",
              description: "Full-stack e-commerce solution",
              status: "Completed",
              progress: 100,
              team: 6,
              dueDate: "Nov 30, 2024",
              color: "emerald",
            },
            {
              name: "Task Management App",
              description: "Collaborative task management tool",
              status: "In Progress",
              progress: 45,
              team: 3,
              dueDate: "Jan 10, 2025",
              color: "orange",
            },
            {
              name: "Weather Dashboard",
              description: "Real-time weather monitoring",
              status: "Planning",
              progress: 20,
              team: 2,
              dueDate: "Feb 1, 2025",
              color: "purple",
            },
            {
              name: "Social Media Analytics",
              description: "Analytics dashboard for social platforms",
              status: "In Progress",
              progress: 60,
              team: 5,
              dueDate: "Jan 20, 2025",
              color: "pink",
            },
            {
              name: "Blockchain Wallet",
              description: "Secure cryptocurrency wallet",
              status: "Planning",
              progress: 10,
              team: 3,
              dueDate: "Mar 1, 2025",
              color: "indigo",
            },
          ].map((project, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-${project.color}-100`}>
                    <Folder className={`w-5 h-5 text-${project.color}-600`} />
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 mt-3">{project.name}</CardTitle>
                <p className="text-sm text-gray-600">{project.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-${project.color}-500`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{project.team} members</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{project.dueDate}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status}
                    </span>
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
