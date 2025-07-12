"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";

const Contest = () => {
  const [contestCode, setContestCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [contests, setContests] = useState([]);
  useEffect(() => {
    async function getContests() {
      try {
        const res = await fetch("/api/contests");
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];

        setContests(data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
        setContests([]);
      }
    }
    getContests();
  }, []);
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col overflow-hidden">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 h-full">
        {/* Left Panel */}
        <div className="md:row-span-3 bg-[#3b1f0b] rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-amber-300 mb-4">
            📅 Contest List
          </h2>
          <ul>
            {contests.map((contest, index) => {
              return <li key={contest.name}>{contest.name}</li>;
            })}
          </ul>
        </div>

        {/* Top Right Panel */}
        <div className="md:col-span-2 bg-[#1e1e1e] rounded-xl p-6 shadow-lg flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white">
            🔍 Join a Contest
          </h2>
          <input
            className="bg-white text-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={contestCode}
            onChange={(e) => setContestCode(e.target.value)}
            placeholder="Enter contest code..."
          />
          <div className="flex gap-4">
            <button
              onClick={() =>
                alert(`Searching contest with code: ${contestCode}`)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🔍 Search
            </button>
            <button
              onClick={() => router.push("/createcontest")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              ➕ Create Contest
            </button>
          </div>
        </div>

        {/* Bottom Right Panel */}
        <div className="md:col-span-2 bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-2">
            📝 Contest Info
          </h2>
          <p className="text-gray-300 text-sm">
            Details about the selected contest will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contest;
