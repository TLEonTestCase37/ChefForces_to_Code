"use client"

import { useState } from "react"
import { Plus, Trash2, Code, Save, AlertCircle, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import Navbar from "../../../components/Navbar"

const SetProblems = () => {
  const [newProblem, setNewProblem] = useState({
    title: "",
    description: "",
    sampleTestCase: "",
    sampleOutput: "",
    difficulty: "",
    testcases: [["", ""]], // [ [input, output], ... ]
  })

  const handleChange = (e) => {
    setNewProblem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleTestcaseChange = (index, field, value) => {
    const updated = [...newProblem.testcases]
    updated[index][field === "input" ? 0 : 1] = value
    setNewProblem((prev) => ({ ...prev, testcases: updated }))
  }

  const addTestcase = () => {
    setNewProblem((prev) => ({
      ...prev,
      testcases: [...prev.testcases, ["", ""]],
    }))
  }

  const removeTestcase = (index) => {
    const updated = [...newProblem.testcases]
    updated.splice(index, 1)
    setNewProblem((prev) => ({ ...prev, testcases: updated }))
  }

  const setProblem = async () => {
    const { title, description, sampleTestCase, sampleOutput, difficulty, testcases } = newProblem

    if (!title.trim() || !description.trim() || !sampleTestCase.trim() || !sampleOutput.trim() || !difficulty.trim()) {
      alert("⚠️ Please fill all the fields.")
      return
    }

    const flattenedTestcases = testcases.flat()

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          sampleTestCase,
          sampleOutput,
          difficulty,
          testcases: flattenedTestcases,
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

      if (res.ok && data.success) {
        alert("✅ Problem added successfully!")
        setNewProblem({
          title: "",
          description: "",
          sampleTestCase: "",
          sampleOutput: "",
          difficulty: "",
          testcases: [["", ""]],
        })
      } else {
        console.error("Server error:", data)
        alert("❌ Failed to add problem.")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("❌ Error submitting problem: " + err.message)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "HARD":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

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
              <h1 className="text-3xl font-bold text-white">Add New Problem</h1>
              <p className="text-gray-400">Create challenging coding problems for the community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-slate-800/60 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="h-5 w-5 mr-2 text-blue-400" />
                Problem Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white font-medium">
                  Problem Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a descriptive problem title..."
                  value={newProblem.title}
                  onChange={handleChange}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white font-medium">
                  Problem Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide a detailed description of the problem..."
                  value={newProblem.description}
                  onChange={handleChange}
                  rows={6}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sampleTestCase" className="text-white font-medium">
                    Sample Input
                  </Label>
                  <Textarea
                    id="sampleTestCase"
                    name="sampleTestCase"
                    placeholder="Enter sample input..."
                    value={newProblem.sampleTestCase}
                    onChange={handleChange}
                    rows={4}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 resize-none font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sampleOutput" className="text-white font-medium">
                    Sample Output
                  </Label>
                  <Textarea
                    id="sampleOutput"
                    name="sampleOutput"
                    placeholder="Enter expected output..."
                    value={newProblem.sampleOutput}
                    onChange={handleChange}
                    rows={4}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 resize-none font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Selection */}
          <Card className="bg-slate-800/60 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
                Difficulty Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {["EASY", "MEDIUM", "HARD"].map((level) => (
                  <label key={level} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={newProblem.difficulty === level}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        newProblem.difficulty === level
                          ? "border-blue-400 bg-blue-400"
                          : "border-gray-500 group-hover:border-blue-400"
                      }`}
                    >
                      {newProblem.difficulty === level && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                    </div>
                    <Badge className={getDifficultyColor(level)}>{level}</Badge>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Cases */}
          <Card className="bg-slate-800/60 border-slate-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <TestTube className="h-5 w-5 mr-2 text-blue-400" />
                  Test Cases ({newProblem.testcases.length})
                </CardTitle>
                <Button
                  onClick={addTestcase}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test Case
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {newProblem.testcases.map(([input, output], index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">Test Case {index + 1}</CardTitle>
                      {newProblem.testcases.length > 1 && (
                        <Button
                          onClick={() => removeTestcase(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300 font-medium">Input</Label>
                        <Textarea
                          placeholder="Enter test input..."
                          value={input}
                          onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                          rows={3}
                          className="bg-slate-600/50 border-slate-500 text-white placeholder-gray-400 focus:border-blue-400 resize-none font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300 font-medium">Expected Output</Label>
                        <Textarea
                          placeholder="Enter expected output..."
                          value={output}
                          onChange={(e) => handleTestcaseChange(index, "output", e.target.value)}
                          rows={3}
                          className="bg-slate-600/50 border-slate-500 text-white placeholder-gray-400 focus:border-blue-400 resize-none font-mono text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={setProblem}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 py-4 text-lg font-semibold"
            >
              <Save className="h-5 w-5 mr-2" />
              Submit Problem
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetProblems
