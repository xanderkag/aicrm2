'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  Settings, 
  LogOut, 
  User, 
  Bot, 
  ShieldCheck, 
  Bell, 
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const SettingsView: React.FC = () => {
  const { data: session } = useSession()
  const user = session?.user

  const settingsGroups = [
    {
      title: 'AI & Automation',
      items: [
        { id: 'bot', icon: Bot, label: 'Bot Token Setup', status: 'Connected', color: 'text-emerald-500' },
        { id: 'ai', icon: Cpu, label: 'AI Model Context', status: 'GPT-4o', color: 'text-purple-500' },
        { id: 'db', icon: Database, label: 'PostgreSQL Schemas', status: '16 Active', color: 'text-blue-500' },
      ]
    },
    {
      title: 'Security & App',
      items: [
        { id: 'security', icon: ShieldCheck, label: 'Access Control', status: 'Strict', color: 'text-amber-500' },
        { id: 'notif', icon: Bell, label: 'System Notifications', status: 'Enabled', color: 'text-emerald-500' },
      ]
    }
  ]

  return (
    <div className="mt-4 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
         <h2 className="text-[22px] font-black tracking-tight text-foreground">Terminal Settings</h2>
      </div>

      {/* User Profile Card */}
      <div className="glass rounded-[32px] p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/20 transition-colors duration-700" />
         
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-20 h-20 rounded-[24px] bg-accent/20 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner ring-4 ring-white/5">
                {user?.image ? (
                  <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-accent" />
                )}
            </div>
            <div className="space-y-1">
               <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight">{user?.name || 'Administrator'}</h3>
               <p className="text-[13px] font-medium text-white/40">{user?.email}</p>
               <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-2">
                 Session Active
               </div>
            </div>
         </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/20">{group.title}</h4>
            <div className="glass rounded-[28px] border border-white/5 overflow-hidden shadow-lg">
               {group.items.map((item, idx) => (
                 <button 
                  key={item.id}
                  className={cn(
                    "w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors border-white/5 group",
                    idx !== group.items.length - 1 && "border-b"
                  )}
                 >
                    <div className="flex items-center gap-4">
                       <div className={cn("w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300", item.color)}>
                          <item.icon size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-[14px] font-bold text-white/80 group-hover:text-white transition-colors">{item.label}</p>
                          <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">{item.status}</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-white/10 group-hover:text-white/40 transition-colors" />
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Action */}
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="w-full flex items-center justify-between p-6 glass rounded-[28px] border border-rose-500/10 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all text-rose-500 group shadow-xl active:scale-[0.98]"
      >
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-all shadow-glow-rose">
               <LogOut size={24} />
            </div>
            <div className="text-left">
               <p className="text-[15px] font-black uppercase tracking-widest">Terminate Session</p>
               <p className="text-[11px] font-medium opacity-60">Log out of the CRM terminal</p>
            </div>
         </div>
         <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 transition-all" />
      </button>

      <div className="text-center py-4 opacity-10">
         <p className="text-[10px] font-bold uppercase tracking-[.3em]">Antigravity CRM v2.0.4</p>
      </div>
    </div>
  )
}
