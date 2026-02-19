import React, { useState } from "react";
import { Mail, Github, Linkedin, Send, Copy, Check } from "lucide-react";

export const Contact: React.FC = () => {
  const email = "swayamprakash.271105@gmail.com"; // change if needed

  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">

      {/* Header */}
      <header className="border-b border-brand-border pb-8">
        <h1 className="text-4xl font-mono font-bold tracking-tighter uppercase">
          Secure Channel // Contact
        </h1>
        <p className="text-brand-muted mt-2 font-mono text-[10px] uppercase tracking-widest">
          Open for collaboration, backend roles and security research.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div className="space-y-8">

          {/* Email Card */}
          <div className="border border-brand-border p-8 bg-brand-bg space-y-6">
            <p className="text-[10px] font-mono text-brand-muted uppercase tracking-widest">
              Primary Communication Channel
            </p>

            <div className="flex items-center justify-between border border-brand-border p-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-accent" />
                <span className="font-mono text-sm">{email}</span>
              </div>

              <button
                onClick={copyEmail}
                className="flex items-center gap-2 text-[10px] font-mono border border-brand-border px-3 py-1 hover:bg-white/5 transition"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          {/* Socials */}
          <div className="border border-brand-border p-8 bg-brand-bg space-y-6">
            <p className="text-[10px] font-mono text-brand-muted uppercase tracking-widest">
              Public Profiles
            </p>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-brand-border py-4 hover:bg-brand-accent hover:text-brand-bg transition"
              >
                <Github size={18} />
                <span className="font-mono text-xs">GITHUB</span>
              </a>

              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-brand-border py-4 hover:bg-brand-accent hover:text-brand-bg transition"
              >
                <Linkedin size={18} />
                <span className="font-mono text-xs">LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — FORM */}
        <div className="border border-brand-border p-8 bg-brand-surface">
          <p className="text-[10px] font-mono text-brand-muted uppercase tracking-widest mb-6">
            Send Direct Message
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Name"
              required
              className="w-full bg-brand-bg border border-brand-border px-4 py-3 outline-none focus:border-brand-accent"
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full bg-brand-bg border border-brand-border px-4 py-3 outline-none focus:border-brand-accent"
            />

            <textarea
              rows={5}
              placeholder="Message"
              required
              className="w-full bg-brand-bg border border-brand-border px-4 py-3 outline-none focus:border-brand-accent resize-none"
            />

            <button className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-bg py-4 font-mono text-xs font-bold hover:bg-brand-muted transition">
              <Send size={16} />
              TRANSMIT_MESSAGE
            </button>

            {sent && (
              <p className="text-center text-xs font-mono text-brand-accent pt-2">
                MESSAGE_QUEUED ✔ (connect backend/email service later)
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};
