'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Settings, Filter, Plus, Loader2 } from 'lucide-react'
import { TelegramHeader, MessengerSource } from '@/components/telegram/TelegramHeader'
import { cn } from '@/lib/utils'
import { TelegramChatRow } from '@/components/telegram/TelegramChatRow'
import { TelegramFloatingNav } from '@/components/telegram/TelegramFloatingNav'
import { TelegramOrdersList } from '@/components/telegram/TelegramOrdersList'
import { TelegramClientsList } from '@/components/telegram/TelegramClientsList'
import { SalesFunnel } from '@/components/telegram/SalesFunnel'
import { TagSelectionDrawer, CRM_TAGS } from '@/components/telegram/TagSelectionDrawer'
import { useProject } from '@/context/ProjectContext'

interface Chat {
  id: string | number
  name: string
  last_message: string
  last_message_time: string
  messenger: 'tg' | 'ig' | 'wa' | 'web'
  unreadCount?: number
  status?: 'online' | 'offline'
  notes?: string
  tags: string[]
  avatarColor?: string
}

export default function TelegramPage() {
  const { selectedProject } = useProject()
  const [activeTab, setActiveTab] = useState('chats')
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSource, setSelectedSource] = useState<MessengerSource>('all')
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      if (!selectedProject?.schema_name) return
      
      setLoading(true)
      try {
        const response = await fetch(`/api/chats?schema=${selectedProject.schema_name}`)
        const data = await response.json()
        
        // Map database fields to UI component props
        const mappedChats = data.map((d: any) => ({
          id: d.id,
          name: d.name || `User ${d.messenger_user_id}`,
          message: d.last_message,
          time: d.last_message_time ? new Date(d.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          messenger: d.messenger === 'telegram' ? 'tg' : d.messenger === 'instagram' ? 'ig' : 'wa',
          unreadCount: 0,
          tags: Array.isArray(d.meta?.tags) ? d.meta.tags : [],
          notes: d.meta?.notes || '',
          avatarColor: 'bg-accent/20'
        }))
        
        setChats(mappedChats)
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (activeTab === 'chats') {
      fetchChats()
    }
  }, [selectedProject, activeTab])

  const handleOpenDrawer = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault() 
    e.stopPropagation()
    setCurrentChatId(chatId)
    setIsDrawerOpen(true)
  }

  const handleToggleTag = (tagId: string) => {
    if (!currentChatId) return
    setChats(prev => prev.map(chat => {
      if (chat.id.toString() === currentChatId) {
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
      chat.id.toString() === currentChatId ? { ...chat, notes: value } : chat
    ))
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    // Refresh to show updated tags/notes in list
    const fetchChats = async () => {
      if (!selectedProject?.schema_name) return
      try {
        const response = await fetch(`/api/chats?schema=${selectedProject.schema_name}`)
        const data = await response.json()
        const mappedChats = data.map((d: any) => ({
          id: d.id,
          name: d.name || `User ${d.messenger_user_id}`,
          message: d.last_message,
          time: d.last_message_time ? new Date(d.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          messenger: d.messenger === 'telegram' ? 'tg' : d.messenger === 'instagram' ? 'ig' : 'wa',
          unreadCount: 0,
          tags: Array.isArray(d.meta?.tags) ? d.meta.tags : [],
          notes: d.meta?.notes || '',
          avatarColor: 'bg-accent/20'
        }))
        setChats(mappedChats)
      } catch (err) {
        console.error('Failed to refresh chats:', err)
      }
    }
    fetchChats()
  }

  const selectedChat = chats.find(c => c.id.toString() === currentChatId)
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
               <div className="flex items-center justify-between mt-1">
                 <p className="text-[14px] font-medium text-white/30 uppercase tracking-widest leading-none items-center flex gap-2">
                   <span className={cn("w-2 h-2 rounded-full shadow-glow-emerald", loading ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} /> 
                   {loading ? 'Syncing...' : `${filteredChats.length} total chats`}
                 </p>
                 {loading && <Loader2 size={14} className="animate-spin text-white/20" />}
               </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                <Loader2 size={32} className="animate-spin text-accent" />
                <span className="text-[12px] font-black uppercase tracking-widest text-white/30 tracking-widest">Fetching Conversations...</span>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <span className="text-[14px] font-black uppercase tracking-widest">No active chats found</span>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <TelegramChatRow
                      id={chat.id.toString()}
                      name={chat.name}
                      message={(chat as any).message}
                      time={(chat as any).time}
                      unreadCount={chat.unreadCount || 0}
                      avatarColor={chat.avatarColor || 'bg-accent/20'}
                      messenger={chat.messenger}
                      tags={chat.tags.map(tId => {
                        const tagInfo = CRM_TAGS.find(t => t.id === tId)
                        return { label: tagInfo?.label || tId, color: tagInfo?.color }
                      })}
                      status={chat.status}
                      notes={chat.notes}
                      avatar=""
                      onAddTag={(e) => handleOpenDrawer(e, chat.id.toString())}
                    />
                  </Link>
                ))}
              </div>
            )}
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
        <TelegramFloatingNav 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          unreadCount={filteredChats.length}
        />
      </div>

      {/* Tag Selection Drawer */}
      <TagSelectionDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        chatName={selectedChat?.name}
        selectedTags={selectedChat?.tags || []}
        onToggleTag={handleToggleTag}
        noteValue={selectedChat?.notes || ''}
        onNoteChange={handleNoteChange}
        clientId={currentChatId}
        schema={selectedProject?.schema_name || null}
      />
    </div>
  )
}
