'use client';
import { useRouter } from "next/navigaton";
import { useState } from "react";
import { saveToken } from "@/lib/auth";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { API_BASE } from "@/lib/config";
import { FormEvent } from "react";
import { error } from "console";

export default function LoginPage() {

    const router = userRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setError(' ')

        const res = await fetch('${API_BASE}/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password },)
        });
        const data = await res.json();
        if (!res.ok)
            setError(data.message || 'Login failed')
        return;
    }
    saveToken(data.accessToken);
    router.push('/dashboard');
}

return (
    <div className="flex itemsa-center justify-center h-screen">
        <card className="w-full max-w-sm p-6">
            <cardContent>
                <h1 className="text-xl font-bold md-4">LOGIN</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input placeholder="Usernamr" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="passsword" placeholder="Passsword" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
                <button variant="link" className="mt-2 w-full" onClick={() => router.push('/register')}>Create an Account</button>
            </cardContent>
        </card>
    </div>
);
}