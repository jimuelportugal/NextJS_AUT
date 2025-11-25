import * as React from "react"
import "tailwindcss";
import { NavBar } from "@/components/NavBar"

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
      <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavBar />
        </div>
      </header>
      <div className="pl-25 pt-20 max-w-5xl mx-auto text-center flex flex-row">
      </div>
    </div>
  );
}
