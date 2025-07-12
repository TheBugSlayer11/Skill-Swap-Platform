import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Search, Handshake, Globe, CheckCircle, Sparkles, UserCheck } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-float animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 border-0">
                    Get Started
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                {/* <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    Dashboard
                  </Button>
                </Link> */}
                <Link href="/browse">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    Browse Skills
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <Handshake className="w-4 h-4" />
            <span>Trade Skills, Build Community</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Swap Skills
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Build Together
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Connect with others to exchange skills and knowledge. Teach what you know, learn what you need. Build a
            community where everyone grows together. 🤝
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            {/* <SignedOut>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-6 text-xl shadow-xl shadow-blue-500/25 border-0 transform hover:scale-105 transition-all duration-200 rounded-2xl"
                >
                  <UserCheck className="mr-3 w-6 h-6" />
                  Start Swapping
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </SignedOut> */}
            {/* <SignedIn> */}
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-6 text-xl shadow-xl shadow-blue-500/25 border-0 transform hover:scale-105 transition-all duration-200 rounded-2xl"
                >
                  <Search className="mr-3 w-6 h-6" />
                  Browse Skills
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            {/* </SignedIn> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "5K+", label: "Active Users", color: "text-blue-600" },
              { number: "12K+", label: "Skills Shared", color: "text-emerald-600" },
              { number: "3K+", label: "Successful Swaps", color: "text-orange-600" },
              { number: "4.8★", label: "Average Rating", color: "text-purple-600" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SkillSwap
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and effective skill exchange platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: UserCheck,
                title: "Create Your Profile",
                description:
                  "List your skills and what you want to learn. Set your availability and make your profile discoverable.",
                gradient: "from-blue-500 to-blue-600",
                bgGradient: "from-blue-50 to-blue-100",
                iconBg: "bg-blue-500",
              },
              {
                icon: Search,
                title: "Find & Connect",
                description:
                  "Browse skills, search for specific expertise, and connect with people who have what you need.",
                gradient: "from-emerald-500 to-emerald-600",
                bgGradient: "from-emerald-50 to-emerald-100",
                iconBg: "bg-emerald-500",
              },
              {
                icon: Handshake,
                title: "Swap & Learn",
                description:
                  "Exchange skills through video calls, in-person meetings, or collaborative projects. Rate your experience.",
                gradient: "from-orange-500 to-orange-600",
                bgGradient: "from-orange-50 to-orange-100",
                iconBg: "bg-orange-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${feature.bgGradient} transform hover:scale-105 rounded-3xl`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-20 h-20 ${feature.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Popular{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Skills</span>
            </h2>
            <p className="text-xl text-gray-600">Most requested skills on our platform</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Web Development", icon: "💻", color: "from-blue-500 to-blue-700" },
              { name: "Graphic Design", icon: "🎨", color: "from-purple-500 to-purple-700" },
              { name: "Photography", icon: "📸", color: "from-emerald-500 to-emerald-700" },
              { name: "Language Exchange", icon: "🗣️", color: "from-orange-500 to-orange-700" },
              { name: "Music Production", icon: "🎵", color: "from-pink-500 to-pink-700" },
              { name: "Digital Marketing", icon: "📱", color: "from-teal-500 to-teal-700" },
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="text-3xl mb-3">{skill.icon}</div>
                <div className={`font-semibold bg-gradient-to-r ${skill.color} bg-clip-text text-transparent text-sm`}>
                  {skill.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Start <span className="text-blue-200">Learning?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of learners and teachers who are growing together through skill exchange.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <SignedOut>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-6 text-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 rounded-2xl"
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  Join SkillSwap
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </SignedOut>
            {/* <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-6 text-xl font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 rounded-2xl"
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  Go to Dashboard
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </SignedIn> */}
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Safe & secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Verified profiles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SkillSwap</span>
            </div>
            <div className="text-gray-400 text-sm">© 2024 SkillSwap. Connecting learners worldwide. 🌍</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
