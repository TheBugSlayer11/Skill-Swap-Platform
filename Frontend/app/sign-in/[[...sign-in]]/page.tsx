import { SignIn } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, ArrowLeft, Shield, Users, Star } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">SkillSwap</span>
            </Link>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome back to the <span className="text-blue-200">Skill Exchange</span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Continue connecting with like-minded learners. Share your skills, learn from others, and grow your network.
            </p>

            <div className="space-y-4">
              {[
                { icon: Shield, text: "Safe & secure community" },
                { icon: Users, text: "Thousands of skill swappers" },
                { icon: Star, text: "Grow your reputation & feedback" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-blue-200" />
                  </div>
                  <span className="text-blue-100">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white/50 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center">
              <Link href="/" className="inline-flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  SkillSwap
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
              <p className="text-gray-600">Sign in to manage your skill swaps</p>
            </div>

            {/* Sign In Form */}
            <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl">
              <CardContent className="p-8">
                <SignIn
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm normal-case font-medium shadow-lg border-0 transition-all duration-200 rounded-xl",
                      card: "shadow-none bg-transparent",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton:
                        "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 transition-all duration-200 rounded-xl",
                      formFieldInput:
                        "bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-xl",
                      footerActionLink: "text-blue-600 hover:text-blue-700",
                      formFieldLabel: "text-gray-700 font-medium",
                      dividerLine: "bg-gray-200",
                      dividerText: "text-gray-500",
                      formHeaderTitle: "text-gray-900",
                      formHeaderSubtitle: "text-gray-600",
                      socialButtonsBlockButtonText: "text-gray-700 font-medium",
                      formButtonReset: "text-blue-600 hover:text-blue-700",
                    },
                  }}
                  redirectUrl="/api/auth/after-auth"
                />
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Sign up here
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
