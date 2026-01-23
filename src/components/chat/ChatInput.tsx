"use client";

import { FormEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Ask me anything...",
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 p-3 border-t border-border/50 bg-muted/20">
      <Input
        id="chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 bg-background/80 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:border-primary/40 transition-all"
        autoComplete="off"
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !value.trim()}
        className="shrink-0 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md disabled:hover:scale-100"
      >
        <Send className="w-4 h-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
