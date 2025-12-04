'use client';
import * as React from "react";
import { useState, useEffect } from "react";
import { getToken, logoutUser } from "@/lib/auth";
import type { CustomJwtPayload } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

const API_BASE_ROOT = API_BASE.replace('/auth', '');

interface Book {
    book_id: number;
    title: string;
    image_link: string;
    borrower_id: number | null;
    status: 'available' | 'requested' | 'borrowed';
}

interface Status {
    message: string;
    type: 'success' | 'error' | null;
}

function StatusMessage({ status, onDismiss }: { status: Status, onDismiss: () => void }) {
    if (!status.message) return null;

    const baseClasses = "flex justify-between items-center p-4 rounded-lg text-white font-medium mb-6 transition-opacity duration-300";
    const statusClasses = status.type === 'success' 
        ? "bg-green-600" 
        : "bg-red-600";

    return (
        <div className={`${baseClasses} ${statusClasses}`}>
            <span>{status.message}</span>
            <Button onClick={onDismiss} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                &times;
            </Button>
        </div>
    );
}

function BookCard({ title, cover, status, onBookAction, book_id }: { title: string, cover: string, status: 'available' | 'requested' | 'borrowed', onBookAction: (bookId: number, action: 'cancel') => void, book_id: number }) {
    let statusText: string = status.charAt(0).toUpperCase() + status.slice(1);
    let statusColor: string = '';
    let button: React.JSX.Element | null = null;
    
    switch (status) {
        case 'requested':
            statusColor = 'text-yellow-400';
            statusText = 'Requested (Pending)';
            button = (
                <Button
                    size="sm"
                    variant="destructive"
                    className="w-full mt-1 bg-red-600 hover:bg-red-700"
                    onClick={() => onBookAction(book_id, 'cancel')}
                >
                    Cancel Request
                </Button>
            );
            break;
        case 'borrowed':
            statusColor = 'text-red-400';
            statusText = 'Borrowed';
            break;
        case 'available':
            statusColor = 'text-green-400';
            statusText = 'Available';
            break;
    }

    return (
        <Card className="rounded-md border-none overflow-hidden bg-[#424769] transition-colors cursor-pointer w-full shadow-md">
            <CardContent className="p-5">
                <div className="w-full h-auto aspect-[150/210]">
                    {cover ? (
                        <img src={cover} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-400 text-center text-sm">No Cover</div>
                    )}
                </div>
                <div className="pt-2 pb-1 px-1 text-sm leading-tight">
                    <p className="text-gray-200 font-medium truncate">{title}</p>
                    <p className={`text-xs text-gray-400 font-semibold ${statusColor}`}>
                        Status: {statusText}
                    </p>
                    {button}
                </div>
            </CardContent>
        </Card>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<Status>({ message: '', type: null });
    const [username, setUsername] = useState<string>('User');

    useEffect(() => {
        const storedToken = getToken();
        if (!storedToken) {
            router.push('/');
        } else {
            setToken(storedToken);
            try {
                const decode: CustomJwtPayload = jwtDecode(storedToken);
                setUsername(decode.username);
            } catch (e) {
                console.error("Token decoding failed", e);
            }
        }
    }, [router]);

    const dismissStatus = (): void => setStatus({ message: '', type: null });

    const fetchBorrowedBooks = async (currentToken: string): Promise<void> => {
        try {
            const res = await fetch(`${API_BASE_ROOT}/books/borrowed`, {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to fetch books");
            }

            const data: Book[] = await res.json();
            setBorrowedBooks(data);
        } catch (err: any) {
            setError((err as Error).message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    const handleBookAction = async (bookId: number, action: 'cancel'): Promise<void> => {
        if (!token) return;
        const endpoint: string = 'cancel';
        const actionVerb: string = 'cancel request';
        dismissStatus();

        try {
            const res = await fetch(`${API_BASE_ROOT}/books/${endpoint}/${bookId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const data = await res.json();
                setStatus({ message: data.message || `Failed to ${actionVerb} book.`, type: 'error' });
                throw new Error(data.message || `Failed to ${actionVerb} book.`);
            }

            setStatus({ message: `Success! Book ID ${bookId} successfully ${actionVerb}ed.`, type: 'success' });
            await fetchBorrowedBooks(token); 

        } catch (err) {
            console.error(`Error: Could not ${actionVerb} book.`, (err as Error).message);
            if (!status.message) {
                setStatus({ message: `Error: Could not complete ${actionVerb}.`, type: 'error' });
            }
        }
    };
    
    useEffect(() => {
        if (token) {
            fetchBorrowedBooks(token);
        }
    }, [token]);

    function handleLogout(): void {
        logoutUser();
        router.push('/');
    }
    
    if (loading) {
        return <div className="min-h-screen bg-[#2d3250] text-white p-6">Loading profile...</div>;
    }
    
    if (error) {
        return <div className="min-h-screen bg-[#2d3250] text-red-400 p-6">Error: {error}</div>;
    }
    
    return (
        <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
            <header className="sticky top-0 z-50 w-full">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <NavBar />
                </div>
            </header>
            <div className="max-w-7xl mx-auto space-y-8 text-white pt-10 p-6">
                <header className="flex justify-between items-center pb-4 border-b border-gray-600">
                    <h1 className="text-3xl font-bold">Welcome, {username}</h1>
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </header>

                <h2 className="text-2xl font-semibold">Your Active Books</h2>
                <StatusMessage status={status} onDismiss={dismissStatus} />

                {borrowedBooks.length === 0 ? (
                    <p className="text-lg text-gray-400">You currently have no requested or borrowed books.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {borrowedBooks.map((book) => (
                            <BookCard 
                                key={book.book_id} 
                                book_id={book.book_id}
                                title={book.title} 
                                cover={book.image_link} 
                                status={book.status}
                                onBookAction={handleBookAction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}