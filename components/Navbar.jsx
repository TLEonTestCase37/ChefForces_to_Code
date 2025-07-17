"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, Code, Home, Trophy, User, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/firebase/firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
      setIsMenuOpen(false)
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Contest",
      href: "/contest",
      icon: <Trophy className="h-4 w-4" />,
      badge: "Live",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4" />,
    },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? "bg-slate-900/95 backdrop-blur-md shadow-lg" : "bg-slate-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CodeCraft</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                <span>{item.name}</span>
                {item.badge && (
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">{item.badge}</Badge>
                )}
              </button>
            ))}

            {/* Notifications */}
            <button className="relative text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              {user ? (
                <Button
                  variant="outline"
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md rounded-lg mt-2 p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs ml-auto">{item.badge}</Badge>
                  )}
                </button>
              ))}

              <div className="border-t border-slate-600 pt-4">
                <button
                  onClick={() => {
                    router.push("/profile")
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50 w-full"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span>My Profile</span>
                </button>

                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-300 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-500/10 w-full mt-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
