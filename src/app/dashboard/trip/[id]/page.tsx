"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Cloud, Calendar, Wallet, Plus, Trash2, RefreshCcw, Download,
  Hotel, ShieldCheck, Backpack, Sparkles, Utensils, Camera, Mountain, Music, Coffee, X, Loader2, Navigation, CheckCircle2, Circle, ArrowDown, Phone
} from "lucide-react";
import { api } from "@/lib/api";

interface Activity {
  _id: string;
  title: string;
  description?: string;
  estimatedCostUSD: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  coordinates?: { lat: number; lng: number };
  transitToNext?: { mode: "Walk" | "Transit" | "Drive" | "None"; durationMin: number };
}

interface ItineraryDay {
  dayNumber: number;
  activities: Activity[];
  title?: string;
}

interface PackingItem {
  _id: string;
  item: string;
  category: "Crucial Travel Documents" | "Activity-Specific Equipment" | "Climate Wear";
  checked: boolean;
}

interface HotelInfo {
  name: string;
  priceRange: string;
  rating: number;
  contactNumber?: string;
  image?: string;
}

interface Trip {
  _id: string;
  destination: string;
  cover?: string;
  country?: string;
  currencyCode?: string;
  currencySymbol?: string;
  usdToINRRate?: number;
  usdToLocalRate?: number;
  numberOfDays: number;
  budgetType: "Low" | "Medium" | "High";
  itinerary: ItineraryDay[];
  hotels: HotelInfo[];
  estimatedBudget: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
    total: number;
  };
  interests: string[];
  interestHighlights?: {
    interest: string;
    title: string;
    description: string;
    image: string;
  }[];
  packingList: PackingItem[];
  safetyTips: string[];
  touristRules?: string[];
  weatherInfo?: {
    temperature: number;
    weather: string;
    description: string;
  };
}

