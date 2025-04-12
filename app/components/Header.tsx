"use client";

import Link from "next/link";
import React from "react";
import PulseReactor from "./PulseReactor";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

function Header({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 right-0 left-0 px-6 md:px-2 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50", className)}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Left */}
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center "></Link>
            <PulseReactor />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              AgentTube
            </h1>
          </div>
          {/* Right */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link href="/manage-plan">
              <Button
                variant="default"
                className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Manage Plan
              </Button>
              </Link>

              <div className="ml-4 border-2 border-blue-400 rounded-full p-0.5 hover:border-blue-600 transition-all duration-200 shadow-md hover:shadow-lg">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="default"
                  className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
