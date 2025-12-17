import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Pipette, RotateCcw } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// 🎨 COLOR PALETTE MODAL - Version 1.5 FIXED
// Props: onSelect, onClose, currentColor
// ═══════════════════════════════════════════════════════════════════

// Palette de 24 couleurs (8x3)
const COLOR_PALETTE = [
  '#F472B6', '#EC4899', '#A855F7', '#8B5CF6', '#7C3AED', '#6366F1', '#3B82F6', '#0EA5E9',
  '#22D3EE', '#14B8A6', '#10B981', '#34D399', '#22C55E', '#84CC16', '#EAB308', '#F59E0B',
  '#FB923C', '#F97316', '#EF4444', '#E11D48', '#9CA3AF', '#6B7280', '#374151', '#FFFFFF',
]

const COLOR_NAMES = {
  '#F472B6': 'Rose clair', '#EC4899': 'Rose vif', '#A855F7': 'Violet clair', '#8B5CF6': 'Violet',
  '#7C3AED': 'Violet foncé', '#6366F1': 'Indigo', '#3B82F6': 'Bleu', '#0EA5E9': 'Bleu ciel',
  '#22D3EE': 'Cyan', '#14B8A6': 'Teal', '#10B981': 'Émeraude', '#34D399': 'Vert clair',
  '#22C55E': 'Vert', '#84CC16': 'Lime', '#EAB308': 'Jaune', '#F59E0B': 'Ambre',
  '#FB923C': 'Orange clair', '#F97316': 'Orange', '#EF4444': 'Rouge', '#E11D48': 'Rose foncé',
  '#9CA3AF': 'Gris clair', '#6B7280': 'Gris', '#374151': 'Gris foncé', '#FFFFFF': 'Blanc',
}

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

function ColorPaletteModal({ onSelect, onClose, currentColor }) {
  const [selectedColor, setSelectedColor] = useState(currentColor || null)

  const handleApply = () => {
    if (selectedColor) {
      onSelect(selectedColor)
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 rounded-3xl"
        style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-[280px]"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#12121a',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div 
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)' }}
          >
            <div className="flex items-center gap-2">
              <Pipette className="w-4 h-4 text-white" />
              <h3 className="font-bold text-sm text-white">Choisis ta couleur</h3>
            </div>
            <motion.button
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/20"
              onClick={onClose}
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Preview */}
            {selectedColor && (
              <motion.div 
                className="mb-4 flex items-center gap-3 p-3 rounded-xl"
                style={{ background: '#1a1a2e' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0"
                  style={{ 
                    background: selectedColor,
                    boxShadow: `0 4px 20px ${selectedColor}50`,
                    border: '2px solid rgba(255,255,255,0.1)',
                  }}
                />
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Preview ✨</p>
                  <p className="font-semibold text-sm" style={{ color: '#FFFFFF' }}>{COLOR_NAMES[selectedColor] || selectedColor}</p>
                </div>
              </motion.div>
            )}

            {/* Grille 8x3 */}
            <div className="grid grid-cols-8 gap-1.5 mb-4">
              {COLOR_PALETTE.map((color, i) => (
                <motion.button
                  key={i}
                  className="relative w-7 h-7 rounded-lg cursor-pointer"
                  style={{ 
                    background: color,
                    border: selectedColor === color ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: selectedColor === color ? `0 0 12px ${color}60` : 'none',
                  }}
                  onClick={() => setSelectedColor(color)}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedColor === color && (
                    <Check 
                      className="w-4 h-4 absolute inset-0 m-auto" 
                      style={{ color: isLightColor(color) ? '#1E1B4B' : 'white' }} 
                      strokeWidth={3}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                className="flex-1 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5"
                style={{ background: '#1a1a2e', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={onClose}
                whileHover={{ background: '#252542' }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Annuler
              </motion.button>
              <motion.button
                className="flex-1 py-2.5 rounded-xl font-medium text-xs text-white flex items-center justify-center gap-1.5"
                style={{
                  background: selectedColor 
                    ? 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)' 
                    : '#1a1a2e',
                  opacity: selectedColor ? 1 : 0.5,
                }}
                onClick={handleApply}
                disabled={!selectedColor}
                whileHover={selectedColor ? { scale: 1.02 } : {}}
                whileTap={selectedColor ? { scale: 0.98 } : {}}
              >
                <Check className="w-3.5 h-3.5" />
                Valider
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ColorPaletteModal
