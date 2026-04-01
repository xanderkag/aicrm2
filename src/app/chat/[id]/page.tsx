'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatMessageBubble, SenderType } from '@/components/chat/ChatMessageBubble'
import { ChatInputBar } from '@/components/chat/ChatInputBar'
import { MessageActionMenu } from '@/components/chat/MessageActionMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { Pin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  text: string
  time: string
  isSent: boolean
  isRead?: boolean
  type?: 'date' | 'message'
  pinned?: boolean
  senderType?: SenderType
  senderName?: string
}

const initialMessages: ChatMessage[] = [
  { 
    id: '1', 
    text: 'Hello, I want to clarify about a Thai driving license for a car. What documents do I need to prepare in advance?', 
    time: '14:20', 
    isSent: false
  },
  { 
    id: '2', 
    text: 'Hello Igor! To apply for a Thai driving license, you will need: 1. Passport (with valid non-immigrant visa), 2. Residency Certificate or Yellow Tabien Baan, 3. Medical Certificate (not older than 1 month), 4. Your domestic driving license (if you have one).', 
    time: '14:21', 
    isSent: true, 
    isRead: true,
    senderType: 'ai',
    senderName: 'AI Assistant'
  },
  { 
    id: '3', 
    text: 'Thank you! Where can I get the Residency Certificate? I am staying in Bangkok now.', 
    time: '14:25', 
    isSent: false 
  },
  { 
    id: '4', 
    text: 'In Bangkok, you can get it at the Immigration Office (Chaengwattana) or through your Embassy. We can also assist you with a fast-track residency certificate if needed.', 
    time: '14:26', 
    isSent: true, 
    isRead: true,
    senderType: 'ai',
    senderName: 'AI Assistant'
  },
  { id: 'date-1', text: 'March 30', time: '', isSent: false, type: 'date' },
  { 
    id: '5', 
    text: 'Can I go there today? I need it urgently.', 
    time: '10:15', 
    isSent: false 
  },
  { 
    id: '6', 
    text: 'I will check the current DLT availability for you Igor. One moment please.', 
    time: '10:16', 
    isSent: true, 
    isRead: true,
    senderType: 'ai',
    senderName: 'AI Assistant'
  },
  { 
    id: '7', 
    text: 'Igor, sorry to interrupt. Today is actually a public holiday in Thailand (Makha Bucha Day), so Immigration and DLT are closed.', 
    time: '10:18', 
    isSent: true, 
    isRead: true,
    senderType: 'admin',
    senderName: 'Alexander Liapustin'
  },
  { 
    id: '8', 
    text: 'Oh, I totally forgot! Thanks for catching that Alexander. When can we proceed?', 
    time: '10:20', 
    isSent: false 
  },
  { 
    id: '9', 
    text: 'I suggest we go on Monday morning. I can arrange a driver to pick you up and we will handle all the paperwork for you.', 
    time: '10:22', 
    isSent: true, 
    isRead: true,
    senderType: 'admin',
    senderName: 'Alexander Liapustin'
  },
  { 
    id: '10', 
    text: 'How much does the VIP fast-track service cost including the driver?', 
    time: '10:25', 
    isSent: false 
  },
  { 
    id: '11', 
    text: 'The comprehensive VIP package (Fast-track Residency Cert + DLT Service + Private Driver) is 3,500 THB. This ensures you get everything done in one morning without queuing. Would you like to proceed?', 
    time: '10:26', 
    isSent: true, 
    isRead: true,
    senderType: 'ai',
    senderName: 'AI Assistant'
  },
  { 
    id: '12', 
    text: 'Yes, please! Let\'s do it.', 
    time: '10:30', 
    isSent: false 
  },
  { id: '13', text: '🔥', time: '10:30', isSent: false },
  { 
    id: '14', 
    text: 'Great! I will send you the payment details and the list of photos we need from your passport. 🤝', 
    time: '10:32', 
    isSent: true, 
    isRead: false,
    senderType: 'admin',
    senderName: 'Alexander Liapustin'
  },
]

