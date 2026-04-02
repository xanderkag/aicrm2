'use client'

import React from 'react'
import { MessageCircle, ShoppingBag, Users, Settings, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TelegramFloatingNavProps {
  activeTab: string
  onChange: (tab: string) => void
}

export const TelegramFloatingNav: React.FC<TelegramFloatingNavProps> = ({ activeTab, onChange }) => {
  const navItems = [
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-center gap-3 px-4">
      {/* Floating Pill Menu */}
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass rounded-[32px] h-[64px] flex items-center px-1.5 py-1 shadow-2xl border border-white/10"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[72px] h-[52px] rounded-2xl transition-all duration-300 relative group",
              activeTab === item.id ? "bg-white/10 text-accent" : "text-secondary-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
               "transition-transform duration-300",
               activeTab === item.id ? "scale-110" : "group-hover:scale-105"
            )}>
              <item.icon 
                size={22} 
                strokeWidth={activeTab === item.id ? 2.5 : 2} 
                className={cn("transition-colors", activeTab === item.id ? "text-accent" : "text-secondary-foreground")}
              />
            </div>
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-tight transition-opacity duration-300",
              activeTab === item.id ? "opacity-100" : "opacity-60"
            )}>
              {item.label}
            </span>
            {item.id === 'chats' && (
              <span className="absolute -top-1 -right-1 bg-accent text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full border-2 border-[#050505] shadow-lg">
                234
              </span>
            )}
          </button>
        ))}
      </motion.nav>

      {/* Floating Circular Search Button */}
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="w-[64px] h-[64px] rounded-full glass border border-white/10 flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-white/5 group"
      >
        <Search size={26} className="text-secondary-foreground group-hover:text-foreground transition-colors" />
      </motion.button>
    </div>
  )
}
