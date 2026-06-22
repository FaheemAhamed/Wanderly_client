"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, Mail, Lock } from "lucide-react";
import { setUser } from "@/lib/trips-store";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      const data = await api.post("/auth/login", { email, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      setUser({ name: data.user.name, email: data.user.email });
      toast.success("Welcome back ✈️");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell 
      title="Welcome back" 
      subtitle="Sign in to keep planning your adventures."
      image="/assets/alps.webp"
      quote="Wanderly turned my chaotic travel notes into a polished plan in a single click."
      author="Sora T., visited 38 countries"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@wanderly.app" />
        <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-background shadow-elegant transition-transform hover:scale-[1.01] disabled:opacity-60 cursor-pointer">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
      </form>
      <Divider />
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account? <Link href="/register" className="font-medium text-foreground hover:underline">Create one</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, image, quote, author, children }: { title: string; subtitle: string; image: string; quote: string; author: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:grid h-[100dvh] lg:grid-cols-2 overflow-hidden bg-background">
      <div className="relative h-48 shrink-0 lg:h-full overflow-hidden bg-muted">
        <img src={image} alt="Travel destination" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent lg:from-background/90" />
        <div className="hidden lg:block absolute bottom-10 left-10 right-10 rounded-2xl glass p-6 shadow-elegant border border-white/10">
          <p className="font-display text-xl font-semibold text-white">"{quote}"</p>
          <p className="mt-3 text-sm text-white/80">— {author}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-12 overflow-y-auto">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <img src="/logo.webp" alt="Wanderly" className="h-9 w-9 rounded-xl object-cover invert dark:invert-0" />
            <span className="font-display text-lg font-bold">Wanderly</span>
          </Link>
          <div className="mt-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Field({ icon: Icon, label, type, value, onChange, placeholder }: { icon: any; label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2.5 transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function SocialButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      const { signInWithPopup } = await import("firebase/auth");
      const { auth, googleProvider } = await import("@/lib/firebase");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const data = await api.post("/auth/google", { 
        name: user.displayName || "Explorer", 
        email: user.email,
        photoURL: user.photoURL,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      setUser({ name: data.user.name, email: data.user.email, photoURL: user.photoURL || undefined });
      toast.success("Welcome to Wanderly ✨");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-medium hover:bg-muted cursor-pointer transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-4 w-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
      )}
      Continue with Google
    </button>
  );
}
