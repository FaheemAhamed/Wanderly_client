"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser, setUser } from "@/lib/trips-store";
import { List, X } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile nav on route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Scroll spy effect using IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px", // triggers when section is in the middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sectionIds = ["home", "features", "how", "testimonials"];
    // Small delay to allow elements to render fully on first load
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const links = [
    { id: "home", to: "/", label: "Home" },
    { id: "features", to: "/#features", label: "Features" },
    { id: "how", to: "/#how", label: "How it works" },
    { id: "testimonials", to: "/#testimonials", label: "Stories" },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-6 z-50 px-4 transition-spring">
        <div className="mx-auto w-max">
          <nav
            className={`flex h-14 items-center justify-between rounded-full px-4 sm:px-6 transition-spring ${
              scrolled
                ? "glass shadow-elegant"
                : "bg-black/20 backdrop-blur-2xl border border-white/5"
            }`}
          >
            <Link href="/" className="flex items-center gap-2 mr-6" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="Wanderly" className="h-6 w-6 rounded-md object-cover invert" />
              <span className="font-display text-lg font-bold tracking-tight">Wanderly</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {links.map((l) => {
                const isActive = activeSection === l.id;
                return (
                  <a
                    key={l.to}
                    href={l.to}
                    className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-white/10 text-white font-medium shadow-[0_2px_10px_rgba(255,255,255,0.05)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </a>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 ml-6 md:flex">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-9 w-9 ring-1 ring-white/10 hover:ring-white/30 transition-all cursor-pointer">
                      {user.photoURL && <AvatarImage src={user.photoURL} alt={user.name} className="object-cover" referrerPolicy="no-referrer" />}
                      <AvatarFallback className="bg-white/10 text-xs font-medium text-white">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/10 text-white rounded-2xl p-2 shadow-elegant mt-2">
                    <DropdownMenuLabel className="font-normal px-2 py-1.5">
                      <div className="flex flex-col space-y-1.5">
                        <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                        <p className="text-xs leading-none text-white/50">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10 my-2" />
                    <DropdownMenuItem className="p-0" asChild>
                      <Link href="/dashboard" className="w-full px-3 py-2.5 cursor-pointer rounded-xl hover:bg-white/10 focus:bg-white/10 outline-none transition-colors block text-sm">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="w-full px-3 py-2.5 mt-1 cursor-pointer text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 rounded-xl outline-none transition-colors text-sm"
                      onClick={() => { setUser(null); router.push("/"); }}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link 
                  href="/login" 
                  className="group relative inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2 text-sm font-medium transition-spring hover:scale-[0.98]"
                >
                  Sign in
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center ml-4">
              <button
                className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all z-[60]"
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
              >
                {/* Hamburger Morph Implementation using span lines */}
                <span className={`absolute h-[1.5px] w-4 bg-foreground transition-spring ${open ? "rotate-45" : "-translate-y-1.5"}`} />
                <span className={`absolute h-[1.5px] w-4 bg-foreground transition-spring ${open ? "opacity-0 scale-x-0" : "opacity-100"}`} />
                <span className={`absolute h-[1.5px] w-4 bg-foreground transition-spring ${open ? "-rotate-45" : "translate-y-1.5"}`} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Massive Screen-Filling Overlay for Mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center justify-center ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center justify-center gap-6 w-full px-6">
          {links.map((l, i) => {
            const isActive = activeSection === l.id;
            return (
              <div key={l.to} className="overflow-hidden">
                <a 
                  href={l.to} 
                  className={`block font-display text-4xl sm:text-5xl font-medium tracking-tight transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isActive ? "text-white scale-105" : "text-white/40 hover:text-white/70"
                  } ${open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
                  style={{ transitionDelay: `${open ? 100 + i * 50 : 0}ms` }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </div>
            );
          })}
          
          <div className="my-4 h-px w-16 bg-white/10" />

          <div className="overflow-hidden">
            {user ? (
              <Link 
                href="/dashboard" 
                className={`block font-display text-2xl text-muted-foreground hover:text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
                style={{ transitionDelay: `${open ? 100 + links.length * 50 : 0}ms` }}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                className={`group relative inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 text-lg font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[0.98] ${open ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"}`}
                style={{ transitionDelay: `${open ? 100 + links.length * 50 : 0}ms` }}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}