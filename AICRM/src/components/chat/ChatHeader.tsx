'use client'

import React, { useState } from 'react'
import { ChevronLeft, Search, Bot } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  name: string
  status?: string
  avatar?: string
  avatarColor?: string
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  status = 'online',
  avatar,
  avatarColor = 'bg-accent'
}) => {
  const router = useRouter()
  const [isAIEnabled, setIsAIEnabled] = useState(true)

  return (
    <header className="fixed top-0 left-0 right-0 h-[64px] glass z-50 flex items-center justify-between px-2">
      <div className="flex items-center gap-1 shrink-0">
        <button 
          onClick={() => router.back()}
          className="p-2 text-accent hover:bg-white/5 rounded-full transition-colors active:scale-95"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        
        <div className="flex flex-col ml-1 cursor-pointer hover:opacity-80 transition-opacity">
           <div className="flex items-center gap-1.5">
              <h3 className="text-[17px] font-black text-foreground tracking-tight leading-tight">{name}</h3>
           </div>
           <span className={cn(
             "text-[13px] font-medium leading-tight",
             status === 'online' ? "text-accent" : "text-white/40"
           )}>
             {status === 'online' ? 'online' : status}
           </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* AI Toggle */}
        <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full">
           <Bot size={16} className={cn("transition-colors", isAIEnabled ? "text-accent" : "text-white/20")} />
           <button 
             onClick={() => setIsAIEnabled(!isAIEnabled)}
             className={cn(
               "w-8 h-4.5 rounded-full transition-all relative overflow-hidden",
               isAIEnabled ? "bg-accent" : "bg-white/10"
             )}
           >
              <div className={cn(
                "absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm",
                isAIEnabled ? "left-4" : "left-0.5"
              )} />
           </button>
           <span className={cn(
             "text-[11px] font-black uppercase tracking-widest",
             isAIEnabled ? "text-accent" : "text-white/20"
           )}>
             AI
           </span>
        </div>

        <button className="p-2.5 text-white/40 hover:text-white transition-colors">
           <Search size={22} />
        </button>
        
        <div className="relative ml-1 pr-2">
           <div className={cn(
             "w-[42px] h-[42px] rounded-full flex items-center justify-center text-white font-black text-[13px] uppercase shadow-lg border border-white/10",
             avatarColor
           )}>
             {avatar ? (
               <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
             ) : (
               <span>{name.charAt(0)}</span>
             )}
           </div>
        </div>
      </div>
    </header>
  )
}
