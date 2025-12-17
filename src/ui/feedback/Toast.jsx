import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Info, AlertTriangle } from 'lucide-react'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'

// ═══════════════════════════════════════════════════════════════════
// 🔔 TOAST NOTIFICATION
// ═══════════════════════════════════════════════════════════════════

const TOAST_ICONS = {
  success: Check,
  error: X,
  info: Info,
  warning: AlertTriangle,
}

const TOAST_COLORS = {
  success: '#34D399',
  error: '#EF4444',
  info: '#3B82F6',
  warning: '#FBBF24',
}

function Toast() {
  const toast = useEditorStore((s) => s.toast)
  const hideToast = useEditorStore((s) => s.hideToast)
  const { colors } = useTheme()

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg"
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${TOAST_COLORS[toast.type]}20`,
            }}
          >
            {/* Icon */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `${TOAST_COLORS[toast.type]}20` }}
            >
              {React.createElement(TOAST_ICONS[toast.type] || Info, {
                className: 'w-4 h-4',
                style: { color: TOAST_COLORS[toast.type] },
              })}
            </div>

            {/* Message */}
            <span
              className="text-sm font-medium"
              style={{ color: colors.text.primary }}
            >
              {toast.message}
            </span>

            {/* Close button */}
            <motion.button
              className="w-6 h-6 rounded-full flex items-center justify-center ml-2"
              style={{ background: colors.border }}
              onClick={hideToast}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-3 h-3" style={{ color: colors.text.muted }} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
