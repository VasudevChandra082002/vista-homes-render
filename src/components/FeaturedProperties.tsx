



import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import { getAllProperties } from "@/api/propertyApi";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMG = "/placeholder.jpg";

// Tabs with All, Ongoing, and Completed (Ongoing first)
const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

function formatCurrency(value: any) {
  if (value == null) return "—";

  if (!isNaN(Number(value))) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }

  return value;
}


/** Prioritize above-the-fold cards (first row). Adjust if your layout differs. */
const shouldPrioritize = (index: number) => index < 3;

type Property = {
  _id: string;
  images?: string[];
  type?: string;
  status?: string;
  title?: string;
  location?: string;
  price?: number;
  features?: string;
};

const PropertyCard = React.memo(({ property, index }: { property: Property; index: number }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cover = property?.images?.[0] || FALLBACK_IMG;

  // Reset state when image source changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [cover]);

  const eager = shouldPrioritize(index);

  return (
    <Card
      key={property._id}
      className="group overflow-hidden border-0 shadow-card hover-lift hover-scale bg-card/50 backdrop-blur-sm animate-slide-up"
      style={{ animationDelay: `${(index ?? 0) * 120}ms` }}
    >
      <div className="relative overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && <div className="w-full h-64 bg-muted animate-pulse" />}

        {/* Actual image with eager/lazy + priority + blur-in */}
        <img
          src={imageError ? FALLBACK_IMG : cover}
          alt={property.title || "Property"}
          width={960}          // helps layout stability
          height={384}         // matches h-64 aspect
          className={`w-full h-64 object-cover transition-[opacity,transform,filter] duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100 filter-none" : "opacity-0 absolute blur-sm"
          }`}
          loading={eager ? "eager" : "lazy"}
          // React DOM supports this attribute as camelCase
          fetchPriority={eager ? "high" : "low"}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.type && (
            <Badge variant="secondary" className="bg-white/90 text-foreground capitalize">
              {property.type}
            </Badge>
          )}
          {property.status && (
            <Badge className="bg-accent text-accent-foreground capitalize">{property.status}</Badge>
          )}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-2xl font-bold text-white">{formatCurrency(property.price)}</div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-playfair font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
          <div className="text-2xl font-bold text-primary mb-2">{formatCurrency(property.price)}</div>
        </div>

        {/* Features as a single text string */}
        {property.features && property.features.trim() && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{property.features}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 transition-colors duration-200"
            onClick={() => navigate(`/property/${property._id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
PropertyCard.displayName = "PropertyCard";

const FeaturedProperties = () => {
  const [all, setAll] = useState<Property[]>([]);
  const [active, setActive] = useState("ongoing"); // Default to Ongoing
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getAllProperties();
        const data =
          (Array.isArray(res) && res) ||
          (Array.isArray(res?.data) && res.data) ||
          (Array.isArray(res?.data?.data) && res.data.data) ||
          (Array.isArray(res?.data?.results) && res.data.results);
        if (!data) throw new Error("API must return an array of properties");
        setAll(data);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter by status tab
  const filtered = useMemo(() => {
    if (active === "all") {
      // For "All" tab, return all properties but sort with ongoing first
      return [...all].sort((a, b) => {
        // Ongoing properties come first
        if (a.status === "ongoing" && b.status !== "ongoing") return -1;
        if (a.status !== "ongoing" && b.status === "ongoing") return 1;
        // If both have same status, maintain original order
        return 0;
      });
    }
    return all.filter((p) => p?.status === active);
  }, [all, active]);

  // Group by type within the selected status
  const groupedByType = useMemo(() => {
    const map = new Map<string, Property[]>();
    for (const p of filtered) {
      const key = (p?.type || "others").toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    const order = [
      "villa",
      "house",
      "penthouse",
      "apartment",
      "studio",
      "townhouse",
      "bungalow",
      "land",
      "commercial",
      "arena_sports",
      "others",
    ];
    const sorted = Array.from(map.entries()).sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0])
    );
    return sorted;
  }, [filtered]);

  /** Prefetch first few covers to kick off network early */
  useEffect(() => {
    if (!filtered?.length) return;
    const firstFew = filtered.slice(0, 6);
    firstFew.forEach((p) => {
      const src = p?.images?.[0];
      if (!src) return;
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [filtered]);

  return (
    <section id="properties" className="py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties in the most desirable locations.
          </p>
        </div>

        {/* Topbar Tabs (horizontal) - Ongoing, Completed, and All */}
        <Tabs value={active} onValueChange={setActive} className="mb-8">
          <TabsList className="grid grid-cols-3 md:inline-flex md:gap-2 w-full md:w-auto justify-center">
            {STATUS_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="capitalize">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {STATUS_TABS.map((t) => (
            <TabsContent key={t.value} value={t.value} />
          ))}
        </Tabs>

        {/* Loading / Error states */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[360px] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        )}
        {!loading && error && <div className="text-center text-destructive">{error}</div>}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-12">
            {groupedByType.length === 0 && (
              <div className="text-center text-muted-foreground">
                No {active === "all" ? "" : active + " "}properties found.
              </div>
            )}

            {groupedByType.map(([type, props]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold capitalize">{type.replace("_", " ")}</h3>
                </div>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  style={{ contentVisibility: "auto", containIntrinsicSize: "360px" }}
                >
                  {props.map((p, idx) => (
                    <PropertyCard key={p._id} property={p} index={idx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;

