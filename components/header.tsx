'use client'

import React from 'react'
import Link from 'next/link'

import { User } from '@supabase/supabase-js'

import { cn } from '@/lib/utils/index'

import { useSidebar } from '@/components/ui/sidebar'

// import { Button } from './ui/button' // No longer needed directly here for Sign In button
import GuestMenu from './guest-menu'; // Import the new GuestMenu component
import UserMenu from './user-menu'

interface HeaderProps {
  user: User | null
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { open } = useSidebar()
  return (
    <header
      className={cn(
        'absolute top-0 right-0 p-2 flex justify-between items-center z-10 backdrop-blur lg:backdrop-blur-none bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
        open ? 'md:w-[calc(100%-var(--sidebar-width))]' : 'md:w-full',
        'w-full'
      )}
    >
      {/* Product link */}
      <div className="flex items-center">
        <Link 
          href="https://morphic-gq15t1869-sevaroys-projects.vercel.app/" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted/50"
        >
          產品展示
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {user ? <UserMenu user={user} /> : <GuestMenu />}
      </div>
    </header>
  )
}

export default Header
