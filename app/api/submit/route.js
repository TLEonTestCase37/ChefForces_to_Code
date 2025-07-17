export async function POST(req) {
  const { code, language_id, stdin, expected_output } = await req.json();

  const submission = await fetch(
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        source_code: code,
        language_id,
        stdin,
        expected_output,
        cpu_time_limit: 2,
      }),
    }
  );
  if (!submission.ok) {
    console.log(submission);
    return Response.json(
      { error: "Failed to submit code to Judge0" },
      { status: 500 }
    );
  } else {
    const res = await submission.json();
    if (res.status?.description == "Accepted") {
      return Response.json({ output: res.stdout, verdict: "Accepted" });
    } else {
      const err =
        res.stderr || res.compile_output || res.status?.description;
      return Response.json(
        {
          output: res.stdout,
          error: err,
          verdict: res.status?.description,
        },
        { status: 400 }
      );
    }
  }
}
