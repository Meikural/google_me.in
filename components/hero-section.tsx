"use client";

import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { SignUpButton } from "@clerk/nextjs";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-purple-200 to-purple-900">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Discover & Share Your{" "}
              <span className="text-purple-600">Interests with the World</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700">
              Connect with people who share your passions. Search, explore, and organize your favorite links in one place.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by username..."
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-lg"
                />
                <IconArrowRight className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              </div>

              <SignUpButton mode="modal">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white rounded-full px-8">
                  Get Started Free
                  <IconArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
            </div>
          </div>

          {/* Right Side - Orbiting Circles */}
          <div className="relative h-[700px] flex items-center justify-center">
            <div className="relative w-[700px] h-[700px] flex items-center justify-center">
              {/* Center Content */}
              <div className="z-10 text-center">
                <h2 className="text-6xl font-bold text-white mb-2">20k+</h2>
                <p className="text-xl text-white/90">Specialists</p>
              </div>

              {/* Inner Circle - Profile Images */}
              <OrbitingCircles radius={120} duration={20} iconSize={60}>
                <div className="rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
                    B
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold text-xl">
                    C
                  </div>
                </div>
              </OrbitingCircles>

              {/* Middle Circle - Mixed Content */}
              <OrbitingCircles radius={200} duration={25} reverse iconSize={55}>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center text-white font-bold text-lg">
                    G
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-gray-800 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🔗
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                    H
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-gray-800 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                </div>
              </OrbitingCircles>

              {/* Outer Circle - Icons & More Profiles */}
              <OrbitingCircles radius={280} duration={30} iconSize={50}>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-lg">
                    D
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-gray-800 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📧
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-gray-800 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    💬
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                    F
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-4 border-purple-300 shadow-lg bg-gray-800 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    🎨
                  </div>
                </div>
              </OrbitingCircles>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
