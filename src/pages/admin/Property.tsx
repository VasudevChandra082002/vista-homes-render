// src/pages/admin/Property.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  createProperty as apiCreateProperty,
  getAllProperties,
  getPropertyById,
  updateProperty as apiUpdateProperty,
  deletePropertyById,
} from "@/api/propertyApi";

import { uploadFilesToFirebase, UploadProgressMap } from "@/lib/upload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Property = {
  _id: string;
  images: string[];
  type: string;
  title: string;
  location: string;
  price: number;
  features: string;
  status: "completed" | "ongoing" | "upcoming";
  createdAt?: string;
  updatedAt?: string;
  amenities?: string[] | string; // NEW
};

const ALLOWED_TYPES = ["Villa", "Commercial", "Land"] as const;

const STATUS = ["completed", "ongoing"] as const;

// -------- NEW: tiny built-in paginator so we don't render 100s of thumbnails
const PAGE_SIZE = 20;

type FormState = {
  images: string[];
  newFiles: File[];
  type: string;
  title: string;
  location: string;
  price: string;
  features: string;
  status: string;
  amenities: string[]; // NEW
};
const AMENITY_OPTIONS = [
  "Swimming Pool",
  "Gym",
  "Kids Play Area",
  // "Sports Court",
  // "Clubhouse",
  // "Power Backup",
  // "Covered Parking",
  // "Lift",
  // "Garden",
  // "Security",
  // "Wi-Fi",
]; // NEW
const defaultForm: FormState = {
  images: [],
  newFiles: [],
  type: "",
  title: "",
  location: "",
  price: "",
  features: "",
  status: "",
  amenities: [], // NEW
};

const unwrapList = (res: any): Property[] =>
  res?.data?.data ?? res?.data ?? res ?? [];
const unwrapOne = (res: any): Property => res?.data?.data ?? res?.data ?? res;

