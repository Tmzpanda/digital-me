"use client";

import Link from "next/link";
import { useState } from "react";

type Locale = "en" | "zh";

const name: Record<Locale, string> = {
  en: "Tianming (Tim) Zhang",
  zh: "Tianming (Tim) Zhang",
};

const messageLinkClass =
  "rounded-[4px] bg-[linear-gradient(180deg,transparent_54%,rgba(43,43,43,0.10)_54%)] underline underline-offset-[0.18em] decoration-foreground/45 transition-colors hover:bg-[linear-gradient(180deg,transparent_42%,rgba(43,43,43,0.16)_42%)] hover:decoration-foreground active:bg-[linear-gradient(180deg,transparent_42%,rgba(43,43,43,0.18)_42%)]";

const profileInfo = {
  tagline: "Build. Think. Compound.",
};

const messages: Array<Record<Locale, React.ReactNode>> = [
  {
    en: "Hi, I'm Tim! 👋",
    zh: "你好，我是天明 👋",
  },
  {
    en: (
      <>
        I build{" "}
        <Link href="https://www.producthunt.com/" className={messageLinkClass}>
          tools
        </Link>{" "}
        that give people leverage.
      </>
    ),
    zh: (
      <>
        我喜欢做一些能让事情变简单、变高效的
        <Link href="https://www.producthunt.com/" className={messageLinkClass}>
          工具
        </Link>
        。
      </>
    ),
  },
  {
    en: (
      <>
        I{" "}
        <Link href="https://paragraph.com/" className={messageLinkClass}>
          write
        </Link>{" "}
        to think out loud about technology, investing, and how the world works.
      </>
    ),
    zh: (
      <>
        平时会
        <Link href="https://paragraph.com/" className={messageLinkClass}>
          写点东西
        </Link>
        ，记录自己对科技、投资，还有这个世界的思考。
      </>
    ),
  },
  {
    en: (
      <>
        I also make{" "}
        <Link href="https://www.youtube.com/" className={messageLinkClass}>
          videos
        </Link>{" "}
        — some things are better felt than explained.
      </>
    ),
    zh: (
      <>
        我也做
        <Link href="https://www.youtube.com/" className={messageLinkClass}>
          视频
        </Link>
        ——有些东西，更适合感受，而不是解释。
      </>
    ),
  },
  {
    en: (
      <>
        I work as a data engineer. You can{" "}
        <Link href="/work" className={messageLinkClass} prefetch>
          chat with an AI version of me
        </Link>{" "}
        about my work and experience.{" "}
      </>
    ),
    zh: (
      <>
        职业上，我是一名数据工程师。你可以和{" "}
        <Link href="/work" className={messageLinkClass} prefetch>
          AI 版本的我
        </Link>
        聊聊，了解我的工作和经历。
      </>
    ),
  },
  {
    en: (
      <>
        I also{" "}
        <Link href="https://moonvest.app/" className={messageLinkClass}>
          invest
        </Link>{" "}
        with a long-term mindset and a deep interest in how the world evolves.
      </>
    ),
    zh: (
      <>
        我坚持长期主义的
        <Link href="https://moonvest.app/" className={messageLinkClass}>
          投资
        </Link>
        ，并持续关注世界如何变化。
      </>
    ),
  },
  {
    en: (
      <>
        If any of this resonates, feel free to{" "}
        <Link href="mailto:tmzpanda@gmail.com" className={messageLinkClass}>
          reach out
        </Link>
        {" :)"}
      </>
    ),
    zh: (
      <>
        如果你也对这些东西感兴趣，欢迎
        <Link href="mailto:tmzpanda@gmail.com" className={messageLinkClass}>
          来聊聊
        </Link>
        :)
      </>
    ),
  },
];

export function LandingHero() {
  const [locale, setLocale] = useState<Locale>("en");
  const [animationKey, setAnimationKey] = useState(0);

  const toggleLocale = () => {
    setLocale((current) => (current === "en" ? "zh" : "en"));
  };

  const replayIntro = () => {
    setAnimationKey((current) => current + 1);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground antialiased max-[1023px]:items-start lg:p-8">
      <div className="relative mx-auto w-full max-w-5xl">
        <button
          type="button"
          onClick={toggleLocale}
          aria-label="Switch language"
          aria-pressed={locale === "zh"}
          className="fixed right-4 top-4 z-10 ml-auto flex w-fit gap-0.5 rounded-full border border-border bg-card/90 p-1 text-xs font-bold text-muted-foreground shadow-[0_6px_22px_rgba(0,0,0,0.06)] backdrop-blur max-[1023px]:static max-[1023px]:mb-8 sm:right-6 sm:top-6"
        >
          <span
            className={`min-w-8 rounded-full px-2 py-1 text-center transition-colors ${
              locale === "en" ? "bg-foreground text-background" : ""
            }`}
          >
            EN
          </span>
          <span
            className={`min-w-8 rounded-full px-2 py-1 text-center transition-colors ${
              locale === "zh" ? "bg-foreground text-background" : ""
            }`}
          >
            中
          </span>
        </button>

        <div className="grid grid-cols-[320px_minmax(0,1fr)] items-center gap-8 lg:gap-16 max-[1023px]:grid-cols-1">
        <aside className="flex animate-[profile-in_680ms_cubic-bezier(0.2,0.8,0.2,1)_both] flex-col items-center text-center">
          <button
            type="button"
            onClick={replayIntro}
            aria-label="Tianming Zhang home"
            className="group relative mb-6 block"
          >
            <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-border/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/profile.jpg"
                alt="Tianming Zhang"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_34px_rgba(0,0,0,0.10)]"
              />
            </div>
          </button>

          <h1 className="text-2xl font-bold leading-tight tracking-tight">
            {name[locale]}
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">
            {profileInfo.tagline}
          </p>

        </aside>

        <section aria-label="Introduction" className="min-w-0 max-w-xl self-center max-[1023px]:mx-auto max-[1023px]:w-full">
          <div className="grid gap-2 text-[16px] leading-[1.45] text-secondary-foreground max-[420px]:text-[15.5px]">
            {messages.map((message, index) => (
              <p
                key={`${animationKey}-${index}`}
                className="w-fit max-w-[min(84%,520px)] animate-[message-in_360ms_cubic-bezier(0.2,0.8,0.2,1)_both] rounded-[18px] rounded-tl-md border border-border bg-card px-3.5 py-2.5 shadow-[0_4px_14px_rgba(0,0,0,0.018)] max-[1023px]:max-w-[92%] max-[420px]:max-w-[96%]"
                style={{ animationDelay: `${80 + index * 70}ms` }}
              >
                {message[locale]}
              </p>
            ))}
          </div>
        </section>
        </div>
      </div>
    </main>
  );
}
