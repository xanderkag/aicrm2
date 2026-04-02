'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useProject } from '@/context/ProjectContext'

const PROJECT_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-cyan-500',
]

export const ProjectSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { projects, selectedProject, setSelectedProject, loading } = useProject()

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
        <Loader2 size={16} className="animate-spin text-accent" />
        <span className="text-[14px] font-bold text-foreground opacity-50">Loading...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors border border-white/5"
      >
        <div className={cn(
          "w-5 h-5 rounded-full border border-white/20", 
          PROJECT_COLORS[selectedProject?.id ? selectedProject.id % PROJECT_COLORS.length : 0]
        )} />
        <span className="text-[15px] font-bold text-foreground truncate max-w-[120px]">
          {selectedProject?.name || 'Select Project'}
        </span>
        <ChevronDown size={16} className={cn("transition-transform duration-200 opacity-50", isOpen && "rotate-180")} />
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
              className="absolute top-full left-0 mt-2 min-w-[200px] glass rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10"
            >
              <div className="py-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {projects.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[12px] font-medium text-white/30 truncate">No projects found</p>
                  </div>
                ) : projects.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project)
                      setIsOpen(false)
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-4 h-4 rounded-full", PROJECT_COLORS[index % PROJECT_COLORS.length])} />
                      <span className={cn(
                        "text-[15px] whitespace-nowrap",
                        selectedProject?.id === project.id ? "font-bold text-accent" : "text-foreground"
                      )}>
                        {project.name}
                      </span>
                    </div>
                    {selectedProject?.id === project.id && (
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
