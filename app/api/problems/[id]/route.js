// app/api/problems/[id]/route.js
import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, context) {
  const { id } = await context.params;

  try {
    const client = await clientPromise;
    const db = client.db("ChefForcesToCode");

    const problem = await db.collection("problems").findOne({
      _id: new ObjectId(id),
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    problem._id = problem._id.toString();

    return NextResponse.json(problem);
  } catch (error) {
    console.error("❌ Error in GET /api/problems/[id]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

