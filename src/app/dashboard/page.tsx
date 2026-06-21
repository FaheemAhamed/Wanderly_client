"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Plane, Compass, Calendar, Wallet, Loader2, MapPin, X, Star, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { useUser, setUser } from "@/lib/trips-store";
import { TripCard } from "@/components/trip-card";

export default function DashboardHome() {
  const router = useRouter();
  const user = useUser();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"trips" | "review">("trips");

  // Review state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    const cached = localStorage.getItem("dashboard_trips_cache");
    if (cached) {
      try {
        setTrips(JSON.parse(cached));
        setLoading(false);
      } catch (e) {}
    }

    try {
      const data = await api.get("/trips");
      setTrips(data.trips || []);
      localStorage.setItem("dashboard_trips_cache", JSON.stringify(data.trips || []));
    } catch (err: any) {
      console.error("Failed to load trips:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) { toast.error("Please enter a comment"); return; }
    setSubmittingReview(true);
    try {
      await api.post("/reviews", { rating, comment: comment.trim() });
      toast.success("Thank you for your testimonial! 🌟");
      setComment("");
      setRating(5);
      setActiveTab("trips");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  }

  const stats = useMemo(() => {
    const totalDays = trips.reduce((s, t) => s + (t.numberOfDays || 0), 0);
    const uniqueDestinations = new Set(trips.map((t) => t.destination.toLowerCase())).size;
    const totalSpent = trips.reduce((s, t) => s + (t.estimatedBudget?.total || 0), 0);

    return [
      { label: "Trips Planned", value: trips.length, icon: Plane },
      { label: "Total Days", value: totalDays, icon: Calendar },
      { label: "Destinations", value: uniqueDestinations, icon: Compass },
    ];
  }, [trips]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Hello, {user?.name?.split(" ")[0] || "Explorer"} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Design your next AI-generated itinerary and manage saved trips.</p>
        </div>

        <div className="flex rounded-xl bg-muted p-1 border border-border">
          <button
            onClick={() => setActiveTab("trips")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition cursor-pointer ${activeTab === "trips" ? "bg-card text-foreground shadow-card" : "text-muted-foreground"}`}
          >
            <Plane className="h-3.5 w-3.5" /> My Trips
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition cursor-pointer ${activeTab === "review" ? "bg-card text-foreground shadow-card" : "text-muted-foreground"}`}
          >
            <Star className="h-3.5 w-3.5" /> Leave Review
          </button>
        </div>
      </header>

      {activeTab === "trips" ? (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-card flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold">{value}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            ))}
          </section>

          <section id="create" className="mt-10">
            <CreateTripForm onCreated={(t) => router.push(`/dashboard/trip/${t._id}`)} />
          </section>

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold">Your Saved Trips</h2>
                <p className="text-sm text-muted-foreground">{trips.length} {trips.length === 1 ? "trip" : "trips"} isolated in your vault</p>
              </div>
            </div>

            {trips.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground"><Plane className="h-6 w-6" /></div>
                <h3 className="mt-4 font-display text-xl font-semibold">No trips yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Generate your first AI itinerary in seconds above.</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((t) => (
                  <TripCard
                    key={t._id}
                    trip={{
                      id: t._id,
                      destination: t.destination,
                      country: t.country || "Custom trip",
                      cover: t.cover || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=80",
                      numDays: t.numberOfDays,
                      budget: t.budgetType,
                      interests: t.interests || [],
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="mt-8 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
              <Star className="h-5 w-5 text-primary fill-current" />
              <h2 className="font-display text-xl font-semibold">Submit App Testimonial</h2>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block mb-2 text-xs font-semibold text-muted-foreground">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 rounded hover:bg-muted transition cursor-pointer"
                    >
                      <Star className={`h-6 w-6 ${rating >= star ? "text-primary fill-current" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-semibold text-muted-foreground">Review Message</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience using Wanderly travel planner..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("trips")}
                  className="rounded-xl px-4 py-2.5 text-sm hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
                >
                  {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Submit Testimonial
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

const PRESET_INTERESTS = ["Food", "Culture", "Nature", "Nightlife", "Architecture", "Adventure", "Relax", "Shopping"];

interface CreateTripFormProps {
  onCreated: (trip: any) => void;
}

function CreateTripForm({ onCreated }: CreateTripFormProps) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState<string>("Medium");
  const [interests, setInterests] = useState<string[]>(["Food", "Culture"]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Thinking...");

  useEffect(() => {
    if (!loading) return;
    const phrases = ["Thinking...", "Planning...", "Generating the trip plan and data..."];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setLoadingText(phrases[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  function toggle(i: string) {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim()) { toast.error("Where are you headed?"); return; }
    setLoading(true);
    try {
      const data = await api.post("/trips", {
        destination: destination.trim(),
        numberOfDays: days,
        budgetType: budget,
        interests,
      });
      toast.success("Itinerary generated successfully by AI ✨");
      onCreated(data.trip);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate travel plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-muted px-6 py-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold">Plan a new trip</h2>
      </div>
      <form onSubmit={submit} className="grid gap-4 p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <FieldText icon={MapPin} label="Destination" value={destination} onChange={setDestination} placeholder="Paris, Tokyo, New York..." />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Number of days</label>
          <div className="flex items-center gap-3 rounded-xl border border-input bg-background px-3 py-2.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input type="range" min={2} max={14} value={days} onChange={(e) => setDays(Number(e.target.value))} className="flex-1 accent-primary cursor-pointer" />
            <span className="w-10 text-right text-sm font-medium">{days}d</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Budget Type</label>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted p-1 border border-border">
            {(["Low", "Medium", "High"] as const).map((b) => (
              <button type="button" key={b} onClick={() => setBudget(b)}
                className={`flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition cursor-pointer ${budget === b ? "bg-card text-foreground shadow-card" : "text-muted-foreground"}`}
              >
                <Wallet className="h-3 w-3" /> {b}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Interests</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_INTERESTS.map((i) => {
              const active = interests.includes(i);
              return (
                <button type="button" key={i} onClick={() => toggle(i)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition cursor-pointer ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"}`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-3 pt-2">
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-60 cursor-pointer">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating</> : <><Sparkles className="h-4 w-4" /> Generate Itinerary</>}
          </button>
        </div>

        {loading && (
          <div className="md:col-span-2 mt-4 rounded-2xl bg-muted/50 p-4 border border-border">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span className="animate-pulse">{loadingText}</span>
            </div>
            <div className="grid gap-2.5">
              <div className="h-2 w-full rounded-full shimmer" />
              <div className="h-2 w-5/6 rounded-full shimmer" />
              <div className="h-2 w-4/6 rounded-full shimmer" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function FieldText({ icon: Icon, label, value, onChange, placeholder }: { icon?: any; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
    </label>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12 animate-pulse">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-muted rounded-md" />
          <div className="h-10 w-64 bg-muted rounded-md" />
          <div className="h-4 w-80 bg-muted rounded-md" />
        </div>
        <div className="h-10 w-48 bg-muted rounded-xl border border-border" />
      </header>
      
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-28 rounded-2xl bg-card border border-border" />
        ))}
      </section>

      <section className="mt-10">
        <div className="h-96 rounded-3xl bg-card border border-border" />
      </section>

      <section className="mt-12">
        <div className="h-8 w-48 bg-muted rounded-md mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[300px] rounded-2xl bg-card border border-border" />
          ))}
        </div>
      </section>
    </div>
  );
}
