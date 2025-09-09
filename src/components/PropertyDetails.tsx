import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPropertyById } from "@/api/propertyApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // already present
import { Waves, Dumbbell, Gamepad2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
} from "lucide-react";
import Header from "./Header";
import About from "./About";
import Contact from "@/components/Contact";
import ContactUs from "@/pages/admin/ContactUs";
import Footer from "@/components/Footer";
import Header2 from "./Header2";
import Footer2 from "./Footer2";

const FALLBACK_IMG = "/placeholder.jpg";

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

type Property = {
  _id: string;
  images?: string[];
  type?: string;
  status?: "completed" | "ongoing" | "upcoming";
  title?: string;
  location?: string;
  price?: number | string;
  features?: string;
  amenities?: string[] | string; // ✅ add this
};
// Coerce amenities to array even if backend sent a string
const toAmenityArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.filter(Boolean).map(String);
  if (typeof val === "string" && val.trim()) {
    return val
      .split(/[,\n;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// Map amenity label -> icon
const AMENITY_ICON_MAP: Record<string, React.ElementType> = {
  "swimming pool": Waves,
  gym: Dumbbell,
  "kids play area": Gamepad2,
};

const getAmenityIcon = (label: string) => {
  const key = label.toLowerCase();
  return AMENITY_ICON_MAP[key] || CheckCircle2; // fallback
};
// const amenitiesArray = toAmenityArray((property as any).amenities);

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [downPayment, setDownPayment] = useState<number>(0);

  const [emiModalOpen, setEmiModalOpen] = useState(false);
  const [months, setMonths] = useState(120); // default 10 years
  const [emi, setEmi] = useState<number | null>(null);

  const calculateEmi = () => {
    const rawPrice = property?.price;
    const priceNum = Number(rawPrice);
    if (!isFinite(priceNum)) {
      setEmi(null);
      return;
    }

    const dp = Math.max(Number(downPayment) || 0, 0);
    const principal = Math.max(priceNum - dp, 0); // Price - Down Payment
    const annualRate = 9; // fixed 9% p.a.
    const monthlyRate = annualRate / 12 / 100;
    const n = Math.max(Number(months) || 0, 0);

    if (n === 0) {
      setEmi(null);
      return;
    }
    if (monthlyRate === 0) {
      setEmi(principal / n);
      return;
    }

    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);

    setEmi(emiValue);
  };

  const {
    data: property,
    isLoading,
    isError,
    error,
  } = useQuery<Property>({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await getPropertyById(id!);
      return (res?.data?.data ?? res?.data ?? res) as Property;
    },
    staleTime: 60_000,
  });

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const openContactModal = () => {
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!property?.images?.length) return;

    if (direction === "next") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === (property.images?.length || 0) - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? (property.images?.length || 0) - 1 : prevIndex - 1
      );
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleBackClick = () => {
    // Navigate directly to homepage
    navigate("/");
  };

  // Parse features string into an array for display
  const parseFeatures = (featuresString: string | undefined): string[] => {
    if (!featuresString) return [];

    // Try to split by common separators
    if (featuresString.includes(",")) {
      return featuresString
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    } else if (featuresString.includes(";")) {
      return featuresString
        .split(";")
        .map((f) => f.trim())
        .filter(Boolean);
    } else if (featuresString.includes(".")) {
      return featuresString
        .split(".")
        .map((f) => f.trim())
        .filter(Boolean);
    }

    // If no obvious separators, try splitting by spaces for longer strings
    if (featuresString.length > 30) {
      return featuresString.split(/\s+/).filter((word) => word.length > 3);
    }

    // Fallback: return as a single item array
    return [featuresString];
  };

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
          onClick={handleBackClick}
          className="mb-8 text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2 " /> Back to Home
        </Button>
        <div className="text-destructive">
          {(error as Error)?.message || "Failed to load property."}
        </div>
      </section>
    );
  }

  const images =
    Array.isArray(property.images) && property.images.length
      ? property.images
      : [FALLBACK_IMG];
  const totalImages = images.length;
  const featuresArray = parseFeatures(property.features);
  const amenitiesArray = toAmenityArray((property as any).amenities);

  return (
    <>
      <Header2 />
      <section className="container mx-auto px-4 pt-28 md:pt-32 pb-16">
        <Button variant="ghost" onClick={handleBackClick} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <Card className="overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 p-2">
            {/* Main image */}
            <div
              className="w-full h-80 lg:h-[28rem] object-cover rounded-lg lg:col-span-2 cursor-pointer relative"
              onClick={() => openLightbox(0)}
            >
              {!loadedImages.has(0) && (
                <div className="absolute inset-0 bg-muted animate-pulse rounded-lg"></div>
              )}
              <img
                src={images[0]}
                alt={property.title || "Property"}
                className={`w-full h-full object-cover rounded-lg ${
                  !loadedImages.has(0) ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => handleImageLoad(0)}
                loading="lazy"
              />
              {totalImages > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  +{totalImages - 1} more
                </div>
              )}
            </div>

            {/* Thumbnail grid for additional images */}
            <div className="grid grid-rows-2 gap-2">
              {totalImages > 1 ? (
                // Show up to 4 thumbnails (2 rows of 2)
                Array.from({ length: Math.min(4, totalImages - 1) }).map(
                  (_, index) => {
                    const imgIndex = index + 1;
                    return (
                      <div
                        key={imgIndex}
                        className="w-full h-40 lg:h-[13.75rem] cursor-pointer relative"
                        onClick={() => openLightbox(imgIndex)}
                      >
                        {!loadedImages.has(imgIndex) && (
                          <div className="absolute inset-0 bg-muted animate-pulse rounded-lg"></div>
                        )}
                        <img
                          src={images[imgIndex] || images[0]}
                          alt={`Property ${imgIndex + 1}`}
                          className={`w-full h-full object-cover rounded-lg ${
                            !loadedImages.has(imgIndex)
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                          onLoad={() => handleImageLoad(imgIndex)}
                          loading="lazy"
                        />
                        {index === 3 && totalImages > 5 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <span className="text-white font-bold text-lg">
                              +{totalImages - 5} more
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                )
              ) : (
                // Fallback if there's only one image
                <>
                  <div className="w-full h-40 lg:h-[13.75rem] bg-muted rounded-lg"></div>
                  <div className="w-full h-40 lg:h-[13.75rem] bg-muted rounded-lg"></div>
                </>
              )}
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{property.title || "—"}</h1>
              <div className="flex gap-2">
                {property.type && (
                  <Badge variant="secondary" className="capitalize">
                    {property.type}
                  </Badge>
                )}
                {property.status && (
                  <Badge className="capitalize">{property.status}</Badge>
                )}
              </div>
            </div>

            {property.location && (
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
            )}

            <p className="text-3xl font-semibold text-primary mb-6 flex items-center gap-2">
              {/* <IndianRupee className="w-6 h-6" /> */}
              <span>{formatCurrency(property.price)}</span>
            </p>

            {featuresArray.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {featuresArray.map((f) => (
                    // <Badge key={i} variant="secondary" className="capitalize">
                    // {f}
                    // </Badge>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {f}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {amenitiesArray.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenitiesArray.map((a) => {
                    const Icon = getAmenityIcon(a);
                    return (
                      <Badge
                        key={a}
                        variant="secondary"
                        className="border-none capitalize flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {a}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                // className="bg-gradient-primary"
                onClick={openContactModal}
                variant="outline"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                Contact Agent
              </Button>
              <Button
                onClick={() => setEmiModalOpen(true)}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                EMI Calculator
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={() => navigateImage("prev")}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={() => navigateImage("next")}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            <div className="h-screen max-h-[80vh] flex items-center justify-center">
              <img
                src={images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-black/50 text-white px-3 py-1 rounded">
                {currentImageIndex + 1} / {totalImages}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Agent Modal */}
      {contactModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeContactModal}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Contact Agent
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={closeContactModal}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                Interested in this property? Contact our agent for more
                information.
              </p>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>

                <a
                  href="tel:+919686102055"
                  className="text-blue-600 font-medium hover:underline"
                >
                  {" "}
                  <div>
                    <p className="text-sm text-gray-500">Call us at</p>
                    +91 9686102055
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us at</p>
                  <a
                    href="mailto:abcde@gmail.com"
                    className="text-green-600 font-medium hover:underline"
                  >
                    info@sitrusgroup.com
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Our agents are available Monday to Saturday, 9 AM to 6 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {emiModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setEmiModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl lg:max-w-3xl p-6 lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                EMI Calculator
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEmiModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Price + quick facts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-3">
                  <p className="text-gray-600">
                    Property Price:&nbsp;
                    <span className="font-semibold">
                      {formatCurrency(property?.price)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Months
                  </label>
                  <input
                    type="number"
                    value={months}
                    min={12}
                    step={12}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tip: 120 = 10 years, 240 = 20 years
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Down Payment
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    min={0}
                    max={Number(property?.price) || undefined}
                    step={50000}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g. 500000"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Amount you pay upfront.
                  </p>
                  {Number(downPayment) > Number(property?.price) && (
                    <p className="mt-1 text-sm text-destructive">
                      Down payment cannot exceed the property price.
                    </p>
                  )}
                </div>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg border bg-gray-50">
                  <p className="text-xs text-gray-500">Loan Amount</p>
                  <p className="font-semibold">
                    {formatCurrency(
                      Math.max(
                        Number(property?.price) - (Number(downPayment) || 0),
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="p-3 rounded-lg border bg-gray-50">
                  <p className="text-xs text-gray-500">Interest Rate</p>
                  <p className="font-semibold">9% p.a.</p>
                </div>
                <div className="p-3 rounded-lg border bg-gray-50">
                  <p className="text-xs text-gray-500">Tenure</p>
                  <p className="font-semibold">{months} months</p>
                </div>
              </div>

              <Button
                onClick={calculateEmi}
                disabled={
                  !isFinite(Number(property?.price)) ||
                  Number(months) <= 0 ||
                  Number(downPayment) > Number(property?.price)
                }
                className="w-full bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Calculate EMI (9% Interest)
              </Button>

              {emi !== null && (
                <div className="mt-2 p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-gray-700">
                    Estimated Monthly EMI:&nbsp;
                    <span className="font-bold text-lg text-green-700">
                      {formatCurrency(Math.round(emi))}
                    </span>
                  </p>
                  {/* <p className="text-xs text-muted-foreground mt-1">
              EMI is calculated on (Price − Down Payment) at 9% p.a., compounded
              monthly.
            </p> */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* </div>
          </div>
        </div>
      )} */}

      {/* <Contact />
      <Footer2 /> */}
    </>
  );
};

export default PropertyDetails;
