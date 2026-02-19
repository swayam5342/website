
import React from 'react';
import { Mail, Github, Linkedin, Send, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12 border-b border-brand-border pb-8">
        <h1 className="text-4xl font-mono font-bold tracking-tighter">COMMS // CHANNEL</h1>
        <p className="text-brand-muted mt-2 font-mono text-[10px] tracking-widest">ENDPOINT: HELLO@JOHNDOE.COM</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
        <div className="md:col-span-2 space-y-10">
          <div className="space-y-6">
            <h3 className="font-mono text-[9px] text-brand-accent uppercase tracking-widest border-b border-brand-border pb-2">Public_Keys</h3>
            <div className="space-y-4">
              <a href="https://github.com" className="flex items-center space-x-4 text-brand-muted hover:text-brand-accent transition-colors font-mono text-xs">
                <Github size={16} />
                <span>GITHUB_ENTITY</span>
              </a>
              <a href="https://linkedin.com" className="flex items-center space-x-4 text-brand-muted hover:text-brand-accent transition-colors font-mono text-xs">
                <Linkedin size={16} />
                <span>LINKEDIN_ENTRY</span>
              </a>
              <a href="mailto:hello@johndoe.com" className="flex items-center space-x-4 text-brand-muted hover:text-brand-accent transition-colors font-mono text-xs">
                <Mail size={16} />
                <span>SMTP_SERVER</span>
              </a>
            </div>
          </div>

          <div className="p-6 bg-brand-surface border border-brand-border font-mono text-[9px] text-brand-muted/50 uppercase leading-loose">
            CIPHER: CHACHA20-POLY1305<br />
            VERSION: SEC_OPS_V4.0<br />
            ORIGIN: 127.0.0.1<br />
            STATUS: WAITING_FOR_INPUT
          </div>
        </div>

        <div className="md:col-span-3">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-brand-muted uppercase tracking-widest">CLAIMED_IDENTITY</label>
              <input type="text" className="w-full bg-brand-surface border border-brand-border p-4 outline-none focus:border-brand-accent text-xs font-mono transition-colors" placeholder="NAME_REQUIRED" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-brand-muted uppercase tracking-widest">RETURN_PROXY</label>
              <input type="email" className="w-full bg-brand-surface border border-brand-border p-4 outline-none focus:border-brand-accent text-xs font-mono transition-colors" placeholder="EMAIL@DOMAIN.COM" />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-brand-muted uppercase tracking-widest">DATA_PAYLOAD</label>
              <textarea rows={6} className="w-full bg-brand-surface border border-brand-border p-4 outline-none focus:border-brand-accent text-xs font-mono resize-none transition-colors" placeholder="MESSAGE_BODY_0x00..."></textarea>
            </div>
            
            <button className="w-full bg-brand-accent text-brand-bg font-mono font-bold py-5 hover:bg-brand-muted transition-all uppercase text-xs tracking-widest flex items-center justify-center space-x-4">
              <Send size={16} />
              <span>TRANSMIT_PACKET</span>
            </button>
            
            <div className="flex items-center space-x-3 text-[8px] font-mono text-brand-muted justify-center uppercase tracking-widest mt-6">
              <ShieldCheck size={12} />
              <span>Sanitization_Protocol_Active</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
