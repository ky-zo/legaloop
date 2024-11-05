'use client'

import { useFormStatus } from 'react-dom'

import { LoaderIcon } from '@/components/custom/icons'

import { Button } from '../ui/button'

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type={pending ? 'button' : 'submit'}
      aria-disabled={pending}
      disabled={pending}
      className="relative">
      {children}
      {pending && (
        <span className="absolute right-4 animate-spin">
          <LoaderIcon />
        </span>
      )}
      <span
        aria-live="polite"
        className="sr-only"
        role="status">
        {pending ? 'Loading' : 'Submit form'}
      </span>
    </Button>
  )
}