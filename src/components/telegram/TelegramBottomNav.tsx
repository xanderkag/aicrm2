'use client'

import React from 'react'
import { Users, ShoppingBag, MessageCircle, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TelegramBottomNavProps {
  activeTab: string
  onChange: (tab: string) => void
}

export const TelegramBottomNav: React.FC<TelegramBottomNavProps> = ({ activeTab, onChange }) => {
  const navItems = [
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass h-[65px] flex justify-around items-center z-50 px-2 pb-safe shadow-[0_-1px_0_0_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 transition-colors duration-200 min-w-[60px]",
            activeTab === item.id ? "text-accent" : "text-secondary-foreground"
          )}
        >
          <div className="relative">
            <item.icon size={26} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            {item.id === 'chats' && (
              <span className="absolute -top-1 -right-2 bg-accent text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full border-2 border-background">
                234
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
