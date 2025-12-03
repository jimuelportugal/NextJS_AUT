'use client';
import { useRouter } from "next/navigation"
import { getToken, logoutUser } from '@/lib/auth'
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/NavBar"

export default function DashboardLayout({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const token = getToken();

    if (!token) {
        router.push('/'); 
        return null;
    }

    function handleLogout() {
        logoutUser();
        router.push('/')
    }
    return (
        <div className="p-6">
            <header className="sticky top-0 z-50 w-full">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <NavBar />
                </div>
            </header>
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Books Dashboard</h1>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </header>
            {children}
        </div>
    );
}