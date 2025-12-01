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
    { title: "IDOL x IDOL STORY!", cover: "https://via.placeholder.com/150x210/ff4d4d/ffffff?text=Manga+1" },
    { title: "Shitai Kanjou no Negima", cover: "https://via.placeholder.com/150x210/2d3250/ffffff?text=Manga+2" },
    { title: "Aku no Hadou o Ikikomashou", cover: "https://via.placeholder.com/150x210/424769/ffffff?text=Manga+3" },
    { title: "Ookami to Koushinryou: Spring Log", cover: "https://via.placeholder.com/150x210/ff4d4d/ffffff?text=Manga+4" },
    { title: "Hichou no Shini Sonia", cover: "https://via.placeholder.com/150x210/2d3250/ffffff?text=Manga+5" },
    { title: "Konohana Kitan", cover: "https://via.placeholder.com/150x210/424769/ffffff?text=Manga+6" },
    { title: "Love Bullet", cover: "https://via.placeholder.com/150x210/ff4d4d/ffffff?text=Manga+7" },
    { title: "Black Clover", cover: "https://via.placeholder.com/150x210/2d3250/ffffff?text=Manga+8" },
    { title: "Filming In Love With My Evil...", cover: "https://via.placeholder.com/150x210/424769/ffffff?text=Manga+9" },
    { title: "Gefu und Prinzen Reborn no Musha", cover: "https://via.placeholder.com/150x210/ff4d4d/ffffff?text=Manga+10" },
    { title: "Hana Monogatari", cover: "https://via.placeholder.com/150x210/2d3250/ffffff?text=Manga+11" },
    { title: "Ryuune Hanashi", cover: "https://via.placeholder.com/150x210/424769/ffffff?text=Manga+12" },
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
            
            {/* Header: Back arrow and Recommended title */}
            <div className="flex items-center space-x-2 pb-4 border-b border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left h-6 w-6 text-gray-400 cursor-pointer"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                <h2 className="text-xl font-bold text-gray-200">Recommended</h2>
            </div>
            
            {/* Sort/Filter Bar */}
            <div className="flex justify-between items-center">
                {/* Sort By Section */}
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span className="font-semibold">Sort by</span>
                    <div className="flex items-center px-2 py-1 bg-[#202125] rounded-md cursor-pointer border border-gray-700 hover:border-red-500 transition-colors">
                        <span>None</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                    </div>
                </div>
                
                {/* View Mode Buttons */}
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon-sm" className="bg-[#424769] hover:bg-[#3d4254] text-gray-200">
                        <List className="h-4 w-4" />
                    </Button>
                    <Button variant="default" size="icon-sm" className="bg-red-600 hover:bg-red-700 text-white">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

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