"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [tests, setTests] = useState([]);
  const [langId, setLangId] = useState(71);
  const [testResults, setTestResults] = useState([]);
  const [disable, setDisable] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curUser) => {
      if (curUser) setDisable(false);
      setUser(curUser.uid)
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch(`/api/problems/${id}`);
        const data = await res?.json();
        console.log(data);
        setTests(data.testcases);
        setQuestion(data);
        console.log(data.testcases);
      } catch (err) {
        console.error("Error fetching question:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchQuestion();
  }, [id]);

  const handleSubmit = async () => {
    if (submitted || disable) return;
    console.log(1);
    if (userCode.trim().length === 0) {
      window.alert("Likha ni kuch");
      return;
    }
    setSubmitted(true);
    setTestResults([]);
    let accepted = true;
    try {
      const results = [];
      for (let i = 0; i < tests.length; i += 2) {
        const stdin = tests[i];
        const expected_output = tests[i + 1];
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: userCode,
            language_id: langId,
            stdin,
            expected_output,
          }),
        });
        const data = await res.json();
        results.push({
          verdict: data.error ? `❌ ${data.verdict}` : `✅ ${data.verdict}`,
          output: data.output || "",
        });
        if (data.error) accepted = false;
      }
      setTestResults(results);
    } catch (err) {
      console.error("Submission failed:", err);
      window.alert("Error while submitting code");
    } finally {
      try {
        const res = await fetch(`/api/users/${user}`, {
          method: "PUT",
          body: JSON.stringify({
            problemName: question?.title || "",
            verdict: accepted ? "Accepted" : "Wrong Answer",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Update failed:", errorData);
          // optional: show a toast
          alert(`Failed to update: ${errorData.error}`);
          return;
        }

        const data = await res.json();
        console.log("Update success:", data);
        // optional: toast or visual feedback
        alert("Submission saved successfully!");
      } catch (error) {
        console.error("Network error:", error);
        alert("Something went wrong. Please try again later.");
      }
      setSubmitted(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const languages = [
    { id: 71, name: "Python 3", icon: "🐍" },
    { id: 54, name: "C++", icon: "⚡" },
    { id: 62, name: "Java", icon: "☕" },
    { id: 63, name: "JavaScript", icon: "🟨" },
  ];

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
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64 bg-slate-700" />
                    <Skeleton className="h-4 w-48 bg-slate-700" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-white">
                      {question?.title}
                    </h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge
                        className={getDifficultyColor(question?.difficulty)}
                      >
                        {question?.difficulty}
                      </Badge>
                      <span className="text-gray-400">Problem #{id}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Problem Description */}
          <div className="flex flex-col">
            <Card className="bg-slate-800/60 border-slate-600 flex-1 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-blue-400" />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full bg-slate-700" />
                    <Skeleton className="h-4 w-3/4 bg-slate-700" />
                    <Skeleton className="h-4 w-full bg-slate-700" />
                    <Skeleton className="h-32 w-full bg-slate-700" />
                  </div>
                ) : (
                  <>
                    <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                      {question?.description}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                          <Terminal className="h-4 w-4 mr-2 text-green-400" />
                          Sample Input
                        </h3>
                        <Card className="bg-slate-900/60 border-slate-600">
                          <CardContent className="p-4">
                            <pre className="text-green-300 font-mono text-sm overflow-x-auto">
                              {question?.sampleTestCase}
                            </pre>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                          <Terminal className="h-4 w-4 mr-2 text-blue-400" />
                          Sample Output
                        </h3>
                        <Card className="bg-slate-900/60 border-slate-600">
                          <CardContent className="p-4">
                            <pre className="text-blue-300 font-mono text-sm overflow-x-auto">
                              {question?.sampleOutput}
                            </pre>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor and Results */}
          <div className="flex flex-col space-y-6">
            {/* Code Editor */}
            <Card className="bg-slate-800/60 border-slate-600 flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-400" />
                    Code Editor
                  </CardTitle>
                  <Select
                    value={langId.toString()}
                    onValueChange={(value) => setLangId(Number(value))}
                  >
                    <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {languages.map((lang) => (
                        <SelectItem
                          key={lang.id}
                          value={lang.id.toString()}
                          className="text-white hover:bg-slate-700"
                        >
                          <span className="flex items-center">
                            <span className="mr-2">{lang.icon}</span>
                            {lang.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <Textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="Write your code here..."
                  className="flex-1 bg-slate-900/60 border-slate-600 text-white font-mono text-sm resize-none focus:border-blue-400 min-h-[300px] max-h-[400px] overflow-auto whitespace-pre"
                />

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitted || disable}
                    className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white"
                  >
                    {submitted ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Submit Solution
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card className="bg-slate-800/60 border-slate-600 max-h-80">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-400" />
                  Test Results
                  {testResults.length > 0 && (
                    <Badge className="ml-2 bg-blue-500/20 text-blue-300">
                      {testResults.length} test
                      {testResults.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                {submitted ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-blue-400 animate-spin" />
                      <span className="text-gray-300">
                        Running test cases...
                      </span>
                    </div>
                  </div>
                ) : testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Terminal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No test results yet</p>
                    <p className="text-gray-500 text-sm">
                      Submit your solution to see results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <Card
                        key={index}
                        className="bg-slate-700/50 border-slate-600"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              Test Case {index + 1}
                            </h4>
                            <div className="flex items-center">
                              {result.verdict.includes("✅") ? (
                                <CheckCircle className="h-4 w-4 text-green-400 mr-1" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400 mr-1" />
                              )}
                              <span
                                className={
                                  result.verdict.includes("✅")
                                    ? "text-green-300"
                                    : "text-red-300"
                                }
                              >
                                {result.verdict}
                              </span>
                            </div>
                          </div>
                          {result.output && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-400 mb-1">
                                Output:
                              </p>
                              <pre className="bg-slate-900/60 p-2 rounded text-xs font-mono text-gray-300 overflow-x-auto">
                                {result.output}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
