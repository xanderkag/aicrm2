'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Project {
  id: number
  name: string
  schema_name: string
}

interface ProjectContextType {
  projects: Project[]
  selectedProject: Project | null
  setSelectedProject: (project: Project) => void
  loading: boolean
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError(null)
        const response = await fetch('/api/projects')
        const data = await response.json()
        
        if (Array.isArray(data)) {
          setProjects(data)
          if (data.length > 0) {
            // Default to the first project or the one saved in localStorage
            const savedProjectId = typeof window !== 'undefined' ? localStorage.getItem('selectedProjectId') : null
            const savedProject = data.find((p: Project) => p.id.toString() === savedProjectId)
            setSelectedProject(savedProject || data[0])
          }
        } else {
          console.error('API did not return an array:', data)
          setError('Failed to load projects')
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setError('Connection error')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleSetSelectedProject = (project: Project) => {
    setSelectedProject(project)
    localStorage.setItem('selectedProjectId', project.id.toString())
  }

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      selectedProject, 
      setSelectedProject: handleSetSelectedProject,
      loading 
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
