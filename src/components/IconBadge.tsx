import type { FC } from "react";
import {
  Award,
  Bird,
  Bot,
  Box,
  Cloud,
  Code2,
  Container,
  Database,
  FileSearch,
  Gamepad2,
  Network,
  Package,
  PhoneOff,
  Plug,
  Radar,
  Route,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  award: Award,
  bird: Bird,
  bot: Bot,
  box: Box,
  cloud: Cloud,
  code: Code2,
  container: Container,
  database: Database,
  "file-search": FileSearch,
  "gamepad-2": Gamepad2,
  network: Network,
  package: Package,
  "phone-off": PhoneOff,
  plug: Plug,
  radar: Radar,
  route: Route,
  server: Server,
  shield: Shield,
  "shield-alert": ShieldAlert,
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
export const IconBadge: FC<IconBadgeProps> = ({
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
