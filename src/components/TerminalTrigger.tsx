"use client";

import type { FC, ReactNode } from "react";
import { openTerminal } from "./TerminalPalette";

export const TerminalTrigger: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = "btn-text",
}) => (
  <button type="button" className={className} onClick={openTerminal}>
    {children}
  </button>
);
