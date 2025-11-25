'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { API_BASE } from "@/lib/config"
import { FormEvent } from "react"

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        setError('');

        const rest = await fetch('${API_BASE}/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await rest.json();
        if (!rest.ok) {
            setError(data.message || 'Register Failed')
            return;
        }
        router.push('/login')
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-sm p-6">
                <CardContent>
                    <h1 className="text-xl font-bold mb-4">Register</h1>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button className="w-full" type="submit">Register</button>
                    </form>
                    <Button variant="link" className="mt-2 w-full" onClick={() => router.push('/login')}>Back To Login</Button>
                </CardContent>
            </Card>
        </div>
    )
}