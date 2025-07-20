// /api/contestsubmit/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { userId, contestId, problemIndex, timeTaken } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  // Prevent duplicate AC submissions for same user & problem in same contest
  const alreadySubmitted = await db.collection("submissions").findOne({
    userId,
    contestId,
    problemIndex,
  });

  if (alreadySubmitted) {
    return NextResponse.json({ message: "Already submitted" }, { status: 400 });
  }

  await db.collection("submissions").insertOne({
    userId,
    contestId,
    problemIndex,
    timeTaken,
    submittedAt: new Date(),
  });

  return NextResponse.json({ message: "Submission recorded" });
}
