// src/sections/MeetOurTeam.tsx
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { getTeams } from "@/api/teamApi"; // <- make sure this matches your actual path

type Team = {
  _id: string;
  name: string;
  role?: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

const FALLBACK_IMG = "/placeholder.jpg";

/** Build initials like "NR" from a full name */
function initials(name?: string) {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "—";
}

const MeetOurTeam: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await getTeams();
      return (Array.isArray(res) ? res : []) as Team[];
    },
    staleTime: 60_000,
  });

  const teams = React.useMemo<Team[]>(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  return (
    <section id="team" className="py-16 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            The passionate professionals behind our exceptional properties
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-card h-full">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
                  </div>
                  <div className="h-6 w-48 bg-muted rounded mb-3 mx-auto animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded mb-4 mx-auto animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && isError && (
          <div className="text-center text-destructive">
            {(error as any)?.message || "Failed to load team."}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && teams.length === 0 && (
          <div className="text-center text-muted-foreground">
            No team members found.
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teams.map((member) => {
              const hasImage = Boolean(member.image && member.image.trim());
              return (
                <Card
                  key={member._id}
                  className="shadow-card hover-lift h-full"
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="mb-6 flex justify-center">
                      {hasImage ? (
                        <img
                          src={member.image as string}
                          alt={member.name}
                          className="w-24 h-24 rounded-full object-cover bg-muted"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            // swap to fallback if image fails
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG;
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-primary text-white flex items-center justify-center text-3xl font-bold">
                          {initials(member.name)}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-playfair font-bold text-foreground mb-2 text-center">
                      {member.name}
                    </h3>
                    <p className="text-accent font-semibold mb-4 text-center">
                      {member.role || "—"}
                    </p>
                    <p className="text-muted-foreground mb-2 leading-relaxed text-center">
                      {member.description || "—"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MeetOurTeam;