const PropertyPage: React.FC = () => {
  const qc = useQueryClient();

  // ===== List =====
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => unwrapList(await getAllProperties()),
  });

  const properties = useMemo<Property[]>(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  // -------- Pagination state
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  useEffect(() => {
    // clamp page when data changes
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return properties.slice(start, start + PAGE_SIZE);
  }, [properties, page]);

  // ===== UI State =====
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<Property | null>(null);

  const [form, setForm] = useState<FormState>(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgressMap>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Prime form from editing doc
  // Prime form from editing doc
  useEffect(() => {
    if (editing) {
      const toAmenityArray = (val: unknown): string[] => {
        if (Array.isArray(val)) return val.filter(Boolean).map(String);
        if (typeof val === "string" && val.trim()) {
          // split common separators if old data was stored as string
          return val
            .split(/[,\n;|]/)
            .map((s) => s.trim())
            .filter(Boolean);
        }
        return [];
      };

      // Convert type to capitalized form for the UI
      const formatTypeForUI = (type: string): string => {
        if (!type) return "";
        return type.charAt(0).toUpperCase() + type.slice(1);
      };

      setForm({
        images: editing.images || [],
        newFiles: [],
        type: formatTypeForUI(editing.type || ""), // FIXED: Convert to capitalized form
        title: editing.title || "",
        location: editing.location || "",
        price: editing.price != null ? String(editing.price) : "",
        features: editing.features || "",
        status: editing.status || "",
        amenities: toAmenityArray(editing.amenities),
      });
    } else {
      setForm(defaultForm);
    }
  }, [editing, isFormOpen]);

  const toggleAmenity = (name: string) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(name);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== name)
          : [...prev.amenities, name],
      };
    });
  };

  // Convert comma-separated features to space-separated string for backend
  const formatFeaturesForBackend = (text: string) =>
    text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");

  const validateForm = () => {
    if (!form.type) return "Please select a property type.";
    if (!(ALLOWED_TYPES as readonly string[]).includes(form.type))
      return "Invalid property type.";
    if (!form.status) return "Please select a status.";
    if (!(STATUS as readonly string[]).includes(form.status))
      return "Invalid status.";
    if (!form.title.trim()) return "Title is required.";
    if (!form.location.trim()) return "Location is required.";
    // if (form.price === "" || isNaN(Number(form.price)))
    //   return "Price must be a valid number.";
    return null;
  };

  // ===== Mutations =====
  const createMut = useMutation({
    mutationFn: async () => {
      const err = validateForm();
      if (err) throw new Error(err);

      setUploading(true);
      setProgress({});
      const newUrls =
        form.newFiles.length > 0
          ? await uploadFilesToFirebase(form.newFiles, {
              path: "properties",
              onProgress: (name, pct) =>
                setProgress((prev) => ({ ...prev, [name]: pct })),
            })
          : [];
      setUploading(false);

      const payload = {
        images: [...form.images, ...newUrls],
        type: form.type.toLowerCase(), // NEW (maps "Villa" -> "villa" for backend enum)
        title: form.title.trim(),
        location: form.location.trim(),
        price: form.price.trim(),
        features: form.features.trim(),
        status: form.status as any,
        amenities: form.amenities, // NEW
      };
      const res = await apiCreateProperty(payload);
      return unwrapOne(res);
    },
    onSuccess: () => {
      toast.success("Property created.");
      qc.invalidateQueries({ queryKey: ["properties"] });
      setIsFormOpen(false);
      setForm(defaultForm);
      setProgress({});
    },
    onError: (e: any) => {
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to create property."
      );
    },
  });

  const updateMut = useMutation({
    mutationFn: async () => {
      if (!editing) throw new Error("No property selected.");
      const err = validateForm();
      if (err) throw new Error(err);

      setUploading(true);
      setProgress({});
      const newUrls =
        form.newFiles.length > 0
          ? await uploadFilesToFirebase(form.newFiles, {
              path: "properties",
              onProgress: (name, pct) =>
                setProgress((prev) => ({ ...prev, [name]: pct })),
            })
          : [];
      setUploading(false);

      const payload = {
        images: [...form.images, ...newUrls],
        type: form.type.toLowerCase(), // NEW
        title: form.title.trim(),
        location: form.location.trim(),
        price: Number(form.price),
        features: form.features.trim(),
        status: form.status as any,
        amenities: form.amenities, // NEW
      };
      const res = await apiUpdateProperty(editing._id, payload);
      return unwrapOne(res);
    },
    onSuccess: () => {
      toast.success("Property updated.");
      qc.invalidateQueries({ queryKey: ["properties"] });
      setIsFormOpen(false);
      setEditing(null);
      setProgress({});
    },
    onError: (e: any) => {
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to update property."
      );
    },
  });

  const deleteMut = useMutation({
    mutationFn: async () => {
      if (!deleting) throw new Error("No property selected.");
      const res = await deletePropertyById(deleting._id);
      return unwrapOne(res);
    },
    onSuccess: () => {
      toast.success("Property deleted.");
      qc.invalidateQueries({ queryKey: ["properties"] });
      setDeleting(null);
    },
    onError: (e: any) => {
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to delete property."
      );
    },
  });

  // ===== Handlers =====
  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setForm((prev) => ({ ...prev, newFiles: [...prev.newFiles, ...files] }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewFile = (name: string) =>
    setForm((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((f) => f.name !== name),
    }));

  const removeImageUrl = (url: string) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((u) => u !== url),
    }));

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsFormOpen(true);
  };

  const openEdit = async (p: Property) => {
    try {
      const res = await getPropertyById(p._id);
      const doc = unwrapOne(res) as Property;
      setEditing(doc);
    } catch {
      setEditing(p);
    }
    setIsFormOpen(true);
  };

  // ===== Render =====
  return (
    <div className="space-y-6">
    
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Properties</h1>
     
        </div>
        <Button
          onClick={openCreate}
          variant="outline"
          className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Property
        </Button>
      </div>

      {/* List */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-6 text-muted-foreground">Loading properties…</div>
          )}
          {isError && (
            <div className="p-6 text-destructive">
              {(error as any)?.message || "Failed to load properties."}
            </div>
          )}
          {!isLoading && !isError && properties.length === 0 && (
            <div className="p-6 text-muted-foreground">
              No properties found.
            </div>
          )}

          {!isLoading && !isError && properties.length > 0 && (
            <div
              className="overflow-x-auto"
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "1200px",
              }}
            >
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Amenities</th>
                    <th className="py-3 px-4">Images</th>
                    <th className="py-3 px-4 w-44">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((p) => (
                    <tr key={p._id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                            {p.images?.[0] ? (
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                width={64}
                                height={48}
                                loading="lazy"
                                decoding="async"
                                fetchPriority="low"
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <div className="font-medium">{p.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {p.createdAt
                                ? new Date(p.createdAt).toLocaleDateString()
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize">{p.type}</td>
                      <td className="py-3 px-4 capitalize">{p.status}</td>
                      <td className="py-3 px-4">{p.price || "-"}</td>
                      <td className="py-3 px-4">{p.location}</td>
                      <td className="py-3 px-4">
                        {Array.isArray(p.amenities) &&
                        p.amenities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.amenities.slice(0, 2).map((a, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {a}
                              </Badge>
                            ))}
                            {p.amenities.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{p.amenities.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">{p.images?.length || 0}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(p)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleting(p)}
                            className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="text-xs text-muted-foreground">
                    Page {page} of {totalPages} • Showing {paged.length} of{" "}
                    {properties.length}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editing ? "Edit Property" : "Add Property"}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditing(null);
                }}
                className="text-sm underline"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editing ? updateMut.mutate() : createMut.mutate();
              }}
              className="space-y-6"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, title: e.target.value }))
                    }
                    placeholder="Luxurious 3BHK Apartment"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, location: e.target.value }))
                    }
                    placeholder="Indiranagar, Bengaluru"
                    required
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, type: e.target.value }))
                    }
                    className="w-full h-11 px-3 rounded-md border border-border bg-background focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Select type</option>
                    {ALLOWED_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, status: e.target.value }))
                    }
                    className="w-full h-11 px-3 rounded-md border border-border bg-background focus:border-primary focus:outline-none"
                    required
                  >
                    <option value="">Select status</option>
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <Input
                    type="text" // allow any text like "1 lakh Rs"
                    value={form.price}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, price: e.target.value }))
                    }
                    placeholder="e.g. 1 lakh Rs"
                    required
                  />
                </div>
              </div>
              {/* Amenities (multi-select dropdown) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Amenities</label>

                {/* Trigger */}
                <div className="relative inline-block w-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("amenities-menu");
                      if (el) el.classList.toggle("hidden");
                    }}
                    className="w-full h-11 px-3 rounded-md border border-border bg-background flex items-center justify-between"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                  >
                    <span className="text-sm truncate">
                      {form.amenities.length
                        ? `${form.amenities.length} selected`
                        : "Select amenities"}
                    </span>
                    <span className="text-xs text-muted-foreground">▼</span>
                  </button>

                  {/* Menu */}
                  <div
                    id="amenities-menu"
                    className="hidden absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md"
                    role="listbox"
                  >
                    <div className="max-h-64 overflow-auto py-2">
                      {AMENITY_OPTIONS.map((opt) => {
                        const checked = form.amenities.includes(opt);
                        return (
                          <label
                            key={opt}
                            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={checked}
                              onChange={() => toggleAmenity(opt)}
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex justify-end gap-2 px-3 py-2 border-t">
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => {
                          setForm((s) => ({ ...s, amenities: [] }));
                        }}
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        className="text-sm underline"
                        onClick={() => {
                          const el = document.getElementById("amenities-menu");
                          if (el) el.classList.add("hidden");
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected chips */}
                {form.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.amenities.map((a) => (
                      <Badge
                        key={a}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {a}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => toggleAmenity(a)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Features (description)
                </label>
                <Textarea
                  value={form.features}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, features: e.target.value }))
                  }
                  placeholder="Describe the features of this property"
                  rows={4}
                />
              </div>

              {/* Images */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Images</label>

                {/* Existing URLs */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {form.images.map((url) => (
                      <div
                        key={url}
                        className="relative w-28 h-20 rounded-lg overflow-hidden border"
                      >
                        <img
                          src={url}
                          alt="property"
                          width={112}
                          height={80}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(url)}
                          className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Newly selected previews + progress */}
                {form.newFiles.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {form.newFiles.map((f) => {
                      const preview = URL.createObjectURL(f);
                      return (
                        <div
                          key={f.name}
                          className="relative w-28 h-20 rounded-lg overflow-hidden border"
                        >
                          <img
                            src={preview}
                            alt={f.name}
                            width={112}
                            height={80}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewFile(f.name)}
                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {progress[f.name] != null && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                              <div
                                className="h-1 bg-primary"
                                style={{ width: `${progress[f.name]}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onPickFiles}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" /> Select Images
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    You can add more images before saving. Files upload on Save.
                  </span>
                </div>
              </div>

              {/* Errors */}
              {(createMut.isError || updateMut.isError) && (
                <div className="text-destructive text-sm">
                  {(createMut.error as any)?.message ||
                    (updateMut.error as any)?.message ||
                    "Something went wrong."}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMut.isPending || updateMut.isPending || uploading
                  }
                  variant="outline"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  {uploading
                    ? "Uploading…"
                    : editing
                    ? updateMut.isPending
                      ? "Saving…"
                      : "Save Changes"
                    : createMut.isPending
                    ? "Creating…"
                    : "Create Property"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-2">Delete Property</h2>
            <p className="text-muted-foreground">
              Are you sure you want to delete this property?
            </p>
            <div className="bg-muted rounded-xl p-3 mt-3 text-sm">
              <div className="font-medium">{deleting.title}</div>
              <div className="text-muted-foreground">{deleting.location}</div>
            </div>

            {deleteMut.isError && (
              <div className="text-destructive text-sm mt-3">
                {(deleteMut.error as any)?.message ||
                  "Failed to delete property."}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => deleteMut.mutate()}
                disabled={deleteMut.isPending}
                className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90"
              >
                {deleteMut.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
