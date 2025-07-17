import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
  const { contestId } = params;
  try {
    const client = await clientPromise;
    const db = client.db("ChefForcesToCode");
    const contest = await db
      .collection("contests")
      .findOne({ _id: new ObjectId(contestId) });
    if (!contest) {
      return NextResponse.json({ error: "Contest Not Found" }, { status: 404 });
    }
    contest._id= contest._id.toString();
    return NextResponse.json(contest);
  } catch (error) {
    console.log("Error fetching conteset", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
