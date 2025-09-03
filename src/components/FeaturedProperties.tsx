import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Heart } from "lucide-react";
import { getAllProperties } from "@/api/propertyApi";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMG = "/placeholder.jpg";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
];

function formatCurrency(num) {
  if (num == null || Number.isNaN(Number(num))) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(num));
  } catch {
    return `$${Number(num).toLocaleString()}`;
  }
}

const PropertyCard = ({ property, index }) => {
  const navigate = useNavigate();
  const cover = property?.images?.[0] || FALLBACK_IMG;
  return (
    <Card
      key={property._id}
      className="group overflow-hidden border-0 shadow-card hover-lift hover-scale bg-card/50 backdrop-blur-sm animate-slide-up"
      style={{ animationDelay: `${(index ?? 0) * 120}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={cover}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-foreground capitalize">
            {property.type}
          </Badge>
          <Badge className="bg-accent text-accent-foreground capitalize">
            {property.status}
          </Badge>
        </div>

        {/* Heart Icon */}
       

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

        {/* Features list */}
        {Array.isArray(property.features) && property.features.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {property.features.slice(0, 4).map((f, i) => (
              <Badge key={i} variant="outline" className="capitalize">
                {f}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1   transition-colors duration-200"
            onClick={() => navigate(`/property/${property._id}`)}
          >
            View Details
          </Button>
          {/* <Button className="flex-1 bg-gradient-primary hover:bg-primary-dark transition-all duration-200">
            Schedule Tour
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedProperties = () => {
  const [all, setAll] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false); // <-- NEW

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
      } catch (e) {
        setError(e?.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset collapsed state on tab change
  useEffect(() => {
    setShowAll(false);
  }, [active]);

  // Filter by status tab
  const filtered = useMemo(() => {
    if (active === "all") return all;
    return all.filter((p) => p?.status === active);
  }, [all, active]);

  // Group by type within the selected status
  const groupedByType = useMemo(() => {
    const map = new Map();
    for (const p of filtered) {
      const key = (p?.type || "others").toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    const order = ["villa", "house", "penthouse", "apartment", "studio", "townhouse", "bungalow", "land", "commercial", "arena_sports", "others"];
    const sorted = Array.from(map.entries()).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    return sorted;
  }, [filtered]);

  // Limit to first N cards across all groups when collapsed
  const VISIBLE_LIMIT = 3;
  const visibleGroups = useMemo(() => {
    if (showAll) return groupedByType;

    let remaining = VISIBLE_LIMIT;
    const out = [];
    for (const [type, props] of groupedByType) {
      if (remaining <= 0) break;
      const take = props.slice(0, remaining);
      if (take.length) out.push([type, take]);
      remaining -= take.length;
    }
    return out;
  }, [groupedByType, showAll]);

  const totalCount = filtered.length;
  const canToggle = totalCount > VISIBLE_LIMIT;

  return (
    <section id="properties" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-4">Featured Properties</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties in the most desirable locations.
          </p>
        </div>

        {/* Topbar Tabs (horizontal) */}
        <Tabs value={active} onValueChange={setActive} className="mb-8">
          <TabsList className="grid grid-cols-4 md:inline-flex md:gap-2 w-full md:w-auto justify-center">
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
          <>
            <div className="space-y-12">
              {visibleGroups.length === 0 && (
                <div className="text-center text-muted-foreground">No properties found.</div>
              )}

              {visibleGroups.map(([type, props]) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold capitalize">{type.replace("_", " ")}</h3>
                    <Badge variant="outline" className="capitalize">
                      {active === "all" ? "all statuses" : active}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {props.map((p, idx) => (
                      <PropertyCard key={p._id} property={p} index={idx} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Toggle button */}
            {canToggle && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  onClick={() => setShowAll((s) => !s)}
                >
                  {showAll ? "View Less" : "View All"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
