import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, EyeOff, Undo2, Redo2, Download, 
  Play, Sparkles, Settings, HelpCircle 
} from 'lucide-react'
import { useEditorStore } from '@core/state/editorStore'
import { useSiteStore } from '@core/state/siteStore'
import { useTheme } from '@core/theme/ThemeProvider'
import DeviceToggle from './DeviceToggle'
import ThemeSelector from '@ui/common/ThemeSelector'

// ═══════════════════════════════════════════════════════════════════
// 🎛️ HEADER - Barre de contrôle principale
// ═══════════════════════════════════════════════════════════════════

function Header() {
  const mode = useEditorStore((s) => s.mode)
  const toggleMode = useEditorStore((s) => s.toggleMode)
  const lumiOpen = useEditorStore((s) => s.lumiOpen)
  const toggleLumi = useEditorStore((s) => s.toggleLumi)
  const openModal = useEditorStore((s) => s.openModal)
  
  const undo = useSiteStore((s) => s.undo)
  const redo = useSiteStore((s) => s.redo)
  const canUndo = useSiteStore((s) => s.canUndo)
  const canRedo = useSiteStore((s) => s.canRedo)
  
  const { colors, gradient } = useTheme()

  return (
    <header 
      className="h-14 flex items-center justify-between px-4 relative z-30"
      style={{ 
        background: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {/* ═══ LEFT - Logo & Brand ═══ */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: gradient }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🫧
          </motion.div>
          <div className="flex items-center gap-2">
            <span 
              className="font-bold"
              style={{ color: colors.text.primary }}
            >
              Bulle
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ 
                background: `${colors.accent.primary}20`,
                color: colors.accent.primary,
              }}
            >
              v1.7
            </span>
          </div>
        </motion.div>

        {/* Separator */}
        <div 
          className="w-px h-6"
          style={{ background: colors.border }}
        />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <HeaderButton
            icon={Undo2}
            onClick={undo}
            disabled={!canUndo()}
            tooltip="Annuler (⌘Z)"
            colors={colors}
          />
          <HeaderButton
            icon={Redo2}
            onClick={redo}
            disabled={!canRedo()}
            tooltip="Refaire (⌘⇧Z)"
            colors={colors}
          />
        </div>
      </div>

      {/* ═══ CENTER - Device Toggle ═══ */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <DeviceToggle />
        
        {/* Preview Mode Toggle */}
        <motion.button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: mode === 'preview' ? gradient : colors.surface,
            border: `1px solid ${mode === 'preview' ? 'transparent' : colors.border}`,
          }}
          onClick={toggleMode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {mode === 'preview' ? (
            <EyeOff className="w-4 h-4 text-white" />
          ) : (
            <Eye className="w-4 h-4" style={{ color: colors.text.muted }} />
          )}
          <span 
            className="text-sm font-medium"
            style={{ color: mode === 'preview' ? 'white' : colors.text.muted }}
          >
            {mode === 'preview' ? 'Éditer' : 'Preview'}
          </span>
        </motion.button>
      </div>

      {/* ═══ RIGHT - Actions ═══ */}
      <div className="flex items-center gap-3">
        {/* Theme Selector */}
        <ThemeSelector />

        {/* Bulle Toggle */}
        <motion.button
          className="flex items-center gap-2 px-3 py-2 rounded-xl relative overflow-hidden"
          style={{
            background: lumiOpen ? gradient : colors.surface,
            border: `1px solid ${lumiOpen ? 'transparent' : colors.border}`,
          }}
          onClick={toggleLumi}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer effect when active */}
          {lumiOpen && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
          
          <motion.span
            animate={lumiOpen ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            🫧
          </motion.span>
          <span 
            className="text-sm font-medium relative z-10"
            style={{ color: lumiOpen ? 'white' : colors.text.muted }}
          >
            Bulle
          </span>
          <kbd 
            className="text-[10px] px-1.5 py-0.5 rounded relative z-10"
            style={{ 
              background: lumiOpen ? 'rgba(255,255,255,0.2)' : colors.border,
              color: lumiOpen ? 'white' : colors.text.light,
            }}
          >
            ⌘K
          </kbd>
        </motion.button>

        {/* Export Button */}
        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium"
          style={{ background: gradient }}
          onClick={() => openModal('export')}
          whileHover={{ scale: 1.02, boxShadow: `0 5px 20px ${colors.accent.primary}40` }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Exporter</span>
        </motion.button>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🔘 HEADER BUTTON
// ═══════════════════════════════════════════════════════════════════

function HeaderButton({ icon: Icon, onClick, disabled, tooltip, colors }) {
  return (
    <motion.button
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ 
        background: colors.surface,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.1, background: colors.surfaceHover }}
      whileTap={disabled ? {} : { scale: 0.9 }}
      title={tooltip}
    >
      <Icon 
        className="w-4 h-4" 
        style={{ color: colors.text.muted }}
      />
    </motion.button>
  )
}

export default Header
