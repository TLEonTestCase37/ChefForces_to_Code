// app/api/problems/route.js
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const problems = await client
    .db("ChefForcesToCode")
    .collection("problems")
    .find()
    .toArray();
  return Response.json(problems);
}

export async function POST(req) {
  try {
    const { title, description, sampleTestCase, sampleOutput,difficulty,testcases } = await req.json();
    const client = await clientPromise;

    const result = await client.db("ChefForcesToCode").collection("problems").insertOne({
      title,
      description,
      sampleTestCase,
      sampleOutput,
      createdAt: new Date(),
      difficulty,
      testcases
    });

    return Response.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Insert error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
