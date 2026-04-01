'use client'

import React, { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const mockProjects = [
  { id: '1', name: 'AI CRM', color: 'bg-blue-500' },
  { id: '2', name: 'Main', color: 'bg-emerald-500' },
  { id: '3', name: 'SLS.AI', color: 'bg-amber-500' },
  { id: '4', name: 'Kredo', color: 'bg-purple-500' },
]

export const ProjectSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(mockProjects[0])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
      >
        <div className={cn("w-5 h-5 rounded-full border border-white/20", selectedProject.color)} />
        <span className="text-[15px] font-bold text-foreground">{selectedProject.name}</span>
        <ChevronDown size={16} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/5"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-2 w-[180px] glass rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="py-2">
                {mockProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project)
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-black/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-4 h-4 rounded-full", project.color)} />
                      <span className={cn(
                        "text-[15px]",
                        selectedProject.id === project.id ? "font-bold text-accent" : "text-foreground"
                      )}>
                        {project.name}
                      </span>
                    </div>
                    {selectedProject.id === project.id && (
                      <Check size={16} className="text-accent" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
