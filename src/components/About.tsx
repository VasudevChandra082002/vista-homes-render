import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Home, TrendingUp, Shield, Clock } from "lucide-react";

const About = () => {
  const services = [
    {
      icon: Home,
      title: "Land Development",
      description:
        "End-to-end transformation of raw land into planned residential layouts with roads, utilities, and approvals.",
    },
    {
      icon: TrendingUp,
      title: "Plotted Communities",
      description:
        "RERA-approved plotted developments with roads, drainage, lighting, and landscaped parks.",
    },
    {
      icon: Shield,
      title: "Approvals & Compliance",
      description:
        "Complete support for RERA, BDA, BMRDA, and CUDA approvals with transparent documentation.",
    },
    {
      icon: Clock,
      title: "Customer Support",
      description:
        "Guidance from site visits to registration and after-sales services for a smooth journey.",
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: "On-time Delivery",
      description:
        "Multiple phases delivered in Chikkaballapur & Nandi Hills region on schedule.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Civil, planning & MEP specialists operating with global PMO practices.",
    },
  ];

  return (
    <section id="about" className="relative py-24">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* === SECTION 1: Headline + Copy + Achievements + CTAs (all together) === */}
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            Your trusted partner in{" "}
            <span className="text-primary">real estate excellence</span>
          </h2>

          <p className="mt-5 text-lg text-white leading-relaxed">
            For over 15 years, Sitrus Projects has been shaping dream
            communities across Karnataka. We specialize in plotted developments,
            premium villas, and gated communities—offering buyers transparent
            titles, approved layouts, and on-time project delivery.
          </p>

          {/* Achievements */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {achievements.map((a, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 rounded-xl border bg-card/60 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <a.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">{a.title}</h4>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
 
        </div>

        {/* Divider */}
        <div className="mx-auto my-14 h-px max-w-5xl bg-border/60" />

        {/* === SECTION 2 (BELOW): Four horizontal service cards === */}
        <div>
          <h3 className="mb-6 text-center text-2xl font-bold">Our Services</h3>

          {/* Desktop: four horizontal cards */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {services.map((s, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/40 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-tr from-primary/10 to-transparent" />
                <CardContent className="relative p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/20">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="mb-2 font-semibold transition group-hover:text-primary">
                    {s.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile/Tablet: smooth horizontal scroll with snap */}
          <div className="lg:hidden -mx-2">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2">
              {services.map((s, i) => (
                <Card
                  key={i}
                  className="group relative min-w-[260px] snap-start overflow-hidden border-0 bg-gradient-to-br from-background to-muted/50 shadow-md transition hover:-translate-y-0.5"
                >
                  <div className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-tr from-primary/10 to-transparent" />
                  <CardContent className="relative p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary/20">
                      <s.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="mb-2 font-semibold transition group-hover:text-primary">
                      {s.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default About;
