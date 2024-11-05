import Form from 'next/form'

import { signOutAction } from '@/actions/auth'

export const SignOutForm = () => {
  return (
    <Form
      className="w-full"
      action={async () => {
        'use server'

        await signOutAction({
          redirectTo: '/',
        })
      }}>
      <button
        type="submit"
        className="w-full px-1 py-0.5 text-left text-red-500">
        Sign out
      </button>
    </Form>
  )
}