'use client'
import * as React from "react"
import "tailwindcss";
import { NavBar } from "@/components/NavBar"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";

function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!API_BASE) {
      setError('API endpoint is not configured.');
      return;
    }

    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || 'Login failed');
      return;
    }
    saveToken(data.accessToken);
    router.push('/dashboard')
  }

  return (
    <Card className="w-full p-6 bg-[#676fgd] border-none mt-30 mb-30 color-white">
      <h1 className="text-2xl font-bold mb-4 text-white">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          className="bg-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          className="bg-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" type="submit">Login</Button>
      </form>
    </Card>
  );
}

function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!API_BASE) {
      setError('API endpoint is not configured.');
      return;
    }

    const rest = await fetch(`${API_BASE}/register`, {
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
    <Card className="w-full p-6 bg-[#676fgd] border-none mt-30 mb-30 color-white">
      <h1 className="text-2xl font-bold mb-4 text-white">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          className="bg-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          className="bg-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" type="submit">Register</Button>
      </form>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
      {/* <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavBar />
        </div>
      </header> */}
      <div className="pl-30 pt-35 max-w-5xl mx-auto text-center flex flex-row h-auto">
        <Card className="bg-[#424769] border-none rounded-l-lg rounded-r-none text-white shadow-2xl border border-gray-700 backdrop-blur-sm duration-300">
          <CardContent>
            <div>
              <div className="basis-50">
                <Tabs defaultValue="login" className="w-[400px]">
                  <TabsList className="bg-[#3d4254]">
                    <TabsTrigger className="bg-[#3d4254]" value="login">Login</TabsTrigger>
                    <TabsTrigger className="bg-[#3d4254]" value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="bg-[#676fgd]">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="register" className="bg-[#676fgd]">
                    <RegisterForm />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="basis-150 bg-contain bg-[url('/side-bg.jpg')] bg-no-repeat"></div>
      </div>
    </div>
  );
}