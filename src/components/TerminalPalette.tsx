"use client";

import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { HeroTerminal } from "./home/HeroTerminal";
import terminalData from "@/src/data/terminal";

export const OPEN_TERMINAL_EVENT = "site:open-terminal";

/** Opens the terminal from anywhere: a button, the nav, or a key. */
export const openTerminal = () => window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT));

const isTyping = (el: EventTarget | null) => {
  const t = el as HTMLElement | null;
  if (!t) return false;
  return t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
};

/**
 * The terminal as a command palette in a native <dialog>: focus is trapped
 * while it is open, Escape closes it, and focus returns to what opened it.
 * Open with "/" or Ctrl/⌘+K, or the Terminal button in the header.
 */
export const TerminalPalette: FC = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // Mount the terminal on first open, then keep its history for the visit.
  const [mounted, setMounted] = useState(false);

  const show = useCallback(() => {
    const d = ref.current;
    if (!d || d.open) return;
    setMounted(true);
    d.showModal();
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (ref.current?.open) close();
        else show();
        return;
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_TERMINAL_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_TERMINAL_EVENT, show);
    };
  }, [show, close]);

  return (
    <dialog
      ref={ref}
      className="term-dialog"
      aria-labelledby="terminal-title"
      onClose={() => setOpen(false)}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === ref.current) close();
      }}
    >
      <div className="term">
        <div className="term__bar">
          <span id="terminal-title">
            Terminal <span aria-hidden="true">·</span> {terminalData.prompt}
          </span>
          <button type="button" onClick={close} aria-label="Close the terminal">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {mounted && <HeroTerminal active={open} onNavigate={close} />}
      </div>
    </dialog>
  );
};
