"use client";

import { Loader } from "@/components/Loader";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ContestPage = () => {
  const { contestId } = useParams();
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState(null);

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

  if (loading || !contest) return <Loader />;

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col">
      <Navbar />

      <motion.div
        className="flex-1 container mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-white">{contest.name}</h1>
          <p className="text-gray-400 text-sm mt-2">
            Created At: {formatDate(contest.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Contest Info */}
          <div className="lg:col-span-1 bg-[#1e1e1e] rounded-xl p-5 border border-gray-700 shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-white">Contest Info</h2>
            <div className="text-sm text-gray-300 space-y-2">
              <div>
                <span className="text-gray-400">Start Time:</span><br />
                {formatDate(contest.startTime)}
              </div>
              <div>
                <span className="text-gray-400">End Time:</span><br />
                {formatDate(contest.endTime)}
              </div>
              <div>
                <span className="text-gray-400">Duration:</span><br />
                {Math.floor(
                  (new Date(contest.endTime) - new Date(contest.startTime)) /
                    60000
                )}{" "}
                minutes
              </div>
            </div>
          </div>

          {/* Right: Problems */}
          <div className="lg:col-span-2 bg-[#1e1e1e] rounded-xl p-5 border border-gray-700 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Problems</h2>
            {contest.problems?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                  <thead className="text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Problem ID</th>
                      <th className="py-2 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contest.problems.map((pid, idx) => (
                      <tr
                        key={pid}
                        className="hover:bg-white/5 transition-colors border-b border-gray-800"
                      >
                        <td className="py-2 px-3">{String.fromCharCode(65 + idx)}</td>
                        <td className="py-2 px-3 font-mono">{pid}</td>
                        <td className="py-2 px-3">
                          <a
                            href={`/dashboard/question/${pid}`}
                            className="text-blue-400 hover:underline"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No problems added to this contest.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContestPage;
