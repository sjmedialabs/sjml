"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroData {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  rotatingWords: string[];
  backgroundImage?: string;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
    </svg>
  );
}

interface HeroSectionProps {
  data: HeroData;
}

export function HeroSection({ data }: HeroSectionProps) {
  const heroData = data;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex(
          (prev) => (prev + 1) % heroData.rotatingWords.length
        );
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroData.rotatingWords.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Background Image or Pattern */}
      {heroData.backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
          />
          <div className="absolute inset-0" />
        </>
      ) : (
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #555 1px, transparent 0)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {heroData.title}{" "}
          <span
            className={`text-[#E63946] inline-block transition-all duration-300 ${
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            {heroData.rotatingWords[currentWordIndex]}
          </span>
        </h1>

        <p className="text-[#888] text-lg md:text-xl max-w-2xl mx-auto mb-10">
          {heroData.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={heroData.primaryButtonUrl || "/contact"}>
            <Button className="bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-full px-8 py-6 text-lg font-medium">
              {heroData.primaryButtonText}
            </Button>
          </Link>
          <Link href={heroData.secondaryButtonUrl || "/work"}>
            <Button
              variant="outline"
              className="border-2 border-white text-[#E63946] hover:bg-white/10 rounded-full px-8 py-6 text-lg bg-transparent font-medium"
            >
              <PlayIcon className="w-6 h-6 mr-2 text-[#E63946]" />
              {heroData.secondaryButtonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
