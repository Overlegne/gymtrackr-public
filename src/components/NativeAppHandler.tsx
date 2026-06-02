
"use client"

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { useToast } from '@/hooks/use-toast'

/**
 * @fileOverview Handles native mobile platform specific behaviors like the Android hardware back button.
 */
export function NativeAppHandler() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const lastBackPress = useRef<number>(0)
  const pathnameRef = useRef(pathname)

  // Keep ref updated to avoid re-registering the listener unnecessarily
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const handleBackButton = async () => {
      // 1. Check for open overlays (Dialogs, Menus, Drawers)
      // Radix UI components (used by Shadcn) typically use [role="dialog"] and Portals
      const overlays = document.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"], [data-radix-portal]')
      
      if (overlays.length > 0) {
        // Most accessible overlays close on Escape. Simulate it.
        window.dispatchEvent(new KeyboardEvent('keydown', { 
          key: 'Escape', 
          code: 'Escape', 
          bubbles: true, 
          cancelable: true 
        }))
        return
      }

      // 2. Navigation logic
      const currentPath = pathnameRef.current

      if (currentPath === '/') {
        // We are at the root, implement "Double Tap to Exit"
        const now = Date.now()
        if (now - lastBackPress.current < 2000) {
          App.exitApp()
        } else {
          lastBackPress.current = now
          toast({
            description: "Press back again to exit Gymtrackr",
            duration: 2000,
          })
        }
      } else {
        // We are on a sub-page, navigate back in the app history
        router.back()
      }
    }

    // Register the Capacitor back button listener
    const listenerPromise = App.addListener('backButton', () => {
      handleBackButton()
    })

    return () => {
      listenerPromise.then(l => l.remove())
    }
  }, [router, toast])

  return null
}
