'use client'

import React from 'react'
import { MessageCircle, ShoppingBag, Users, Settings, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface TelegramFloatingNavProps {
  activeTab: string
  onChange: (tab: string) => void
  unreadCount?: number
}

export const TelegramFloatingNav: React.FC<TelegramFloatingNavProps> = ({ activeTab, onChange, unreadCount = 0 }) => {
  const navItems = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', count: unreadCount },
    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    { id: 'clients', icon: Users, label: 'Clients' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-8 px-4 pointer-events-none">
      {/* Dimming/Shadow Backdrop - Provides depth and readability */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative glass rounded-[32px] h-[72px] w-full max-w-[440px] flex items-center justify-between px-2 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-3xl pointer-events-auto"
      >
        <div className="flex items-center flex-1 justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 min-w-[64px] h-[56px] rounded-2xl transition-all duration-500 relative group",
                )}
              >
                {/* Active Indicator Background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg"
                      className="absolute inset-0 bg-white/[0.08] rounded-2xl z-0"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </AnimatePresence>

                <div className={cn(
                   "relative z-10 transition-all duration-500",
                   isActive ? "scale-110 -translate-y-0.5" : "group-hover:scale-105"
                )}>
                  {/* Glow effect for active icon */}
                  {isActive && (
                    <div className="absolute inset-0 bg-accent/40 blur-md rounded-full -z-10" />
                  )}
                  <item.icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={cn(
                      "transition-colors duration-500", 
                      isActive ? "text-accent" : "text-white/40 group-hover:text-white/60"
                    )}
                  />
                </div>

                <span className={cn(
                  "relative z-10 text-[9px] uppercase font-black tracking-[0.1em] transition-all duration-500",
                  isActive ? "text-accent opacity-100" : "text-white/20 opacity-60 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>

                {/* Real-time Counter */}
                {item.count && item.count > 0 ? (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-2 bg-accent text-[8px] text-white font-black px-1.5 py-0.5 rounded-full border-2 border-[#050505] shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)] z-20"
                  >
                    {item.count > 99 ? '99+' : item.count}
                  </motion.span>
                ) : null}
              </button>
            )
          })}
        </div>

        {/* Separator */}
        <div className="w-[1px] h-8 bg-white/5 mx-2" />

        {/* Integrated Search Button */}
        <button
          className="w-14 h-14 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center transition-all group active:scale-95 pointer-events-auto"
        >
          <Search size={20} className="text-white/30 group-hover:text-white group-hover:rotate-12 transition-all duration-500" />
        </button>
      </motion.nav>
    </div>
  )
}
