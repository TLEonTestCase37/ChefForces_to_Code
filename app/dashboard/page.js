"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
const Dashboard = () => {
  const router =useRouter();
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
        setProblems([]); // fallback to empty
      }
    }
  
    getProblems();
  }, []);
  

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
    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] min-h-screen text-white">
      <Navbar />

      <div className="flex flex-col md:flex-row pt-10 px-6 md:px-16 gap-6 w-full">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden md:block md:w-1/4 bg-[#1f1f1f] backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-amber-400">Dashboard</h2>
          <div className="flex flex-col gap-4 text-lg">
            <button className="text-left text-white hover:text-amber-400 transition duration-200">
              📘 My Problems
            </button>
            <button className="text-left text-white hover:text-amber-400 transition duration-200">
              🎓 My Courses
            </button>
          </div>
        </motion.div>

        {/* Problems Table */}
        <div className="w-full">
          <h1 className="text-3xl font-bold text-amber-400 mb-6">All Problems</h1>
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
                {problems.map((problem, index) => (
                  <motion.tr
                    key={problem._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#292929] transition border-b border-gray-800"
                    onClick={()=>{router.push(`/dashboard/question/${problem._id}`)}}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium hover:text-amber-400 cursor-pointer">
                      {problem.title}
                    </td>
                    <td className={`px-6 py-4 font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-gray-400">
                      {(problem.tags || []).join(", ") || "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
