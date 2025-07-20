"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Code, BookOpen, Trophy, Search, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Navbar from "../../components/Navbar"

const Dashboard = () => {
  const router = useRouter()
  const [problems, setProblems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  useEffect(() => {
    async function getProblems() {
      try {
        const res = await fetch("/api/problems")
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        setProblems(data)
      } catch (err) {
        console.error("Failed to fetch problems:", err)
        setProblems([]) // fallback to empty
      }
    }
    getProblems()
  }, [])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "hard":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "🟢"
      case "medium":
        return "🟡"
      case "hard":
        return "🔴"
      default:
        return "⚪"
    }
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty.toLowerCase() === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty.toLowerCase() === "easy").length,
    medium: problems.filter((p) => p.difficulty.toLowerCase() === "medium").length,
    hard: problems.filter((p) => p.difficulty.toLowerCase() === "hard").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Code className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Problem Dashboard</h1>
                <p className="text-gray-400">Master coding challenges and level up your skills</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white cursor-pointer">
              <Trophy className="h-4 w-4 mr-2" />
              View Progress
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Stats Cards */}
              <Card className="bg-slate-800/60 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                    Problem Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Problems</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {stats.total}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Easy</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{stats.easy}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Medium</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">{stats.medium}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Hard</span>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{stats.hard}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800/60 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    My Problems
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-blue-400 hover:bg-blue-500/10"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    My Courses
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/60 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedDifficulty === "all" ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty("all")}
                    className={
                      selectedDifficulty === "all"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                        : "border-slate-600 text-gray-300 hover:bg-slate-700"
                    }
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedDifficulty === "easy" ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty("easy")}
                    className={
                      selectedDifficulty === "easy"
                        ? "bg-green-500 text-white"
                        : "border-slate-600 text-gray-300 hover:bg-slate-700"
                    }
                  >
                    Easy
                  </Button>
                  <Button
                    variant={selectedDifficulty === "medium" ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty("medium")}
                    className={
                      selectedDifficulty === "medium"
                        ? "bg-yellow-500 text-white"
                        : "border-slate-600 text-gray-300 hover:bg-slate-700"
                    }
                  >
                    Medium
                  </Button>
                  <Button
                    variant={selectedDifficulty === "hard" ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty("hard")}
                    className={
                      selectedDifficulty === "hard"
                        ? "bg-red-500 text-white"
                        : "border-slate-600 text-gray-300 hover:bg-slate-700"
                    }
                  >
                    Hard
                  </Button>
                </div>
              </div>
            </div>

            {/* Problems Grid */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">All Problems ({filteredProblems.length})</h2>

              {filteredProblems.length === 0 ? (
                <Card className="bg-slate-800/60 border-slate-600">
                  <CardContent className="py-12 text-center">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No problems found</p>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredProblems.map((problem, index) => (
                    <Card
                      key={problem._id}
                      className="bg-slate-800/60 border-slate-600 hover:bg-slate-800/80 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                      onClick={() => {
                        router.push(`/dashboard/question/${problem._id}`)
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                              <span className="text-blue-300 font-bold">#{index + 1}</span>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                                {problem.title}
                              </h3>

                              <div className="flex items-center space-x-4 mt-2">
                                <Badge className={getDifficultyColor(problem.difficulty)}>
                                  {getDifficultyIcon(problem.difficulty)} {problem.difficulty}
                                </Badge>

                                {problem.tags && problem.tags.length > 0 && (
                                  <div className="flex items-center space-x-2">
                                    <Tag className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm text-gray-400">
                                      {problem.tags.slice(0, 3).join(", ")}
                                      {problem.tags.length > 3 && "..."}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">~30 min</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
