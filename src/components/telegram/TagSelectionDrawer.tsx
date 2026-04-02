'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Star, Sparkles, Headset, Repeat, AlertCircle, Flame, Snowflake, Handshake, XCircle, CheckCircle, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'

export const CRM_TAGS = [
  { id: 'vip', label: 'VIP', icon: Star, color: 'bg-amber-500/10 text-amber-500' },
  { id: 'potential', label: 'Potential', icon: Sparkles, color: 'bg-blue-500/10 text-blue-500' },
  { id: 'support', label: 'Support', icon: Headset, color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 'recurring', label: 'Recurring', icon: Repeat, color: 'bg-purple-500/10 text-purple-500' },
  { id: 'complaint', label: 'Complaint', icon: AlertCircle, color: 'bg-rose-500/10 text-rose-500' },
  { id: 'warm', label: 'Warm Lead', icon: Flame, color: 'bg-orange-500/10 text-orange-500' },
  { id: 'cold', label: 'Cold Lead', icon: Snowflake, color: 'bg-cyan-500/10 text-cyan-500' },
  { id: 'partner', label: 'Partner', icon: Handshake, color: 'bg-indigo-500/10 text-indigo-500' },
  { id: 'lost', label: 'Lost', icon: XCircle, color: 'bg-slate-500/10 text-slate-500' },
  { id: 'won', label: 'Won', icon: CheckCircle, color: 'bg-emerald-600/10 text-emerald-400' },
]

interface TagSelectionDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedTags: string[]
  onToggleTag: (tagId: string) => void
  chatName?: string
  noteValue: string
  onNoteChange: (value: string) => void
  clientId: string | number | null
  schema: string | null
}

export const TagSelectionDrawer: React.FC<TagSelectionDrawerProps> = ({
  isOpen,
  onClose,
  selectedTags,
  onToggleTag,
  chatName,
  noteValue,
  onNoteChange,
  clientId,
  schema
}) => {
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    if (!clientId || !schema) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/clients/${clientId}?schema=${schema}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta: {
            tags: selectedTags,
            notes: noteValue
          }
        })
      })
      
      if (!response.ok) throw new Error('Failed to save')
      onClose()
    } catch (error) {
      console.error('Error saving client data:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 glass rounded-t-[32px] z-[70] px-6 pt-2 pb-safe shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar border-t border-white/10"
          >
            {/* Handle */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                 <h2 className="text-xl font-black text-foreground">Manage Client</h2>
                 <p className="text-sm text-secondary-foreground opacity-60 tracking-tight">{chatName}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground active:scale-95 transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tags Grid (3xN) */}
            <div className="mb-2 px-1">
               <span className="text-[12px] font-bold uppercase tracking-wider text-secondary-foreground">Quick Categorization</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {CRM_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    onClick={() => onToggleTag(tag.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 border relative group",
                      isSelected 
                        ? "bg-accent/10 border-accent/40" 
                        : "bg-secondary/40 border-white/5 hover:bg-secondary/60"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-transform",
                      tag.color,
                      isSelected && "scale-110"
                    )}>
                       <tag.icon size={24} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest text-center leading-tight",
                      isSelected ? "text-accent" : "text-secondary-foreground"
                    )}>
                      {tag.label}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white border-2 border-[#1a1a1a]">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Manual Note Input */}
            <div className="mb-8 space-y-3">
               <div className="flex items-center gap-2 text-secondary-foreground px-1">
                  <StickyNote size={16} />
                  <span className="text-[12px] font-bold uppercase tracking-wider">Remark / Note</span>
               </div>
               <div className="relative">
                  <textarea
                    value={noteValue}
                    onChange={(e) => onNoteChange(e.target.value)}
                    placeholder="Enter short note about this client..."
                    className="w-full bg-secondary/50 border border-white/5 rounded-2xl p-4 text-[14px] font-medium text-foreground placeholder:text-secondary-foreground/30 focus:outline-none focus:border-accent/40 min-h-[120px] resize-none transition-all"
                  />
               </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "flex-1 h-16 bg-accent text-white font-black text-[17px] rounded-2xl transition-all active:scale-95 shadow-xl shadow-accent/20 uppercase tracking-widest flex items-center justify-center gap-3",
                  isSaving && "opacity-70 pointer-events-none"
                )}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Apply Changes'
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
