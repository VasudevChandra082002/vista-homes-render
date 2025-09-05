// src/pages/admin/Teams.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Upload, X, Edit3, Trash2 } from "lucide-react";

import { getTeams, createTeam, updateTeamById, deleteTeamById } from "@/api/teamApi";
import { uploadFilesToFirebase } from "@/lib/upload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Team = {
  _id: string;
  name: string;
  role?: string;
  description?: string;
  image?: string; // single image URL
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  name: string;
  role: string;
  description: string;
  image: string;     // existing image URL (if editing)
  newFile: File | null; // new file to upload
};

const FALLBACK_IMG = "/placeholder.jpg";
const PAGE_SIZE = 20;

const defaultForm: FormState = {
  name: "",
  role: "",
  description: "",
  image: "",
  newFile: null,
};

const unwrapList = (res: any): Team[] => res ?? [];
const unwrapOne = (res: any): Team => res ?? null;

const TeamsPage: React.FC = () => {
  const qc = useQueryClient();

  // ====== List ======
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => unwrapList(await getTeams()),
  });

  const teams = useMemo<Team[]>(() => (Array.isArray(data) ? data : []), [data]);

  // ====== Pagination ======
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(teams.length / PAGE_SIZE));
  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return teams.slice(start, start + PAGE_SIZE);
  }, [teams, page]);

  // ====== UI State ======
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState<Team | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Prime form from editing doc
  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || "",
        role: editing.role || "",
        description: editing.description || "",
        image: editing.image || "",
        newFile: null,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editing, isFormOpen]);

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required.";
    return null;
  };

  // ====== Mutations ======
  const createMut = useMutation({
    mutationFn: async () => {
      const err = validateForm();
      if (err) throw new Error(err);

      let imageUrl = form.image;
      if (form.newFile) {
        setUploading(true);
        try {
          const [url] = await uploadFilesToFirebase([form.newFile], "teams");
          imageUrl = url;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        description: form.description.trim(),
        image: imageUrl || "",
      };
      const res = await createTeam(payload);
      return unwrapOne(res);
    },
    onSuccess: () => {
      toast.success("Team member created.");
      qc.invalidateQueries({ queryKey: ["teams"] });
      setIsFormOpen(false);
      setForm(defaultForm);
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.error || e?.message || "Failed to create team member.");
    },
  });

  const updateMut = useMutation({
    mutationFn: async () => {
      if (!editing) throw new Error("No team member selected.");
      const err = validateForm();
      if (err) throw new Error(err);

      let imageUrl = form.image;
      if (form.newFile) {
        setUploading(true);
        try {
          const [url] = await uploadFilesToFirebase([form.newFile], "teams");
          imageUrl = url;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        description: form.description.trim(),
        image: imageUrl || "",
      };
      const res = await updateTeamById(editing._id, payload);
      return unwrapOne(res);
    },
    onSuccess: () => {
      toast.success("Team member updated.");
      qc.invalidateQueries({ queryKey: ["teams"] });
      setIsFormOpen(false);
      setEditing(null);
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.error || e?.message || "Failed to update team member.");
    },
  });

  const deleteMut = useMutation({
    mutationFn: async () => {
      if (!deleting) throw new Error("No team member selected.");
      const res = await deleteTeamById(deleting._id);
      return unwrapOne(res);
    },
    onSuccess: () => {
      toast.success("Team member deleted.");
      qc.invalidateQueries({ queryKey: ["teams"] });
      setDeleting(null);
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.error || e?.message || "Failed to delete team member.");
    },
  });

  // ====== Handlers ======
  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsFormOpen(true);
  };

  const openEdit = (t: Team) => {
    setEditing(t);
    setIsFormOpen(true);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setForm((s) => ({ ...s, newFile: f }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = () => setForm((s) => ({ ...s, image: "" }));
  const removeNewFile = () => setForm((s) => ({ ...s, newFile: null }));

  // ====== Render ======
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Team</h1>
          <p className="text-sm text-muted-foreground">Create, edit, and manage team members.</p>
        </div>
        <Button onClick={openCreate} variant="outline" className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
           >
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      {/* List */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-0">
          {isLoading && <div className="p-6 text-muted-foreground">Loading team…</div>}
          {isError && <div className="p-6 text-destructive">{(error as any)?.message || "Failed to load team."}</div>}
          {!isLoading && !isError && teams.length === 0 && (
            <div className="p-6 text-muted-foreground">No team members found.</div>
          )}

          {!isLoading && !isError && teams.length > 0 && (
            <div className="overflow-x-auto" style={{ contentVisibility: "auto", containIntrinsicSize: "1200px" }}>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">About</th>
                    <th className="py-3 px-4 w-44">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((t) => (
                    <tr key={t._id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                            <img
                              src={t.image || FALLBACK_IMG}
                              alt={t.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate max-w-[220px]">{t.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{t.role || "-"}</td>
                      <td className="py-3 px-4">
                        <p className="line-clamp-2 max-w-[380px] text-muted-foreground">{t.description || "-"}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(t)}>
                            <Edit3 className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleting(t)}
                            className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
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
                    Page {page} of {totalPages} • Showing {paged.length} of {teams.length}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-2xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{editing ? "Edit Member" : "Add Member"}</h2>
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
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <Input
                    value={form.role}
                    onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                    placeholder="Managing Director"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Short bio or description"
                  rows={5}
                />
              </div>

              {/* Image */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Profile Image</label>

                {/* Existing image */}
                {form.image && !form.newFile && (
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border">
                    <img
                      src={form.image}
                      alt="member"
                      width={112}
                      height={112}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeExistingImage}
                      className="absolute -right-2 -top-2 bg-black/70 text-white p-1 rounded-full"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* New file preview */}
                {form.newFile && (
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border">
                    <img
                      src={URL.createObjectURL(form.newFile)}
                      alt={form.newFile.name}
                      width={112}
                      height={112}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeNewFile}
                      className="absolute -right-2 -top-2 bg-black/70 text-white p-1 rounded-full"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onPickFile}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" /> {form.newFile ? "Change Image" : "Select Image"}
                  </Button>
                  {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
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
                  disabled={createMut.isPending || updateMut.isPending || uploading}
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
                    : "Create Member"}
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
            <h2 className="text-xl font-semibold mb-2">Delete Member</h2>
            <p className="text-muted-foreground">Are you sure you want to delete this team member?</p>
            <div className="bg-muted rounded-xl p-3 mt-3 text-sm">
              <div className="font-medium">{deleting.name}</div>
              <div className="text-muted-foreground">{deleting.role || "-"}</div>
            </div>

            {deleteMut.isError && (
              <div className="text-destructive text-sm mt-3">
                {(deleteMut.error as any)?.message || "Failed to delete member."}
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

export default TeamsPage;
