'use client';
import { useState, useEffect } from "react";
import { getToken, logoutUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

const API_BASE_ROOT = API_BASE.replace('/auth', '');

function BookCard({ title, cover, status, onBookAction, book_id }) {
    let statusText = status.charAt(0).toUpperCase() + status.slice(1);
    let statusColor = '';
    let button = null;
    
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
    const token = getToken();
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState({ message: '', type: null });
    let username = 'User';
    let userId = null;

    if (!token) {
        router.push('/');
        return null;
    }
    
    try {
        const decode = jwtDecode(token);
        username = decode.username;
        userId = decode.sub;
    } catch (e) {
        console.error("Token decoding failed", e);
    }

    const dismissStatus = () => setStatus({ message: '', type: null });

    const fetchBorrowedBooks = async () => {
        try {
            const res = await fetch(`${API_BASE_ROOT}/books/borrowed`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const data = await res.json();
                console.error("Failed to fetch borrowed books:", data.message);
                throw new Error(data.message || "Failed to fetch books");
            }

            const data = await res.json();
            setBorrowedBooks(data);
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    const handleBookAction = async (bookId, action) => {
        const endpoint = action === 'request' ? 'request' : 'cancel';
        const actionVerb = action === 'request' ? 'request' : 'cancel request';
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
                console.error(`Error: Failed to ${actionVerb} book.`, data.message);
                setStatus({ message: data.message || `Failed to ${actionVerb} book.`, type: 'error' });
                throw new Error(data.message || `Failed to ${actionVerb} book.`);
            }

            console.log(`Action Success: Book ID ${bookId} successfully ${actionVerb}ed.`);
            setStatus({ message: `Success! Book ID ${bookId} successfully ${actionVerb}ed.`, type: 'success' });
            await fetchBorrowedBooks(); 

        } catch (err) {
            console.error(`Error: Could not ${actionVerb} book.`, err.message);
            if (!status.message) {
                setStatus({ message: `Error: Could not complete ${actionVerb}.`, type: 'error' });
            }
        }
    };
    
    useEffect(() => {
        fetchBorrowedBooks();
    }, [token]);

    function handleLogout() {
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
        <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black p-6">
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