export default function ChatDetailPage() {
  const params = useParams()
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [chatName] = useState('Igor Rogacevich')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Action Menu State
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  const handleSend = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      isSent: true,
      isRead: false,
      senderType: 'admin',
      senderName: 'Alexander Liapustin'
    }
    setMessages(prev => [...prev, newMessage])
    
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const handleOpenMenu = (msgId: string, rect: DOMRect) => {
    setSelectedMsgId(msgId)
    setAnchorRect(rect)
    setMenuOpen(true)
  }

  const handleCopy = () => {
    const msg = messages.find(m => m.id === selectedMsgId)
    if (msg) {
      navigator.clipboard.writeText(msg.text)
    }
    setMenuOpen(false)
  }

  const handlePin = () => {
    setMessages(prev => prev.map(m => 
      m.id === selectedMsgId ? { ...m, pinned: true } : m
    ))
    setMenuOpen(false)
  }

  const handleDelete = () => {
    setMessages(prev => prev.filter(m => m.id !== selectedMsgId))
    setMenuOpen(false)
  }

  const pinnedMessages = messages.filter(m => m.pinned)
  const activePin = pinnedMessages[pinnedMessages.length - 1]

  return (
    <div className="flex flex-col h-screen bg-[#050505] overflow-hidden chat-pattern">
      <ChatHeader 
        name={chatName} 
        status="online" 
        avatarColor="bg-amber-600"
      />
      
      {/* Top Gradient Shadow */}
      <div className="fixed top-0 left-0 right-0 h-32 gradient-overlay-top z-40" />

      {/* Dynamic Pinned Message */}
      <AnimatePresence>
        {activePin && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-[64px] left-0 right-0 z-40 px-3 py-1.5 flex justify-center"
          >
            <div className="w-full max-w-2xl bg-secondary/80 backdrop-blur-xl border border-white/5 rounded-xl h-12 flex items-center px-3 gap-3 shadow-lg group cursor-pointer hover:bg-secondary transition-all">
                <div className="w-1 h-8 bg-accent rounded-full shrink-0" />
                <div className="flex-1 flex flex-col min-w-0 pr-4">
                   <span className="text-[14px] font-black text-accent uppercase tracking-tight leading-tight">Pinned Message</span>
                   <p className="text-[14px] font-medium text-white/60 truncate leading-tight">
                      {activePin.text}
                   </p>
                </div>
                <Pin size={20} className="text-white/40 shrink-0 group-hover:text-accent transition-colors rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Messages View */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto px-2 pt-24 pb-32 no-scrollbar scroll-smooth",
          activePin && "pt-40"
        )}
      >
        <div className="max-w-2xl mx-auto flex flex-col pt-4">
          {messages.map((msg) => {
            if (msg.type === 'date') {
              return (
                <div key={msg.id} className="flex justify-center my-4 py-2">
                  <span className="bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-[13px] font-bold text-white/70 uppercase tracking-widest leading-none">
                    {msg.text}
                  </span>
                </div>
              )
            }
            return (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ChatMessageBubble 
                  message={msg.text}
                  time={msg.time}
                  isSent={msg.isSent}
                  isRead={msg.isRead}
                  senderType={msg.senderType}
                  senderName={msg.senderName}
                  onAction={(rect) => handleOpenMenu(msg.id, rect)}
                />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom Gradient Shadow */}
      <div className="fixed bottom-0 left-0 right-0 h-32 gradient-overlay-bottom z-40" />

      <ChatInputBar onSend={handleSend} />

      <MessageActionMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCopy={handleCopy}
        onPin={handlePin}
        onDelete={handleDelete}
        anchorRect={anchorRect}
        isSent={messages.find(m => m.id === selectedMsgId)?.isSent}
      />
    </div>
  )
}
