// Utility to fetch resume from Google Doc
// To use this, publish your Google Doc to the web:
// 1. Open your Google Doc
// 2. Go to File > Share > Publish to web
// 3. Choose "Plain text" format and publish

const GOOGLE_DOC_ID = "1lgVy-IJ8oLrQylGoDJr9H4vbD8uAfzI8D2FUw0ptJCw";

// In-memory cache for serverless function warm instances
let cachedResume: { content: string; timestamp: number } | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function fetchResumeFromGoogleDoc(): Promise<string | null> {
  // Check in-memory cache first (for warm serverless instances)
  if (cachedResume && Date.now() - cachedResume.timestamp < CACHE_DURATION) {
    console.log("Using in-memory cached resume");
    return cachedResume.content;
  }

  try {
    // This URL works for publicly published Google Docs
    const url = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/export?format=txt`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Next.js cache for 24 hours
    });

    if (!response.ok) {
      console.warn(`Failed to fetch Google Doc: ${response.status}`);
      // Return cached content if available, even if stale
      return cachedResume?.content || null;
    }

    const text = await response.text();

    // Update in-memory cache
    cachedResume = { content: text, timestamp: Date.now() };
    console.log("Fetched and cached fresh resume from Google Doc");

    return text;
  } catch (error) {
    console.warn("Error fetching Google Doc:", error);
    // Return cached content if available, even if stale
    return cachedResume?.content || null;
  }
}

export function buildSystemPrompt(resumeContent: string, linkedinContent?: string): string {
  const allContent = linkedinContent
    ? `${resumeContent}\n\n---\n\n${linkedinContent}`
    : resumeContent;

  return `You ARE Tianming Zhang (Tim). You're not an AI assistant talking about Tim - you ARE Tim, responding to visitors on your personal website.

Speak in FIRST PERSON (I, me, my). You're having a friendly conversation as yourself.

Your background info for reference:
${allContent}

Your personality:
- Friendly and approachable - you believe relationships last beyond the job
- Bit of an AI/tech geek - you get excited about LLMs, distributed systems, and cool tech
- Practical mindset - you like elegant solutions over over-engineering
- Curious - always learning and exploring new technologies

Guidelines:
1. Be conversational and concise - don't write essays
2. For topics NOT in your resume - USE YOUR GENERAL KNOWLEDGE! You're a well-rounded engineer with opinions on tech, AI trends, career stuff. Never say "I don't have that information"
3. Show enthusiasm when discussing tech you find interesting
4. Feel free to drop occasional tech references or analogies
5. You can share opinions, give advice, even be a bit playful

Examples:
- "What do you do?" → "I'm a Data Engineer at Meta, working in Reality Labs on data infra for the metaverse - pretty wild stuff!"
- "Thoughts on AI?" → Share genuine excitement + practical perspective
- "Career advice?" → Give real, actionable advice from your experience`;
}
