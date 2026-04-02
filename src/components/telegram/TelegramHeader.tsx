'use client'

import React from 'react'
import { ChevronDown, Send, Camera, MessageCircle, MoreHorizontal, Globe, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession, signOut } from 'next-auth/react'

import { ProjectSelector } from './ProjectSelector'

export type MessengerSource = 'all' | 'tg' | 'ig' | 'wa'

interface TelegramHeaderProps {
  selectedSource: MessengerSource
  onSourceChange: (source: MessengerSource) => void
}

const SOURCES = [
  { id: 'all' as const, label: 'All', icon: Globe, color: 'text-white' },
  { id: 'tg' as const, label: 'Telegram', icon: Send, color: 'text-[#3390ec]' },
  { id: 'ig' as const, label: 'Instagram', icon: Camera, color: 'text-[#e1306c]' },
  { id: 'wa' as const, label: 'WhatsApp', icon: MessageCircle, color: 'text-[#25d366]' },
]

export const TelegramHeader: React.FC<TelegramHeaderProps> = ({
  selectedSource,
  onSourceChange
}) => {
  const { data: session } = useSession()
  const user = session?.user

  // Get initials from name
  const getInitials = (name?: string | null) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="flex flex-col gap-4 px-6 pt-6 sticky top-0 bg-background/80 backdrop-blur-xl z-50 border-b border-white/[0.03] pb-4">
      {/* Search and Project Selector */}
      <div className="flex items-center justify-between">
        <ProjectSelector />
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-white/20 hover:text-red-500 transition-colors flex items-center gap-2 group"
            title="Sign Out"
          >
             <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
               <p className="text-[12px] font-bold text-white leading-none mb-0.5">{user?.name}</p>
               <p className="text-[10px] text-white/30 font-medium leading-none">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-black text-[12px] uppercase shadow-lg border border-white/10 overflow-hidden ring-2 ring-white/5">
               {user?.image ? (
                 <img src={user.image} alt="User" className="w-full h-full object-cover" />
               ) : (
                 getInitials(user?.name)
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Messenger Source Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {SOURCES.map((source) => {
          const isActive = selectedSource === source.id
          const Icon = source.icon
          
          return (
            <button
              key={source.id}
              onClick={() => onSourceChange(source.id)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-300 border shrink-0",
                isActive 
                  ? "bg-white/10 border-white/10 shadow-lg scale-105" 
                  : "bg-transparent border-transparent text-secondary-foreground hover:bg-white/[0.03]"
              )}
            >
              <Icon size={18} className={cn(isActive ? source.color : "opacity-40")} />
              <span className={cn(
                "text-[13px] font-black uppercase tracking-widest",
                isActive ? "text-foreground" : "text-secondary-foreground"
              )}>
                {source.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}
