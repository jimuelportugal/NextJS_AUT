import * as React from "react"
import "tailwindcss";
import { NavBar } from "@/components/NavBar"

export default function About() {
  return (
    <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
      <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Assuming you'll update the NavBar component to include the About link */}
          <NavBar />
        </div>
      </header>
      <div className="pt-16 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            📚 About Our Library System
          </h1>
          <p className="text-xl text-gray-300">
            Your seamless solution for book management and requests.
          </p>
        </div>

        <div className="bg-[#474a68] p-8 rounded-lg shadow-2xl text-left">
          <h2 className="text-3xl font-semibold text-white mb-6 border-b border-gray-500 pb-2">
            Our Purpose
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed mb-6">
            Welcome to our **Library Management System**. This platform is designed to provide a modern, efficient way for users to interact with our book catalog. Our primary goal is to simplify the process of borrowing and requesting books, making the library experience as smooth as possible.
          </p>

          <h3 className="text-2xl font-medium text-white mb-4">
            Key Features
          </h3>
          <ul className="space-y-3 text-lg text-gray-300 list-disc list-inside">
            <li>
              **Book Catalog**: Easily browse and search through our comprehensive collection of books.
            </li>
            <li>
              **Request & Borrow**: Users can directly submit requests to borrow available books, streamlining the checkout process.
            </li>
            <li>
              **Status Tracking**: Books are clearly marked with their status, indicating whether they are **`available`** or **`borrowed`**, so you always know what's ready to read.
            </li>
            <li>
              **User Management**: The system securely manages user accounts, roles (like administrators/staff through the `positions` table), and borrowing history.
            </li>
          </ul>

          <p className="mt-8 text-lg text-gray-200 italic">
            "Connecting readers with the books they love, effortlessly."
          </p>
        </div>
      </div>
    </div>
  );
}