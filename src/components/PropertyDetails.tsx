// PropertyDetails.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPropertyById } from "@/api/propertyApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, } from "lucide-react";
import Header from "./Header";
import About from "./About";
import Contact from "@/components/Contact";
import ContactUs from "@/pages/admin/ContactUs";
// import { Footer } from "react-day-picker";
import Footer from "@/components/Footer";
import Header2 from "./Header2";
const FALLBACK_IMG = "/placeholder.jpg";

function formatCurrency(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
}

type Property = {
  _id: string;
  images?: string[];
  type?: string;
  status?: "completed" | "ongoing" | "upcoming";
  title?: string;
  location?: string;
  price?: number | string; // be permissive
  features?: string[];
};

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: property, isLoading, isError, error } = useQuery<Property>({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await getPropertyById(id!);
      // unwrap common shapes: {}, { data: {} }
      return (res?.data?.data ?? res?.data ?? res) as Property;
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <section className="py-16 container mx-auto px-4">
        <div className="h-10 w-40 mb-4 rounded bg-muted animate-pulse" />
        <div className="h-96 w-full rounded-2xl bg-muted animate-pulse" />
        <div className="h-48 w-full mt-6 rounded-2xl bg-muted animate-pulse" />
      </section>
    );
  }
  if (isError || !property) {
    return (
      <section className="py-16 container mx-auto px-4">
<Button
  variant="ghost"
  onClick={() => navigate("/")} // always go to homepage
  className="mb-4"
>
  <ArrowLeft className="w-4 h-4 mr-2" /> Back
</Button>
        <div className="text-destructive">{(error as Error)?.message || "Failed to load property."}</div>
      </section>
    );
  }

  const images = Array.isArray(property.images) && property.images.length ? property.images : [FALLBACK_IMG];

  return (
   <>
    <Header2 />
    <section className="py-16 container mx-auto px-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-2">
          <img src={images[0]} alt={property.title || "Property"} className="w-full h-80 lg:h-[28rem] object-cover rounded-lg lg:col-span-2" />
          <div className="grid grid-rows-2 gap-2">
            <img src={images[1] || images[0]} alt="Property 2" className="w-full h-40 lg:h-[13.75rem] object-cover rounded-lg" />
            <img src={images[2] || images[0]} alt="Property 3" className="w-full h-40 lg:h-[13.75rem] object-cover rounded-lg" />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{property.title || "—"}</h1>
            <div className="flex gap-2">
              {property.type && <Badge variant="secondary" className="capitalize">{property.type}</Badge>}
              {property.status && <Badge className="capitalize">{property.status}</Badge>}
            </div>
          </div>

          {property.location && (
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{property.location}</span>
            </div>
          )}

          <p className="text-3xl font-semibold text-primary mb-6">
            {formatCurrency(property.price)}
          </p>

          {!!property.features?.length && (
            <div className="mb-6 flex flex-wrap gap-2">
              {property.features.map((f, i) => (
                <Badge key={i} variant="outline" className="capitalize">
                  {f}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button className="bg-gradient-primary">Contact Agent</Button>
            <Button variant="outline">Schedule Tour</Button>
          </div>
        </CardContent>
      </Card>
    </section>
    {/* <About /> */}
   <Contact />
   <Footer />
   </>
  );
};

export default PropertyDetails;
