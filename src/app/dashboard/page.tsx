'use client';
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";
import { Button } from "@/components/ui/button";

interface jwtPayload {
    sub: number;
    username: string;
    role: string;
    exp: number;
    iat: number;
}

interface Book {
    book_id: number;
    title: string;
    image_link: string;
    borrower_id: number | null;
    status: 'available' | 'borrowed';
}

function BookCard({ 
    book_id, 
    title, 
    cover, 
    status, 
    onBorrow 
}: { 
    book_id: number, 
    title: string, 
    cover: string, 
    status: 'available' | 'borrowed', 
    onBorrow: (bookId: number) => void 
}) {
    const statusColor = status === 'available' ? 'text-green-400' : 'text-yellow-400';

    return (
        <Card className="rounded-md border-none overflow-hidden bg-[#424769] transition-colors cursor-pointer w-full shadow-md">
            <CardContent className="p-5">
                <div className="w-full h-auto aspect-[150/210] mb-2">
                    {cover ? (
                        <img src={cover} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-400 text-center text-sm">No Cover</div>
                    )}
                </div>
                <div className="pt-1 pb-2 px-1 text-sm leading-tight space-y-1">
                    <p className="text-gray-200 font-medium truncate">{title}</p>
                    <p className={`text-xs font-semibold ${statusColor}`}>
                        Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                    </p>
                    {status === 'available' && (
                        <Button
                            size="sm"
                            className="w-full mt-2 bg-primary hover:bg-primary/80"
                            onClick={() => onBorrow(book_id)}
                        >
                            Borrow
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardHome() {
    const token = getToken();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    let username = 'Guest';
    let userId: number | null = null;

    if (token) {
        try {
            const decode = jwtDecode<jwtPayload>(token);
            username = decode.username;
            userId = decode.sub;
        } catch (e) {
            console.error("Token decoding failed", e);
        }
    }

    const fetchAllBooks = async () => {
        if (!token) {
            setLoading(false);
            setError("Not authenticated.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/books`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to fetch all books");
            }

            const data: Book[] = await res.json();
            // Sort to show available books first
            const sortedBooks = data.sort((a, b) => {
                if (a.status === 'available' && b.status === 'borrowed') return -1;
                if (a.status === 'borrowed' && b.status === 'available') return 1;
                return 0;
            });
            setBooks(sortedBooks);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred while fetching books.");
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async (bookId: number) => {
        if (!token || !userId) {
            alert("You must be logged in to borrow a book.");
            return;
        }
        
        try {
            // Note: This endpoint is assumed to be implemented on the backend.
            const res = await fetch(`${API_BASE}/books/borrow/${bookId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // The backend should use the userId from the token to set the borrower_id.
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to borrow book.");
            }

            alert(`Book ID ${bookId} successfully borrowed!`);
            // Refresh the book list to update the status
            await fetchAllBooks();

        } catch (err: any) {
            alert(`Error borrowing book: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchAllBooks();
    }, [token]);

    if (loading) {
        return <div className="text-white">Loading books...</div>;
    }

    if (error) {
        return <div className="text-red-400">Error: {error}</div>;
    }

    return (
        <div className="space-y-6 bg-[#2d3250]">   
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {books.length === 0 ? (
                    <p className="text-white col-span-full">No books found in the library.</p>
                ) : (
                    books.map((book) => (
                        <BookCard 
                            key={book.book_id} 
                            book_id={book.book_id}
                            title={book.title} 
                            cover={book.image_link} 
                            status={book.status}
                            onBorrow={handleBorrow}
                        />
                    ))
                )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700 hidden">
                <h3 className="text-lg font-semibold mb-2 text-gray-400">User Token Info (Hidden)</h3>
                <p className="text-sm text-gray-500">Welcome, {username}</p>
                {token && (
                    <pre className="p-2 bg-slate-100 text-xs mt-2 break-all text-black hidden">{token}</pre>
                )}
            </div>
        </div>
    );
}   