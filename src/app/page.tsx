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
// hover:scale-[1.02]
// hover:shadow-indigo-500/30
export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
      <header className="sticky top-0 z-50 w-full">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavBar />
        </div>
      </header>
      <div className="pl-25 pt-20 max-w-5xl mx-auto text-center flex flex-row h-auto">
        <Card className="bg-[#424769] border-none rounded-l-lg rounded-r-none text-white shadow-2xl border border-gray-700 backdrop-blur-sm duration-300">
          <CardContent>
            <div>
              <div className="basis-50">
                <Tabs defaultValue="account" className="w-[400px]">
                  <TabsList className="bg-[#3d4254]">
                    <TabsTrigger className="bg-[#3d4254]" value="login">Login</TabsTrigger>
                    <TabsTrigger className="bg-[#3d4254]" value="register">Register</TabsTrigger>
                  </TabsList>
                  {/* LOGIN FORM */}
                  <TabsContent value="login" className="bg-[#676fgd]">
                    <Card className="w-full p-6 bg-[#676fgd] border-none mt-30 mb-30 color-white">
                      <h1 className="text-2xl font-bold mb-4 text-white">Login</h1>
                      <Input className="bg-white" placeholder="Username"/>
                      <Input className="bg-white" type="password" placeholder="Password"/>
                      <Button className="w-full" type="submit">Login</Button>
                    </Card>
                  </TabsContent>
                  {/* REGISTER FORM */}
                  <TabsContent value="register">
                    <Card className="w-full p-6 bg-[#676fgd] border-none mt-30 mb-30 color-white">
                      <h1 className="text-2xl font-bold mb-4 text-white">Register</h1>
                      <Input className="bg-white" placeholder="Username"/>
                      <Input className="bg-white" type="password" placeholder="Password"/>
                      <Button className="w-full" type="submit">Register</Button>
                    </Card>
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
