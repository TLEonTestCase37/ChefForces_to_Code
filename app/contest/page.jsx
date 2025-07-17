"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CalendarDays, Search, Plus, Info, Trophy, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "../../components/Navbar"

const Contest = () => {
  const [contestCode, setContestCode] = useState("")
  const [loading, setLoading] = useState(true) // Set to true initially for loading state
  const router = useRouter()
  const [contests, setContests] = useState([])

  useEffect(() => {
    async function getContests() {
      try {
        const res = await fetch("/api/contests")
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        setContests(data)
      } catch (err) {
        console.error("Failed to fetch contests:", err)
        setContests([])
      } finally {
        setLoading(false) // Set loading to false after fetch
      }
    }
    getContests()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Contest Hub</h1>
              <p className="text-gray-400">Compete, learn, and challenge yourself with coding contests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Contest List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/60 border-slate-600 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-blue-400" />
                  Upcoming Contests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full bg-slate-700" />
                    <Skeleton className="h-12 w-full bg-slate-700" />
                    <Skeleton className="h-12 w-full bg-slate-700" />
                  </div>
                ) : contests.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No contests found</p>
                    <p className="text-gray-500 text-sm">Check back later or create a new one!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contests.map((contest) => (
                      <Link key={contest._id} href={`/contest/${contest._id}`} className="block">
                        <Card className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-all duration-200 cursor-pointer group">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                                {contest.name}
                              </h3>
                              <div className="flex items-center text-sm text-gray-400 mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{contest.duration || "2 hours"}</span>
                                <Badge className="ml-2 bg-green-500/20 text-green-300 border-green-500/30">Live</Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400">
                              <Info className="h-5 w-5" />
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panels */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Top Right Panel - Join a Contest */}
            <Card className="bg-slate-800/60 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-400" />
                  Join a Contest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                    value={contestCode}
                    onChange={(e) => setContestCode(e.target.value)}
                    placeholder="Enter contest code..."
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => alert(`Searching contest with code: ${contestCode}`)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Contest
                  </Button>
                  <Button
                    onClick={() => router.push("/createcontest")}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Contest
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Right Panel - Contest Info */}
            <Card className="bg-slate-800/60 border-slate-600 flex-1">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-400" />
                  Contest Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-base">Details about the selected contest will appear here.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Click on a contest from the list to view its full details, including problems, rules, and leaderboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contest
