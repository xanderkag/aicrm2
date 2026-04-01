'use client'

import React from 'react'
import { User, ShieldCheck, Mail, MessageCircle, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

const CLIENTS = [
  { id: '1', name: 'Igor Rogacevich', status: 'Lead (Warm)', avatar: 'bg-amber-600', spent: '0 THB', last: '10m ago' },
  { id: '2', name: 'Max Phuket', status: 'Lead (Cold)', avatar: 'bg-indigo-500', spent: '0 THB', last: '2h ago' },
  { id: '3', name: 'Sarah Mills', status: 'VIP Customer', avatar: 'bg-rose-500', spent: '12,500 THB', last: 'Yesterday' },
  { id: '4', name: 'David Chen', status: 'Customer', avatar: 'bg-emerald-600', spent: '500 THB', last: '2 days ago' },
  { id: '5', name: 'James Wilson', status: 'Banned', avatar: 'bg-red-900', spent: '2,500 THB', last: '1 week ago' },
]

export const TelegramClientsList: React.FC = () => {
  return (
    <div className="px-6 space-y-2 pb-8">
      {CLIENTS.map((client) => (
        <div key={client.id} className="list-item-hover p-3 rounded-xl flex items-center justify-between group">
           <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-[14px] shadow-lg border border-white/10",
                client.avatar
              )}>
                <span>{client.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[16px] font-black tracking-tight">{client.name}</h4>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      client.status.includes('VIP') ? 'text-accent' : 
                      client.status.includes('Banned') ? 'text-rose-500' : 'text-white/40'
                    )}>
                      {client.status}
                    </span>
                    {client.status.includes('VIP') && <ShieldCheck size={10} className="text-accent" />}
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-1">
              <span className="text-[14px] font-black tracking-tight text-foreground/90">{client.spent}</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{client.last}</span>
           </div>

           {/* Hover Actions */}
           <div className="hidden group-hover:flex items-center gap-2 ml-4">
              <button className="p-2 bg-accent/20 rounded-full text-accent hover:bg-accent hover:text-white transition-all">
                 <MessageCircle size={16} />
              </button>
              <button className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white">
                 <Mail size={16} />
              </button>
           </div>
        </div>
      ))}
    </div>
  )
}
