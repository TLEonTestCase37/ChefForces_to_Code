// app/api/leaderboard/[contestId]/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request, context) {
  const { contestId } = context.params; 

  const client = await clientPromise;
  const db = client.db();

  const submissions = await db
    .collection("submissions")
    .find({ contestId })
    .toArray();

  const leaderboardMap = new Map();

  for (const sub of submissions) {
    const { userId, problemIndex, timeTaken } = sub;
    if (!leaderboardMap.has(userId)) {
      leaderboardMap.set(userId, {
        userId,
        problemsSolved: new Set(),
        totalTime: 0,
      });
    }

    const userData = leaderboardMap.get(userId);

    if (!userData.problemsSolved.has(problemIndex)) {
      userData.problemsSolved.add(problemIndex);
      userData.totalTime += timeTaken;
    }
  }

  const leaderboard = [...leaderboardMap.values()]
    .map(({ userId, problemsSolved, totalTime }) => ({
      userId,
      problemsSolved: problemsSolved.size,
      totalTime,
    }))
    .sort((a, b) => {
      if (b.problemsSolved !== a.problemsSolved)
        return b.problemsSolved - a.problemsSolved;
      return a.totalTime - b.totalTime;
    });

  return NextResponse.json(leaderboard);
}
