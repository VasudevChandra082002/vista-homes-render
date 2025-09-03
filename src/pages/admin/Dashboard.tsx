import React from "react";
import { motion } from "framer-motion";
import  image1  from "../../assets/imagecitrus.jpeg"

const Dashboard: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Background with Parallax Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Layer 1 - Buildings */}
        <motion.img
          src={image1}
          alt="Sitrus Apartments"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
        {/* Layer 2 - Another building for depth */}
        <motion.img
          src={image1}
          alt="Sitrus Apartments"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 5, ease: "easeOut" }}
        />
        {/* Overlay for dark theme readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Welcome Text */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-4xl md:text-6xl font-extrabold text-white text-center tracking-wide"
      >
        Welcome to <span className="text-[hsl(var(--accent))]">Sitrus Projects</span>
      </motion.h1>

      {/* Waveform Animation */}
      <div className="flex space-x-1 mt-8 z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0.2 }}
            animate={{ scaleY: [0.2, 1, 0.2] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
            className="w-1 h-12 bg-[hsl(var(--primary))] rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
