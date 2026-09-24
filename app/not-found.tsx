import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="font-mono text-[10px] text-brand-accent uppercase tracking-widest mb-4">
        ERROR // 404
      </p>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
        NOT_FOUND
      </h1>
      <p className="text-brand-muted font-mono text-sm mb-10 max-w-md mx-auto">
        {'>'} the requested resource does not exist on this system.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center space-x-3 border border-brand-accent bg-brand-accent text-brand-bg px-8 py-3 font-mono text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_var(--brand-accent)]"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        <span>RETURN_HOME</span>
      </Link>
    </div>
  );
}
