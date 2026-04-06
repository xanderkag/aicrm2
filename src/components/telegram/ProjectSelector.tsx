'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, Loader2, Plus, X } from 'lucide-react'
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
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { projects, selectedProject, setSelectedProject, loading } = useProject()

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setNewProjectName('')
        setIsCreating(false)
        // Refresh the page or trigger a re-fetch of projects
        window.location.reload() 
      } else {
        console.error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
              onClick={() => {
                setIsOpen(false)
                setIsCreating(false)
              }}
              className="fixed inset-0 z-40 bg-black/5"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-2 min-w-[240px] glass rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10 flex flex-col"
            >
              <div className="py-2 max-h-[260px] overflow-y-auto no-scrollbar">
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

              {/* Create Project Section - Sticky Footer */}
              <div className="p-3 bg-secondary/30 backdrop-blur-xl border-t border-white/5 sticky bottom-0 mt-auto">
                {isCreating ? (
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/5 px-2.5 py-1.5 ring-offset-background transition-all focus-within:ring-2 focus-within:ring-accent/50">
                        <input 
                          autoFocus
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                          placeholder="Project name..."
                          className="bg-transparent border-none text-[13px] font-medium text-foreground focus:outline-none flex-1 placeholder:text-white/20"
                        />
                        {isSubmitting ? (
                          <Loader2 size={14} className="animate-spin text-accent" />
                        ) : (
                          <button onClick={() => setIsCreating(false)} className="text-white/20 hover:text-white transition-colors">
                            <X size={14} />
                          </button>
                        )}
                     </div>
                     <button
                        onClick={handleCreateProject}
                        disabled={!newProjectName.trim() || isSubmitting}
                        className="w-full py-1.5 bg-accent text-[12px] font-black uppercase tracking-widest text-white rounded-xl shadow-lg shadow-accent/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                     >
                        Create Project
                     </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full h-10 flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-dashed border-white/10 rounded-xl hover:bg-white/[0.02]"
                  >
                    <Plus size={16} />
                    <span>Create New</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
