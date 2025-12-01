'use client';
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { Search, ChevronDown, List, LayoutGrid } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface jwtPayload {
    sub: number;
    username: string;
    role: string;
    exp: number;
    iat: number;
}

// Mock data to fill the grid, mimicking MangaDex covers
const mockManga = [
    { title: "Berserk", cover: "https://mangadex.org/covers/801513ba-a712-498c-8f57-cae55b38cc92/81e1c82d-6672-400c-8c58-4ff9bfb89031.jpg" },
    { title: "", cover: "" }
];

function MangaCard({ title, cover }: { title: string, cover: string }) {
    return (
        <Card className="rounded-md border-none overflow-hidden bg-[#2d3250] hover:bg-[#3d4254] transition-colors cursor-pointer w-full shadow-none">
            <CardContent className="p-0">
                <div className="w-full h-auto aspect-[150/210]">
                    <img src={cover} alt={title} className="w-full h-full object-cover" />
                </div>
                <div className="pt-2 pb-1 px-1 text-sm leading-tight">
                    <p className="text-gray-200 font-medium truncate">{title}</p>
                    <p className="text-xs text-gray-400">Chapter 1</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardHome() {
    const token = getToken();
    let username = 'Guest';

    if (token) {
        try {
            const decode = jwtDecode<jwtPayload>(token);

            if (decode.username) {
                username = decode.username;
            }
        } catch (e) {
            console.error("Token decoding failed", e);
        }
    }

    // Hide the previous dashboard info and show the manga layout
    return (
        <div className="space-y-6">   
            {/* Manga Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 pt-4">
                {mockManga.map((manga, index) => (
                    <MangaCard key={index} title={manga.title} cover={manga.cover} />
                ))}
            </div>

            {/* Optional: Restore the user info below the main content if required */}
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