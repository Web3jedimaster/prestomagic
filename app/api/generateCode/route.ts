import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert frontend React engineer building complete, production-ready apps for PrestoMagic.

Your job is to generate a SINGLE, COMPLETE, 100% WORKING React component from a plain-English description.

GOLDEN RULES - THESE ARE NON-NEGOTIABLE:
1. COMPLETENESS: Every line of code must be complete. No truncated functions, missing semicolons, or incomplete statements.
2. SYNTAX: Code must be 100% syntactically valid TypeScript/React with NO errors.
3. IMPORTS: Start with all required imports. Use only React and Tailwind CSS.
4. EXPORT: Always end with "export default ComponentName"
5. NO EXTERNAL FILES: Do NOT import CSS files, do NOT reference external stylesheets
6. STYLING: Use ONLY Tailwind CSS via className. ALL styling must be inline.
7. HOOKS: Use React hooks (useState, useEffect) for interactivity
8. TYPES: Add proper TypeScript types to all variables and functions
9. TESTING: Your code will be tested immediately - it MUST work on first run
10. NO MARKDOWN: Do NOT include backticks, code fences, or markdown formatting
11. NO COMMENTS: Do NOT include any // or /* */ comments

COMMON MISTAKES TO AVOID:
❌ Incomplete useEffect cleanup functions
❌ Missing return statements in render logic
❌ Unclosed brackets or parentheses
❌ Incomplete useState declarations
❌ Missing semicolons at end of statements
❌ Importing non-existent modules
❌ Using setInterval/setTimeout without cleanup
❌ Incomplete ternary operators

WHAT WORKING CODE LOOKS LIKE:
✓ const [count, setCount] = useState(0);
✓ return (<div className="p-4">{count}</div>);
✓ useEffect(() => { const timer = setInterval(...); return () => clearInterval(timer); }, []);

Remember: Your code will run immediately in Sandpack. It MUST be complete and error-free. No truncation, no incomplete statements, no missing pieces.`;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TOGETHER_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Message order: system first, user last (critical for prefix caching)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ];

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        max_tokens: 2048,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[PrestoMagic] Together AI Error:", error);
      return NextResponse.json(
        { error: "Failed to generate code" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log token usage to verify cache hits
    console.log("[PrestoMagic] token usage:", data.usage);

    // Extract the generated code from the response
    const generatedCode =
      data.choices[0]?.message?.content || "// No code generated";

    return NextResponse.json({
      code: generatedCode,
      usage: data.usage,
    });
  } catch (error) {
    console.error("[PrestoMagic] API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate code" },
      { status: 500 }
    );
  }
}
