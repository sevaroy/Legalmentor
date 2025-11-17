'use client'

import React from 'react'

import { User } from '@supabase/supabase-js'

import { cn } from '@/lib/utils/index'

import { useSidebar } from '@/components/ui/sidebar'

import GuestMenu from './guest-menu'
import UserMenu from './user-menu'

interface HeaderProps {
  user: User | null
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { open } = useSidebar()
  return (
    <header
      className={cn(
        'absolute top-0 right-0 flex justify-end items-center z-10 transition-[width] duration-200 ease-linear',
        'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'px-4 py-3 md:px-6',
        open ? 'md:w-[calc(100%-var(--sidebar-width))]' : 'md:w-full',
        'w-full'
      )}
    >
      <div className="flex items-center gap-3">
        {user ? <UserMenu user={user} /> : <GuestMenu />}
      </div>
    </header>
  )
}

export default Header
