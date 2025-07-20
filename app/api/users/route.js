import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
// POST /api/users
export async function POST(req) {
  try {
    const { userId, userEmail, username, userSubmissions, userSolvedCount } =
      await req.json();

    const client = await clientPromise;
    const db = client.db("ChefForcesToCode");

    await db.collection("users").insertOne({
      userId,
      userEmail,
      username,
      userSubmissions,
      userSolvedCount,
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
