// src/components/MascotModal.tsx
// Interactive 3D Mascot Showcase & Inspector for "BYTE"
// Allows full 360 inspection, real-time theme syncing, and one-click GLB export.

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { MascotCanvas, exportGLB } from './OpenCodeMascot'

interface MascotModalProps {
  isOpen: boolean
  onClose: () => void
  theme?: 'green' | 'blue'
}

export default function MascotModal({ isOpen, onClose, theme = 'green' }: MascotModalProps) {
  const rootGroupRef = useRef<THREE.Group | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  const handleExport = async () => {
    if (!rootGroupRef.current) return
    setIsExporting(true)
    try {
      await exportGLB(rootGroupRef.current, 'opencode-byte.glb')
      setExportNotice('Exported opencode-byte.glb successfully!')
      setTimeout(() => setExportNotice(null), 3500)
    } catch (err: any) {
      setExportNotice('Export failed: ' + (err?.message || 'Unknown error'))
      setTimeout(() => setExportNotice(null), 4000)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="relative w-full max-w-2xl bg-card border border-primary/40 rounded-lg shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] overflow-hidden z-10 flex flex-col font-mono"
          >
            {/* Window title bar */}
            <div className="px-5 py-3 border-b border-borderc bg-bg/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold text-primary tracking-wide">
                  BYTE // 3D CYBER MASCOT INSPECTOR
                </span>
                <span className="text-muted-fg text-[11px] hidden sm:inline">
                  (v1.0 - Procedural Three.js)
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded border border-borderc text-muted-fg hover:text-primary hover:border-primary transition-colors flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Viewport & 3D Stage */}
            <div className="relative w-full h-[360px] bg-bg/95 grid-bg overflow-hidden flex items-center justify-center">
              {/* Scanline overlay */}
              <div className="scanlines absolute inset-0 pointer-events-none" />

              {/* Live 3D Mascot Canvas */}
              <MascotCanvas
                theme={theme}
                style={{ width: '100%', height: '100%' }}
                onRootReady={(grp) => {
                  rootGroupRef.current = grp
                }}
              />

              {/* Cursor interactive hint */}
              <div className="absolute top-3 left-4 px-2.5 py-1 rounded border border-borderc bg-card/80 backdrop-blur text-[11px] text-muted-fg pointer-events-none flex items-center gap-1.5">
                <span className="text-accent">&gt;</span>
                <span>Move cursor to guide head tracking & eye blinks</span>
              </div>

              {/* Export feedback toast */}
              {exportNotice && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded bg-primary text-bg font-bold text-xs shadow-lg animate-fade-in">
                  {exportNotice}
                </div>
              )}
            </div>

            {/* Spec & Details Footer */}
            <div className="p-5 border-t border-borderc bg-card/60 flex flex-col gap-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded border border-borderc/60 bg-bg/40">
                  <span className="text-[10px] text-muted-fg block">MODEL</span>
                  <span className="text-fg font-semibold">BYTE Terminal Bot</span>
                </div>
                <div className="p-2 rounded border border-borderc/60 bg-bg/40">
                  <span className="text-[10px] text-muted-fg block">POLY COUNT</span>
                  <span className="text-fg font-semibold">~3.5k Triangles</span>
                </div>
                <div className="p-2 rounded border border-borderc/60 bg-bg/40">
                  <span className="text-[10px] text-muted-fg block">TEXTURES</span>
                  <span className="text-fg font-semibold">0 KB (Procedural)</span>
                </div>
                <div className="p-2 rounded border border-borderc/60 bg-bg/40">
                  <span className="text-[10px] text-muted-fg block">THEME COLOR</span>
                  <span className="text-primary font-semibold uppercase">{theme}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-fg hidden sm:inline">
                  Idle float, eye blink (2–5s), damping cursor tracker active.
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="px-3.5 py-1.5 rounded border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20 hover:border-primary transition-all text-xs font-bold cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{isExporting ? 'Exporting...' : 'Export GLB (.glb)'}</span>
                    <span className="text-accent">&darr;</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded border border-borderc text-muted-fg hover:text-fg hover:border-muted transition-colors text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
