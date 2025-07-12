'use client';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-300 to-blue-500 text-gray-900">
      <div className="text-4xl font-bold mb-4 drop-shadow-sm">👋 Hello, I am Aman</div>
      <div className="text-lg mb-8 text-center max-w-md">
        To continue practicing and solving problems, please log in first.
      </div>
      <button
        className="bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:scale-105"
        onClick={() => router.push("./login")}
      >
        🔐 Login
      </button>
    </main>
  );
}
  