"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarExpanded")
    if (savedState !== null) {
      setExpanded(savedState === "true")
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", expanded.toString())
  }, [expanded])

  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  return <SidebarContext.Provider value={{ expanded, setExpanded, toggleSidebar }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
