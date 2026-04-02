'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatMessageBubble, SenderType } from '@/components/chat/ChatMessageBubble'
import { ChatInputBar } from '@/components/chat/ChatInputBar'
import { MessageActionMenu } from '@/components/chat/MessageActionMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { Pin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProject } from '@/context/ProjectContext'

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

export default function ChatDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { selectedProject } = useProject()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [chatName, setChatName] = useState('Loading...')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Action Menu State
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const fetchChatData = async () => {
      if (!id || !selectedProject?.schema_name) return
      
      setLoading(true)
      try {
        // Fetch messages
        const response = await fetch(`/api/chat/${id}?schema=${selectedProject.schema_name}`)
        const data = await response.json()
        
        const mappedMessages = data.map((m: any) => ({
          id: m.id.toString(),
          text: m.text,
          time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          isSent: m.type === 'response',
          isRead: true,
          senderType: m.type === 'response' ? 'admin' : 'user',
          senderName: m.sender_name || (m.type === 'response' ? 'Admin' : 'User')
        }))
        
        setMessages(mappedMessages)
        setChatName(`User ${id}`)
      } catch (error) {
        console.error('Failed to fetch chat data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatData()
  }, [id, selectedProject])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text: string) => {
    if (!selectedProject?.schema_name) return

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

    try {
      await fetch(`/api/chat/${id}?schema=${selectedProject.schema_name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, senderName: 'Alexander Liapustin' })
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }
    
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] gap-4">
        <Loader2 size={40} className="animate-spin text-accent" />
        <span className="text-[14px] font-black uppercase tracking-widest text-white/30">Syncing history...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] overflow-hidden chat-pattern">
      <ChatHeader 
        name={chatName} 
        status="online" 
        avatarColor="bg-accent/20"
      />
      
      <div className="fixed top-0 left-0 right-0 h-32 gradient-overlay-top z-40" />

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
      
      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 overflow-y-auto px-2 pt-24 pb-32 no-scrollbar scroll-smooth",
          activePin && "pt-40"
        )}
      >
        <div className="max-w-2xl mx-auto flex flex-col pt-4">
          {messages.length === 0 ? (
            <div className="text-center py-20 opacity-20">
              <span className="text-[14px] font-black uppercase tracking-widest">No message history</span>
            </div>
          ) : messages.map((msg) => {
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
