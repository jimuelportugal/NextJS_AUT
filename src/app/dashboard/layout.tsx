'use client'
import { useRouter } from "next/navigation"
import { getToken, logoutUser } from '@/lib/auth'
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const token = getToken();

    if (!token) {
        router.push('https://nextjs-aut.onrender.com/');
        return null;
    }

    function handleLogout() {
        logoutUser();
        router.push('https://nextjs-aut.onrender.com/')
    }
    
    return (
        // Apply a dark background (like the one used in other pages) and ensure text is light
        <div className="min-h-screen bg-[#2d3250] text-gray-200">
            {/* Header/Navbar Area - Use a slightly darker shade for the navbar, similar to the MangaDex top bar */}
            <header className="w-full bg-[#202125] border-b border-gray-700 shadow-lg sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-14">
                    {/* MangaDex Logo/Title - Using a characteristic bold red color */}
                    <h1 className="text-2xl font-extrabold text-red-500 cursor-pointer">
                        MangaDex
                    </h1>
                    
                    {/* Logout Button */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="destructive" // Uses the red/dark red destructive style defined in button.tsx
                            onClick={handleLogout}
                            className="text-sm font-semibold h-8 px-3"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area - Apply padding to the inner main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
}