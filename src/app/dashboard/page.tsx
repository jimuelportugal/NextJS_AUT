'use client';
import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent } from "@/components/ui/card";
import { API_BASE } from "@/lib/config";
import { Button } from "@/components/ui/button";

function StatusMessage({ status, onDismiss }) {
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

function BookCard({
    book_id,
    title,
    cover,
    status,
    onBookAction,
    borrower_id, 
    currentUserId
}) {
    let statusText = status.charAt(0).toUpperCase() + status.slice(1);
    let statusColor = '';
    let button = null;
    
    switch (status) {
        case 'available':
            statusColor = 'text-green-400';
            statusText = 'Available';
            button = (
                <Button
                    size="sm"
                    className="w-full mt-1 bg-primary hover:bg-primary/80"
                    onClick={() => onBookAction(book_id, 'request')}
                >
                    Request
                </Button>
            );
            break;
        case 'requested':
            statusColor = 'text-yellow-400';
            statusText = 'Requested (Pending)';
            if (borrower_id === currentUserId) {
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
            }
            break;
        case 'borrowed':
            statusColor = 'text-red-400';
            statusText = 'Borrowed';
            break;
    }


    return (
        <Card className="rounded-md border-none overflow-hidden bg-[#424769] transition-colors cursor-pointer w-full shadow-md">
            <CardContent className="p-5">
                <div className="w-full h-auto aspect-[150/210] mb-2">
                    {cover ? (
                        <img src={cover} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-210 flex items-center justify-center bg-gray-600 text-gray-400 text-center text-sm">No Cover</div>
                    )}
                </div>
                <div className="pt-1 pb-2 px-1 text-sm leading-tight space-y-1">
                    <p className="text-gray-200 font-medium truncate">{title}</p>
                    <p className={`text-xs font-semibold ${statusColor}`}>
                        Status: {statusText}
                    </p>
                    {button}
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardHome() {
    const token = getToken();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState({ message: '', type: null });
    let username = 'Guest';
    let userId = null;

    if (token) {
        try {
            const decode = jwtDecode(token);
            username = decode.username;
            userId = decode.sub;
        } catch (e) {
            console.error("Token decoding failed", e);
        }
    }
    
    const dismissStatus = () => setStatus({ message: '', type: null });

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
                console.error("Failed to fetch all books:", data.message);
                throw new Error(data.message || "Failed to fetch all books");
            }

            const data = await res.json();
            const sortedBooks = data.sort((a, b) => {
                if (a.status === 'available' && b.status !== 'available') return -1;
                if (a.status !== 'available' && b.status === 'available') return 1;
                return 0;
            });
            setBooks(sortedBooks);
        } catch (err) {
            setError(err.message || "An unexpected error occurred while fetching books.");
        } finally {
            setLoading(false);
        }
    };

    const handleBookAction = async (bookId, action) => {
        if (!token || !userId) {
            console.error("Authentication required to perform action.");
            setStatus({ message: "Authentication required to perform action.", type: 'error' });
            return;
        }
        
        const endpoint = action === 'request' ? 'request' : 'cancel';
        const actionVerb = action === 'request' ? 'request' : 'cancel request';
        dismissStatus();

        try {
            const res = await fetch(`${API_BASE}/books/${endpoint}/${bookId}`, {
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
            await fetchAllBooks(); 

        } catch (err) {
            console.error(`Error: Could not ${actionVerb} book.`, err.message);
            if (!status.message) {
                setStatus({ message: `Error: Could not complete ${actionVerb}.`, type: 'error' });
            }
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
        <div className="space-y-6"> 
            <StatusMessage status={status} onDismiss={dismissStatus} />  
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
                            onBookAction={handleBookAction}
                            borrower_id={book.borrower_id}
                            currentUserId={userId}
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