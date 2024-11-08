'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'

import { PlusIcon, VercelIcon } from '@/components/custom/icons'
import { SidebarHistory } from '@/components/custom/sidebar-history'
import { SidebarUserNav } from '@/components/custom/sidebar-user-nav'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, useSidebar } from '@/components/ui/sidebar'
import { BetterTooltip } from '@/components/ui/tooltip'

export function AppSidebar({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpenMobile(false)}
              className="flex flex-row items-center gap-3">
              <span className="px-2 text-lg font-semibold">Chatbot</span>
            </Link>
            <BetterTooltip
              content="New Chat"
              align="start">
              <Button
                variant="ghost"
                className="h-fit p-2"
                asChild>
                <Link
                  href="/"
                  onClick={() => setOpenMobile(false)}>
                  <PlusIcon />
                </Link>
              </Button>
            </BetterTooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHistory user={user} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-0">
        {user && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarUserNav user={user} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
