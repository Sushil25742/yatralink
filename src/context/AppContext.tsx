"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type CrowdLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL"

export interface JourneyStop {
  id: string
  time: string
  title: string
  duration: string
  price?: string
  crowd: CrowdLevel
  category: "heritage" | "experience"
}

export interface Booking {
  id: string
  title: string
  date: string
  time: string
  status: "Confirmed" | "Pending"
  imageUrl: string
}

export interface ImpactStats {
  localSpend: number
  businessesSupported: number
  placesAvoided: number
  culturalExperiences: number
}

interface AppState {
  crowdPatanDurbar: CrowdLevel
  journeyStops: JourneyStop[]
  bookings: Booking[]
  heritagePoints: number
  impact: ImpactStats
  hasGeneratedJourney: boolean
}

const DEFAULT_STATE: AppState = {
  crowdPatanDurbar: "MODERATE", // Initial state for demo
  hasGeneratedJourney: false,
  journeyStops: [],
  bookings: [],
  heritagePoints: 650,
  impact: {
    localSpend: 3850,
    businessesSupported: 4,
    placesAvoided: 2,
    culturalExperiences: 3
  }
}

interface AppContextType {
  state: AppState
  setCrowdStatus: (level: CrowdLevel) => void
  generateJourney: () => void
  updateJourneyToAlternative: () => void
  bookExperience: (experience: { title: string, price?: number, imageUrl: string }) => void
  resetDemo: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("yatralink_demo_state")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTimeout(() => setState(parsed), 0)
      } catch (e) {
        console.error("Failed to parse state", e)
      }
    }
    setIsInitialized(true)

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "yatralink_demo_state" && e.newValue) {
        setState(JSON.parse(e.newValue))
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Save to local storage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("yatralink_demo_state", JSON.stringify(state))
    }
  }, [state, isInitialized])

  // Actions
  const setCrowdStatus = (level: CrowdLevel) => {
    setState(s => ({ ...s, crowdPatanDurbar: level }))
  }

  const generateJourney = () => {
    // Generate the initial demo journey
    setState(s => ({
      ...s,
      hasGeneratedJourney: true,
      journeyStops: [
        {
          id: "1",
          time: "10:00 AM",
          title: "Traditional Woodcarving Workshop",
          duration: "45 min",
          price: "NPR 800",
          crowd: "LOW",
          category: "experience"
        },
        {
          id: "2",
          time: "11:15 AM",
          title: "Golden Temple",
          duration: "30 min",
          crowd: "MODERATE",
          category: "heritage"
        },
        {
          id: "3",
          time: "12:15 PM",
          title: "Newari Lunch Experience",
          duration: "60 min",
          price: "NPR 900",
          crowd: "LOW",
          category: "experience"
        },
        {
          id: "4",
          time: "1:30 PM",
          title: "Patan Durbar Square",
          duration: "60 min",
          crowd: s.crowdPatanDurbar, // Ties to live status
          category: "heritage"
        }
      ]
    }))
  }

  const updateJourneyToAlternative = () => {
    // Swaps out Patan Durbar Square for Mangal Bazaar earlier, shifts things around
    setState(s => {
      const newStops = s.journeyStops.filter(stop => stop.title !== "Patan Durbar Square")
      // Let's just remove Durbar Square and add an alternative
      newStops.push({
        id: "5",
        time: "1:30 PM",
        title: "Mangal Bazaar Exploration",
        duration: "45 min",
        crowd: "LOW",
        category: "heritage"
      })
      
      return {
        ...s,
        journeyStops: newStops.sort((a, b) => a.time.localeCompare(b.time)), // simple sort
        impact: {
          ...s.impact,
          placesAvoided: s.impact.placesAvoided + 1
        }
      }
    })
  }

  const bookExperience = (experience: { title: string, price?: number, imageUrl: string }) => {
    setState(s => ({
      ...s,
      heritagePoints: s.heritagePoints + 100,
      impact: {
        ...s.impact,
        localSpend: s.impact.localSpend + (experience.price || 800),
        businessesSupported: s.impact.businessesSupported + 1,
        culturalExperiences: s.impact.culturalExperiences + 1
      },
      bookings: [
        {
          id: `YL${Math.floor(10000 + Math.random() * 90000)}`,
          title: experience.title || "Local Experience",
          date: "Today",
          time: "Flexible",
          status: "Confirmed",
          imageUrl: experience.imageUrl || "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400"
        },
        ...s.bookings
      ]
    }))
  }

  const resetDemo = () => {
    setState(DEFAULT_STATE)
  }

  return (
    <AppContext.Provider value={{
      state,
      setCrowdStatus,
      generateJourney,
      updateJourneyToAlternative,
      bookExperience,
      resetDemo
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
