"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, MagicWand, CloudSun, MapPinLine, ArrowUpRight, Star } from "@phosphor-icons/react";
import heroImg from "@/assets/hero-travel.jpg";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Index() {
  return (
    <div className="bg-background selection:bg-primary/30 selection:text-white relative overflow-hidden min-h-screen">
      <SiteNav />
      
      {/* Ambient Glowing Violet Orbs */}
      <div className="absolute top-[5%] left-[-15%] w-[30vw] h-[30vw] min-w-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-15%] w-[35vw] h-[35vw] min-w-[350px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[55%] left-[-20%] w-[40vw] h-[40vw] min-w-[400px] rounded-full bg-fuchsia-600/10 blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[80%] right-[-10%] w-[30vw] h-[30vw] min-w-[300px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none z-0" />

      <main className="relative z-10 overflow-x-hidden w-full max-w-full flex flex-col gap-32 md:gap-48 pb-32">
        <Hero />
        <InfiniteMarquee />
        <Features />
        <ScrubbingTextReveal />
        <HorizontalAccordions />
        <Testimonials />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".hero-element", {
      y: 40,
      opacity: 0,
      filter: "blur(10px)",
    }, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out",
    });

    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, { scope: container });

  return (
    <section id="home" ref={container} className="relative z-0 min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 w-full overflow-hidden pt-24">
      <div className="absolute inset-0 -z-20 hero-bg">
        <img src="/assets/travelcinematic.jpg" alt="Cinematic Background" className="w-full h-full object-cover mix-blend-luminosity opacity-40 contrast-125" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="hero-element inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-8">
        <MagicWand className="h-3.5 w-3.5 text-white/70" weight="light" />
        <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/70">Wanderly Engine 2.0</span>
      </div>

      <h1 className="hero-element font-display font-bold leading-[1.02] tracking-[-0.03em] text-[clamp(3rem,6vw,7rem)] max-w-6xl text-white">
        Design the perfect trip 
        <span 
          className="inline-block w-[2.5em] h-[0.8em] rounded-full align-middle mx-3 bg-cover bg-center border border-white/10" 
          style={{ backgroundImage: `url(/assets/location.jpg)` }}
        /> 
        in seconds.
      </h1>

      <p className="hero-element mt-8 max-w-2xl text-lg text-white/60 leading-relaxed font-sans">
        Wanderly orchestrates your destination, interests, and budget into a beautifully crafted, day-by-day itinerary. Live weather, curated stays, and hidden gems seamlessly baked in.
      </p>

      <div className="hero-element mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/register"
          className="group relative inline-flex items-center justify-center rounded-full bg-white text-black px-1 pl-8 py-1 text-base font-medium transition-transform duration-700 hover:scale-105"
        >
          <span className="mr-4">Get started free</span>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowRight className="h-5 w-5" weight="bold" />
          </div>
        </Link>
      </div>
    </section>
  );
}

