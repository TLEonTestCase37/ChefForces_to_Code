"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CalendarDays, Plus, Save, Code, Info, Search } from "lucide-react" // Added Search and Terminal
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const CreateContest = () => {
  const router = useRouter()
  const [problems, setProblems] = useState([])
  const [loadingProblems, setLoadingProblems] = useState(true)
  const [searchTerm, setSearchTerm] = useState("") // New state for search
  const [selectedDifficulty, setSelectedDifficulty] = useState("all") // New state for difficulty filter

  useEffect(() => {
    async function getProblems() {
      try {
        const res = await fetch("/api/problems")
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        setProblems(data)
      } catch (err) {
        console.error("Failed to fetch problems:", err)
        setProblems([])
      } finally {
        setLoadingProblems(false)
      }
    }
    getProblems()
  }, [])

  const [contestData, setContestData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    problems: [], // <-- now tracks selected problem IDs
  })

  const toggleProblemSelection = (id) => {
    setContestData((prev) => {
      const isSelected = prev.problems.includes(id)
      return {
        ...prev,
        problems: isSelected ? prev.problems.filter((pid) => pid !== id) : [...prev.problems, id],
      }
    })
  }

  const createContest = async () => {
    const { name, startTime, endTime, problems } = contestData
    if (!name.trim() || !startTime.trim() || !endTime.trim() || problems.length === 0) {
      alert("⚠️ Please fill all the fields and select at least one problem.")
      return
    }
    try {
      const res = await fetch("/api/contests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          startTime,
          endTime,
          problems,
        }),
      })
      const raw = await res.text()
      let data
      try {
        data = JSON.parse(raw)
      } catch {
        console.error("Invalid JSON:", raw)
        alert("Server returned invalid JSON.")
        return
      }
      console.log(res)
      if (res.ok && data.success) {
        alert("✅ Contest added successfully!")
        setContestData({
          name: "",
          startTime: "",
          endTime: "",
          problems: [],
        })
      } else {
        console.error("Server error:", data)
        alert("❌ Failed to add contest.")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("❌ Error creating contest: " + err.message)
    }
  }

  const handleChange = (e) => {
    setContestData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

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

  // Filtering logic for problems
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty.toLowerCase() === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Plus className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Contest</h1>
              <p className="text-gray-400">Define contest details and select problems</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Create Contest Form */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Contest Details */}
            <Card className="bg-slate-800/60 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-blue-400" />
                  Contest Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-white font-medium">
                    Contest Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Weekly Coding Challenge #1"
                    value={contestData.name}
                    onChange={handleChange}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="startTime" className="text-white font-medium">
                      Start Time
                    </label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      value={contestData.startTime}
                      onChange={handleChange}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endTime" className="text-white font-medium">
                      End Time
                    </label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      value={contestData.endTime}
                      onChange={handleChange}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-400"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem Selection */}
            <Card className="bg-slate-800/60 border-slate-600 flex-1">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-400" />
                  Select Problems ({contestData.problems.length} selected)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters for Problems */}
                <div className="mb-4 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search problems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
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

                {loadingProblems ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full bg-slate-700" />
                    <Skeleton className="h-12 w-full bg-slate-700" />
                    <Skeleton className="h-12 w-full bg-slate-700" />
                  </div>
                ) : filteredProblems.length === 0 ? (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No problems found matching your criteria</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {" "}
                    {/* Added max-height and overflow */}
                    {filteredProblems.map((problem) => {
                      const selected = contestData.problems.includes(problem._id)
                      return (
                        <motion.div
                          key={problem._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                            selected
                              ? "bg-blue-500/20 border-blue-400 shadow-md"
                              : "bg-slate-700/50 border-slate-600 hover:bg-slate-700/70"
                          }`}
                          onClick={() => toggleProblemSelection(problem._id)}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleProblemSelection(problem._id)}
                              className="h-5 w-5 accent-blue-400 cursor-pointer"
                            />
                            <div>
                              <h3 className="font-medium text-white">{problem.title}</h3>
                              <Badge className={`mt-1 ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-blue-400"
                            onClick={(e) => {
                              e.stopPropagation() // Prevent toggling selection when clicking button
                              router.push(`/dashboard/question/${problem._id}`)
                            }}
                          >
                            <Info className="h-5 w-5" />
                          </Button>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create Contest Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={createContest}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-4 text-lg font-semibold shadow-md"
              >
                <Save className="h-5 w-5 mr-2" />
                Create Contest
              </Button>
            </div>
          </div>

          {/* Right Panel - Instructions */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/60 border-slate-600 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-400" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 list-disc pl-5 space-y-2">
                  <li>Fill in the contest name, start time, and end time.</li>
                  <li>Select problems from the list to include in your contest.</li>
                  <li>Use the search bar and difficulty filters to find problems easily.</li>
                  <li>Ensure all required fields are filled and at least one problem is selected.</li>
                  <li>Problems can be added or removed from the contest after creation (future feature).</li>
                  <li>Click the info icon next to a problem to view its details.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateContest
