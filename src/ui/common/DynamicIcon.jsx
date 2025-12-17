import React, { memo } from 'react'
import * as LucideIcons from 'lucide-react'
import { motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════
// 🎨 ICÔNES DYNAMIQUES LUCIDE
// ═══════════════════════════════════════════════════════════════════

// Mapping des icônes les plus utilisées (pour autocomplétion)
export const POPULAR_ICONS = [
  'Zap', 'Sparkles', 'Star', 'Heart', 'Shield', 'Lock',
  'Rocket', 'Globe', 'Users', 'TrendingUp', 'Award', 'Target',
  'Lightbulb', 'Palette', 'Code', 'Smartphone', 'Laptop', 'Cloud',
  'Mail', 'MessageCircle', 'Bell', 'Calendar', 'Clock', 'Check',
  'CheckCircle', 'ArrowRight', 'Play', 'Pause', 'Settings', 'Search',
  'Home', 'User', 'Camera', 'Image', 'Video', 'Music',
  'FileText', 'Folder', 'Download', 'Upload', 'Share', 'Link',
  'Eye', 'EyeOff', 'Edit', 'Trash', 'Plus', 'Minus',
  'X', 'Menu', 'MoreHorizontal', 'MoreVertical', 'ChevronDown', 'ChevronUp',
  'ChevronLeft', 'ChevronRight', 'ExternalLink', 'Copy', 'Clipboard',
  'Bookmark', 'Tag', 'Hash', 'AtSign', 'Send', 'Inbox',
  'Archive', 'Trash2', 'RefreshCw', 'RotateCcw', 'Save',
  'Layers', 'Layout', 'Grid', 'List', 'Filter', 'SortAsc',
  'BarChart', 'PieChart', 'Activity', 'Cpu', 'Database', 'Server',
  'Wifi', 'Bluetooth', 'Battery', 'Power', 'Plug', 'Headphones',
  'Mic', 'Volume2', 'VolumeX', 'Sun', 'Moon', 'CloudRain',
  'Thermometer', 'Droplet', 'Wind', 'Umbrella', 'Map', 'MapPin',
  'Navigation', 'Compass', 'Flag', 'Gift', 'ShoppingCart', 'ShoppingBag',
  'CreditCard', 'DollarSign', 'Percent', 'Truck', 'Package', 'Box',
  'Key', 'Unlock', 'LogIn', 'LogOut', 'UserPlus', 'UserMinus',
  'UserCheck', 'UserX', 'Users2', 'Building', 'Building2', 'Store',
  'Coffee', 'Pizza', 'Apple', 'Cake', 'Wine', 'Beer',
  'Plane', 'Car', 'Bus', 'Train', 'Bike', 'Anchor',
  'Bot', 'Brain', 'Fingerprint', 'QrCode', 'Scan', 'Maximize',
  'Minimize', 'Move', 'Crosshair', 'Focus', 'ZoomIn', 'ZoomOut',
]

// Catégories d'icônes pour le picker
export const ICON_CATEGORIES = {
  'Actions': ['Zap', 'Sparkles', 'Rocket', 'Play', 'Send', 'Download', 'Upload', 'Share', 'Check', 'Plus'],
  'Interface': ['Menu', 'Settings', 'Search', 'Filter', 'Grid', 'List', 'Layout', 'Eye', 'Edit', 'Trash'],
  'Communication': ['Mail', 'MessageCircle', 'Bell', 'Phone', 'Video', 'Mic', 'Send', 'Inbox', 'AtSign', 'Hash'],
  'Médias': ['Image', 'Camera', 'Video', 'Music', 'Headphones', 'Play', 'Pause', 'Volume2', 'Film', 'Tv'],
  'Business': ['TrendingUp', 'BarChart', 'PieChart', 'DollarSign', 'CreditCard', 'ShoppingCart', 'Briefcase', 'Building', 'Store', 'Package'],
  'Tech': ['Code', 'Laptop', 'Smartphone', 'Cloud', 'Database', 'Server', 'Cpu', 'Wifi', 'Globe', 'Bot'],
  'Social': ['Heart', 'Star', 'Users', 'User', 'Award', 'Gift', 'ThumbsUp', 'Share2', 'MessageCircle', 'UserPlus'],
  'Sécurité': ['Shield', 'Lock', 'Unlock', 'Key', 'Eye', 'EyeOff', 'Fingerprint', 'ShieldCheck', 'AlertTriangle', 'Ban'],
}

// ═══════════════════════════════════════════════════════════════════
// 🔧 COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

/**
 * Composant d'icône dynamique qui charge une icône Lucide par son nom
 * 
 * @param {string} name - Nom de l'icône Lucide (ex: "Zap", "Sparkles")
 * @param {number} size - Taille de l'icône en pixels
 * @param {string} color - Couleur de l'icône
 * @param {number} strokeWidth - Épaisseur du trait
 * @param {string} className - Classes CSS additionnelles
 * @param {boolean} animated - Activer les animations au hover
 * @param {string} animationType - Type d'animation ('bounce', 'spin', 'pulse', 'shake')
 */
function DynamicIcon({ 
  name = 'Sparkles',
  size = 24,
  color,
  strokeWidth = 2,
  className = '',
  animated = false,
  animationType = 'bounce',
  style = {},
  ...props 
}) {
  // Récupérer le composant d'icône
  const IconComponent = LucideIcons[name]
  
  // Fallback si l'icône n'existe pas
  if (!IconComponent) {
    console.warn(`DynamicIcon: L'icône "${name}" n'existe pas dans Lucide. Utilisation de Sparkles par défaut.`)
    const FallbackIcon = LucideIcons.Sparkles
    return (
      <FallbackIcon 
        size={size} 
        color={color} 
        strokeWidth={strokeWidth}
        className={className}
        style={style}
        {...props}
      />
    )
  }
  
  // Animations
  const animations = {
    bounce: {
      whileHover: { y: -3, scale: 1.1 },
      whileTap: { scale: 0.9 },
    },
    spin: {
      whileHover: { rotate: 180, scale: 1.1 },
      whileTap: { scale: 0.9 },
    },
    pulse: {
      whileHover: { scale: [1, 1.2, 1] },
      transition: { duration: 0.3 },
    },
    shake: {
      whileHover: { x: [-2, 2, -2, 2, 0] },
      transition: { duration: 0.3 },
    },
    glow: {
      whileHover: { filter: 'drop-shadow(0 0 8px currentColor)' },
    },
  }
  
  // Si animé, wrapper avec motion
  if (animated) {
    return (
      <motion.span
        className={`inline-flex ${className}`}
        style={style}
        {...animations[animationType]}
        {...props}
      >
        <IconComponent 
          size={size} 
          color={color} 
          strokeWidth={strokeWidth}
        />
      </motion.span>
    )
  }
  
  // Version simple sans animation
  return (
    <IconComponent 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      {...props}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🎭 COMPOSANTS SPÉCIALISÉS
// ═══════════════════════════════════════════════════════════════════

/**
 * Icône avec fond coloré (style feature card)
 */
export function IconBox({ 
  name, 
  color = '#A78BFA', 
  size = 24,
  boxSize = 48,
  rounded = 'xl',
  className = '',
}) {
  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  }
  
  return (
    <div 
      className={`flex items-center justify-center ${roundedClasses[rounded]} ${className}`}
      style={{
        width: boxSize,
        height: boxSize,
        background: `${color}20`,
        border: `1px solid ${color}30`,
      }}
    >
      <DynamicIcon name={name} size={size} color={color} />
    </div>
  )
}

/**
 * Icône avec badge de notification
 */
export function IconWithBadge({ 
  name, 
  badgeCount, 
  size = 24, 
  color,
  badgeColor = '#EF4444',
  ...props 
}) {
  return (
    <div className="relative inline-flex">
      <DynamicIcon name={name} size={size} color={color} {...props} />
      {badgeCount > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          style={{ background: badgeColor }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </motion.span>
      )}
    </div>
  )
}

/**
 * Groupe d'icônes empilées
 */
export function IconStack({ icons = [], size = 20, overlap = -8 }) {
  return (
    <div className="flex items-center">
      {icons.map((icon, index) => (
        <div
          key={index}
          className="relative"
          style={{ marginLeft: index > 0 ? overlap : 0, zIndex: icons.length - index }}
        >
          {typeof icon === 'string' ? (
            <DynamicIcon name={icon} size={size} />
          ) : (
            <IconBox name={icon.name} color={icon.color} size={size} boxSize={size + 12} />
          )}
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🔍 UTILITAIRES
// ═══════════════════════════════════════════════════════════════════

/**
 * Vérifie si une icône existe
 */
export function iconExists(name) {
  return !!LucideIcons[name]
}

/**
 * Recherche d'icônes par nom
 */
export function searchIcons(query) {
  if (!query) return POPULAR_ICONS
  
  const lowerQuery = query.toLowerCase()
  return Object.keys(LucideIcons).filter(name => 
    name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Obtenir toutes les icônes disponibles
 */
export function getAllIcons() {
  return Object.keys(LucideIcons).filter(key => 
    typeof LucideIcons[key] === 'function' && 
    key !== 'createLucideIcon' &&
    key !== 'default'
  )
}

// Export par défaut mémorisé pour les performances
export default memo(DynamicIcon)
