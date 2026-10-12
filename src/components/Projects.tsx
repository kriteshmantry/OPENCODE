import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DecryptText from './DecryptText'
import SubmitProjectModal from './SubmitProjectModal'
import { getProjects, isSupabaseConfigured } from '../lib/supabase'
import type { Project } from '../types/database'

export default function Projects() {
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [dataSource, setDataSource] = useState<'supabase' | 'local'>('local')

  const loadProjects = async () => {
    setLoading(true)
    const { data, source } = await getProjects()
    setProjectsList(data)
    setDataSource(source)
    setLoading(false)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleProjectAdded = (newProj: Project) => {
    setProjectsList(prev => [newProj, ...prev])
  }

  const allTags = ['All', ...Array.from(new Set(projectsList.flatMap(p => p.tags || [])))]
  const filtered = activeTag === 'All' ? projectsList : projectsList.filter(p => p.tags?.includes(activeTag))

  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-xs text-accent uppercase tracking-[0.2em]">
                // open source repositories
              </p>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-borderc bg-card text-muted-fg">
                {isSupabaseConfigured() ? '⚡ Supabase DB' : '📦 Local Store'}
              </span>
            </div>
            <DecryptText
              text="Tools we built and ship."
              tag="h2"
              className="font-mono text-4xl md:text-5xl font-black text-fg"
              delay={150}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Submit Project Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 font-mono text-xs bg-primary text-bg font-bold rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <span>+</span> submit project
            </motion.button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map(tag => (
            <motion.button
              key={tag}
              onClick={() => setActiveTag(tag)}
              whileTap={{ scale: 0.95 }}
              className={`font-mono text-xs px-3 py-1.5 border rounded-sm transition-colors ${
                activeTag === tag
                  ? 'border-primary/60 bg-primary/15 text-primary'
                  : 'border-borderc text-muted-fg hover:border-fg/30 hover:text-fg'
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center font-mono text-muted-fg flex flex-col items-center gap-3">
            <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Decrypting repository catalog...</span>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(project => (
                <ProjectCard key={project.id || project.name} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <SubmitProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -4, rotateX: 2, rotateY: 1 }}
      style={{ transformStyle: 'preserve-3d', perspective: '600px' }}
      className="block bg-card border border-borderc rounded-sm p-5 hover:border-primary/30 transition-colors group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-mono font-bold text-fg group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <div className="flex items-center gap-1 text-muted-fg">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
          </svg>
          <span className="font-mono text-xs">{project.stars}</span>
        </div>
      </div>

      <p className="text-sm text-muted-fg leading-relaxed mb-4">{project.desc}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {project.tags?.map(tag => (
            <span
              key={tag}
              className="font-mono text-xs px-2 py-0.5 bg-muted/60 text-muted-fg rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: project.langColor || '#00ff41' }}
          />
          <span className="font-mono text-xs text-muted-fg">{project.lang}</span>
        </div>
      </div>
    </motion.a>
  )
}

