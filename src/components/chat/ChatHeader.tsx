'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, Search, Bot, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  name: string
  status?: string
  avatar?: string
  avatarColor?: string
  clientId: string
  schema: string
  initialAIStatus?: boolean
  onNameUpdate?: (newName: string) => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  status = 'online',
  avatar,
  avatarColor = 'bg-accent',
  clientId,
  schema,
  initialAIStatus = true,
  onNameUpdate
}) => {
  const router = useRouter()
  const [isAIEnabled, setIsAIEnabled] = useState(initialAIStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [currentName, setCurrentName] = useState(name)

  useEffect(() => {
    setIsAIEnabled(initialAIStatus)
  }, [initialAIStatus])

  useEffect(() => {
    setCurrentName(name)
  }, [name])

  const toggleAI = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    
    const newStatus = !isAIEnabled
    try {
      const response = await fetch(`/api/clients/${clientId}?schema=${schema}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_ai_enabled: newStatus })
      })

      if (response.ok) {
        setIsAIEnabled(newStatus)
      } else {
        console.error('Failed to toggle AI status')
      }
    } catch (error) {
      console.error('Error toggling AI:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNameSubmit = async () => {
    if (!currentName.trim() || currentName === name) {
      setIsEditingName(false)
      setCurrentName(name)
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/clients/${clientId}?schema=${schema}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentName.trim() })
      })

      if (response.ok) {
        setIsEditingName(false)
        onNameUpdate?.(currentName.trim())
      }
    } catch (error) {
      console.error('Failed to update name:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-[64px] glass z-50 flex items-center justify-between px-2">
      <div className="flex items-center gap-1 shrink-0 overflow-hidden pr-4">
        <button 
          onClick={() => router.back()}
          className="p-2 text-accent hover:bg-white/5 rounded-full transition-colors active:scale-95 shrink-0"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
        
        <div className="flex flex-col ml-1 min-w-0">
           <div className="flex items-center gap-1.5 min-w-0">
              {isEditingName ? (
                <input
                  autoFocus
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  onBlur={handleNameSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                  className="bg-white/5 border border-accent/30 rounded px-1.5 py-0.5 text-[17px] font-black text-foreground focus:outline-none w-full"
                />
              ) : (
                <h3 
                  onClick={() => setIsEditingName(true)}
                  className="text-[17px] font-black text-foreground tracking-tight leading-tight truncate cursor-pointer hover:text-accent transition-colors"
                >
                  {name}
                </h3>
              )}
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
        <div className={cn(
          "flex items-center gap-2 mr-2 px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full transition-all",
          isUpdating && "opacity-50 grayscale pointer-events-none"
        )}>
           {isUpdating ? (
             <Loader2 size={16} className="text-accent animate-spin" />
           ) : (
             <Bot size={16} className={cn("transition-colors", isAIEnabled ? "text-accent" : "text-white/20")} />
           )}
           <button 
             onClick={toggleAI}
             disabled={isUpdating}
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
             {isAIEnabled ? 'AI ON' : 'AI OFF'}
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
