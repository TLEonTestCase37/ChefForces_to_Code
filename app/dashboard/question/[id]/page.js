"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { auth } from "../../../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {Loader} from "../../../../components/Loader";

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
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (curUser) => {
      if (curUser) setDisable(false);
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch(`/api/problems/${id}`);
        const data = await res?.json();
        setTests(data.testcases);
        setQuestion(data);
      } catch (err) {
        console.error("Error fetching question:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchQuestion();
  }, [id]);
  // useEffect(() => {
  //   console.log(tests);
  // }, [tests]);
  const handleSubmit = async () => {
    if (submitted || disable) return;
    console.log(1);
    if (userCode.trim().length === 0) {
      window.alert("Likha ni kuch");
      return;
    }

    setSubmitted(true);
    setTestResults([]);

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
      }

      setTestResults(results);
    } catch (err) {
      console.error("Submission failed:", err);
      window.alert("Error while submitting code");
    } finally {
      setSubmitted(false);
    }
  };

  if (loading)
    return <div className="text-center p-10 text-black">Loading...</div>;

  if (!question)
    return (
      <div className="text-center p-10 text-red-500">
        ❌ Question not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 p-4 gap-4">
        {/* Left Panel - Description */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#1e1e1e] rounded-xl p-6 border border-gray-700 overflow-y-auto">
          <h1 className="text-3xl font-extrabold text-amber-400 mb-4">
            {question.title}
          </h1>
          <div className="text-gray-300 whitespace-pre-line leading-relaxed text-base">
            {question.description}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white">Sample Input</h2>
            <pre className="bg-black/30 p-3 mt-1 rounded text-sm text-green-300 overflow-x-auto">
              {question.sampleTestCase}
            </pre>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold text-white">Sample Output</h2>
            <pre className="bg-black/30 p-3 mt-1 rounded text-sm text-blue-300 overflow-x-auto">
              {question.sampleOutput}
            </pre>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            <span className="font-semibold">Difficulty: </span>
            <span
              className={`capitalize font-bold ${
                question.difficulty.toLowerCase() === "easy"
                  ? "text-green-400"
                  : question.difficulty.toLowerCase() === "medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {question.difficulty}
            </span>
          </p>
        </div>

        {/* Right Panel - Editor */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 flex-1 flex flex-col">
            <select
              className="border-2 p-1"
              value={langId}
              onChange={(e) => setLangId(Number(e.target.value))}
            >
              <option className="bg-blue-900" value={71}>Python 3</option>
              <option className="bg-blue-900" value={54}>C++</option>
              <option className="bg-blue-900" value={62}>Java</option>
              <option className="bg-blue-900" value={63}>JavaScript</option>
            </select>
            <h2 className="text-lg font-semibold mb-2">📝 Your Solution</h2>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full flex-1 bg-black/40 text-white p-3 rounded font-mono text-sm resize-none focus:outline-none focus:ring-0 border border-gray-600 focus:border-blue-500 box-border"
              placeholder="Write your code here..."
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition-colors text-sm font-semibold"
                onClick={() => handleSubmit()}
                disabled={!submitted && disable}
              >
                ✅ Submit
              </button>
            </div>
          </div>

          {!submitted && <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-700 flex-1">
            <h2 className="text-lg font-semibold mb-2">📤 Test Case Results</h2>

            {testResults.length === 0 ? (
              <p className="text-gray-400">No results yet.</p>
            ) : (
              testResults.map((res, idx) => (
                <div
                  key={idx}
                  className="border-2 p-2 mb-4 bg-yellow-600 rounded-lg text-black"
                >
                  <h3 className="font-semibold mb-1">Test Case {idx + 1}</h3>
                  <p>
                    <strong>Verdict:</strong> {res.verdict}
                  </p>
                  <pre>
                    <strong>Output:</strong> {res.output}
                  </pre>
                </div>
              ))
            )}
          </div>}
          {submitted && <Loader/>}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
