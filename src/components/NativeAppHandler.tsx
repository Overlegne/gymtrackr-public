"use client"

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
    // Ensure we are in a browser environment and on a native platform
    if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) return

    const initCapacitor = async () => {
      try {
        const { App } = await import('@capacitor/app')
        
        const handleBackButton = async () => {
          // 1. Check for open overlays (Dialogs, Menus, Drawers)
          const overlays = document.querySelectorAll('[role="dialog"], [role="menu"], [role="listbox"], [data-radix-portal]')
          
          if (overlays.length > 0) {
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
            router.back()
          }
        }

        const listener = await App.addListener('backButton', () => {
          handleBackButton()
        })

        return () => {
          listener.remove()
        }
      } catch (err) {
        console.error('Failed to initialize Capacitor App listener:', err)
      }
    }

    const cleanupPromise = initCapacitor()

    return () => {
      cleanupPromise.then(cleanup => cleanup?.())
    }
  }, [router, toast])

  return null
}
