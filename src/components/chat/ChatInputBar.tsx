'use client'

import React, { useState } from 'react'
import { Paperclip, Mic, Send, Smile, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputBarProps {
  onSend: (text: string) => void
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({ onSend }) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (text.trim()) {
      onSend(text)
      setText('')
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 pb-8 z-50">
      <div className="max-w-2xl mx-auto flex items-end gap-2 px-1">
        
        {/* Attachment Pill */}
        <button className="flex h-[46px] w-[46px] items-center justify-center text-white/50 hover:text-white transition-colors bg-secondary/80 backdrop-blur-xl border border-white/5 rounded-full active:scale-95 shadow-lg">
           <Paperclip size={24} strokeWidth={2.5} />
        </button>

        {/* Input Text Pill */}
        <div className="flex-1 min-h-[46px] bg-secondary/80 backdrop-blur-xl border border-white/5 rounded-[24px] flex items-end px-4 py-2.5 shadow-lg group focus-within:border-accent/30 transition-all">
           <textarea
             rows={1}
             value={text}
             onChange={(e) => {
               setText(e.target.value)
               // Auto resize
               e.target.style.height = 'auto'
               e.target.style.height = e.target.scrollHeight + 'px'
             }}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault()
                 handleSend()
               }
             }}
             placeholder="Message"
             className="flex-1 bg-transparent text-[16px] font-medium text-foreground placeholder:text-white/30 resize-none focus:outline-none min-h-[22px] max-h-[150px] leading-tight"
           />
           <button className="px-1.5 pb-0.5 text-white/30 hover:text-white active:scale-95 transition-colors">
              <Smile size={24} strokeWidth={2.5} />
           </button>
        </div>

        {/* Action Pill (Mic or Send) */}
        <button 
          onClick={handleSend}
          className={cn(
            "flex h-[46px] w-[46px] items-center justify-center rounded-full transition-all duration-300 shadow-lg active:scale-90",
            text.trim() ? "bg-accent text-white scale-100" : "bg-transparent text-white/50 hover:text-white"
          )}
        >
          {text.trim() ? (
            <Send size={22} fill="currentColor" />
          ) : (
            <Mic size={24} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  )
}
