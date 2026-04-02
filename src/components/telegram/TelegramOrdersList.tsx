'use client'

import React from 'react'
import { MoreHorizontal, ExternalLink, Clock, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const ORDERS = [
  { id: '1', customer: 'Igor Rogacevich', service: 'Car Driving License (VIP)', price: '3,500 THB', status: 'Consultation', time: '10m ago', color: 'text-indigo-400' },
  { id: '2', customer: 'Max Phuket', service: 'Bike License (Tourist)', price: '1,500 THB', status: 'Documents', time: '2h ago', color: 'text-amber-400' },
  { id: '3', customer: 'Sarah Mills', service: 'License Renewal (5y)', price: '2,000 THB', status: 'Processing', time: 'Yesterday', color: 'text-emerald-400' },
  { id: '4', customer: 'David Chen', service: 'Medical Certificate', price: '500 THB', status: 'Paid', time: '2 days ago', color: 'text-accent' },
]

export const TelegramOrdersList: React.FC = () => {
  return (
    <div className="px-6 space-y-3 pb-8">
      {ORDERS.map((order) => (
        <div key={order.id} className="premium-card p-4 flex flex-col gap-3 group relative overflow-hidden">
           {/* Glow Effect */}
           <div className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-20", order.status === 'Paid' ? 'bg-emerald-500' : 'bg-accent')} />
           
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <h4 className="text-[17px] font-black tracking-tight">{order.customer}</h4>
                 <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/30">{order.service}</span>
                 </div>
              </div>
              <button className="p-2 text-white/20 group-hover:text-white transition-colors">
                 <MoreHorizontal size={20} />
              </button>
           </div>
           
           <div className="flex items-center justify-between border-t border-white/[0.03] pt-3">
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-emerald-500" />
                    <span className="text-[15px] font-black text-emerald-500 tracking-tight">{order.price}</span>
                 </div>
                 <div className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded-full border border-white/5">
                    <div className={cn("w-1.5 h-1.5 rounded-full", order.status === 'Paid' ? 'bg-emerald-500' : 'bg-accent')} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{order.status}</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-1 text-white/20">
                 <Clock size={12} />
                 <span className="text-[11px] font-bold">{order.time}</span>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-accent hover:underline">
                 <span>Details</span>
                 <ExternalLink size={12} />
              </button>
           </div>
        </div>
      ))}
    </div>
  )
}
