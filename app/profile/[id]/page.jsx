"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Mail, User, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const { id } = useParams(); // this is userId from URL
  const [userInfo, setUserInfo] = useState(null);
  const [curUserId, setCurUserId] = useState(null); // 👈 current logged-in user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurUserId(user.uid); // 👈 Set the currently logged-in user's UID

        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) throw new Error("Failed to fetch user data");
          const data = await res.json();
          setUserInfo(data);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [id]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile Info */}
        <Card className="bg-slate-800/60 border border-slate-600 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white text-3xl">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-600 rounded w-1/2" />
                <div className="h-4 bg-slate-600 rounded w-1/3" />
                <div className="h-4 bg-slate-600 rounded w-1/4" />
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>{userInfo?.userEmail}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-green-400" />
                  <span className="text-xl font-bold">
                    {userInfo?.username ?? "Unknown User"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-yellow-400" />
                  <span>Problems Solved: {userInfo?.userSolvedCount || 0}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="bg-slate-800/60 border border-slate-600 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Activity Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-400">
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-slate-600 rounded-xl">
              <span className="text-sm">[Heatmap coming soon...]</span>
            </div>
          </CardContent>
        </Card>

        {/* Submissions */}
        <Card className="bg-slate-800/60 border border-slate-600 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-slate-700 pb-2"
                  >
                    <div className="h-4 bg-slate-600 rounded w-2/3" />
                    <div className="h-4 bg-slate-600 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : userInfo?.userSubmissions?.length > 0 ? (
              userInfo.userSubmissions.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-slate-700 pb-2 text-gray-300"
                >
                  <span className="text-white font-medium">
                    {sub.problemName}
                  </span>
                  <Badge
                    className={
                      sub.verdict === "Accepted"
                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                        : sub.verdict === "Wrong Answer"
                        ? "bg-red-500/20 text-red-300 border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    }
                  >
                    {sub.verdict}
                  </Badge>
                </div>
              ))
            ) : (
              <span className="text-slate-400">No submissions yet.</span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
