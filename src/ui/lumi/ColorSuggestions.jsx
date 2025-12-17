import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════
// 🎨 COLOR SUGGESTIONS - Ronds de couleurs cliquables
// ═══════════════════════════════════════════════════════════════════

const PRESET_COLORS = [
  { name: 'Rose', hex: '#F472B6' },
  { name: 'Violet', hex: '#A78BFA' },
  { name: 'Bleu', hex: '#3B82F6' },
  { name: 'Cyan', hex: '#22D3EE' },
  { name: 'Vert', hex: '#34D399' },
]

function ColorSuggestions({ onColorSelect, onOpenPalette }) {
  const [hoveredColor, setHoveredColor] = useState(null)

  const handleColorClick = (color) => {
    onColorSelect(color.name.toLowerCase())
  }

  return (
    <motion.div 
      className="flex items-center gap-3 mt-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* 5 Ronds de couleurs prédéfinies */}
      {PRESET_COLORS.map((color, index) => (
        <motion.button
          key={color.name}
          className="relative group"
          onClick={() => handleColorClick(color)}
          onMouseEnter={() => setHoveredColor(color.name)}
          onMouseLeave={() => setHoveredColor(null)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.3 + index * 0.08,
            type: 'spring',
            damping: 15,
            stiffness: 300,
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-md"
            style={{ background: color.hex }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.6 }}
          />
          
          {/* Color circle */}
          <div
            className="relative w-11 h-11 rounded-full border-[3px] border-white cursor-pointer"
            style={{ 
              background: color.hex,
              boxShadow: `0 4px 15px ${color.hex}40`,
            }}
          />
          
          {/* Tooltip */}
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
            style={{
              background: '#1E1B4B',
              color: 'white',
            }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ 
              opacity: hoveredColor === color.name ? 1 : 0,
              y: hoveredColor === color.name ? 0 : -5,
            }}
          >
            {color.name}
          </motion.div>
        </motion.button>
      ))}

      {/* Bouton "+" pour palette personnalisée */}
      <motion.button
        className="relative group"
        onClick={() => onOpenPalette && onOpenPalette()}
        onMouseEnter={() => setHoveredColor('custom')}
        onMouseLeave={() => setHoveredColor(null)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.3 + PRESET_COLORS.length * 0.08,
          type: 'spring',
          damping: 15,
          stiffness: 300,
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-md"
          style={{ background: 'linear-gradient(135deg, #F472B6, #A78BFA, #22D3EE)' }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.4 }}
        />
        
        {/* Plus circle */}
        <div
          className="relative w-11 h-11 rounded-full border-[3px] border-white cursor-pointer flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          }}
        >
          <Plus className="w-5 h-5 text-[#1E1B4B]" strokeWidth={3} />
        </div>
        
        {/* Tooltip */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
          style={{
            background: '#1E1B4B',
            color: 'white',
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ 
            opacity: hoveredColor === 'custom' ? 1 : 0,
            y: hoveredColor === 'custom' ? 0 : -5,
          }}
        >
          Plus de couleurs
        </motion.div>
      </motion.button>
    </motion.div>
  )
}

export default ColorSuggestions
