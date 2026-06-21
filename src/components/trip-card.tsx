import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";

export interface TripCardProps {
  trip: {
    id: string;
    destination: string;
    country: string;
    cover: string;
    numDays: number;
    budget: string;
    interests: string[];
  };
}

export function TripCard({ trip }: TripCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      href={`/dashboard/trip/${trip.id}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {!imgLoaded && (
          <div className="absolute inset-0 z-10 h-full w-full shimmer bg-muted" />
        )}
        <Image
          src={trip.cover}
          alt={trip.destination}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setImgLoaded(true)}
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        <span className="absolute right-3 top-3 z-20 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-black backdrop-blur shadow-sm">
          {trip.budget}
        </span>
        <div className="absolute inset-x-4 bottom-4 z-20 text-white">
          <h3 className="font-display text-xl font-semibold">{trip.destination}</h3>
          <p className="flex items-center gap-1 text-xs opacity-90">
            <MapPin className="h-3 w-3" /> {trip.country || "Custom trip"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> {trip.numDays} days
        </span>
        <span className="flex flex-wrap gap-1">
          {trip.interests.slice(0, 2).map((i) => (
            <span key={i} className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{i}</span>
          ))}
        </span>
      </div>
    </Link>
  );
}