const CAT_ICONS: Record<string, any> = {
  Morning: Coffee,
  Afternoon: Mountain,
  Evening: Utensils,
};

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [addingToDay, setAddingToDay] = useState<number | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  
  // Regenerate Prompt State
  const [regeneratePromptDay, setRegeneratePromptDay] = useState<number | null>(null);
  const [regeneratePromptText, setRegeneratePromptText] = useState("");

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  // New Activity Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCost, setNewCost] = useState(0);
  const [newTime, setNewTime] = useState<"Morning" | "Afternoon" | "Evening">("Afternoon");
  const [addingActivityLoading, setAddingActivityLoading] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  async function fetchTripDetails() {
    try {
      const data = await api.get(`/trips/${id}`);
      if (data.success && data.trip) {
        setTrip(data.trip);
      } else {
        toast.error("Trip not found");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  }

  async function performDeleteTrip() {
    setDeletingTrip(true);
    try {
      await api.delete(`/trips/${id}`);
      toast.success("Trip deleted successfully");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete trip");
      setDeletingTrip(false);
    }
  }

  function deleteTrip() {
    confirmAction(
      "Delete Trip",
      "Are you sure you want to delete this trip? This cannot be undone.",
      performDeleteTrip
    );
  }

  async function handleTogglePacking(itemId: string) {
    if (!trip) return;
    try {
      // Opt-in UI update
      setTrip({
        ...trip,
        packingList: trip.packingList.map(item =>
          item._id === itemId ? { ...item, checked: !item.checked } : item
        )
      });

      await api.patch(`/trips/${trip._id}/packing/${itemId}/toggle`);
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle packing item");
      // Fallback
      fetchTripDetails();
    }
  }

  async function handleAddActivity(dayNum: number) {
    if (!newTitle.trim()) { toast.error("Activity title is required"); return; }
    setAddingActivityLoading(true);
    try {
      const payload = {
        activity: {
          title: newTitle.trim(),
          description: newDesc.trim(),
          estimatedCostUSD: Number(newCost) || 0,
          timeOfDay: newTime,
        }
      };

      const data = await api.patch(`/trips/${id}/day/${dayNum}/add-activity`, payload);
      toast.success("Activity added successfully ✨");
      if (data.trip) setTrip(data.trip);
      else fetchTripDetails();
      
      setAddingToDay(null);
      setNewTitle("");
      setNewDesc("");
      setNewCost(0);
      setNewTime("Afternoon");
    } catch (err: any) {
      toast.error(err.message || "Failed to add activity");
    } finally {
      setAddingActivityLoading(false);
    }
  }

  async function performRemoveActivity(dayNum: number, activityId: string) {
    try {
      const data = await api.patch(`/trips/${id}/day/${dayNum}/remove-activity`, { activityId });
      toast.success("Activity removed successfully");
      if (data.trip) setTrip(data.trip);
      else fetchTripDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove activity");
    }
  }

  function handleRemoveActivity(dayNum: number, activityId: string) {
    confirmAction(
      "Remove Activity",
      "Are you sure you want to remove this activity?",
      () => performRemoveActivity(dayNum, activityId)
    );
  }

  async function handleRegenerateDay(dayNum: number, promptText: string) {
    setRegeneratingDay(dayNum);
    setRegeneratePromptDay(null); // close modal
    setRegeneratePromptText("");
    try {
      const data = await api.patch(`/trips/${id}/day/${dayNum}/regenerate`, { prompt: promptText });
      toast.success(`Day ${dayNum} regenerated successfully ✨`);
      // Reload details
      fetchTripDetails();
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate day");
    } finally {
      setRegeneratingDay(null);
    }
  }

  if (loading) {
    return <TripSkeleton />;
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Trip not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">It may have been deleted or access is denied.</p>
        <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  // Visual layout helpers
  const weather = trip.weatherInfo || { temperature: 20, weather: "Clear", description: "clear sky" };
  const coverUrl = trip.cover || "/assets/trip1.webp";

  const formatCurrency = (usdVal: number) => {
    const usdToINR = trip.usdToINRRate || 83.5;
    const usdToLocal = trip.usdToLocalRate || 1;
    const inrVal = Math.round(usdVal * usdToINR);
    const localVal = Math.round(usdVal * usdToLocal);
    
    const isIndia = trip.country?.toLowerCase() === "india" || trip.currencyCode === "INR" || trip.destination?.toLowerCase().includes("india");
    
    if (isIndia) {
      return `₹${inrVal.toLocaleString("en-IN")}`;
    } else {
      const symbol = trip.currencySymbol || "$";
      return `₹${inrVal.toLocaleString("en-IN")} / ${symbol}${localVal.toLocaleString()}`;
    }
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <>
    <div id="trip-pdf-container" className="bg-background print:hidden">
      {/* Hero banner */}
      <section className="relative h-[340px] overflow-hidden sm:h-[420px]">
        <Image src={coverUrl} alt={trip.destination || "Destination"} fill priority sizes="100vw" className="object-cover brightness-[0.85]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/45" />
        <div className="absolute inset-x-0 top-0 p-4 sm:p-6" data-html2canvas-ignore="true">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
          </Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-10 sm:pb-10">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm text-white/80">Wanderly Secure Enclave Plan</p>
            <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow">{trip.destination}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge><Calendar className="h-3 w-3" /> {trip.numberOfDays} days</Badge>
              <Badge><Wallet className="h-3 w-3" /> {trip.budgetType} Budget</Badge>
              {trip.interests.slice(0, 3).map((i) => <Badge key={i}>{i}</Badge>)}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        {/* Action bar */}
        <div id="action-bar" className="flex flex-wrap items-center justify-end gap-2 border-b border-border pb-4 print:hidden" data-html2canvas-ignore="true">
          <button onClick={exportPdf} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors">
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button onClick={deleteTrip} disabled={deletingTrip} className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive hover:bg-destructive/15 cursor-pointer disabled:opacity-60 transition-colors">
            {deletingTrip ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete trip
          </button>
        </div>

        {/* Info cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard title="Weather Forecast" icon={Cloud}>
            <p className="font-display text-3xl font-bold">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground">{weather.weather}</p>
            <p className="mt-2 text-xs text-muted-foreground capitalize">{weather.description}</p>
          </InfoCard>
          <InfoCard title="Budget Estimation" icon={Wallet}>
            <p className="font-display text-3xl font-bold">{formatCurrency(trip.estimatedBudget?.total || 0)}</p>
            <p className="text-sm text-muted-foreground">Flights: {formatCurrency(trip.estimatedBudget?.flights || 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Accom: {formatCurrency(trip.estimatedBudget?.accommodation || 0)} · Food: {formatCurrency(trip.estimatedBudget?.food || 0)}</p>
          </InfoCard>
          <InfoCard title="Itinerary Status" icon={Sparkles}>
            <p className="font-display text-3xl font-bold">{trip.itinerary.reduce((s, d) => s + d.activities.length, 0)}</p>
            <p className="text-sm text-muted-foreground">AI optimized experiences</p>
          </InfoCard>
        </div>

        {/* Destination Highlights */}
        {trip.interestHighlights && trip.interestHighlights.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">Destination Highlights</h2>
            <p className="text-sm text-muted-foreground">Signature experiences in {trip.destination} matching your interests.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trip.interestHighlights.map((highlight, index) => (
                <div key={index} className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card flex flex-col">
                  <div className="relative aspect-video w-full overflow-hidden shrink-0 bg-muted">
                    <Image 
                      src={highlight.image} 
                      alt={highlight.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {highlight.interest}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold">{highlight.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Timeline Itinerary</h2>
          <p className="text-sm text-muted-foreground">Modify activities, regenerate days, and configure details.</p>

          <div className="mt-6 space-y-6">
            {trip.itinerary.map((day, idx) => {
              const dayNum = day.dayNumber || (day as any).day;
              return (
                <article key={idx} className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-accent/30 to-transparent px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-primary">Day {dayNum}</p>
                      <h3 className="font-display text-lg font-semibold">{day.title || `Explore Destination`}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setAddingToDay(dayNum)} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted cursor-pointer">
                        <Plus className="h-3.5 w-3.5" /> Add Activity
                      </button>
                      <button onClick={() => setRegeneratePromptDay(dayNum)} disabled={regeneratingDay === dayNum} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-60 cursor-pointer">
                        {regeneratingDay === dayNum ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                        Regenerate
                      </button>
                    </div>
                  </header>

                  <div className="p-6">
                    {regeneratingDay === dayNum ? (
                      <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="rounded-2xl border border-border bg-card p-4 shadow-sm grid grid-cols-[3rem_1fr_auto] gap-4 items-center opacity-70">
                            <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
                            <div className="space-y-2">
                              <div className="h-4 w-1/3 bg-muted rounded" />
                              <div className="h-3 w-2/3 bg-muted rounded" />
                            </div>
                            <div className="h-6 w-16 bg-muted rounded-full" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {day.activities.map((a, actIdx) => {
                          const Icon = CAT_ICONS[a.timeOfDay] || Coffee;
                          const isLast = actIdx === day.activities.length - 1;
                          return (
                            <div key={a._id || actIdx} className="flex flex-col items-center">
                              {/* Activity Card */}
                              <div className="w-full relative group">
                                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition grid grid-cols-[3rem_1fr_auto] gap-4 items-center">
                                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card">
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-2">
                                      <span className="font-display text-base font-semibold">{a.title}</span>
                                      <span className="text-xs text-muted-foreground">{a.timeOfDay}</span>
                                      {a.estimatedCostUSD > 0 && (
                                        <span className="text-xs bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded-full font-mono">
                                          {formatCurrency(a.estimatedCostUSD)}
                                        </span>
                                      )}
                                    </div>
                                    {a.description && <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>}
                                  </div>
                                  <button onClick={() => handleRemoveActivity(dayNum, a._id)}
                                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Transit Flow Arrow */}
                              {!isLast && (
                                <div className="flex flex-col items-center my-2">
                                  <div className="h-4 w-px bg-border" />
                                  {a.transitToNext && a.transitToNext.mode !== "None" ? (
                                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                      <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium shadow-sm">
                                        <Navigation className="h-3 w-3" />
                                        {a.transitToNext.mode} ({a.transitToNext.durationMin} mins)
                                      </div>
                                      <div className="h-4 w-px bg-border" />
                                      <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                  ) : (
                                    <ArrowDown className="h-3.5 w-3.5 text-muted-foreground mt-1" />
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {day.activities.length === 0 && (
                          <p className="text-center text-sm text-muted-foreground">No activities yet — add one above.</p>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Hotels */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Recommended Hotels</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {trip.hotels.map((h, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col justify-between overflow-hidden">
                <div>
                  {h.image && (
                    <div className="relative aspect-video w-full mb-4 rounded-xl overflow-hidden bg-muted">
                      <Image src={h.image} alt={h.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                  )}
                  <Hotel className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-display text-lg font-semibold">{h.name}</h3>
                  <p className="text-sm text-muted-foreground">{h.priceRange || "Comfortable Room"}</p>
                  {h.contactNumber && (
                    <p className="mt-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg inline-flex items-center gap-1.5 font-mono">
                      <Phone className="h-3 w-3" /> {h.contactNumber}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm border-t border-border/50 pt-2">
                  <span className="text-muted-foreground">★ {h.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Packing Checklist & Safety & Rules */}
        <section className="mt-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2">
          {/* Weather-Aware Packing checklist */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <Backpack className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-display text-lg font-semibold">AI Climate Packing Checklist</h3>
                <p className="text-xs text-muted-foreground">Auto-generated smart packing checklist for {trip.destination}.</p>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {trip.packingList && trip.packingList.length > 0 ? (
                trip.packingList.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => handleTogglePacking(item._id)}
                    className="flex items-center gap-3 p-3 bg-slate-900/30 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition"
                  >
                    {item.checked ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                    ) : (
                      <Circle className="h-4.5 w-4.5 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${item.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.item}
                    </span>
                    <span className="ml-auto text-[9px] uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded font-mono">
                      {item.category}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No packing recommendations generated.</p>
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card flex flex-col">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-display text-lg font-semibold">Safety Tips</h3>
                <p className="text-xs text-muted-foreground">Travel safely in this destination.</p>
              </div>
            </div>
            <ul className="space-y-3 mt-2 flex-1">
              {trip.safetyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {trip.touristRules && trip.touristRules.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card flex flex-col">
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-display text-lg font-semibold">Local Rules</h3>
                  <p className="text-xs text-muted-foreground">Etiquette and laws for tourists.</p>
                </div>
              </div>
              <ul className="space-y-3 mt-2 flex-1">
                {trip.touristRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {addingToDay && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setAddingToDay(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg font-semibold">Add activity (Day {addingToDay})</h3>
              <button onClick={() => setAddingToDay(null)} className="rounded-lg p-1.5 hover:bg-muted cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block mb-1.5 text-xs text-muted-foreground">Activity Title</label>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What's the plan?" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
              </div>
              
              <div>
                <label className="block mb-1.5 text-xs text-muted-foreground">Description / Notes</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Notes, addresses, or links..." rows={3} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 text-xs text-muted-foreground">Est. Cost (USD)</label>
                  <input type="number" value={newCost} onChange={(e) => setNewCost(Number(e.target.value))} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs text-muted-foreground">Time of Day</label>
                  <select value={newTime} onChange={(e: any) => setNewTime(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none">
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setAddingToDay(null)} className="rounded-xl px-4 py-2 text-sm hover:bg-muted cursor-pointer">Cancel</button>
              <button
                onClick={() => handleAddActivity(addingToDay)}
                disabled={addingActivityLoading}
                className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background shadow-card cursor-pointer disabled:opacity-60 inline-flex items-center gap-1.5"
              >
                {addingActivityLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-elegant animate-in zoom-in-95 duration-200">
            <h3 className="font-display text-xl font-semibold">{confirmModal.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{confirmModal.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted transition cursor-pointer">
                Cancel
              </button>
              <button onClick={() => {
                confirmModal.onConfirm();
                setConfirmModal({ ...confirmModal, isOpen: false });
              }} className="rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition shadow-sm cursor-pointer">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Day Prompt Modal */}
      {regeneratePromptDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border">
            <h3 className="font-display text-xl font-bold">Regenerate Day {regeneratePromptDay}</h3>
            <p className="mt-2 text-sm text-muted-foreground">What would you like to change about this day? For example, "More outdoor activities" or "Change museums to shopping". Leave blank to randomly regenerate.</p>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground block mb-2">Prompt (Optional)</label>
              <textarea 
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                placeholder="Make it less physically demanding..."
                value={regeneratePromptText}
                onChange={e => setRegeneratePromptText(e.target.value)}
              />
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setRegeneratePromptDay(null)}
                className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRegenerateDay(regeneratePromptDay, regeneratePromptText)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Editorial / Textbook PDF View */}
    <div className="hidden print:block bg-white text-black font-serif w-full m-0 p-0">
      
      {/* COVER PAGE */}
      <div className="h-screen w-full flex flex-col justify-center items-center text-center px-12 break-after-page relative">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src={coverUrl} alt="Background" className="w-full h-full object-cover print-color-adjust-exact grayscale" />
        </div>
        <div className="z-10 bg-white/90 p-16 border border-gray-200 shadow-2xl backdrop-blur-sm max-w-2xl w-full">
          <h1 className="text-6xl font-bold tracking-tighter mb-8 uppercase text-gray-900 leading-none">{trip.destination}</h1>
          <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          <p className="text-xl text-gray-800 tracking-widest uppercase mb-4">Official Travel Dossier</p>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            {trip.numberOfDays} Days &bull; {trip.budgetType} Budget
          </p>
        </div>
      </div>

      {/* HIGHLIGHTS / INTRO (Page 2) */}
      {trip.interestHighlights && trip.interestHighlights.length > 0 && (
        <div className="p-16 break-after-page">
          <h2 className="text-4xl font-bold mb-16 uppercase border-b-4 border-black pb-4">Destination Highlights</h2>
          <div className="space-y-16">
            {trip.interestHighlights.map((highlight, idx) => (
              <div key={idx} className="flex gap-10 items-center break-inside-avoid">
                <div className="w-1/3 aspect-square bg-gray-100">
                  {highlight.image && <img src={highlight.image} className="w-full h-full object-cover print-color-adjust-exact" alt={highlight.title} />}
                </div>
                <div className="w-2/3">
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{highlight.interest}</span>
                  <h3 className="text-4xl font-serif mt-2 mb-6 text-black">{highlight.title}</h3>
                  <p className="text-gray-800 leading-loose text-lg">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ITINERARY */}
      <div className="p-16 break-after-page">
        <h2 className="text-4xl font-bold mb-16 uppercase border-b-4 border-black pb-4">Daily Itinerary</h2>
        <div className="space-y-16">
          {trip.itinerary.map((day, idx) => {
            const dayNum = day.dayNumber || (day as any).day;
            return (
              <div key={idx} className="break-inside-avoid">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-2xl font-bold rounded-full print-color-adjust-exact">
                    {dayNum}
                  </div>
                  <h3 className="text-3xl font-serif text-black">{day.title || 'Explore'}</h3>
                </div>
                
                <div className="pl-8 border-l-2 border-gray-300 ml-8 space-y-10">
                  {day.activities.map((a, actIdx) => (
                    <div key={actIdx} className="relative">
                      <div className="absolute -left-[41px] top-1.5 w-4 h-4 bg-white border-2 border-black rounded-full print-color-adjust-exact"></div>
                      <div className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">
                        {a.timeOfDay}
                      </div>
                      <h4 className="text-xl font-bold text-black mb-2">{a.title}</h4>
                      <p className="text-gray-800 text-base leading-relaxed">{a.description}</p>
                      {a.estimatedCostUSD > 0 && (
                        <p className="text-sm text-gray-500 mt-3 font-sans">
                          Est. Cost: {formatCurrency(a.estimatedCostUSD)}
                        </p>
                      )}
                    </div>
                  ))}
                  {day.activities.length === 0 && (
                    <p className="text-base text-gray-500 italic">No scheduled activities.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOTELS */}
      {trip.hotels && trip.hotels.length > 0 && (
        <div className="p-16 break-after-page">
          <h2 className="text-4xl font-bold mb-16 uppercase border-b-4 border-black pb-4">Recommended Hotels</h2>
          <div className="grid grid-cols-2 gap-16">
            {trip.hotels.map((h, idx) => (
              <div key={idx} className="break-inside-avoid">
                <div className="w-full aspect-[4/3] bg-gray-100 mb-6">
                  {h.image && <img src={h.image} className="w-full h-full object-cover print-color-adjust-exact" alt={h.name} />}
                </div>
                <h3 className="text-2xl font-bold text-black">{h.name}</h3>
                <p className="text-gray-800 mt-2 text-lg font-sans">{h.priceRange} &bull; {h.rating} Stars</p>
                {h.contactNumber && <p className="text-gray-600 mt-2 font-sans">{h.contactNumber}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* APPENDIX */}
      <div className="p-16 space-y-20">
        {trip.packingList && trip.packingList.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="text-3xl font-bold mb-8 uppercase border-b-2 border-gray-300 pb-4">Packing Checklist</h2>
            <div className="columns-2 gap-12 font-sans">
              {trip.packingList.map(item => (
                <div key={item._id} className="text-base mb-4 break-inside-avoid flex items-start gap-3">
                  <div className="w-5 h-5 border-2 border-black shrink-0 mt-0.5 rounded-sm"></div>
                  <div>
                    <span className="text-gray-900 font-medium">{item.item}</span>
                    <span className="text-gray-500 text-sm ml-2">({item.category})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {trip.safetyTips && trip.safetyTips.length > 0 && (
          <div className="break-inside-avoid">
            <h2 className="text-3xl font-bold mb-8 uppercase border-b-2 border-gray-300 pb-4">Important Notes</h2>
            <ul className="space-y-4 font-sans text-lg">
              {trip.safetyTips.map((tip, idx) => (
                <li key={idx} className="text-gray-800 leading-relaxed flex gap-4">
                  <span className="font-bold text-gray-400">{idx + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">{children}</span>;
}

function InfoCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function TripSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[340px] sm:h-[420px] w-full bg-muted" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
        <div className="flex justify-end gap-2 border-b border-border pb-4">
          <div className="h-9 w-28 rounded-xl bg-muted" />
          <div className="h-9 w-28 rounded-xl bg-muted" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-card border border-border" />
          ))}
        </div>
        <div className="mt-12">
          <div className="h-8 w-64 bg-muted rounded-md mb-6" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-card border border-border" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