function InfiniteMarquee() {
  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-white/[0.02] py-6 flex items-center">
      <div className="flex w-max animate-[marquee_30s_linear_infinite]">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex gap-24 px-12 items-center text-white/30 font-display text-xl uppercase tracking-widest whitespace-nowrap">
            <span>The New York Times</span>
            <Star weight="fill" className="h-4 w-4 shrink-0" />
            <span>Condé Nast</span>
            <Star weight="fill" className="h-4 w-4 shrink-0" />
            <span>Vogue</span>
            <Star weight="fill" className="h-4 w-4 shrink-0" />
            <span>Monocle</span>
            <Star weight="fill" className="h-4 w-4 shrink-0" />
            <span>Wallpaper*</span>
            <Star weight="fill" className="h-4 w-4 shrink-0" />
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          to { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}

function Features() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Scroll animations removed per user request
  }, { scope: container });

  const features = [
    { 
      icon: MagicWand, 
      title: "Generative Itineraries", 
      desc: "Tell us where and how long. We engineer a thoughtful, context-aware timeline you can edit freely.",
      colSpan: "lg:col-span-8",
      rowSpan: "lg:row-span-2",
      imgSeed: "blueprint",
      titleSize: "text-3xl lg:text-5xl",
      descSize: "text-base lg:text-lg"
    },
    { 
      icon: CloudSun, 
      title: "Atmospheric Data", 
      desc: "Live meteorological forecasts wired into every day. Never pack wrong.",
      colSpan: "lg:col-span-4",
      rowSpan: "lg:row-span-1",
      imgSeed: "clouds",
      titleSize: "text-2xl",
      descSize: "text-sm"
    },
    { 
      icon: MapPinLine, 
      title: "Curated Topology", 
      desc: "Hidden gems and highly-rated stays mapped perfectly to your timeline.",
      colSpan: "lg:col-span-4",
      rowSpan: "lg:row-span-1",
      imgSeed: "architecture",
      titleSize: "text-2xl",
      descSize: "text-sm"
    },
  ];

  return (
    <section id="features" ref={container} className="px-4 md:px-8 max-w-[1400px] mx-auto w-full">
      <div className="max-w-2xl mb-16">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-4 block">Architecture</span>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight">
          A meticulously crafted toolkit for the modern traveler.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-[280px] grid-flow-dense">
        {features.map((f, i) => (
          <div key={f.title} className={`relative w-full h-full ${f.colSpan} ${f.rowSpan} p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10 group hover:ring-white/20 transition-all duration-700 overflow-hidden`}>
            <div className="relative h-full w-full rounded-[calc(2rem-6px)] bg-transparent p-8 lg:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col justify-end overflow-hidden z-10">
              <div className="mt-auto">
                <f.icon className="h-8 w-8 text-white/70 mb-6" weight="light" />
                <h3 className={`font-display font-medium text-white ${f.titleSize}`}>{f.title}</h3>
                <p className={`mt-4 text-white/70 max-w-md leading-relaxed ${f.descSize}`}>{f.desc}</p>
              </div>
              
              <div className="absolute top-8 right-8 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500">
                <ArrowUpRight className="h-5 w-5 text-white" weight="light" />
              </div>
            </div>
            
            <div className="absolute inset-0 z-0 p-1.5">
              <div className="relative h-full w-full rounded-[calc(2rem-6px)] overflow-hidden bg-black">
                <img 
                  src={`/assets/${f.imgSeed}.jpg`} 
                  alt={f.title} 
                  className="bento-img w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <div 
                  className="absolute inset-0 z-10 mix-blend-color pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, hsl(${i * 60}, 80%, 60%), hsl(${i * 60 + 120}, 80%, 60%))`,
                    animation: `color-breathe 12s infinite alternate ease-in-out`,
                    animationDelay: `${i * 2}s`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes color-breathe {
          0% { filter: hue-rotate(0deg); opacity: 0; }
          50% { opacity: 0.6; }
          100% { filter: hue-rotate(90deg); opacity: 0; }
        }
      `}} />
    </section>
  );
}

function ScrubbingTextReveal() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;
    const words = textRef.current.querySelectorAll('.scrub-word');
    
    gsap.fromTo(words, {
      opacity: 0.1
    }, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top 60%",
        end: "bottom 80%",
        scrub: true,
      }
    });
  }, { scope: container });

  const paragraph = "Select a destination and constraints. Our spatial engine synthesizes millions of data points to generate a perfectly timed, mathematically optimized itinerary in under thirty seconds. Total manual override included.";

  return (
    <section id="how" ref={container} className="px-4 md:px-8 max-w-5xl mx-auto w-full py-24 min-h-[50vh] flex items-center justify-center">
      <h2 ref={textRef} className="font-display text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.3] text-white">
        {paragraph.split(" ").map((word, i) => (
          <span key={i} className="scrub-word inline-block mr-3 mb-2">{word}</span>
        ))}
      </h2>
    </section>
  );
}

function HorizontalAccordions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  
  const slices = [
    { title: "Tokyo", subtitle: "Urban Density", seed: "tokyo" },
    { title: "Amalfi", subtitle: "Coastal Retreat", seed: "amalfi" },
    { title: "Zermatt", subtitle: "Alpine Ascent", seed: "alps" },
    { title: "Kyoto", subtitle: "Historic Silence", seed: "kyoto" },
  ];

  return (
    <section className="px-4 md:px-8 max-w-[1400px] mx-auto w-full h-[600px] flex gap-2 overflow-hidden">
      {slices.map((slice, i) => {
        const isHovered = hoveredIndex === i;
        return (
          <div 
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            className={`relative h-full rounded-[2rem] overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer ring-1 ring-white/10 ${isHovered ? 'w-full lg:w-[60%]' : 'w-16 lg:w-[13.33%]'}`}
          >
            <img 
              src={`/assets/${slice.seed}.jpg`} 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'grayscale-0 mix-blend-normal' : 'grayscale mix-blend-luminosity'}`} 
              alt={slice.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className={`absolute bottom-8 left-8 transition-all duration-700 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-xs font-mono text-white/50 mb-2 block">{slice.subtitle}</span>
              <h3 className="font-display text-4xl text-white font-medium">{slice.title}</h3>
            </div>
            
            {!isHovered && (
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="font-display text-xl text-white/50 -rotate-90 origin-left whitespace-nowrap translate-x-3">{slice.title}</span>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function Testimonials() {
  const defaultTestimonials = [
    { comment: "Planned a 10-day Japan trip in 4 minutes. The spatial mapping is brilliant.", userName: "Maya R." },
    { comment: "The timeline feels like an editorial magazine, yet it's entirely functional and editable.", userName: "Daniel K." },
    { comment: "Granular control combined with generative speed. This is how software should feel.", userName: "Priya S." },
  ];

  return (
    <section id="testimonials" className="px-4 md:px-8 max-w-[1400px] mx-auto w-full">
      <div className="mb-16">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 mb-4 block">Telemetry</span>
        <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-white">Verified outcomes.</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 grid-flow-dense">
        {defaultTestimonials.map((t, idx) => (
          <div key={idx} className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10 h-full group hover:bg-white/[0.07] transition-all duration-700">
            <figure className="h-full rounded-[calc(2rem-6px)] bg-card p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col justify-between">
              <div>
                <blockquote className="text-lg leading-relaxed text-white/80">"{t.comment}"</blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-white/5 pt-6">
                <img src={`/assets/user${idx}.jpg`} className="h-10 w-10 rounded-full object-cover grayscale mix-blend-luminosity" alt={t.userName} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{t.userName}</span>
                  <span className="text-xs text-white/40 font-mono">EARLY ACCESS</span>
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-4 md:px-8 max-w-[1400px] mx-auto w-full pt-16">
      <div className="p-1.5 rounded-[3rem] bg-white/5 ring-1 ring-white/10 shadow-elegant overflow-hidden relative">
        <img 
          src="/assets/space-earth.jpg"
          alt="Space background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0" />
        
        <div className="relative overflow-hidden rounded-[calc(3rem-6px)] bg-black/40 backdrop-blur-md p-16 sm:p-32 text-center flex flex-col items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] z-10">
          <h2 className="font-display text-5xl sm:text-7xl font-medium tracking-tight text-white max-w-4xl">
            Initialize your next coordinates.
          </h2>
          <p className="mt-8 text-lg text-white/50 max-w-lg">
            No credit card required. Free tier includes unlimited generative planning and PDF exports.
          </p>
          <Link 
            href="/register" 
            className="mt-12 group relative inline-flex items-center justify-center rounded-full bg-white text-black px-1 pl-8 py-1 text-base font-medium transition-transform duration-700 hover:scale-105"
          >
            <span className="mr-4">Commence</span>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowRight className="h-5 w-5" weight="bold" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

