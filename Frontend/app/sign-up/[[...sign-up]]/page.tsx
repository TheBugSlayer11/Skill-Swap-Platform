import { SignUp } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, ArrowLeft, Sparkles, Trophy, Rocket, Star } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">HackTemplate</span>
            </Link>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start your <span className="text-emerald-200">winning</span> journey
            </h1>

            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Join thousands of developers who are building faster and winning more hackathons. Your breakthrough
              project starts here.
            </p>

            <div className="space-y-4">
              {[
                { icon: Rocket, text: "Launch projects in minutes" },
                { icon: Trophy, text: "Win more hackathons" },
                { icon: Star, text: "Join the elite community" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-emerald-200" />
                  </div>
                  <span className="text-emerald-100">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Success Stories */}
            <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full border-2 border-white/20"
                    ></div>
                  ))}
                </div>
                <span className="text-sm text-emerald-100">10,000+ developers</span>
              </div>
              <p className="text-sm text-emerald-200">
                "This template helped us win our first hackathon! The setup was incredibly fast." - Sarah, Developer
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white/50 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center">
              <Link href="/" className="inline-flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  HackTemplate
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Join the winners</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account 🚀</h1>
              <p className="text-gray-600">Start building your winning project today</p>
            </div>

            {/* Sign Up Form */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl">
              <CardContent className="p-8">
                <SignUp
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm normal-case font-medium shadow-lg border-0 transition-all duration-200 rounded-xl",
                      card: "shadow-none bg-transparent",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 transition-all duration-200 rounded-xl",
                      formFieldInput:
                        "bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl",
                      footerActionLink: "text-emerald-600 hover:text-emerald-700",
                      formFieldLabel: "text-gray-700 font-medium",
                      dividerLine: "bg-gray-200",
                      dividerText: "text-gray-500",
                      formHeaderTitle: "text-gray-900",
                      formHeaderSubtitle: "text-gray-600",
                      socialButtonsBlockButtonText: "text-gray-700 font-medium",
                      formButtonReset: "text-emerald-600 hover:text-emerald-700",
                    },
                  }}
                  // Direct API call after signup completion
                  redirectUrl="/api/auth/after-auth"
                />
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>

              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
