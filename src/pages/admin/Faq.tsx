// src/pages/admin/Faq.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFaq,
  getAllfaq,
  updateFaq,
  deleteFaq,
} from "@/api/faqApi";

type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
};

const Faq: React.FC = () => {
  const qc = useQueryClient();

  // --------------- Fetch list ---------------
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await getAllfaq();
      // Support common shapes:
      // - axios response data = res.data
      // - array may be on res.data.faqs || res.data.data || res.data
      const d = (res as any)?.data ?? res;
      return d?.faqs ?? d?.data ?? d;
    },
  });

  const faqs: FaqItem[] = useMemo(() => Array.isArray(data) ? data : [], [data]);

  // --------------- Modals state ---------------
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // form mode
  const [editing, setEditing] = useState<FaqItem | null>(null);

  // form fields
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // delete target
  const [deleting, setDeleting] = useState<FaqItem | null>(null);

  // Reset form when opening/closing or switching edit target
  useEffect(() => {
    if (editing) {
      setQuestion(editing.question || "");
      setAnswer(editing.answer || "");
    } else {
      setQuestion("");
      setAnswer("");
    }
  }, [editing, isFormOpen]);

  // --------------- Mutations ---------------
  const createMutation = useMutation({
    mutationFn: async (payload: { question: string; answer: string }) => {
      const res = await createFaq(payload);
      return (res as any)?.data ?? res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; question: string; answer: string }) => {
      const res = await updateFaq(payload.id, { question: payload.question, answer: payload.answer });
      return (res as any)?.data ?? res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"] });
      setIsFormOpen(false);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteFaq(id);
      return (res as any)?.data ?? res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"] });
      setIsDeleteOpen(false);
      setDeleting(null);
    },
  });

  // --------------- Handlers ---------------
  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditing(item);
    setIsFormOpen(true);
  };

  const openDelete = (item: FaqItem) => {
    setDeleting(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (editing) {
      updateMutation.mutate({ id: editing._id, question: question.trim(), answer: answer.trim() });
    } else {
      createMutation.mutate({ question: question.trim(), answer: answer.trim() });
    }
  };

  const handleConfirmDelete = () => {
    if (deleting?._id) deleteMutation.mutate(deleting._id);
  };

  // --------------- UI ---------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Faq's</h1>
          <p className="text-sm text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium shadow-card hover-lift transition"
        >
          + Add FAQ
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-card rounded-2xl shadow-card p-4 md:p-6">
        {/* Loading / Error / Empty */}
        {isLoading && (
          <div className="text-muted-foreground">Loading Faq's…</div>
        )}

        {isError && (
          <div className="text-destructive">
            {(error as any)?.message || "Failed to load Faq's."}
          </div>
        )}

        {!isLoading && !isError && faqs.length === 0 && (
          <div className="text-muted-foreground">No Faq's yet. Click “Add Faq” to create one.</div>
        )}

        {/* List */}
        {!isLoading && !isError && faqs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 pr-3">Question</th>
                  <th className="py-3 pr-3">Answer</th>
                  <th className="py-3 pr-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f._id} className="border-b last:border-b-0">
                    <td className="py-3 pr-3 align-top">
                      <div className="font-medium">{f.question}</div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <div className="text-muted-foreground whitespace-pre-wrap">
                        {f.answer}
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(f)}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition"
                          title="Edit"
                        >
                           Edit
                        </button>
                        <button
                          onClick={() => openDelete(f)}
                          className="px-3 py-1.5 rounded-lg bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 transition"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {editing ? "Edit FAQ" : "Add FAQ"}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="Enter the question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Answer</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="Enter the answer"
                />
              </div>

              {(createMutation.isError || updateMutation.isError) && (
                <div className="text-destructive text-sm">
                  {(createMutation.error as any)?.message ||
                    (updateMutation.error as any)?.message ||
                    "Something went wrong."}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium shadow-card hover-lift transition disabled:opacity-60"
                >
                  {editing
                    ? (updateMutation.isPending ? "Saving…" : "Save Changes")
                    : (createMutation.isPending ? "Creating…" : "Create FAQ")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {isDeleteOpen && deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-2">Delete FAQ</h2>
            <p className="text-muted-foreground">
              Are you sure you want to delete this FAQ?
            </p>
            <div className="bg-muted rounded-xl p-3 mt-3">
              <div className="text-sm font-medium">{deleting.question}</div>
              <div className="text-sm text-muted-foreground line-clamp-2">{deleting.answer}</div>
            </div>

            {(deleteMutation.isError) && (
              <div className="text-destructive text-sm mt-3">
                {(deleteMutation.error as any)?.message || "Failed to delete FAQ."}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleting(null);
                }}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-lg bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 transition disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faq;
