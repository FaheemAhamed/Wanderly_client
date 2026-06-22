import Link from "next/link";
import { Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-travel.jpg";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-black text-white pt-24 pb-8">
      {/* Background Video & Tint Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="h-full w-full object-cover opacity-20 mix-blend-luminosity"
        >
          <source src="/hero-bg.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col md:flex-row justify-between gap-10 px-6 relative z-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Wanderly" className="h-8 w-8 rounded-lg object-cover invert mix-blend-screen" />
            <span className="font-display text-lg font-bold">Wanderly</span>
          </div>
          <p className="mt-4 text-sm text-white/70">
            The AI travel planner for people who'd rather be exploring than spreadsheeting.
          </p>
        </div>
        <FooterCol title="Navigation" items={[
          ["Home", "/"],
          ["Features", "/#features"],
          ["How it works", "/#how"],
          ["Stories", "/#testimonials"],
        ]} />
      </div>

      {/* Creative Typography */}
      <div className="mt-20 overflow-hidden px-6 relative z-10 flex justify-center">
        <h2 className="text-[14vw] md:text-[16vw] font-display font-black leading-[0.8] tracking-tighter text-violet-400/10 uppercase select-none pointer-events-none">
          Wanderly
        </h2>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 pt-8 mt-8 border-t border-white/10 text-xs text-white/50 sm:flex-row relative z-10">
        <p>© {new Date().getFullYear()} Wanderly. All rights reserved.</p>
        <p>Crafted for travellers, by travellers.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-white/70">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-white transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}