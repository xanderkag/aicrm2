'use client'

import React, { useEffect, useState } from 'react'
import { User, ShieldCheck, Mail, MessageCircle, MoreVertical, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProject } from '@/context/ProjectContext'

interface Client {
  id: string | number
  name: string
  messenger: string
  messenger_user_id: string
  last_message: string
  last_message_time: string
  ai_answer: string
}

export const TelegramClientsList: React.FC = () => {
  const { selectedProject } = useProject()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClients = async () => {
      if (!selectedProject?.schema_name) return
      
      setLoading(true)
      try {
        const response = await fetch(`/api/chats?schema=${selectedProject.schema_name}`)
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [selectedProject])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
        <Loader2 size={32} className="animate-spin text-accent" />
        <span className="text-[12px] font-black uppercase tracking-widest text-white/30">Syncing with {selectedProject?.name}...</span>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-20 opacity-30">
        <span className="text-[14px] font-black uppercase tracking-widest">No contacts found in this project</span>
      </div>
    )
  }

  return (
    <div className="px-6 space-y-2 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {clients.map((client) => (
        <div key={client.id} className="list-item-hover p-4 rounded-2xl flex items-center justify-between group border border-white/[0.02] bg-white/[0.01]">
           <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-[14px] shadow-lg border border-white/10 bg-accent/20"
              )}>
                <span>{client.messenger_user_id.slice(0, 2)}</span>
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[16px] font-black tracking-tight text-foreground">
                   {client.name || `User ${client.messenger_user_id}`}
                 </h4>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest text-white/40"
                    )}>
                      {client.messenger} • {client.messenger_user_id}
                    </span>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-1">
              <span className="text-[14px] font-black tracking-tight text-foreground/90 truncate max-w-[150px]">
                {client.last_message || 'No messages'}
              </span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">
                {client.last_message_time ? new Date(client.last_message_time).toLocaleDateString() : 'Never'}
              </span>
           </div>

           {/* Hover Actions */}
           <div className="hidden group-hover:flex items-center gap-2 ml-4">
              <button className="p-2 bg-accent/20 rounded-full text-accent hover:bg-accent hover:text-white transition-all shadow-glow-accent/20">
                 <MessageCircle size={16} />
              </button>
              <button className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
                 <MoreVertical size={16} />
              </button>
           </div>
        </div>
      ))}
    </div>
  )
}
