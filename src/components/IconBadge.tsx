import React from "react";
import {
  Award,
  Bot,
  Box,
  Cloud,
  Code2,
  Container,
  Database,
  FileSearch,
  Network,
  PhoneOff,
  Plug,
  Radar,
  Server,
  Shield,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  award: Award,
  bot: Bot,
  box: Box,
  cloud: Cloud,
  code: Code2,
  container: Container,
  database: Database,
  "file-search": FileSearch,
  network: Network,
  "phone-off": PhoneOff,
  plug: Plug,
  radar: Radar,
  server: Server,
  shield: Shield,
  "shield-check": ShieldCheck,
  terminal: Terminal,
  wrench: Wrench,
};

interface IconBadgeProps {
  /** Icon name from the ICONS map; falls back to terminal */
  icon?: string;
  size?: number;
  className?: string;
}

/** Square boxed icon used on project, certificate, and skill cards. */
export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  size = 18,
  className = "",
}) => {
  const Icon = (icon && ICONS[icon]) || Terminal;
  return (
    <span
      className={`inline-flex items-center justify-center w-11 h-11 shrink-0 border border-brand-accent/30 bg-brand-accent/10 text-brand-accent ${className}`}
    >
      <Icon size={size} />
    </span>
  );
};
