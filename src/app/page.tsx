'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Settings, Filter, Plus } from 'lucide-react'
import { TelegramHeader, MessengerSource } from '@/components/telegram/TelegramHeader'
import { TelegramChatRow } from '@/components/telegram/TelegramChatRow'
import { TelegramFloatingNav } from '@/components/telegram/TelegramFloatingNav'
import { TelegramOrdersList } from '@/components/telegram/TelegramOrdersList'
import { TelegramClientsList } from '@/components/telegram/TelegramClientsList'
import { SalesFunnel } from '@/components/telegram/SalesFunnel'
import { TagSelectionDrawer, CRM_TAGS } from '@/components/telegram/TagSelectionDrawer'

const initialMockChats = [
  {
    id: '1',
    name: 'Igor Rogacevich',
    message: 'What documents do I need for a Thai residency certificate?',
    time: '12:45',
    avatarColor: 'bg-amber-600',
    messenger: 'tg' as const,
    unreadCount: 3,
    status: 'online' as const,
    notes: 'Inquiry about Thai Driving License (Car). Needs residency cert info.',
    tags: ['potential', 'warm']
  },
  {
    id: '2',
    name: 'Max Phuket',
    message: 'Can I get a bike license with a tourist visa?',
    time: '11:20',
    avatarColor: 'bg-indigo-500',
    messenger: 'ig' as const,
    unreadCount: 0,
    status: 'offline' as const,
    notes: 'Phuket based. Asking about Tourist Visa limitations for DLT.',
    tags: ['support', 'cold']
  },
  {
    id: '3',
    name: 'Sarah Mills',
    message: 'My 2-year temporary license is expiring soon.',
    time: 'Yesterday',
    avatarColor: 'bg-rose-500',
    messenger: 'tg' as const,
    unreadCount: 12,
    notes: 'Renewal from 2-year to 5-year license. Needs scheduling.',
    tags: ['vip', 'recurring']
  },
  {
    id: '4',
    name: 'David Chen',
    message: 'Where is the best clinic for a medical certificate in Samui?',
    time: 'Monday',
    avatarColor: 'bg-emerald-600',
    messenger: 'wa' as const,
    unreadCount: 0,
    notes: 'DLT Samui area. Direct web inquiry.',
    tags: ['support']
  },
  {
    id: '5',
    name: 'WhatsApp Test',
    message: 'Testing the WhatsApp source filtering!',
    time: '1m',
    avatarColor: 'bg-emerald-500',
    messenger: 'wa' as const,
    unreadCount: 1,
    status: 'online' as const,
    notes: 'New WhatsApp lead.',
    tags: ['potential']
  },
]

export default function TelegramPage() {
  const [activeTab, setActiveTab] = useState('chats')
  const [chats, setChats] = useState(initialMockChats)
  const [selectedSource, setSelectedSource] = useState<MessengerSource>('all')
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const handleOpenDrawer = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()
    setCurrentChatId(chatId)
    setIsDrawerOpen(true)
  }

  const handleToggleTag = (tagId: string) => {
    if (!currentChatId) return
    
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const hasTag = chat.tags.includes(tagId)
        return {
          ...chat,
          tags: hasTag 
            ? chat.tags.filter(t => t !== tagId) 
            : [...chat.tags, tagId]
        }
      }
      return chat
    }))
  }

  const handleNoteChange = (value: string) => {
    if (!currentChatId) return
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId ? { ...chat, notes: value } : chat
    ))
  }

  const selectedChat = chats.find(c => c.id === currentChatId)
  const filteredChats = chats.filter(chat => selectedSource === 'all' || chat.messenger === selectedSource)

  return (
    <div className="min-h-screen bg-background pb-[160px] chat-pattern font-inter overflow-x-hidden">
      <TelegramHeader 
        selectedSource={selectedSource} 
        onSourceChange={setSelectedSource} 
      />

      {/* Top Depth Overlay */}
      <div className="fixed top-0 left-0 right-0 h-48 gradient-overlay-top z-[45]" />
      
      {/* Bottom Depth Overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-64 gradient-overlay-bottom z-[45]" />
      
      {activeTab === 'chats' && (
        <>
          <main className="mt-4 relative z-10">
            <div className="px-6 mb-4">
               <h2 className="text-[22px] font-black tracking-tight text-foreground">
                  {selectedSource === 'all' ? 'Active Consultations' : `${selectedSource.toUpperCase()} Consultations`}
               </h2>
               <p className="text-[14px] font-medium text-white/30 uppercase tracking-widest leading-none mt-1 items-center flex gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-glow-emerald" /> 
                 {filteredChats.length} total chats
               </p>
            </div>
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                  <TelegramChatRow
                    id={chat.id}
                    name={chat.name}
                    message={chat.message}
                    time={chat.time}
                    unreadCount={chat.unreadCount}
                    avatarColor={chat.avatarColor}
                    messenger={chat.messenger}
                    tags={chat.tags.map(tId => {
                      const tagInfo = CRM_TAGS.find(t => t.id === tId)
                      return { label: tagInfo?.label || '', color: tagInfo?.color }
                    })}
                    status={chat.status}
                    notes={chat.notes}
                    avatar=""
                    onAddTag={(e) => handleOpenDrawer(e, chat.id)}
                  />
                </Link>
              ))}
            </div>
          </main>
        </>
      )}

      {activeTab === 'orders' && (
        <main className="mt-4 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-6 py-2 mb-2 flex items-center justify-between">
             <h2 className="text-[22px] font-black tracking-tight">Active Applications</h2>
             <div className="flex items-center gap-2">
                <button className="p-2 text-white/20 hover:text-white transition-colors bg-white/5 rounded-full border border-white/5">
                   <Filter size={18} />
                </button>
                <button className="p-2 bg-accent rounded-full text-white shadow-lg shadow-accent/20">
                   <Plus size={18} />
                </button>
             </div>
          </div>
          
          {/* Funnel & Metrics */}
          <SalesFunnel />
          
          <div className="px-6 mb-4">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40">Deal List</h3>
          </div>
          <TelegramOrdersList />
        </main>
      )}

      {activeTab === 'clients' && (
        <main className="mt-4 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="px-6 py-2 mb-4 flex items-center justify-between">
             <h2 className="text-[22px] font-black tracking-tight">CRM Contact Database</h2>
             <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
                <Search size={14} className="text-white/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Search Database</span>
             </div>
          </div>
          <TelegramClientsList />
        </main>
      )}

      {activeTab === 'settings' && (
        <main className="mt-12 p-8 text-center text-secondary-foreground relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col items-center gap-6">
             <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center border border-white/5 shadow-inner">
                <Settings size={48} className="text-accent/80" />
             </div>
             <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">System Settings</h2>
                <p className="text-sm opacity-60 max-w-[240px]">Manage AI Assistant profiles and Bot Token integrations.</p>
             </div>
          </div>
        </main>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <TelegramFloatingNav activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tag Selection Drawer */}
      <TagSelectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        chatName={selectedChat?.name}
        selectedTags={selectedChat?.tags || []}
        onToggleTag={handleToggleTag}
        noteValue={selectedChat?.notes || ''}
        onNoteChange={handleNoteChange}
      />
    </div>
  )
}
