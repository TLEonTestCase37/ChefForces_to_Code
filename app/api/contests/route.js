// app/api/contests/route.js
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const contests = await client
    .db("ChefForcesToCode")
    .collection("contests")
    .find()
    .toArray();
  return Response.json(contests);
}

export async function POST(req) {
  try {
    const { name, startTime, endTime,problems } = await req.json();
    const client = await clientPromise;

    const result = await client.db("ChefForcesToCode").collection("contests").insertOne({
      name,
      startTime,
      endTime,
      problems,
      createdAt: new Date(),
    });

    return Response.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Insert error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
