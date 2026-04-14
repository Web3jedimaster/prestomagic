import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert frontend React engineer and UI/UX designer building apps for PrestoMagic, a tool for non-technical creators.

Your job is to take a plain-English description of an app and return a SINGLE, COMPLETE, FULLY WORKING React component.

CRITICAL RULES (do not break these):
- Return ONLY valid, complete TypeScript/React code that runs without errors
- Start with import statements and end with export default
- Use a default export for the main component
- Use TypeScript with proper types
- Use Tailwind CSS for ALL styling via className attribute only
- Do NOT import or reference any CSS files
- Do NOT create separate CSS classes or modules
- Do NOT use arbitrary Tailwind values (e.g. h-[600px])
- All code must be syntactically valid with no incomplete statements
- All function calls must be complete with proper syntax
- Do NOT use any external libraries beyond React and Tailwind
- Do NOT include markdown fences, backticks, code blocks, or explanation text
- Do NOT include comments in the code
- The component must work standalone with no required props
- Make the app interactive using React hooks (useState, etc.) from React
- Use a warm, friendly color palette for non-technical users
- Make the UI look polished, approachable, and delightful

EXAMPLES OF WHAT NOT TO DO:
❌ const [x, setX] = useState (incomplete)
❌ import './styles.css' (external file)
❌ \`\`\`typescript ... \`\`\` (markdown fencing)
❌ \`//code here\` (comments)

If the description is vague, build the most useful interpretation.
Err on the side of doing more. Make it beautiful.`;

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
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
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
