# Digital Me - AI-Powered Personal Website

A personal website with an AI chatbot that speaks as you. Built with Next.js, Claude API, and deployed on Vercel.

**Live Demo:** [timzhang.me/work](https://timzhang.me/work)

## Features

- Clean, minimal profile page with social links
- AI chatbot powered by Claude that answers questions as you
- Dynamic resume fetching from Google Docs (with 24-hour caching)
- Responsive design for mobile and desktop

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/tmzpanda/digital-me.git
cd digital-me
npm install
```

### 2. Set Up Environment

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key from [console.anthropic.com](https://console.anthropic.com/)

### 3. Customize Your Info

**Profile & Links** - Edit `src/app/work/page.tsx`:
```typescript
const personalInfo = {
  name: "Your Name",
  nickname: "Nick",
  tagline: "Your Title",
  subtitle: "Your subtitle",
  profileImage: "/images/profile.jpg",
};

const actionLinks = [
  // Update your social links
];
```

**AI Personality** - Edit `src/lib/fetch-resume.ts`:
- Update the system prompt with your name and personality

**Resume Content** - Two options:
1. **Google Docs (recommended):** Publish your resume as plain text and update `GOOGLE_DOC_ID` in `src/lib/fetch-resume.ts`
2. **Static:** Edit `src/data/resume-context.ts`

**LinkedIn Info** - Edit `src/data/linkedin-info.ts`

**Profile Photo** - Replace `public/images/profile.jpg`

### 4. Run Locally

```bash
npm run dev
```

Visit [localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Add `ANTHROPIC_API_KEY` to Vercel Environment Variables:
```bash
npx vercel env add ANTHROPIC_API_KEY production
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Redirects to /work
│   ├── work/page.tsx         # Main profile page
│   ├── layout.tsx            # Site metadata
│   └── api/chat/route.ts     # Claude API endpoint
├── components/chat/          # Chat UI components
├── data/
│   ├── resume-context.ts     # Fallback resume content
│   └── linkedin-info.ts      # LinkedIn profile info
└── lib/
    └── fetch-resume.ts       # Google Doc fetching + AI prompt
```

## Claude Code Prompt

If you want to build this from scratch using Claude Code, use this prompt:

---

```
Build me a personal website with these features:

1. **Layout**: Profile photo + name + title on the left, AI chatbot on the right
2. **Social Links**: LinkedIn, GitHub, Email with official brand icons
3. **AI Chatbot**:
   - Uses Claude API via Vercel AI SDK
   - Speaks in first person as me (not "Tim is..." but "I am...")
   - Fetches my resume from a Google Doc (publish as plain text)
   - Caches the resume for 24 hours
   - Refuses personal questions, redirects to work topics
4. **Tech Stack**: Next.js 15+, TypeScript, Tailwind CSS, shadcn/ui
5. **Deployment**: Vercel with custom domain

Make the design clean and minimal. The chatbot is the main feature.
```

---

## Customization Tips

- **Add more pages**: Create folders like `src/app/life/`, `src/app/thoughts/`
- **Change AI model**: Update model in `src/app/api/chat/route.ts`
- **Adjust caching**: Change `CACHE_DURATION` in `src/lib/fetch-resume.ts`
- **Update metadata**: Edit `src/app/layout.tsx` for SEO

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration
- [Claude API](https://anthropic.com/) - AI model
- [Vercel](https://vercel.com/) - Hosting

## License

MIT - Feel free to use this for your own personal website!
