'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { Laptop, Moon, Sun } from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function ThemeMenuItems() {
  const { setTheme } = useTheme()
  const t = useTranslations('theme')

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <Sun className="mr-2 h-4 w-4" />
        <span>{t('light')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <Moon className="mr-2 h-4 w-4" />
        <span>{t('dark')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <Laptop className="mr-2 h-4 w-4" />
        <span>{t('system')}</span>
      </DropdownMenuItem>
    </>
  )
}
