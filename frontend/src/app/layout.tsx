import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
const g=Geist({variable:"--font-geist-sans",subsets:["latin"]});
const m=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata: Metadata={title:"Reading App",description:"Interactive reading comprehension platform"};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return(<html lang="en"><body className={`${g.variable} ${m.variable} antialiased`}><AuthProvider>{children}</AuthProvider></body></html>);}
