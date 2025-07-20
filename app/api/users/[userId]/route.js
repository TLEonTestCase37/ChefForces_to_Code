import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET /api/users/[userId]
export async function GET(req, context) {
  const { userId } = context.params;
  try {
    const client = await clientPromise;
    const db = client.db("ChefForcesToCode");

    // Look up user using userId (not uid)
    const user = await db.collection("users").findOne({ userId });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    user._id = user._id.toString();

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[userId]
export async function PUT(req, context) {
  const { userId } = context.params;

  try {
    const client = await clientPromise;
    const db = client.db("ChefForcesToCode");

    const updateData = await req.json();
    const { problemName, verdict } = updateData;

    // Fetch the existing user document
    const user = await db.collection("users").findOne({ userId });
    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const alreadySolved = user.userSubmissions?.some(
      (submission) =>
        submission.problemName === problemName &&
        submission.verdict === "Accepted"
    );

    const submissionEntry = {
      problemName,
      verdict,
      timestamp: new Date().toISOString(),
    };

    // Always push submission
    const updateQuery = {
      $push: { userSubmissions: submissionEntry },
    };

    // Increment solved count if accepted and not already solved
    if (verdict === "Accepted" && !alreadySolved) {
      updateQuery.$inc = { userSolvedCount: 1 };
    }

    await db.collection("users").updateOne({ userId }, updateQuery);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}