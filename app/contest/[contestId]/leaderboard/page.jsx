"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

export default function LeaderboardPage() {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch(`/api/leaderboard/${contestId}`);
      const data = await res.json();
      console.log(data);
      setLeaderboard(data);
    };

    fetchLeaderboard();
  }, [contestId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Navbar />
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <Card className="bg-slate-800/60 border border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-bold">
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-slate-700 text-gray-300 text-left text-sm">
                    <th className="border-b border-slate-600 p-3">Rank</th>
                    <th className="border-b border-slate-600 p-3">User ID</th>
                    <th className="border-b border-slate-600 p-3">Problems Solved</th>
                    <th className="border-b border-slate-600 p-3">Total Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-400 py-4">
                        No submissions yet
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <tr
                        key={entry.userId}
                        className="hover:bg-slate-700/40 transition"
                      >
                        <td className="border-b border-slate-700 p-3">{index + 1}</td>
                        <td className="border-b border-slate-700 p-3">{entry.userId}</td>
                        <td className="border-b border-slate-700 p-3">{entry.problemsSolved}</td>
                        <td className="border-b border-slate-700 p-3">{entry.totalTime}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
