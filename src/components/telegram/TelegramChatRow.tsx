'use client'

import React from 'react'
import { MessageSquare, Clock, Plus, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Tag {
  label: string
  color?: string
}

interface TelegramChatRowProps {
  id: string
  avatar: string
  name: string
  message: string
  time: string
  unreadCount?: number
  avatarColor?: string
  messenger?: 'tg' | 'ig' | 'web'
  tags?: Tag[]
  status?: 'online' | 'offline'
  notes?: string
  onAddTag?: (e: React.MouseEvent) => void
}

const MessengerIcon = ({ source }: { source?: string }) => {
  if (source === 'tg') return (
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#3390ec] rounded-full border-2 border-[#111111] flex items-center justify-center shadow-lg">
       <span className="text-[9px] font-black text-white">TG</span>
    </div>
  )
  if (source === 'ig') return (
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full border-2 border-[#111111] flex items-center justify-center shadow-lg">
       <span className="text-[9px] font-black text-white">IG</span>
    </div>
  )
  return (
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-500 rounded-full border-2 border-[#111111] flex items-center justify-center shadow-lg">
       <span className="text-[9px] font-black text-white">W</span>
    </div>
  )
}

export const TelegramChatRow: React.FC<TelegramChatRowProps> = ({
  id,
  avatar,
  name,
  message,
  time,
  unreadCount,
  avatarColor = 'bg-accent',
  messenger = 'tg',
  tags = [],
  status,
  notes,
  onAddTag
}) => {
  return (
    <div className="px-4 py-2 flex justify-center">
      <div className="premium-card flex flex-col p-4 relative overflow-hidden group w-full max-w-2xl bg-[#121212] border-white/5 hover:bg-white/[0.03]">
        {/* Tags at top right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
           {tags.map((tag, idx) => (
             <span 
               key={idx} 
               className={cn(
                 "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest leading-none",
                 tag.color || "bg-secondary-foreground/20 text-secondary-foreground"
               )}
             >
               {tag.label}
             </span>
           ))}
        </div>

        <div className="flex gap-4 items-center">
          {/* Avatar with Messenger Icon */}
          <div className="relative shrink-0">
            <div className={cn(
              "w-[60px] h-[60px] rounded-full flex items-center justify-center text-white font-black text-2xl uppercase transition-transform duration-300 group-hover:scale-105 shadow-xl",
              avatarColor
            )}>
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{name.charAt(0)}</span>
              )}
            </div>
            <MessengerIcon source={messenger} />
            {status === 'online' && (
              <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#111111] shadow-glow-emerald animate-pulse" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col min-w-0 pr-20">
            <h3 className="font-black text-[18px] text-foreground tracking-tight group-hover:text-accent transition-colors leading-tight mb-2">
              {name}
            </h3>
            
            <div className="flex items-center gap-2 text-secondary-foreground overflow-hidden">
               <div className="flex items-center gap-1.5 shrink-0 bg-white/5 px-2 py-0.5 rounded-md">
                  <MessageSquare size={12} className={cn(unreadCount ? "text-accent" : "opacity-30")} />
                  <span className={cn("text-[11px] font-bold uppercase tracking-wider", unreadCount && "text-foreground")}>
                    {unreadCount ? `${unreadCount} unread` : 'Clear'}
                  </span>
               </div>
               <span className="opacity-20 text-[10px]">|</span>
               <div className="flex items-center gap-1.5 truncate">
                  <Clock size={12} className="opacity-30" />
                  <span className="text-[11px] font-medium opacity-60 truncate uppercase tracking-wider">{time}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Notes (Small Info Display) */}
        {notes && (
          <div className="mt-3 px-3 py-2 bg-accent/5 rounded-xl flex items-start gap-2 border border-accent/10">
             <StickyNote size={14} className="text-accent mt-0.5 shrink-0" />
             <p className="text-[12px] font-bold text-accent/80 italic leading-snug">{notes}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.03]">
           <p className="text-[14px] text-secondary-foreground/60 truncate font-medium max-w-[85%] group-hover:text-foreground/80 transition-colors">
             {message}
           </p>
           <button 
             onClick={onAddTag}
             className="p-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all hover:scale-110 active:scale-90 z-10"
           >
              <Plus size={18} strokeWidth={3} />
           </button>
        </div>
      </div>
    </div>
  )
}
