import * as React from "react"
import { Mail, Facebook, Github } from "lucide-react"
import { NavBar } from "@/components/NavBar"

export default function ContactPage() {

    const contactMethods = [
        {
            title: "Email",
            icon: Mail,
            description: "Send me a direct email.",
            details: "anonymous0358798@gmail.com",
            href: "mailto:anonymous0358798@gmail.com",
        },
        {
            title: "Facebook",
            icon: Facebook,
            description: "Connect on Facebook.",
            details: "Jimuel L. Portugal",
            href: "https://www.facebook.com/PortugalJimuel.L",
        },
        {
            title: "GitHub",
            icon: Github,
            description: "Check out my projects.",
            details: "JIMUEL L. PORTUGAL",
            href: "https://github.com/jimuelportugal",
        },
    ];

    return (
        <div className="min-h-screen font-sans bg-[#2d3250] dark:bg-black">
            <header className="sticky top-0 z-50 w-full">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <NavBar />
                </div>
            </header>

            <div
                className="relative w-full overflow-hidden"
                style={{
                    paddingBottom: '12rem',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start justify-between">
                    <div className="flex-1 max-w-lg z-10 text-white pt-20 pb-16">
                        <h1 className="text-6xl font-extrabold leading-tight" style={{ color: '#ffffff' }}>
                            Drop me a message here
                        </h1>
                        <p className="text-2xl mt-4 font-light" style={{ color: '#c8ebe3' }}>
                            Got a question or want to collaborate? Let's chat.
                        </p>
                    </div>

                    <div className="w-full md:w-80 h-64 mt-10 md:mt-0 flex items-center justify-center text-black font-bold text-center opacity-90">
                        <img src="ME.jpg" alt="ME" className="rounded-b-lg" />
                    </div>
                </div>

            </div>
            <div className="absolute bottom-0 left-0 w-full h-80 bg-[#242840]"></div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-36 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contactMethods.map((method) => (
                        <a
                            key={method.title}
                            href={method.href}
                            target={method.href.startsWith("http") ? "_blank" : undefined}
                            rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="block p-8 bg-[#6c6f84] rounded-xl shadow-lg transition-transform transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <method.icon className="w-10 h-10 text-[#eaeaed]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0d0f18] text-center mb-2">{method.title}</h2>
                            <p className="text-[#0d0f18] text-center mb-4">{method.description}</p>
                            <p className="text-lg font-semibold text-[#0d0f18] text-center break-words">{method.details}</p>
                        </a>
                    ))}
                </div>
            </main>

        </div>
    );
}