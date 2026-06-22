import { useEffect, useState, useSyncExternalStore } from "react";

export type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  category: "food" | "sight" | "adventure" | "rest" | "culture";
};

export type Day = {
  id: string;
  date: string;
  title: string;
  activities: Activity[];
};

export type Trip = {
  id: string;
  destination: string;
  country: string;
  cover: string;
  days: Day[];
  numDays: number;
  budget: "Budget" | "Comfort" | "Luxury";
  interests: string[];
  weather: { temp: number; condition: string; high: number; low: number };
  hotels: { name: string; rating: number; pricePerNight: number; area: string }[];
  packing: string[];
  safety: string[];
  createdAt: number;
};

const KEY = "wanderly.trips.v1";
const AUTH_KEY = "wanderly.user.v1";

const CATS: Activity["category"][] = ["sight", "food", "culture", "adventure", "rest"];
const COVERS = [
  "/assets/trip1.jpg",
  "/assets/trip2.jpg",
  "/assets/trip3.jpg",
  "/assets/trip4.jpg",
  "/assets/trip5.jpg",
  "/assets/trip6.jpg",
];

const SAMPLE_TITLES = [
  "Sunrise viewpoint hike",
  "Local breakfast crawl",
  "Old town walking tour",
  "Hidden artisan market",
  "Riverside lunch",
  "Museum of modern art",
  "Rooftop sunset drinks",
  "Chef's tasting dinner",
  "Coastal scooter ride",
  "Spa & hammam",
];

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }
const uid = () => Math.random().toString(36).slice(2, 10);

function generateDays(destination: string, n: number): Day[] {
  const start = new Date();
  return Array.from({ length: n }, (_, d) => {
    const date = new Date(start.getTime() + d * 86400000);
    const acts = Array.from({ length: 4 + (d % 2) }, (_, i) => ({
      id: uid(),
      time: ["08:30", "11:00", "14:00", "18:30", "21:00"][i],
      title: pick(SAMPLE_TITLES, d * 3 + i),
      description: `A handpicked experience in ${destination} tailored to your interests.`,
      category: pick(CATS, d + i),
    }));
    return {
      id: uid(),
      date: date.toISOString().slice(0, 10),
      title: d === 0 ? "Arrival & first impressions" : `Day ${d + 1} in ${destination}`,
      activities: acts,
    };
  });
}

export function createTrip(input: {
  destination: string;
  country?: string;
  numDays: number;
  budget: Trip["budget"];
  interests: string[];
}): Trip {
  const id = uid();
  return {
    id,
    destination: input.destination,
    country: input.country ?? "",
    cover: pick(COVERS, id.charCodeAt(0)),
    days: generateDays(input.destination, input.numDays),
    numDays: input.numDays,
    budget: input.budget,
    interests: input.interests,
    weather: { temp: 24, condition: "Sunny", high: 28, low: 19 },
    hotels: [
      { name: "The Quiet House", rating: 4.8, pricePerNight: 180, area: "Old Town" },
      { name: "Marina Boutique", rating: 4.6, pricePerNight: 240, area: "Waterfront" },
      { name: "Garden Riad", rating: 4.7, pricePerNight: 150, area: "Historic Quarter" },
    ],
    packing: ["Lightweight layers", "Walking shoes", "Sunscreen SPF 50", "Universal adapter", "Reusable bottle", "Day backpack"],
    safety: ["Keep a digital copy of your passport", "Drink bottled water", "Use registered taxis after dark", "Save local emergency number"],
    createdAt: Date.now(),
  };
}

const SEED: Trip[] = [
  createTrip({ destination: "Lisbon", country: "Portugal", numDays: 5, budget: "Comfort", interests: ["Food", "Architecture", "Music"] }),
  createTrip({ destination: "Kyoto", country: "Japan", numDays: 7, budget: "Luxury", interests: ["Culture", "Temples", "Tea"] }),
  createTrip({ destination: "Cape Town", country: "South Africa", numDays: 6, budget: "Comfort", interests: ["Nature", "Wine", "Hiking"] }),
];

function read(): Trip[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Trip[];
  } catch {
    return SEED;
  }
}

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }
function write(trips: Trip[]) {
  localStorage.setItem(KEY, JSON.stringify(trips));
  emit();
}

export const tripsStore = {
  subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); },
  get(): Trip[] { return read(); },
  add(t: Trip) { write([t, ...read()]); },
  remove(id: string) { write(read().filter((t) => t.id !== id)); },
  update(id: string, patch: Partial<Trip>) {
    write(read().map((t) => (t.id === id ? { ...t, ...patch } : t)));
  },
  regenerateDay(tripId: string, dayId: string) {
    const trips = read();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    const idx = trip.days.findIndex((d) => d.id === dayId);
    if (idx < 0) return;
    const fresh = generateDays(trip.destination, 1)[0];
    trip.days[idx] = { ...fresh, date: trip.days[idx].date, title: trip.days[idx].title };
    write(trips);
  },
  addActivity(tripId: string, dayId: string, activity: Omit<Activity, "id">) {
    const trips = read();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    const day = trip.days.find((d) => d.id === dayId);
    if (!day) return;
    day.activities.push({ ...activity, id: uid() });
    write(trips);
  },
  removeActivity(tripId: string, dayId: string, activityId: string) {
    const trips = read();
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;
    const day = trip.days.find((d) => d.id === dayId);
    if (!day) return;
    day.activities = day.activities.filter((a) => a.id !== activityId);
    write(trips);
  },
};

export function useTrips() {
  return useSyncExternalStore(
    tripsStore.subscribe,
    () => tripsStore.get(),
    () => SEED,
  );
}

export function useTrip(id: string) {
  const trips = useTrips();
  return trips.find((t) => t.id === id);
}

/* Auth (mock) */
export type User = { name: string; email: string; photoURL?: string };

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}
export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  else localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("wanderly:auth"));
}
export function useUser() {
  const [u, setU] = useState<User | null>(null);
  useEffect(() => {
    setU(getUser());
    const h = () => setU(getUser());
    window.addEventListener("wanderly:auth", h);
    return () => window.removeEventListener("wanderly:auth", h);
  }, []);
  return u;
}
