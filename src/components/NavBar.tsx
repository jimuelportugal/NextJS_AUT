"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { getToken, isAdmin } from "@/lib/auth"

function NavLink({ href, children, className = "", prefetch }) {
    const pathname = usePathname()
    const isActive = pathname === href
    const baseClasses = navigationMenuTriggerStyle() + ' px-3 py-2 rounded-lg'
    const activeClasses = isActive 
      ? "border-b-3 border-[#676fgd] pb-[5px] hover:bg-transparent hover:text-white bg-transparent text-xl text-[#E1AA4C]"
      : "hover:border-b-1 hover:border-[#676fgd] pb-[5px] bg-transparent hover:text-white text-white hover:bg-transparent"
    return (
      <NavigationMenuItem>
        <NavigationMenuLink
          asChild
          className={`${baseClasses} ${activeClasses} ${className}`}
        >
          <Link href={href} prefetch={href === "/contact" ? false : undefined}>{children}</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }
  
export function NavBar() {
  const isLoggedIn = !!getToken();
  const userIsAdmin = isAdmin();
  
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex-wrap justify-start p-0 -ml-4 mt-1">
        {isLoggedIn ? (
          <>
            <NavLink href="/dashboard" >Books</NavLink>
            <NavLink href="/profile" >Profile</NavLink>
            {userIsAdmin && (
              <NavLink href="/admin" >Admin Panel</NavLink>
            )}
          </>
        ) : (
          <NavLink href="/" >Home</NavLink>
        )}
        <NavLink href="/about" >About</NavLink>
        <NavLink href="/contact" prefetch={false} >Contact</NavLink> 
      </NavigationMenuList>
    </NavigationMenu>
  )
}