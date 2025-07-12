"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
const CreateContest = () => {
  const router = useRouter();
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    async function getProblems() {
      try {
        const res = await fetch("/api/problems");
        const text = await res.text();
        const data = text ? JSON.parse(text) : [];

        setProblems(data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
        setProblems([]);
      }
    }
    
    getProblems();
  }, []);

  const [contestData, setContestData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    problems: [], // <-- now tracks selected problem IDs
  });
  const toggleProblemSelection = (id) => {
    setContestData((prev) => {
      const isSelected = prev.problems.includes(id);
      return {
        ...prev,
        problems: isSelected
          ? prev.problems.filter((pid) => pid !== id)
          : [...prev.problems, id],
      };
    });
  };
  const createContest = async () => {
    const { name, startTime, endTime, problems } = contestData;

    if (
      !name.trim() ||
      !startTime.trim() ||
      !endTime.trim() ||
      !problems.length === 0
    ) {
      alert("⚠️ Please fill all the fields.");
      return;
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
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        console.error("Invalid JSON:", raw);
        alert("Server returned invalid JSON.");
        return;
      }
      console.log(res);
      if (res.ok && data.success) {
        alert("✅ Contest added successfully!");
        setContestData({
          name: "",
          startTime: "",
          endTime: "",
          problems: [],
        });
      } else {
        console.error("Server error:", data);
        alert("❌ Failed to add problem.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error creating contest: " + err.message);
    }
  };
  const handleChange = (e) => {
    setContestData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col overflow-hidden">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 h-full">
        {/* Left Panel */}
        <div className="md:row-span-3 bg-[#3b1f0b] rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-amber-300 mb-4">
            🛠️ Create Contest
          </h2>
            
        </div>

        {/* Right Top Panel - Form */}
        <div className="md:col-span-2 bg-[#1e1e1e] rounded-xl p-6 shadow-lg flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white mb-2">
            📄 Contest Details
          </h2>

          <input
            name="name"
            type="text"
            placeholder="Contest Name"
            value={contestData.name}
            onChange={handleChange}
            className="bg-white text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-4">
            <input
              name="startTime"
              type="datetime-local"
              value={contestData.startTime}
              onChange={handleChange}
              className="bg-white text-black px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="endTime"
              type="datetime-local"
              value={contestData.endTime}
              onChange={handleChange}
              className="bg-white text-black px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full">
            <h1 className="text-3xl font-bold text-amber-400 mb-6">
              All Problems
            </h1>
            <div className="overflow-x-auto bg-[#1f1f1f] rounded-2xl shadow-xl border border-gray-700">
              <table className="min-w-full table-auto text-sm md:text-base">
                <thead>
                  <tr className="text-left text-gray-300 border-b border-gray-700">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem, index) => {
                    const selected = contestData.problems.includes(problem._id);
                    return (
                      <motion.tr
                        key={problem._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-[#292929] transition border-b border-gray-800 ${
                          selected ? "bg-[#292929]" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleProblemSelection(problem._id)}
                            className="accent-amber-400"
                          />
                        </td>
                        <td
                          className="px-6 py-4 font-medium hover:text-amber-400 cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/question/${problem._id}`)
                          }
                        >
                          {problem.title}
                        </td>
                        <td
                          className={`px-6 py-4 font-semibold ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell text-gray-400">
                          {(problem.tags || []).join(", ") || "—"}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <button
            onClick={createContest}
            className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-xl transition duration-200 shadow-md w-fit"
          >
            🚀 Create Contest
          </button>
        </div>

        {/* Right Bottom Panel - Info */}
        <div className="md:col-span-2 bg-[#1e1e1e] rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-2">
            Instructions
          </h2>
          <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
            <li>You can add problems after the contest is created.</li>
            <li>Start and end times are required.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateContest;
