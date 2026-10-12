import { createClient } from '@supabase/supabase-js'
import type { Project, ClubApplication, NewProjectInput, NewApplicationInput } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key'
  )
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const DEFAULT_PROJECTS: Project[] = [
  {
    name: 'VulnScan',
    desc: 'Automated vulnerability scanner with CVE correlation and severity scoring. OWASP Top-10 coverage.',
    tags: ['Scanner', 'Automation'],
    stars: 445,
    lang: 'Python',
    langColor: '#3572A5',
    url: 'https://github.com/nullsec-collective/vulnscan',
  },
  {
    name: 'BruteForge',
    desc: 'High-performance password audit framework supporting 40+ hash types with GPU acceleration.',
    tags: ['Password', 'Cryptography'],
    stars: 312,
    lang: 'Rust',
    langColor: '#dea584',
    url: 'https://github.com/nullsec-collective/bruteforge',
  },
  {
    name: 'MemVault',
    desc: 'Memory forensics toolkit for live incident response. Dump, analyze, and correlate process artifacts.',
    tags: ['Forensics', 'IR'],
    stars: 234,
    lang: 'C++',
    langColor: '#f34b7d',
    url: 'https://github.com/nullsec-collective/memvault',
  },
  {
    name: 'NullTrace',
    desc: 'Multi-hop network packet anonymizer. Routes traffic through randomized relay chains with E2E encryption.',
    tags: ['Network', 'Privacy'],
    stars: 189,
    lang: 'Go',
    langColor: '#00ADD8',
    url: 'https://github.com/nullsec-collective/nulltrace',
  },
  {
    name: 'CryptoMesh',
    desc: 'Peer-to-peer encrypted messaging protocol with perfect forward secrecy and deniable authentication.',
    tags: ['Cryptography', 'P2P'],
    stars: 156,
    lang: 'Rust',
    langColor: '#dea584',
    url: 'https://github.com/nullsec-collective/cryptomesh',
  },
  {
    name: 'PhishKit',
    desc: 'Authorized phishing simulation platform for security awareness training. Full campaign analytics.',
    tags: ['Social Engineering', 'Automation'],
    stars: 98,
    lang: 'TypeScript',
    langColor: '#3178c6',
    url: 'https://github.com/nullsec-collective/phishkit',
  },
]

// Fetch all projects from Supabase or fallback to Local Storage / defaults
export async function getProjects(): Promise<{ data: Project[]; source: 'supabase' | 'local' }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('stars', { ascending: false })

      if (!error && data && data.length > 0) {
        return { data: data as Project[], source: 'supabase' }
      }
      if (error) {
        console.warn('Supabase projects query returned error:', error.message)
      }
    } catch (err) {
      console.error('Error fetching projects from Supabase:', err)
    }
  }

  // Local fallback
  const stored = localStorage.getItem('opencode_custom_projects')
  let customProjects: Project[] = []
  if (stored) {
    try {
      customProjects = JSON.parse(stored)
    } catch {
      customProjects = []
    }
  }

  return {
    data: [...customProjects, ...DEFAULT_PROJECTS],
    source: 'local',
  }
}

// Create a new Project in Supabase
export async function createProject(projectInput: NewProjectInput): Promise<{ success: boolean; data?: Project; error?: string }> {
  const newProject: Project = {
    ...projectInput,
    stars: projectInput.stars || 0,
    created_at: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true, data: data as Project }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Database insert failed' }
    }
  }

  // Fallback: save to localStorage demo store
  const stored = localStorage.getItem('opencode_custom_projects')
  const existing: Project[] = stored ? JSON.parse(stored) : []
  newProject.id = `local-${Date.now()}`
  localStorage.setItem('opencode_custom_projects', JSON.stringify([newProject, ...existing]))

  return {
    success: true,
    data: newProject,
  }
}

// Submit a membership / joining application
export async function submitApplication(appInput: NewApplicationInput): Promise<{ success: boolean; id?: string; error?: string; source: 'supabase' | 'local' }> {
  const applicationPayload = {
    ...appInput,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationPayload])
        .select('id')
        .single()

      if (error) {
        return { success: false, error: error.message, source: 'supabase' }
      }
      return { success: true, id: data?.id, source: 'supabase' }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to submit application', source: 'supabase' }
    }
  }

  // Demo / local storage fallback
  const stored = localStorage.getItem('opencode_applications')
  const existing: any[] = stored ? JSON.parse(stored) : []
  const localId = `APP-LOC-${Math.floor(100000 + Math.random() * 900000)}`
  const savedItem = { ...applicationPayload, id: localId }
  localStorage.setItem('opencode_applications', JSON.stringify([savedItem, ...existing]))

  return { success: true, id: localId, source: 'local' }
}
