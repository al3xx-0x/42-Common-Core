"use client"

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Games = {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  action: () => void;
  icon: any;
};

export default function GameModes({ gameModes }: { gameModes: Games[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % gameModes.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + gameModes.length) % gameModes.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + gameModes.length) % gameModes.length);

    // Center card (active)
    if (normalizedDiff === 0) {
      return {
        zIndex: 30,
        scale: 1,
        x: 0,
        opacity: 1,
        rotateY: 0,
      };
    }
    // Right card (next)
    else if (normalizedDiff === 1) {
      return {
        zIndex: 20,
        scale: 0.85,
        x: 200,
        opacity: 0.7,
        rotateY: -15,
      };
    }
    // Left card (previous)
    else if (normalizedDiff === gameModes.length - 1) {
      return {
        zIndex: 20,
        scale: 0.85,
        x: -200,
        opacity: 0.7,
        rotateY: 15,
      };
    }
    // Hidden cards
    else {
      return {
        zIndex: 10,
        scale: 0.7,
        x: 0,
        opacity: 0,
        rotateY: 0,
      };
    }
  };

  return (
    <div className="mb-6 md:mb-8 py-12">
      <div className="relative h-[600px] flex items-center justify-center perspective-1000">
        {/* Cards */}
        {gameModes.map((mode, index) => {
          const style = getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={index}
              className="absolute w-full max-w-2xl cursor-pointer"
              initial={false}
              animate={{
                ...style,
                transition: {
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1],
                },
              }}
              style={{
                zIndex: style.zIndex,
                transformStyle: "preserve-3d",
              }}
              onClick={() => !isActive && setActiveIndex(index)}
            >
              <div
                className={`bg-[#081C29]/90 border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isActive
                    ? "border-[#23ccdc] shadow-2xl shadow-[#23ccdc]/30"
                    : "border-[#21364a] hover:border-[#23ccdc]/50"
                }`}
              >
                {/* Image */}
                <div className="relative bg-white h-96 overflow-hidden">
                  <img
                    src={mode.image}
                    alt={mode.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081C29] via-transparent to-transparent opacity-60" />

                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4 bg-[#23ccdc]/20 backdrop-blur-sm p-3 rounded-lg">
                    <mode.icon className="h-6 w-6 text-[#23ccdc]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {mode.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[#a4aca7] text-sm leading-relaxed mb-6 line-clamp-3">
                    {mode.description}
                  </p>

                  {/* Button */}
                  {isActive && (
                    <button
                      onClick={() => mode.action()}
                      className="w-full bg-cyan-500/60 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg animations">
                      {mode.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute h-32 left-4 z-40 bg-[#081C29]/80 hover:bg-[#23ccdc]/20 border border-[#23ccdc]/30 text-[#23ccdc] p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute h-32 right-4 z-40 bg-[#081C29]/80 hover:bg-[#23ccdc]/20 border border-[#23ccdc]/30 text-[#23ccdc] p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {gameModes.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-10 bg-cyan-500"
                : "w-4 bg-cyan-800 hover:bg-[#23ccdc]/50"
            }`}
          />
        ))}
      </div>

      {/* Add perspective CSS */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}