import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStaticList,
  getStaticById,
  updateStaticById,
} from "@/api/staticApi";

type StaticData = {
  _id: string;
  about: string;
  privacy: string;
  terms: string;
  refundPolicy: string;
  createdAt?: string;
  updatedAt?: string;
};

const Static: React.FC = () => {
  const qc = useQueryClient();

  // 1) Fetch list → pick first doc id
  const listQ = useQuery({
    queryKey: ["static", "list"],
    queryFn: getStaticList,
  });

  const firstId = useMemo<string | null>(() => {
    const arr = (listQ.data as StaticData[] | undefined) || [];
    return arr[0]?._id ?? null;
  }, [listQ.data]);

  // 2) Fetch detail by id
  const detailQ = useQuery({
    queryKey: ["static", "detail", firstId],
    queryFn: () => getStaticById(firstId as string),
    enabled: !!firstId,
  });

  // Form state
  const [about, setAbout] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [terms, setTerms] = useState("");
  const [refundPolicy, setRefundPolicy] = useState("");

  useEffect(() => {
    const d = detailQ.data as StaticData | undefined;
    if (d) {
      setAbout(d.about ?? "");
      setPrivacy(d.privacy ?? "");
      setTerms(d.terms ?? "");
      setRefundPolicy(d.refundPolicy ?? "");
    }
  }, [detailQ.data]);

  // Update
  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<StaticData>) => {
      return updateStaticById(firstId as string, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["static", "list"] });
      if (firstId) qc.invalidateQueries({ queryKey: ["static", "detail", firstId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstId) return;
    updateMutation.mutate({ about, privacy, terms, refundPolicy });
  };

  const isPriming = listQ.isLoading || listQ.isFetching;
  const isDetailLoading = !!firstId && (detailQ.isLoading || detailQ.isFetching);
  const listError = listQ.isError ? (listQ.error as any)?.message || "Failed to load list." : null;
  const detailError = detailQ.isError ? (detailQ.error as any)?.message || "Failed to load details." : null;

  const createdAt = (detailQ.data as StaticData | undefined)?.createdAt;
  const updatedAt = (detailQ.data as StaticData | undefined)?.updatedAt;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Static Content</h1>
        <p className="text-sm text-muted-foreground">
          Manage About, Privacy, Terms, and Refund Policy.
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6">
        {isPriming && <div className="text-muted-foreground">Loading…</div>}
        {listError && <div className="text-destructive">{listError}</div>}

        {!isPriming && !listError && !firstId && (
          <div className="text-muted-foreground">
            No static record found. Please create one in backend first.
          </div>
        )}

        {!isPriming && firstId && (
          <>
            {isDetailLoading && <div className="text-muted-foreground">Loading details…</div>}
            {detailError && <div className="text-destructive">{detailError}</div>}

            {!isDetailLoading && !detailError && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* {(createdAt || updatedAt) && (
                  <div className="grid gap-2 text-xs text-muted-foreground">
                    {createdAt && <div>Created: {new Date(createdAt).toLocaleString()}</div>}
                    {updatedAt && <div>Last Updated: {new Date(updatedAt).toLocaleString()}</div>}
                    <div>ID: <span className="font-mono">{firstId}</span></div>
                  </div>
                )} */}

                <div>
                  <label className="block text-sm font-medium mb-2">About</label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
                    placeholder="We are Digi9 Reach Info Systems, committed to building scalable digital platforms."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Privacy</label>
                  <textarea
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
                    placeholder="We respect your privacy..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Terms & Conditions</label>
                  <textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
                    placeholder="By using our services, you agree..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Refund Policy</label>
                  <textarea
                    value={refundPolicy}
                    onChange={(e) => setRefundPolicy(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary transition"
                    placeholder="Refunds are processed within 7 working days..."
                  />
                </div>

                {updateMutation.isError && (
                  <div className="text-destructive text-sm">
                    {(updateMutation.error as any)?.message || "Update failed."}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium shadow-card hover-lift transition disabled:opacity-60"
                  >
                    {updateMutation.isPending ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Static;
