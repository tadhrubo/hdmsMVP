'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { UserRole } from '@/lib/types/database'

interface AuthContextType {
  currentRole: UserRole
  setCurrentRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType>({
  currentRole: 'Owner',
  setCurrentRole: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('Owner')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hdms_demo_role') as UserRole | null
      if (saved === 'Owner' || saved === 'Employee') {
        setCurrentRoleState(saved)
      }
    } catch {
      // Storage access blocked in restricted iframes
    }
  }, [])

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role)
    try {
      localStorage.setItem('hdms_demo_role', role)
    } catch {
      // Storage access blocked in restricted iframes
    }
  }

  return (
    <AuthContext.Provider value={{ currentRole, setCurrentRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
