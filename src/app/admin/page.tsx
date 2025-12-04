'use client';
import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdmin, logoutUser, getToken } from "@/lib/auth";
import type { CustomJwtPayload } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE } from "@/lib/config";
import { jwtDecode } from "jwt-decode";

const API_BASE_ROOT: string = API_BASE.replace('/auth', '');

interface User { id: number, username: string, role: string }
interface Book { book_id: number, title: string, status: 'available' | 'requested' | 'borrowed', borrower_id: number | null }

function AdminUserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (): Promise<void> => {
        const token: string | null = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_ROOT}/users`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to fetch users");
            }

            const data: User[] = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError((err as Error).message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId: number, action: 'delete' | 'edit'): Promise<void> => {
        if (action === 'delete') {
            if (!confirm(`Are you sure you want to delete User ID ${userId}?`)) return;
        }
        
        console.log(`Admin action: ${action} user ${userId}. (Simulated)`);
        fetchUsers();
    }


    if (loading) return <p className="text-white">Loading users...</p>;
    if (error) return <p className="text-red-400">Error: {error}</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Manage Users ({users.length})</h2>
            <div className="bg-[#424769] p-4 rounded-lg">
                <Button className="mb-4">Add New User</Button>
                <ul className="text-gray-200 space-y-2">
                    {users.map(user => (
                        <li key={user.id} className="flex justify-between items-center p-2 border-b border-[#2d3250]">
                            <span>{user.username} - ({user.role})</span>
                            <div>
                                <Button size="sm" variant="outline" className="mr-2" onClick={() => handleAction(user.id, 'edit')}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleAction(user.id, 'delete')}>Delete</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function AdminBookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchAllBooks = async (): Promise<void> => {
        const token: string | null = getToken();
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE_ROOT}/books`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to fetch books");
            }
            const data: Book[] = await res.json();
            setBooks(data);
        } catch (err: any) {
            setError((err as Error).message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleAction = async (bookId: number, action: 'delete' | 'edit'): Promise<void> => {
        if (action === 'delete') {
            if (!confirm(`Are you sure you want to delete Book ID ${bookId}?`)) return;
        }
        
        console.log(`Admin action: ${action} book ${bookId}. (Simulated)`);
        fetchAllBooks();
    }
    
    const handleReject = async (bookId: number): Promise<void> => {
        const reason: string | null = prompt("Enter reason for rejecting the request:");
        if (reason === null) return; 

        const token: string | null = getToken();
        try {
            const res = await fetch(`${API_BASE_ROOT}/books/reject/${bookId}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason }),
            });
            
            if (!res.ok) {
                const data = await res.json();
                console.error("Rejection failed:", data.message);
                throw new Error(data.message || "Failed to reject request.");
            }

            console.log(`Rejection successful for Book ID ${bookId}. Notification sent to user.`);
            fetchAllBooks();

        } catch (err: any) {
            console.error(`Error rejecting request:`, (err as Error).message);
        }
    }
    
    const handleApprove = async (bookId: number): Promise<void> => {
        const token: string | null = getToken();
        try {
            const res = await fetch(`${API_BASE_ROOT}/books/${bookId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'borrowed' }),
            });
            
            if (!res.ok) {
                const data = await res.json();
                console.error("Approval failed:", data.message);
                throw new Error(data.message || "Failed to approve request.");
            }

            console.log(`Approval successful for Book ID ${bookId}. Status changed to 'borrowed'.`);
            fetchAllBooks();

        } catch (err: any) {
            console.error(`Error approving request:`, (err as Error).message);
        }
    }

    useEffect(() => {
        fetchAllBooks();
    }, []);

    if (loading) return <p className="text-white">Loading books...</p>;
    if (error) return <p className="text-red-400">Error: {error}</p>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Manage Books ({books.length})</h2>
            <div className="bg-[#424769] p-4 rounded-lg">
                <Button className="mb-4">Add New Book</Button>
                <ul className="text-gray-200 space-y-2">
                    {books.map(book => (
                        <li key={book.book_id} className="flex justify-between items-center p-2 border-b border-[#2d3250]">
                            <span className="flex-1">{book.title} - Status: {book.status} (Borrower: {book.borrower_id || 'N/A'})</span>
                            <div>
                                {book.status === 'requested' && (
                                    <>
                                        <Button size="sm" className="mr-2 bg-green-500 hover:bg-green-600" onClick={() => handleApprove(book.book_id)}>Approve</Button>
                                        <Button size="sm" variant="destructive" className="mr-4" onClick={() => handleReject(book.book_id)}>Reject</Button>
                                    </>
                                )}
                                <Button size="sm" variant="outline" className="mr-2" onClick={() => handleAction(book.book_id, 'edit')}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleAction(book.book_id, 'delete')}>Delete</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default function AdminPage() {
    const router = useRouter();
    const [accessChecked, setAccessChecked] = useState<boolean>(false);

    useEffect(() => {
        if (!isAdmin()) {
            logoutUser();
            router.push('/');
        } else {
            setAccessChecked(true);
        }
    }, [router]);

    function handleLogout(): void {
        logoutUser();
        router.push('/');
    }

    if (!accessChecked) {
        return <div className="min-h-screen bg-[#2d3250] text-white p-6">Checking access...</div>;
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
                    <h1 className="text-3xl font-bold" style={{ color: '#E1AA4C' }}>
                        ADMINISTRATION PANEL
                    </h1>
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </header>

                <Tabs defaultValue="books" className="w-full">
                    <TabsList className="bg-[#424769] mb-4">
                        <TabsTrigger value="users">Users List</TabsTrigger>
                        <TabsTrigger value="books">Books List</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users">
                        <AdminUserList />
                    </TabsContent>
                    <TabsContent value="books">
                        <AdminBookList />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}