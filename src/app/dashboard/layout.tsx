"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Plus, User as UserIcon, LogOut, Sparkles, Menu, X } from "lucide-react";
import { useUser, setUser } from "@/lib/trips-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        toastRedirect();
      } else {
        setCheckingAuth(false);
      }
    }
  }, [router]);

  function toastRedirect() {
    setUser(null);
    router.push("/login");
  }

  function handleSignOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
    router.push("/");
  }

  const nav = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Profile", icon: UserIcon },
  ];

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-xl animate-pulse">Verifying secure session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 print:bg-white">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden print:hidden">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Wanderly" className="h-8 w-8 rounded-lg object-cover invert dark:invert-0" />
          <span className="font-display font-bold">Wanderly</span>
        </Link>
        <button onClick={() => setOpen(v => !v)} className="rounded-lg p-2 hover:bg-muted cursor-pointer">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} print:hidden`}>
          <div className="flex h-full flex-col p-5">
            <Link href="/" className="flex items-center gap-2 mt-2">
              <img src="/logo.png" alt="Wanderly" className="h-9 w-9 rounded-xl object-cover invert dark:invert-0" />
              <span className="font-display text-lg font-bold">Wanderly</span>
            </Link>

            <nav className="mt-8 flex-1 space-y-1">
              {nav.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"}`}
                  >
                    <n.icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-sidebar-border pt-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sidebar-foreground font-medium">
                  {user?.name?.charAt(0) ?? "E"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium">{user?.name ?? "Explorer"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSignoutModal(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-transparent py-2 text-xs font-medium text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      {/* Sign-out Confirmation Modal */}
      {showSignoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSignoutModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 overflow-hidden rounded-[2rem] bg-card p-6 shadow-2xl border border-border">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <LogOut className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight">Sign out</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to sign out? You will need to log back in to view your itineraries.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignoutModal(false)}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 rounded-xl bg-destructive px-4 py-3 text-sm font-medium text-destructive-foreground hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
