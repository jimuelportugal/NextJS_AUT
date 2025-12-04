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

interface NavLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: boolean
}
    
export function NavBar(): React.JSX.Element {
  const pathname: string = usePathname()
  const isLoggedIn: boolean = !!getToken();
  const userIsAdmin: boolean = isAdmin();
  
  const NavLink = ({ href, children, className = "", prefetch }: NavLinkProps): React.JSX.Element => {
    const isActive: boolean = pathname === href
    const baseClasses: string = navigationMenuTriggerStyle() + ' px-3 py-2 rounded-lg'
    const activeClasses: string = isActive 
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

  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex-wrap justify-start p-0 -ml-4 mt-1">
        {isLoggedIn ? (
          <React.Fragment>
            <NavLink href="/dashboard" >Books</NavLink>
            <NavLink href="/profile" >Profile</NavLink>
            {userIsAdmin && (
              <NavLink href="/admin" >Admin Panel</NavLink>
            )}
          </React.Fragment>
        ) : (
          <NavLink href="/" >Home</NavLink>
        )}
        <NavLink href="/about" >About</NavLink>
        <NavLink href="/contact" prefetch={false} >Contact</NavLink> 
      </NavigationMenuList>
    </NavigationMenu>
  )
}