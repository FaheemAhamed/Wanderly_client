"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-travel.jpg";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SiteFooter() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;
    
    gsap.fromTo(
      ".wanderly-char",
      { y: 150, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 90%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="relative overflow-hidden bg-black text-white pt-24 pb-8 perspective-[1000px]">
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

        {/* Central Creative CTA */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <h4 className="text-xl font-display font-medium text-white mb-4">Ready for your next adventure?</h4>
          <Link href="/login" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white hover:text-black">
            <span className="relative z-10">Start planning for free</span>
            <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>

        <FooterCol title="Navigation" items={[
          ["Home", "/"],
          ["Features", "/#features"],
          ["How it works", "/#how"],
          ["Stories", "/#testimonials"],
        ]} />
      </div>

      {/* Creative Typography */}
      <div className="mt-20 overflow-hidden px-6 relative z-10 flex justify-center perspective-[1000px]">
        <h2 ref={textRef} className="flex text-[14vw] md:text-[16vw] font-display font-black leading-[0.8] tracking-tighter text-violet-400/10 uppercase select-none pointer-events-none">
          {"Wanderly".split("").map((char, i) => (
            <span key={i} className="wanderly-char inline-block origin-bottom">
              {char}
            </span>
          ))}
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
            <Link href={href} className="group flex items-center gap-2 hover:text-white transition-colors">
              <span className="h-1 w-1 rounded-full bg-white/0 transition-all group-hover:bg-white/100" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}