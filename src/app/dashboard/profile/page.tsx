"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Save } from "lucide-react";
import { getUser, setUser, useUser } from "@/lib/trips-store";

export default function ProfilePage() {
  const user = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  useEffect(() => {
    const u = getUser();
    setName(u?.name ?? "");
    setEmail(u?.email ?? "");
  }, [user?.email]);

  function save() {
    if (!name || !email) { toast.error("Name and email required"); return; }
    setUser({ name, email });
    toast.success("Profile saved");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences.</p>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
        </div>
        <button onClick={save} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-card hover:scale-[1.02] transition-transform cursor-pointer">
          <Save className="h-4 w-4" /> Save changes
        </button>
      </section>

      <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold">Danger zone</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign out of this device.</p>
        <button onClick={() => setShowSignoutModal(true)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/15 cursor-pointer transition-colors">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>

      {/* Sign-out Confirmation Modal */}
      {showSignoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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
                onClick={() => { setUser(null); router.push("/"); }}
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

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
    </label>
  );
}
