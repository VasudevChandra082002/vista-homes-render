import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllContactUs,
  deleteContactUs,
  getcontactUsById,
} from "@/api/contactUs.js"; // adjust path if needed

type ContactData = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
};

const ContactUs: React.FC = () => {
  const qc = useQueryClient();

  // List all contacts
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contactus", "list"],
    queryFn: async () => {
      const res = await getAllContactUs();
      return (res as any)?.data?.data ?? [];
    },
  });

  const contacts: ContactData[] = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteContactUs(id);
      return (res as any)?.data ?? res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contactus", "list"] });
    },
  });

  // Modal state
  const [viewing, setViewing] = useState<ContactData | null>(null);
  const [deleting, setDeleting] = useState<ContactData | null>(null);

  // View one contact
  const handleView = async (id: string) => {
    const res = await getcontactUsById(id);
    const d = (res as any)?.data?.data ?? null;
    if (d) setViewing(d);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleting?._id) {
      deleteMutation.mutate(deleting._id);
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            View and manage contact form submissions
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6">
        {isLoading && <div className="text-muted-foreground">Loading…</div>}
        {isError && (
          <div className="text-destructive">
            {(error as any)?.message || "Failed to load contacts."}
          </div>
        )}
        {!isLoading && !isError && contacts.length === 0 && (
          <div className="text-muted-foreground">No contacts found.</div>
        )}

        {!isLoading && !isError && contacts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Created</th>
                  <th className="py-3 px-3 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c._id} className="border-b last:border-b-0">
                    <td className="py-3 px-3">{c.firstName} {c.lastName}</td>
                    <td className="py-3 px-3">{c.email}</td>
                    <td className="py-3 px-3">{c.phone}</td>
                    <td className="py-3 px-3">{c.subject}</td>
                    <td className="py-3 px-3">{new Date(c.createdAt || "").toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(c._id)}
                          className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleting(c)}
                          className="px-3 py-1.5 rounded-lg bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 transition"
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

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-lg p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Contact Details</h2>
              <button
                onClick={() => setViewing(null)}
                className="text-sm underline"
              >
                Close
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {viewing.firstName} {viewing.lastName}</p>
              <p><strong>Email:</strong> {viewing.email}</p>
              <p><strong>Phone:</strong> {viewing.phone}</p>
              <p><strong>Subject:</strong> {viewing.subject}</p>
              <p><strong>Message:</strong> {viewing.message}</p>
              <p><strong>Created At:</strong> {new Date(viewing.createdAt || "").toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl shadow-lg w-full max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-semibold mb-2">Delete Contact</h2>
            <p className="text-muted-foreground">
              Are you sure you want to delete this contact?
            </p>
            <div className="bg-muted rounded-xl p-3 mt-3 text-sm">
              {deleting.firstName} {deleting.lastName} ({deleting.email})
            </div>

            {deleteMutation.isError && (
              <div className="text-destructive text-sm mt-3">
                {(deleteMutation.error as any)?.message || "Failed to delete contact."}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleting(null)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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

export default ContactUs;
