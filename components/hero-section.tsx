"use client";

import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { useState, useEffect } from "react";

const userPhotos = [
  "/images/users/user1.png",
  "/images/users/user2.png",
  "/images/users/user3.png",
  "/images/users/user4.png",
  "/images/users/user5.png",
  "/images/users/user6.png",
];

export function HeroSection() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % userPhotos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div>
            <Image
              src="/images/logos/logo1.png"
              alt="Logo"
              width={100}
              height={30}
              className="object-contain"
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <Button variant="ghost" size="default">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
              >
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-[calc(100vh-8rem)]">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Discover & Share Your{" "}
              <span className="text-purple-600 dark:text-purple-400">
                Interests with the World
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground">
              Connect with people who share your passions. Search, explore, and
              organize your favorite links in one place.
            </p>

            <div className="relative">
              <input
                type="text"
                placeholder="Search users by username..."
                className="w-full px-6 py-3 text-base border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground shadow-lg"
              />
              <IconArrowRight className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Right Side - Orbiting Circles */}
          <div className="relative h-full max-h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-[600px] h-full flex items-center justify-center">
              {/* Center Content - Rotating User Photo */}
              <div className="z-10 relative">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-white shadow-2xl transition-opacity duration-500">
                  <Image
                    src={userPhotos[currentPhotoIndex]}
                    alt="User"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Inner Circle - Profile Images */}
              <OrbitingCircles radius={100} duration={20} iconSize={50}>
                <div className="rounded-full overflow-hidden border-3 border-white shadow-lg bg-gray-200 w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-white shadow-lg bg-gray-200 w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                    B
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-white shadow-lg bg-gray-200 w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold text-lg">
                    C
                  </div>
                </div>
              </OrbitingCircles>

              {/* Middle Circle - Category Icons */}
              <OrbitingCircles radius={170} duration={25} reverse iconSize={48}>
                <div className="rounded-full overflow-hidden border-3 border-purple-300 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center p-2.5">
                    <Image
                      src="/images/icons/social.svg"
                      alt="Social"
                      width={26}
                      height={26}
                    />
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-purple-300 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center p-2.5">
                    <Image
                      src="/images/icons/books.svg"
                      alt="Books"
                      width={26}
                      height={26}
                    />
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-purple-300 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center p-2.5">
                    <Image
                      src="/images/icons/games.svg"
                      alt="Games"
                      width={26}
                      height={26}
                    />
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-purple-300 shadow-lg bg-gradient-to-br from-pink-500 to-rose-600 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center p-2.5">
                    <Image
                      src="/images/icons/movies.svg"
                      alt="Movies"
                      width={26}
                      height={26}
                    />
                  </div>
                </div>
              </OrbitingCircles>

              {/* Outer Circle - Education, Others & Profile Avatars */}
              <OrbitingCircles radius={240} duration={30} iconSize={45}>
                <div className="rounded-full overflow-hidden border-3 border-purple-300 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center p-2.5">
                    <Image
                      src="/images/icons/education.svg"
                      alt="Education"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-white shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-base">
                    D
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-purple-300 shadow-lg bg-gradient-to-br from-gray-600 to-gray-700 w-full h-full">
                  <div className="w-full h-full flex items-center justify-center p-2.5">
                    <Image
                      src="/images/icons/others.svg"
                      alt="Others"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-white shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold text-base">
                    E
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-white shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white font-bold text-base">
                    F
                  </div>
                </div>
                <div className="rounded-full overflow-hidden border-3 border-white shadow-lg bg-white w-full h-full">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-base">
                    G
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
