"use client";

import Navbar from "@/components/Navbar";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Code,
  Info,
  Trophy,
  ExternalLink,
} from "lucide-react"; // Added ExternalLink
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"; // Added Badge
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

const ContestPage = () => {
  const { contestId } = useParams();
  const router = useRouter(); // Initialize useRouter
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState(null);
  const [user, setUser] = useState(null);
  const now = new Date();
  const isRunning =
    contest &&
    now >= new Date(contest.startTime) &&
    now < new Date(contest.endTime);
  const isRegistered = user && contest?.registeredUsers?.includes(user.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  const handleRegister = async () => {
    try {
      const res = await fetch(`/api/contests/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contestId,
          userId: user.uid,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Update contest state
        setContest((prev) => ({
          ...prev,
          registeredUsers: [...prev.registeredUsers, user.uid],
        }));
      }
    } catch (err) {
      console.error("Failed to register", err);
    }
  };

  useEffect(() => {
    async function getContestData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/contests/${contestId}`);
        const data = await res.json();
        setContest(data);
      } catch (err) {
        console.error("Failed to fetch contest", err);
      } finally {
        setLoading(false);
      }
    }
    if (contestId) getContestData();
  }, [contestId]);

  const formatDate = (str) =>
    new Date(str).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // If loading or contest data is not available, show a full-page skeleton
  if (loading || !contest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 pb-4 mb-8">
            <Skeleton className="h-10 w-3/4 bg-slate-700 mb-2" />
            <Skeleton className="h-4 w-1/2 bg-slate-700" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-1 h-64 bg-slate-800/60 rounded-xl" />
            <Skeleton className="lg:col-span-2 h-96 bg-slate-800/60 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-white">{contest.name}</h1>
              <p className="text-gray-400">
                Created At: {formatDate(contest.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Contest Info */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/60 border-slate-600 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-400" />
                  Contest Info
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {user ? (
                      isRunning ? (
                        isRegistered ? (
                          <div className="bg-green-600/10 text-green-400 border border-green-700 rounded-lg p-3 mb-4 text-sm">
                            ✅ You are registered for this contest.
                          </div>
                        ) : (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium mb-4"
                            onClick={handleRegister}
                          >
                            Register for Contest
                          </Button>
                        )
                      ) : (
                        <div className="bg-yellow-500/10 text-yellow-400 border border-yellow-600 rounded-lg p-3 mb-4 text-sm">
                          ⚠️ The contest is not currently running.
                        </div>
                      )
                    ) : (
                      <div className="bg-red-500/10 text-red-400 border border-red-600 rounded-lg p-3 mb-4 text-sm">
                        🔒 Please log in to register or participate.
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Start Time:</span>
                    <p className="font-medium">
                      {formatDate(contest.startTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-sm">End Time:</span>
                    <p className="font-medium">{formatDate(contest.endTime)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Duration:</span>
                    <p className="font-medium">
                      {Math.floor(
                        (new Date(contest.endTime) -
                          new Date(contest.startTime)) /
                          60000
                      )}{" "}
                      minutes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Problems */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/60 border-slate-600 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-400" />
                  Problems ({contest.problems?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contest.problems?.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {contest.problems.map((pid, idx) => (
                      <motion.div
                        key={pid}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:bg-slate-700/70 transition-all duration-200 cursor-pointer group"
                        onClick={() => {
                          if (isRunning && user) {
                            router.push(`/contest/${contestId}/problem/${pid}`);
                          } else {
                            router.push(`/dashboard/question/${pid}`);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            {String.fromCharCode(65 + idx)}
                          </Badge>
                          <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors duration-200">
                            Problem ID: {pid}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigating to problem on button click
                            router.push(`/dashboard/question/${pid}`);
                          }}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">
                      No problems added to this contest yet.
                    </p>
                    <p className="text-gray-500 text-sm">
                      The contest creator might add them soon!
                    </p>
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

export default ContestPage;
