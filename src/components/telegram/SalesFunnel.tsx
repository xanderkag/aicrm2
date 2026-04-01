'use client'

import React from 'react'
import { TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const STAGES = [
  { id: 'new', label: 'New', count: 12, color: 'bg-blue-500' },
  { id: 'consult', label: 'Consult', count: 8, color: 'bg-indigo-500' },
  { id: 'docs', label: 'Docs', count: 5, color: 'bg-amber-500' },
  { id: 'paid', label: 'Paid', count: 3, color: 'bg-emerald-500' },
  { id: 'won', label: 'Won', count: 42, color: 'bg-accent' },
]

const METRICS = [
  { label: 'Revenue', value: '145k', sub: '+12% 📈', icon: DollarSign, color: 'text-emerald-500' },
  { label: 'Conversion', value: '24%', sub: 'Avg 22%', icon: TrendingUp, color: 'text-accent' },
  { label: 'Active', value: '28', sub: 'leads', icon: Users, color: 'text-indigo-400' },
]

export const SalesFunnel: React.FC = () => {
  return (
    <div className="px-6 py-4 space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        {METRICS.map((metric) => (
          <div key={metric.label} className="premium-card p-4 flex flex-col gap-1">
             <div className="flex items-center justify-between mb-1">
                <metric.icon size={16} className={metric.color} />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{metric.label}</span>
             </div>
             <span className="text-xl font-black tracking-tight">{metric.value}</span>
             <span className={cn("text-[10px] font-bold uppercase tracking-tight", metric.sub.includes('+') ? "text-emerald-500" : "text-white/40")}>
               {metric.sub}
             </span>
          </div>
        ))}
      </div>

      {/* Funnel Visual */}
      <div className="space-y-3">
         <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-white/40">Sales Pipeline</h3>
            <span className="text-[11px] font-bold text-accent">Last 30 Days</span>
         </div>
         
         <div className="flex items-end gap-1.5 h-32">
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex-1 flex flex-col items-center gap-2 group">
                 <div className="w-full relative flex flex-col justify-end">
                    <div 
                      className={cn(
                        "w-full rounded-lg transition-all duration-500 group-hover:brightness-125 cursor-pointer shadow-lg",
                        stage.color
                      )} 
                      style={{ height: `${(stage.count / 42) * 100}%`, minHeight: '8px' }}
                    >
                       <div className="absolute -top-6 left-0 right-0 text-center">
                          <span className="text-[12px] font-black text-white/90">{stage.count}</span>
                       </div>
                    </div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-tighter text-white/30 group-hover:text-white/60 transition-colors">
                   {stage.label}
                 </span>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}
