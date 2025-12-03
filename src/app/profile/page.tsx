'use client';
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

interface BorrowedBook {
    book_id: number;
    title: string;
    image_link: string;
    status: 'available' | 'borrowed';
    created_at: string;
}

interface jwtPayload {
    sub: number;
    username: string;
    role: string;
    exp: number;
    iat: number;
}

// Reusing the MangaCard component logic for consistency
function BookCard({ title, cover }: { title: string, cover: string }) {
    return (
        <Card className="rounded-md border-none overflow-hidden bg-[#424769] transition-colors cursor-pointer w-full shadow-md">
            <CardContent className="p-5">
                <div className="w-full h-auto aspect-[150/210]">
                    {cover ? (
                        <img src={cover} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-500 text-white text-center">No Cover</div>
                    )}
                </div>
                <div className="pt-2 pb-1 px-1 text-sm leading-tight">
                    <p className="text-gray-200 font-medium truncate">{title}</p>
                    <p className="text-xs text-gray-400">Borrowed</p>
                </div>
            </CardContent>
        </Card>
    );
}


export default function ProfilePage() {
    const router = useRouter();
    const token = getToken();
    const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    let username = 'User';

    if (!token) {
        router.push('/');
        return null;
    }

    try {
        const decode = jwtDecode<jwtPayload>(token);
        if (decode.username) {
            username = decode.username;
        }
    } catch (e) {
        console.error("Token decoding failed", e);
    }
    
    useEffect(() => {
        async function fetchBorrowedBooks() {
            try {
                const res = await fetch(`${API_BASE}/books/borrowed`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Failed to fetch books");
                }

                const data: BorrowedBook[] = await res.json();
                setBorrowedBooks(data);
            } catch (err: any) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        }

        fetchBorrowedBooks();
    }, [token]);

    function handleLogout() {
        // Reuse logout logic from auth.ts
        if (typeof window !== 'undefined') localStorage.removeItem("accessToken");
        router.push('/');
    }
    
    return (
        <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
            <header className="sticky top-0 z-50 w-full">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <NavBar />
                </div>
            </header>
            <div className="max-w-7xl mx-auto space-y-8 text-white pt-10">
                <header className="flex justify-between items-center pb-4 border-b border-gray-600">
                    <h1 className="text-3xl font-bold">Welcome, {username}</h1>
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </header>

                <h2 className="text-2xl font-semibold">Your Borrowed Books</h2>

                {loading ? (
                    <p>Loading your borrowed books...</p>
                ) : error ? (
                    <p className="text-red-400">Error: {error}</p>
                ) : borrowedBooks.length === 0 ? (
                    <p className="text-lg text-gray-400">You currently have no books borrowed.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {borrowedBooks.map((book) => (
                            <BookCard 
                                key={book.book_id} 
                                title={book.title} 
                                cover={book.image_link} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}