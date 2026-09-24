import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <p className="eyebrow mb-6">Error 404</p>
      <h1 className="display text-6xl md:text-8xl mb-6">
        Page <em>not found.</em>
      </h1>
      <p className="text-brand-muted mb-10 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="group btn btn-solid">
        <ArrowLeft
          size={14}
          className="transition-transform duration-300 group-hover:-translate-x-1"
        />
        <span>Return home</span>
      </Link>
    </div>
  );
}
