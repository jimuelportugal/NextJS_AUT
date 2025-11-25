import * as React from "react"
import "tailwindcss";
import { NavBar } from "@/components/NavBar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
      <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavBar />
        </div>
      </header>
      <div className="pl-25 pt-80 max-w-7xl mx-auto text-center">
        <Card className="bg-[#424769] border-none text-white shadow-2xl hover:shadow-indigo-500/30 hover:scale-[1.02] border border-gray-700 backdrop-blur-sm rounded-xl duration-300">
          <CardContent>
            <div className="flex flex-row">
              <div className="basis-50">
                <Tabs defaultValue="account" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="account">Login</TabsTrigger>
                    <TabsTrigger value="password">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="bg-[#424769]">
                      <Card className="w-full p-6 bg-[#424769] border-none">
                        <h1 className="text-xl font-bold mb-4 text-white">Login</h1>
                          <Input placeholder="Username" className="bg-[#676fgd]"/>
                          <Input type="password" placeholder="Password"/>
                          <Button className="w-full" type="submit">Login</Button>
                      </Card>
                  </TabsContent>
                  <TabsContent value="account">

                  </TabsContent>
                </Tabs>
              </div>
              <div className="basis-300" style={{ backgroundImage: `url('/side-bg.jpg')` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
