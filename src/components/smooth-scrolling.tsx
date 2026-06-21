"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (!href) return;

      // Check if it's an anchor link for the current page
      if (href.startsWith("#") || (href.startsWith("/#") && window.location.pathname === "/")) {
        const id = href.startsWith("/#") ? href.substring(1) : href;
        const element = document.querySelector(id) as HTMLElement;
        
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -64 }); // Offset for navbar height
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
