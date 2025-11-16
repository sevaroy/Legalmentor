'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'

import { clearChats } from '@/lib/actions/chat'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { Spinner } from './ui/spinner'

type ClearHistoryProps = {
  empty: boolean
}

export function ClearHistory({ empty }: ClearHistoryProps) {
  const t = useTranslations('clearHistory')
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={empty}>
          {t('button')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={event => {
              event.preventDefault()
              startTransition(async () => {
                const result = await clearChats()
                if (result?.error) {
                  toast.error(result.error)
                } else {
                  toast.success(t('success'))
                }
                setOpen(false)
              })
            }}
          >
            {isPending ? <Spinner /> : t('clear')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
