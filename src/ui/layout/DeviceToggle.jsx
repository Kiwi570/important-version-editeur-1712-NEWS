import React from 'react'
import { motion } from 'framer-motion'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'

// ═══════════════════════════════════════════════════════════════════
// 📱 DEVICE TOGGLE - Preview responsive
// ═══════════════════════════════════════════════════════════════════

const DEVICES = [
  { id: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' },
  { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' },
]

function DeviceToggle() {
  const previewDevice = useEditorStore((s) => s.previewDevice)
  const setPreviewDevice = useEditorStore((s) => s.setPreviewDevice)
  const { colors, gradient } = useTheme()

  return (
    <div 
      className="flex items-center gap-1 p-1 rounded-xl"
      style={{ 
        background: colors.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      {DEVICES.map((device) => {
        const isActive = previewDevice === device.id
        const Icon = device.icon
        
        return (
          <motion.button
            key={device.id}
            className="relative flex items-center justify-center w-10 h-8 rounded-lg"
            onClick={() => setPreviewDevice(device.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`${device.label} (${device.width})`}
          >
            {/* Active background */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{ background: gradient }}
                layoutId="deviceToggle"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            
            <Icon 
              className="w-4 h-4 relative z-10"
              style={{ 
                color: isActive ? 'white' : colors.text.muted,
              }}
            />
          </motion.button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 📊 DEVICE INFO BADGE
// ═══════════════════════════════════════════════════════════════════

export function DeviceInfoBadge() {
  const previewDevice = useEditorStore((s) => s.previewDevice)
  const { colors } = useTheme()
  
  if (previewDevice === 'desktop') return null
  
  const deviceInfo = DEVICES.find(d => d.id === previewDevice)
  
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ 
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {React.createElement(deviceInfo.icon, {
        className: 'w-4 h-4',
        style: { color: colors.accent.primary },
      })}
      <span 
        className="text-sm font-medium"
        style={{ color: colors.text.muted }}
      >
        {deviceInfo.label} ({deviceInfo.width})
      </span>
    </motion.div>
  )
}

export default DeviceToggle
