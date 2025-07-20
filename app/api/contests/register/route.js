import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { contestId, userId } = await req.json();

    if (!contestId || !userId) {
      return NextResponse.json({ error: "Missing contestId or userId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ChefForcesToCode");

    const result = await db.collection("contests").updateOne(
      { _id: new ObjectId(contestId) },
      { $addToSet: { registeredUsers: userId } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Already registered or contest not found" });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
