'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'ai-crm', label: 'AI CRM' },
  { id: 'main', label: 'Main', count: 2 },
  { id: 'sls-ai', label: 'SLS.AI', count: 6 },
  { id: 'kredo', label: 'Kredo' },
]

export const TelegramTopTabs = () => {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="sticky top-[60px] bg-background z-40 border-b border-border overflow-x-auto no-scrollbar">
      <div className="flex px-4 min-w-max h-[44px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-4 py-2 flex items-center gap-2 text-[14px] font-semibold transition-colors duration-200",
              activeTab === tab.id ? "text-accent" : "text-secondary-foreground"
            )}
          >
            <span>{tab.label}</span>
            {tab.count && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                activeTab === tab.id ? "bg-accent text-white" : "bg-secondary text-secondary-foreground"
              )}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
