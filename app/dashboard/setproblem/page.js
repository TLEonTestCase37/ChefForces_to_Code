"use client";

import React, { useState } from "react";
import Navbar from "../../../components/Navbar";

const SetProblems = () => {
  const [newProblem, setNewProblem] = useState({
    title: "",
    description: "",
    sampleTestCase: "",
    sampleOutput: "",
    difficulty: "",
    testcases: [["", ""]], // [ [input, output], ... ]
  });

  const handleChange = (e) => {
    setNewProblem((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTestcaseChange = (index, field, value) => {
    const updated = [...newProblem.testcases];
    updated[index][field === "input" ? 0 : 1] = value;
    setNewProblem((prev) => ({ ...prev, testcases: updated }));
  };

  const addTestcase = () => {
    setNewProblem((prev) => ({
      ...prev,
      testcases: [...prev.testcases, ["", ""]],
    }));
  };

  const removeTestcase = (index) => {
    const updated = [...newProblem.testcases];
    updated.splice(index, 1);
    setNewProblem((prev) => ({ ...prev, testcases: updated }));
  };

  const setProblem = async () => {
    const {
      title,
      description,
      sampleTestCase,
      sampleOutput,
      difficulty,
      testcases,
    } = newProblem;

    if (
      !title.trim() ||
      !description.trim() ||
      !sampleTestCase.trim() ||
      !sampleOutput.trim() ||
      !difficulty.trim()
    ) {
      alert("⚠️ Please fill all the fields.");
      return;
    }

    const flattenedTestcases = testcases.flat();

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

      if (res.ok && data.success) {
        alert("✅ Problem added successfully!");
        setNewProblem({
          title: "",
          description: "",
          sampleTestCase: "",
          sampleOutput: "",
          difficulty: "",
          testcases: [["", ""]],
        });
      } else {
        console.error("Server error:", data);
        alert("❌ Failed to add problem.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error submitting problem: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6 text-amber-400">➕ Add New Problem</h1>

        <div className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Problem Title"
            value={newProblem.title}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <textarea
            name="description"
            placeholder="Problem Description"
            value={newProblem.description}
            onChange={handleChange}
            rows={5}
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <textarea
            name="sampleTestCase"
            placeholder="Sample Test Case Input"
            value={newProblem.sampleTestCase}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <textarea
            name="sampleOutput"
            placeholder="Sample Output"
            value={newProblem.sampleOutput}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded-xl bg-[#2a2a2a] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">🧪 Add Test Cases</h2>
            {newProblem.testcases.map(([input, output], index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-[#2a2a2a] p-4 rounded-lg border border-gray-700"
              >
                <div>
                  <label className="block mb-1 font-semibold">Input {index + 1}</label>
                  <textarea
                    rows={2}
                    placeholder="Input"
                    value={input}
                    onChange={(e) =>
                      handleTestcaseChange(index, "input", e.target.value)
                    }
                    className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Expected Output {index + 1}</label>
                  <textarea
                    rows={2}
                    placeholder="Expected Output"
                    value={output}
                    onChange={(e) =>
                      handleTestcaseChange(index, "output", e.target.value)
                    }
                    className="w-full p-2 rounded bg-[#1c1c1c] border border-gray-600 text-sm"
                  />
                </div>

                <div className="col-span-2 text-right">
                  <button
                    onClick={() => removeTestcase(index)}
                    className="text-red-400 hover:text-red-500 text-sm"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addTestcase}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              ➕ Add Test Case
            </button>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold text-lg text-white">
              Select Difficulty
            </label>
            <div className="flex gap-6">
              {["EASY", "MEDIUM", "HARD"].map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 capitalize cursor-pointer text-white"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={newProblem.difficulty === level}
                    onChange={handleChange}
                    className="accent-amber-400"
                  />
                  <span
                    className={`${
                      level === "EASY"
                        ? "text-green-400"
                        : level === "MEDIUM"
                        ? "text-yellow-400"
                        : "text-red-400"
                    } font-semibold`}
                  >
                    {level}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={setProblem}
            className="bg-amber-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-amber-500 transition duration-200 shadow-md"
          >
            🚀 Submit Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetProblems;
