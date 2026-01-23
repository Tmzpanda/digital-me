# Digital Me - AI-Powered Personal Website

A personal website with an AI chatbot that speaks as you. Built with Next.js, Claude API, and deployed on Vercel.

**Live Demo:** [timzhang.me/work](https://timzhang.me/work)

## Features

- Landing page with profile photo and navigation
- AI chatbot powered by Claude that answers questions as you
- Dynamic resume fetching from Google Docs (with 24-hour caching)
- Responsive design for mobile and desktop

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/tmzpanda/digital-me.git
cd digital-me
pnpm install
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
pnpm dev
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
digital-me/
├── public/
│   ├── images/profile.jpg
│   └── favicon.jpg
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── work/page.tsx         # Profile + AI chatbot
│   │   ├── blog/page.tsx         # Blog (coming soon)
│   │   ├── life/page.tsx         # Life (coming soon)
│   │   ├── layout.tsx            # Site metadata
│   │   └── api/chat/route.ts     # Claude API endpoint
│   ├── components/
│   │   ├── chat/                 # Chat UI components
│   │   ├── landing/              # Landing page components
│   │   └── ui/                   # Shared UI components
│   ├── data/
│   │   ├── resume-context.ts     # Fallback resume content
│   │   └── linkedin-info.ts      # LinkedIn profile info
│   └── lib/
│       ├── fetch-resume.ts       # Google Doc fetching + AI prompt
│       ├── navigation-config.ts  # Nav items config
│       └── utils.ts              # Utility functions
├── package.json
├── next.config.js
└── tsconfig.json
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with navigation |
| `/work` | Profile page with AI chatbot |
| `/blog` | Blog (coming soon) |
| `/life` | Life section (coming soon) |

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration
- [Claude API](https://anthropic.com/) - AI model
- [Vercel](https://vercel.com/) - Hosting

## License

MIT - Feel free to use this for your own personal website!
