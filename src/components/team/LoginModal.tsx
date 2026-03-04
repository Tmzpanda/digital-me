"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { X } from "lucide-react";

interface LoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function LoginModal({ onSuccess, onClose }: LoginModalProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        setError("Invalid passcode");
        setPasscode("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-background border border-border rounded-xl w-[340px] p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-foreground">
            Sign in
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[13px] text-muted-foreground mb-4">
          Enter the owner passcode to chat with agents.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-lg text-[14px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            disabled={loading}
            autoComplete="off"
          />

          {error && (
            <p className="text-[12px] text-red-500 mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !passcode.trim()}
            className="mt-4 w-full px-3 py-2 rounded-lg bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
