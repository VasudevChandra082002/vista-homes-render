import React from "react";
import clsx from "clsx";
import Logo from "@/assets/logonone.png";
type Props = {
  image?: string;                 // e.g. "/images/hero.jpg"
  overlayAlpha?: number;          // 0–1 amount of tint over the image (default 0.78)
  position?: string;              // CSS background-position, e.g. "50% 30%"
  parallax?: boolean;             // enable bg-attachment: fixed on md+ for perf
  className?: string;             // extra classes (padding, etc.)
  children: React.ReactNode;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const BackgroundSection: React.FC<Props> = ({
  image = {Logo},
  overlayAlpha = 0.78,
  position = "50% 35%",
  parallax = true,
  className,
  children,
}) => {
  // CSS variables drive image, overlay strength, and position
  const style: React.CSSProperties = {
    // @ts-ignore - CSS var string is fine
    "--section-image": `url('${image}')`,
    "--overlay-alpha": String(clamp01(overlayAlpha)),
    "--section-position": position,
  };

  return (
    <section
      className={clsx(
        "relative section-photo",
        parallax && "parallax", // turns on bg-fixed at md+ only (perf-friendly)
        className
      )}
      style={style}
    >
      {/* content wrapper stays readable thanks to the overlay */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {children}
      </div>
    </section>
  );
};

export default BackgroundSection;
