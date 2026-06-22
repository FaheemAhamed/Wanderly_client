"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { setUser } from "@/lib/trips-store";
import { api } from "@/lib/api";
import { AuthShell, Field, Divider, SocialButtons } from "../login/page";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const data = await api.post("/auth/register", { name, email, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      setUser({ name: data.user.name, email: data.user.email });
      toast.success("Account created — let's plan something ✨");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell 
      title="Create your account" 
      subtitle="Plan unlimited trips with AI. Free forever."
      image="/assets/amalfi.jpg"
      quote="The AI completely understood the vibe we wanted. It felt like having a local guide in our pocket."
      author="Marcus P., traveled to Italy"
    >
      <form onSubmit={submit} className="space-y-4">
        <Field icon={UserIcon} label="Full name" type="text" value={name} onChange={setName} placeholder="Ada Lovelace" />
        <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@wanderly.app" />
        <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-background shadow-elegant transition-transform hover:scale-[1.01] disabled:opacity-60 cursor-pointer">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create account
        </button>
      </form>
      <Divider />
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="font-medium text-foreground hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
