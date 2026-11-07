import type { FC } from "react";
import {
  Award,
  Bird,
  Bot,
  Box,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FileSearch,
  Globe,
  Hourglass,
  Gamepad2,
  Network,
  Package,
  PhoneOff,
  Plug,
  Radar,
  Regex,
  Route,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Icon names a project or certificate may use in its `icon` field. */
const ICONS: Record<string, LucideIcon> = {
  award: Award,
  bird: Bird,
  bot: Bot,
  box: Box,
  cloud: Cloud,
  code: Code2,
  container: Container,
  cpu: Cpu,
  database: Database,
  "file-search": FileSearch,
  "gamepad-2": Gamepad2,
  globe: Globe,
  hourglass: Hourglass,
  network: Network,
  package: Package,
  "phone-off": PhoneOff,
  plug: Plug,
  radar: Radar,
  regex: Regex,
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

/** A project's or certificate's small glyph, shown beside its name in lists. Decorative. */
export const IconBadge: FC<IconBadgeProps> = ({ icon, size = 18, className = "" }) => {
  const Icon = (icon && ICONS[icon]) || Terminal;
  return (
    <span className={`icon-glyph ${className}`} aria-hidden="true">
      <Icon size={size} />
    </span>
  );
};
