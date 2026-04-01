'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Pin, Trash2, Reply, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionMenuItemProps {
  label: string
  icon: React.ElementType
  onClick: () => void
  variant?: 'default' | 'danger'
}

const ActionMenuItem: React.FC<ActionMenuItemProps> = ({ 
  label, 
  icon: Icon, 
  onClick, 
  variant = 'default' 
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    className={cn(
      "flex items-center justify-between w-full px-4 py-3 text-[14px] font-black uppercase tracking-widest transition-colors active:bg-white/10",
      variant === 'danger' ? "text-rose-500" : "text-foreground/90"
    )}
  >
    <span>{label}</span>
    <Icon size={18} strokeWidth={2.5} />
  </button>
)

interface MessageActionMenuProps {
  isOpen: boolean
  onClose: () => void
  onCopy: () => void
  onPin: () => void
  onDelete: () => void
  anchorRect: DOMRect | null
  isSent?: boolean
}

export const MessageActionMenu: React.FC<MessageActionMenuProps> = ({
  isOpen,
  onClose,
  onCopy,
  onPin,
  onDelete,
  anchorRect,
  isSent
}) => {
  if (!anchorRect) return null

  // Calculate position: try to show above or below the bubble
  const top = anchorRect.top < 300 ? anchorRect.bottom + 8 : anchorRect.top - 210
  const left = isSent ? anchorRect.right - 200 : anchorRect.left

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: isSent ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: isSent ? -10 : 10 }}
            style={{ 
              top: `${Math.max(10, Math.min(top, window.innerHeight - 250))}px`, 
              left: `${Math.max(10, Math.min(left, window.innerWidth - 210))}px` 
            }}
            className="fixed z-[110] w-[200px] bg-secondary/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="divide-y divide-white/5">
              <ActionMenuItem label="Reply" icon={Reply} onClick={onClose} />
              <ActionMenuItem label="Copy" icon={Copy} onClick={onCopy} />
              <ActionMenuItem label="Pin" icon={Pin} onClick={onPin} />
              <ActionMenuItem label="Forward" icon={Send} onClick={onClose} />
              <ActionMenuItem label="Delete" icon={Trash2} onClick={onDelete} variant="danger" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

import { Send } from 'lucide-react'
