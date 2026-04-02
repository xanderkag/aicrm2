'use client'

import React, { useRef } from 'react'
import { Check, CheckCheck, Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SenderType = 'ai' | 'admin' | 'user'

interface ChatMessageBubbleProps {
  message: string
  time: string
  isSent?: boolean
  isRead?: boolean
  onAction?: (rect: DOMRect) => void
  senderType?: SenderType
  senderName?: string
}

const isOnlyEmojis = (str: string) => {
  const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
  const emojis = str.match(emojiRegex)
  if (!emojis) return false
  return emojis.join('') === str.trim() && emojis.length <= 3
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  time,
  isSent,
  isRead,
  onAction,
  senderType = 'user',
  senderName
}) => {
  const isBigEmoji = isOnlyEmojis(message)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (bubbleRef.current && onAction) {
      onAction(bubbleRef.current.getBoundingClientRect())
    }
  }

  return (
    <div className={cn(
      "flex w-full mb-3 px-2 group",
      isSent ? "justify-end" : "justify-start"
    )}>
      <div 
        ref={bubbleRef}
        onClick={handleAction}
        className="relative max-w-[85%] cursor-pointer select-none active:scale-[0.98] transition-transform duration-200"
      >
        {/* Sender Name / Label */}
        {isSent && senderName && !isBigEmoji && (
          <div className="flex items-center gap-1.5 mb-1 px-2 justify-end">
            <span className={cn(
              "text-[11px] font-black uppercase tracking-widest",
              senderType === 'ai' ? "text-accent" : "text-amber-500"
            )}>
              {senderName}
            </span>
            {senderType === 'ai' ? (
              <Bot size={12} className="text-accent/60" />
            ) : (
              <User size={12} className="text-amber-500/60" />
            )}
          </div>
        )}

        <div className={cn(
          "px-3 py-1.5 rounded-[18px] relative transition-all duration-200",
          isBigEmoji
            ? "bg-transparent shadow-none"
            : isSent
              ? (senderType === 'ai' ? "bubble-sent" : "bg-indigo-600 shadow-lg text-white") + " rounded-tr-sm"
              : "bubble-received rounded-tl-sm"
        )}>
          {isBigEmoji ? (
            <span className="big-emoji drop-shadow-xl block text-center mb-2">{message}</span>
          ) : (
            <p className={cn(
               "text-[16px] leading-[22px] tracking-tight pb-1",
               isSent ? "text-white pr-14" : "text-white pr-10"
            )}>
               {message}
            </p>
          )}

          {!isBigEmoji && (
            <div className={cn(
              "absolute bottom-1.5 right-2 flex items-center gap-0.5",
              isSent ? "text-white/60" : "text-white/40"
            )}>
              <span className="text-[11px] font-medium">{time}</span>
              {isSent && (
                isRead 
                  ? <CheckCheck size={14} className="text-white/90 drop-shadow-sm" /> 
                  : <Check size={14} className="text-white/60 drop-shadow-sm" />
              )}
            </div>
          )}
          
          {/* Simple footer for big emojis */}
          {isBigEmoji && (
            <div className="flex justify-end pr-2">
                 <div className="flex items-center gap-1 text-white/40">
                  <span className="text-[11px]">{time}</span>
                  {isSent && (
                    isRead 
                      ? <CheckCheck size={14} className="text-accent" /> 
                      : <Check size={14} />
                  )}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
