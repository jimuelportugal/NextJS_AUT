'use client';
import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdmin, logoutUser, getToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { API_BASE } from "@/lib/config";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_BASE_ROOT: string = API_BASE.replace('/auth', '');

interface User { id: number, username: string, role: string }
// UPDATED: Added borrower_username to interface
interface Book { 
    book_id: number; 
    title: string; 
    image_link: string; 
    status: 'available' | 'requested' | 'borrowed'; 
    borrower_id: number | null; 
    borrower_username?: string; 
}

function AdminUserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    // State for Editing
    const [editId, setEditId] = useState<number | null>(null);
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState(''); // Empty means don't change
    const [editRole, setEditRole] = useState('user');

    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });

    const fetchUsers = async (): Promise<void> => {
        const token: string | null = getToken();
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_ROOT}/users`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) setUsers(await res.json());
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    }

    useEffect(() => { fetchUsers(); }, []);

    const handleAddUser = async () => {
        const token = getToken();
        await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newUser),
        });
        setIsAddOpen(false);
        setNewUser({ username: '', password: '', role: 'user' });
        fetchUsers();
    };

    const openEditDialog = (user: User) => {
        setEditId(user.id);
        setEditUsername(user.username);
        setEditRole(user.role);
        setEditPassword(''); // Reset password field
        setIsEditOpen(true);
    };

    const handleEditUser = async () => {
        if(!editId) return;
        const token = getToken();
        
        const payload: any = { username: editUsername, role: editRole };
        if (editPassword) {
            payload.password = editPassword;
        }

        await fetch(`${API_BASE_ROOT}/users/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload),
        });
        setIsEditOpen(false);
        fetchUsers();
    };

    const handleDeleteUser = async (id: number) => {
        const token = getToken();
        await fetch(`${API_BASE_ROOT}/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        fetchUsers();
    };

    if (loading) return <p className="text-white">Loading users...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage Users ({users.length})</h2>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>Add New User</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#424769] text-white border-gray-600">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Input placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                            <Input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-white"
                                value={newUser.role} 
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                            >
                                <option value="user" className="text-black">User</option>
                                <option value="admin" className="text-black">Admin</option>
                            </select>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddUser}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* FULL EDIT USER DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-[#424769] text-white border-gray-600">
                    <DialogHeader><DialogTitle>Edit User Details</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input 
                                value={editUsername} 
                                onChange={e => setEditUsername(e.target.value)} 
                                placeholder="Username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password (Leave blank to keep current)</label>
                            <Input 
                                type="password" 
                                value={editPassword} 
                                onChange={e => setEditPassword(e.target.value)} 
                                placeholder="New Password"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Role</label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-white"
                                value={editRole} 
                                onChange={e => setEditRole(e.target.value)}
                            >
                                <option value="user" className="text-black">User</option>
                                <option value="admin" className="text-black">Admin</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleEditUser}>Update User</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="bg-[#424769] p-4 rounded-lg">
                <ul className="text-gray-200 space-y-2">
                    {users.map(user => (
                        <li key={user.id} className="flex justify-between items-center p-2 border-b border-[#2d3250]">
                            <span>{user.username} <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-2">{user.role}</span></span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-black" onClick={() => openEditDialog(user)}>Edit</Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-[#424769] text-white border-gray-600">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-300">
                                                This will permanently delete <b>{user.username}</b>.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-gray-600 text-white border-none hover:bg-gray-700">Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteUser(user.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    // REJECTION STATE: ID Only
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [bookIdToReject, setBookIdToReject] = useState<number | null>(null);

    const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
    const [newBook, setNewBook] = useState({ title: '', image_link: '' });

    const fetchAllBooks = async (): Promise<void> => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_ROOT}/books`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) setBooks(await res.json());
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAllBooks(); }, []);

    const handleAddBook = async () => {
        const token = getToken();
        await fetch(`${API_BASE_ROOT}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newBook),
        });
        setIsAddOpen(false);
        setNewBook({ title: '', image_link: '' });
        fetchAllBooks();
    };

    const handleEditBook = async () => {
        if(!currentBook.book_id) return;
        const token = getToken();
        await fetch(`${API_BASE_ROOT}/books/${currentBook.book_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: currentBook.title, image_link: currentBook.image_link }),
        });
        setIsEditOpen(false);
        fetchAllBooks();
    };

    const handleDeleteBook = async (id: number) => {
        const token = getToken();
        await fetch(`${API_BASE_ROOT}/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        fetchAllBooks();
    };

    const handleApprove = async (id: number) => {
        const token = getToken();
        await fetch(`${API_BASE_ROOT}/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: 'borrowed' }),
        });
        fetchAllBooks();
    };

    const openRejectDialog = (id: number) => {
        setBookIdToReject(id);
        setIsRejectOpen(true);
    };

    const submitReject = async () => {
        if (!bookIdToReject) return;
        const token = getToken();
        // REMOVED BODY: Just calling the endpoint with ID
        await fetch(`${API_BASE_ROOT}/books/reject/${bookIdToReject}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        setIsRejectOpen(false);
        fetchAllBooks();
    };

    const handleReturn = async (id: number) => {
        const token = getToken();
        const res = await fetch(`${API_BASE_ROOT}/books/return/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if(res.ok) {
            fetchAllBooks();
        } else {
            console.error("Failed to return book");
        }
    };

    if (loading) return <p className="text-white">Loading books...</p>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Manage Books ({books.length})</h2>
                {/* ADD BOOK DIALOG */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>Add New Book</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#424769] text-white border-gray-600">
                        <DialogHeader><DialogTitle>Add New Book</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Input placeholder="Book Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                            <Input placeholder="Cover Image URL" value={newBook.image_link} onChange={e => setNewBook({...newBook, image_link: e.target.value})} />
                        </div>
                        <DialogFooter><Button onClick={handleAddBook}>Save</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* EDIT BOOK DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-[#424769] text-white border-gray-600">
                    <DialogHeader><DialogTitle>Edit Book</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input placeholder="Book Title" value={currentBook.title || ''} onChange={e => setCurrentBook({...currentBook, title: e.target.value})} />
                        <Input placeholder="Cover Image URL" value={currentBook.image_link || ''} onChange={e => setCurrentBook({...currentBook, image_link: e.target.value})} />
                    </div>
                    <DialogFooter><Button onClick={handleEditBook}>Update</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* REJECT BOOK ALERT DIALOG (NO INPUT) */}
            <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <AlertDialogContent className="bg-[#424769] text-white border-gray-600">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Request</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            Are you sure you want to reject this request?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-600 text-white border-none hover:bg-gray-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700" 
                            onClick={submitReject}
                        >
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="bg-[#424769] p-4 rounded-lg">
                <ul className="text-gray-200 space-y-2">
                    {books.map(book => (
                        <li key={book.book_id} className="flex flex-col md:flex-row justify-between items-center p-2 border-b border-[#2d3250] gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <img src={book.image_link || "https://placehold.co/40x60"} className="w-10 h-14 object-cover rounded" alt="cover"/>
                                <div>
                                    <p className="font-semibold">{book.title}</p>
                                    <p className="text-xs text-gray-400">
                                        Status: <span className={book.status === 'available' ? 'text-green-400' : 'text-yellow-400'}>{book.status}</span>
                                        {/* DISPLAY USERNAME HERE */}
                                        {book.borrower_username && (
                                            <span className="text-white ml-1">
                                                — {book.status === 'requested' ? 'Requested by' : 'Borrowed by'}: <b>{book.borrower_username}</b>
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {book.status === 'requested' && (
                                    <>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(book.book_id)}>Approve</Button>
                                        <Button size="sm" variant="destructive" onClick={() => openRejectDialog(book.book_id)}>Reject</Button>
                                    </>
                                )}
                                {book.status === 'borrowed' && (
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleReturn(book.book_id)}>Returned</Button>
                                )}
                                <Button size="sm" variant="outline" className="text-black" onClick={() => { setCurrentBook(book); setIsEditOpen(true); }}>Edit</Button>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-[#424769] text-white border-gray-600">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Book?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-300">
                                                This action cannot be undone. This will permanently delete <b>{book.title}</b>.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-gray-600 text-white border-none hover:bg-gray-700">Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDeleteBook(book.book_id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
        <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
            <header className="sticky top-0 z-50 w-full">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <NavBar />
                </div>
            </header>
            
            <div className="max-w-7xl mx-auto space-y-8 text-white pt-10 p-6">
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