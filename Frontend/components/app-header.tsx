"use client"

import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Bell, Handshake, User, Search, MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppHeader() {
  const pathname = usePathname()

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/dashboard" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/browse"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/browse" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Browse Skills
              </Link>
              <Link
                href="/swaps"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/swaps" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                My Swaps
              </Link>
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === "/profile" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/browse">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
              >
                <Search className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/swaps">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
              >
                <User className="w-4 h-4" />
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}
