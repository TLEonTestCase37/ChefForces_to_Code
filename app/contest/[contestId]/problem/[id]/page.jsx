"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const { contestId, id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [langId, setLangId] = useState(71);
  const [testResults, setTestResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [tests, setTests] = useState([]);
  const [curuserId, setCurUserId] = useState(null);
  const [problemIndex, setProblemIndex] = useState(0);
  const [startTime, setStarttime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    const fetchData = async (user) => {
      try {
        const contestRes = await fetch(`/api/contests/${contestId}`);
        const contest = await contestRes.json();
        const now = Date.now();
        const start = new Date(contest.startTime).getTime();
        const end = new Date(contest.endTime).getTime();
        // console.log(start);
        if (now < start || now > end) {
          router.push(`/contest/${contestId}/page`);
          return;
        }
        setStarttime(start);
        setEndTime(end);
        const index = contest.problems.findIndex((pid) => pid === id);
        // console.log(index);
        setProblemIndex(index + 1);
        const questionRes = await fetch(`/api/problems/${id}`);
        const data = await questionRes.json();
        setQuestion(data);
        setTests(data.testcases);
      } catch (err) {
        console.error("Error loading contest/question:", err);
        router.push(`/contest/${contestId}/page`);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (curUser) => {
      if (!curUser) {
        router.push(`/contest/${contestId}/page`);
        return;
      }
      setCurUserId(curUser.uid);
      fetchData(curUser);
    });

    return () => unsubscribe();
  }, [contestId, id, router]);

  const handleSubmit = async () => {
    const now = Date.now();
    const start = startTime;
    const end = endTime;
    if (now < start || now > end) {
      window.alert("Contest has Ended");
      router.push("/dashboard");
    }
    if (submitted || userCode.trim().length === 0) return;
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
        if (data.error) {
          accepted = false;
        }
      }
      setTestResults(results);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Error while submitting code");
    } finally {
      if (accepted) {
        await fetch("/api/contestsubmit", {
          method: "POST",
          body: JSON.stringify({
            userId: curuserId,
            contestId: contestId,
            problemIndex: problemIndex,
            timeTaken: (now - startTime) / 1000,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      setSubmitted(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Code className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {question?.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getDifficultyColor(question?.difficulty)}>
                  {question?.difficulty}
                </Badge>
                <span className="text-gray-400">Problem #{id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Problem Description */}
          <div>
            <Card className="bg-slate-800/60 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-blue-400" />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-gray-300">
                <div className="whitespace-pre-line">
                  {question?.description}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Sample Input
                  </h3>
                  <Card className="bg-slate-900/60 border-slate-600">
                    <CardContent className="p-4">
                      <pre className="text-green-300 font-mono text-sm">
                        {question?.sampleTestCase}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Sample Output
                  </h3>
                  <Card className="bg-slate-900/60 border-slate-600">
                    <CardContent className="p-4">
                      <pre className="text-blue-300 font-mono text-sm">
                        {question?.sampleOutput}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Editor + Results */}
          <div className="space-y-6">
            <Card className="bg-slate-800/60 border-slate-600">
              <CardHeader>
                <div className="flex justify-between items-center">
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
              <CardContent>
                <Textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="Write your code here..."
                  className="bg-slate-900/60 border-slate-600 text-white font-mono text-sm min-h-[300px]"
                />
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitted}
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

            <Card className="bg-slate-800/60 border-slate-600 max-h-80 overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-400" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <p className="text-gray-400 text-sm">No test results yet</p>
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
