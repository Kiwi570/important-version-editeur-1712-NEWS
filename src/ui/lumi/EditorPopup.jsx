import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Type, Layout, Check, Plus, Trash2, ChevronDown, ChevronLeft, Sparkles, Zap } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import DynamicIcon, { POPULAR_ICONS } from '@ui/common/DynamicIcon'

// ═══════════════════════════════════════════════════════════════════
// 🎨 EDITOR POPUP - Version 5.2 NAVY BODY + WHITE INPUTS
// ═══════════════════════════════════════════════════════════════════

const THEME = {
  navyDark: '#0a0a0f',
  navy: '#12121a',
  navyLight: '#1a1a2e',
  navyLighter: '#252542',
  white: '#FFFFFF',
  whiteMuted: '#F8FAFC',
  grayLight: '#F1F5F9',
  border: 'rgba(255, 255, 255, 0.15)',
  borderLight: '#E2E8F0',
  textWhite: '#FFFFFF',
  textDark: '#1F2937',
  textBlack: '#111827',
  textMuted: '#9CA3AF',
  textMutedDark: '#6B7280',
  rose: '#F472B6',
  violet: '#A78BFA',
  cyan: '#22D3EE',
  green: '#34D399',
  yellow: '#FBBF24',
  orange: '#FB923C',
  red: '#EF4444',
  blue: '#3B82F6',
  gradient: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)',
}

const SECTION_CONFIG = {
  hero: { emoji: '🦸', label: 'Hero', color: THEME.rose },
  features: { emoji: '✨', label: 'Features', color: THEME.violet },
  howItWorks: { emoji: '📋', label: 'Étapes', color: THEME.blue },
  pricing: { emoji: '💰', label: 'Tarifs', color: THEME.yellow },
  faq: { emoji: '❓', label: 'FAQ', color: THEME.cyan },
}

const COLOR_PRESETS = [
  { hex: '#F472B6', name: 'Rose' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#A78BFA', name: 'Violet' },
  { hex: '#8B5CF6', name: 'Purple' },
  { hex: '#22D3EE', name: 'Cyan' },
  { hex: '#06B6D4', name: 'Teal' },
  { hex: '#34D399', name: 'Vert' },
  { hex: '#10B981', name: 'Emerald' },
  { hex: '#FBBF24', name: 'Jaune' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#FB923C', name: 'Orange' },
  { hex: '#EF4444', name: 'Rouge' },
  { hex: '#3B82F6', name: 'Bleu' },
  { hex: '#6366F1', name: 'Indigo' },
  { hex: '#FFFFFF', name: 'Blanc' },
]

const LayoutPreview = ({ type, isActive }) => {
  const color = isActive ? 'rgba(255,255,255,0.9)' : THEME.textMuted
  const bgColor = isActive ? 'rgba(255,255,255,0.15)' : THEME.navyLighter
  
  const previews = {
    'centered': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="12" y="4" width="16" height="3" rx="1.5" fill={color} /><rect x="8" y="10" width="24" height="2" rx="1" fill={color} opacity="0.5" /><rect x="14" y="20" width="12" height="4" rx="2" fill={color} /></svg>),
    'split-left': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="4" width="14" height="20" rx="2" fill={bgColor} /><rect x="20" y="6" width="16" height="3" rx="1.5" fill={color} /><rect x="20" y="12" width="14" height="2" rx="1" fill={color} opacity="0.5" /></svg>),
    'split-right': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="24" y="4" width="14" height="20" rx="2" fill={bgColor} /><rect x="4" y="6" width="16" height="3" rx="1.5" fill={color} /><rect x="4" y="12" width="14" height="2" rx="1" fill={color} opacity="0.5" /></svg>),
    'grid-3': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="4" width="10" height="12" rx="2" fill={bgColor} /><rect x="15" y="4" width="10" height="12" rx="2" fill={bgColor} /><rect x="28" y="4" width="10" height="12" rx="2" fill={bgColor} /></svg>),
    'grid-2': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="4" width="17" height="12" rx="2" fill={bgColor} /><rect x="21" y="4" width="17" height="12" rx="2" fill={bgColor} /></svg>),
    'list': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="2" width="36" height="7" rx="2" fill={bgColor} /><rect x="2" y="11" width="36" height="7" rx="2" fill={color} opacity="0.3" /><rect x="2" y="20" width="36" height="7" rx="2" fill={color} opacity="0.2" /></svg>),
    'timeline': (<svg width="40" height="28" viewBox="0 0 40 28"><line x1="20" y1="2" x2="20" y2="26" stroke={color} strokeWidth="2" opacity="0.3" /><circle cx="20" cy="6" r="3" fill={color} /><circle cx="20" cy="14" r="3" fill={bgColor} stroke={color} strokeWidth="1.5" /><circle cx="20" cy="22" r="3" fill={color} opacity="0.5" /></svg>),
    'cards': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="6" width="10" height="16" rx="2" fill={bgColor} /><rect x="15" y="4" width="10" height="20" rx="2" fill={color} opacity="0.8" /><rect x="28" y="6" width="10" height="16" rx="2" fill={bgColor} /></svg>),
    'minimal': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="4" y="8" width="32" height="2" rx="1" fill={color} opacity="0.3" /><rect x="4" y="13" width="32" height="2" rx="1" fill={color} opacity="0.6" /><rect x="4" y="18" width="32" height="2" rx="1" fill={color} opacity="0.3" /></svg>),
    'accordion': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="2" width="36" height="7" rx="2" fill={color} /><rect x="4" y="11" width="32" height="4" rx="1" fill={color} opacity="0.3" /><rect x="2" y="17" width="36" height="5" rx="2" fill={bgColor} /></svg>),
    'grid': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="2" width="17" height="11" rx="2" fill={color} /><rect x="21" y="2" width="17" height="11" rx="2" fill={bgColor} /><rect x="2" y="15" width="17" height="11" rx="2" fill={bgColor} /><rect x="21" y="15" width="17" height="11" rx="2" fill={color} opacity="0.5" /></svg>),
    'simple': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="4" y="3" width="14" height="3" rx="1" fill={color} /><rect x="4" y="8" width="32" height="2" rx="1" fill={color} opacity="0.4" /><rect x="4" y="14" width="12" height="3" rx="1" fill={color} /><rect x="4" y="19" width="32" height="2" rx="1" fill={color} opacity="0.4" /></svg>),
    'table': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="3" width="36" height="5" rx="1" fill={color} /><line x1="2" y1="12" x2="38" y2="12" stroke={color} strokeWidth="1" opacity="0.3" /><line x1="2" y1="18" x2="38" y2="18" stroke={color} strokeWidth="1" opacity="0.3" /></svg>),
    'pricing-cards': (<svg width="40" height="28" viewBox="0 0 40 28"><rect x="2" y="6" width="10" height="16" rx="2" fill={bgColor} /><rect x="15" y="3" width="10" height="22" rx="2" fill={color} /><rect x="28" y="6" width="10" height="16" rx="2" fill={bgColor} /></svg>),
  }
  return previews[type] || previews['grid-3']
}

const LAYOUTS = {
  hero: [
    { id: 'centered', name: 'Centré', desc: 'Texte au centre' },
    { id: 'split-left', name: 'Image gauche', desc: 'Visuel à gauche' },
    { id: 'split-right', name: 'Image droite', desc: 'Visuel à droite' },
  ],
  features: [
    { id: 'grid-3', name: '3 colonnes', desc: 'Grille classique' },
    { id: 'grid-2', name: '2 colonnes', desc: 'Plus d\'espace' },
    { id: 'list', name: 'Liste', desc: 'Vertical' },
  ],
  howItWorks: [
    { id: 'timeline', name: 'Timeline', desc: 'Alternance' },
    { id: 'cards', name: 'Cartes', desc: 'En ligne' },
    { id: 'minimal', name: 'Minimal', desc: 'Épuré' },
  ],
  pricing: [
    { id: 'pricing-cards', name: 'Cartes', desc: 'Mise en avant' },
    { id: 'table', name: 'Tableau', desc: 'Comparaison' },
    { id: 'minimal', name: 'Minimal', desc: 'Simple' },
  ],
  faq: [
    { id: 'accordion', name: 'Accordéon', desc: 'Dépliable' },
    { id: 'grid', name: 'Grille', desc: '2 colonnes' },
    { id: 'simple', name: 'Simple', desc: 'Liste' },
  ],
}

const SPACING_OPTIONS = [
  { id: 'compact', name: 'Compact' },
  { id: 'normal', name: 'Normal' },
  { id: 'spacious', name: 'Spacieux' },
]

function EditorPopup() {
  const editorPopup = useEditorStore((s) => s.editorPopup)
  const closeEditorPopup = useEditorStore((s) => s.closeEditorPopup)
  const highlightSection = useEditorStore((s) => s.highlightSection)
  const [activeTab, setActiveTab] = useState('content')
  const [modCount, setModCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  
  if (!editorPopup) return null
  
  const { sectionId } = editorPopup
  const config = SECTION_CONFIG[sectionId] || SECTION_CONFIG.hero
  
  useEffect(() => { setActiveTab(editorPopup.type) }, [editorPopup.type])
  
  const incrementMod = () => {
    setModCount(c => c + 1)
    highlightSection(sectionId)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 600)
  }
  
  return (
    <AnimatePresence>
      <motion.div className="absolute inset-0 z-50 flex flex-col overflow-hidden" style={{ background: THEME.navy, borderRadius: 'inherit' }} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
        {/* HEADER */}
        <div className="px-4 pt-4 pb-3" style={{ background: THEME.navyDark }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: THEME.navyLight }} onClick={closeEditorPopup} whileHover={{ scale: 1.1, background: THEME.navyLighter }} whileTap={{ scale: 0.9 }}><ChevronLeft className="w-4 h-4" style={{ color: THEME.textMuted }} /></motion.button>
              <div className="flex items-center gap-2">
                <motion.span className="text-xl" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>{config.emoji}</motion.span>
                <span className="font-bold text-base" style={{ color: THEME.textWhite }}>{config.label}</span>
                <span style={{ color: THEME.textMuted }}>→</span>
                <span className="text-sm font-medium" style={{ color: config.color }}>{activeTab === 'content' ? 'Contenu' : 'Layout'}</span>
              </div>
            </div>
            <motion.button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: THEME.navyLight }} onClick={closeEditorPopup} whileHover={{ scale: 1.1, background: THEME.red + '30' }} whileTap={{ scale: 0.9 }}><X className="w-4 h-4" style={{ color: THEME.textMuted }} /></motion.button>
          </div>
          <div className="flex p-1 rounded-xl gap-1" style={{ background: THEME.navyLight }}>
            <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<Type className="w-4 h-4" />} label="Contenu" />
            <TabButton active={activeTab === 'layout'} onClick={() => setActiveTab('layout')} icon={<Layout className="w-4 h-4" />} label="Layout" />
          </div>
        </div>
        
        {/* BODY */}
        <div className="flex-1 overflow-y-auto" style={{ background: THEME.navy }}>
          <AnimatePresence mode="wait">
            {activeTab === 'content' ? (
              <motion.div key="content" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}><ContentTab sectionId={sectionId} onModify={incrementMod} /></motion.div>
            ) : (
              <motion.div key="layout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}><LayoutTab sectionId={sectionId} onModify={incrementMod} /></motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* FOOTER */}
        <div className="px-4 py-3 flex items-center justify-center gap-3" style={{ background: THEME.navyDark }}>
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}><Sparkles className="w-4 h-4" style={{ color: THEME.cyan }} /></motion.div>
          <span className="text-sm font-medium" style={{ background: THEME.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{modCount} modif{modCount > 1 ? 's' : ''} • Auto-sauvegardé</span>
          <motion.div className="w-2 h-2 rounded-full" style={{ background: THEME.green }} animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: THEME.green + '30' }} initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} exit={{ scale: 0, opacity: 0 }}><Check className="w-8 h-8" style={{ color: THEME.green }} /></motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <motion.button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold relative overflow-hidden" style={{ background: active ? THEME.gradient : 'transparent', color: active ? 'white' : THEME.textMuted }} onClick={onClick} whileTap={{ scale: 0.98 }} whileHover={!active ? { background: THEME.navyLighter } : {}}>
      {active && <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity }} />}
      <span className="relative z-10 flex items-center gap-2">{icon}{label}</span>
    </motion.button>
  )
}

function ContentTab({ sectionId, onModify }) {
  const section = useSiteStore((s) => s.getSection(sectionId))
  const updateContent = useSiteStore((s) => s.updateContent)
  const updateSectionColor = useSiteStore((s) => s.updateSectionColor)
  if (!section) return null
  const { content, colors: sectionColors = {} } = section
  const accentColors = [THEME.rose, THEME.violet, THEME.cyan]
  let colorIndex = 0
  const getAccent = () => accentColors[colorIndex++ % 3]
  const handleChange = (field, value) => { updateContent(sectionId, { [field]: value }); onModify() }
  const handleColorChange = (element, color) => { updateSectionColor(sectionId, element, color); onModify() }
  
  return (
    <div className="p-4 space-y-4">
      {content?.badge !== undefined && <FieldWithColor label="BADGE" accent={getAccent()} value={content.badge} onChange={(v) => handleChange('badge', v)} color={sectionColors.badge || THEME.violet} onColorChange={(c) => handleColorChange('badge', c)} placeholder="✨ Nouveau" />}
      {content?.title !== undefined && <FieldWithColor label="TITRE" accent={getAccent()} value={content.title} onChange={(v) => handleChange('title', v)} color={sectionColors.title || '#FFFFFF'} onColorChange={(c) => handleColorChange('title', c)} placeholder="Ton titre accrocheur..." />}
      {content?.titleHighlight !== undefined && <FieldHighlight label="MOT EN SURBRILLANCE" accent={getAccent()} value={content.titleHighlight} onChange={(v) => handleChange('titleHighlight', v)} placeholder="Le mot qui brille ✨" />}
      {content?.subtitle !== undefined && <FieldWithColor label="SOUS-TITRE" accent={getAccent()} value={content.subtitle} onChange={(v) => handleChange('subtitle', v)} color={sectionColors.subtitle || '#9CA3AF'} onColorChange={(c) => handleColorChange('subtitle', c)} placeholder="Description..." multiline />}
      {content?.ctaPrimary !== undefined && <FieldWithColor label="BOUTON PRINCIPAL" accent={getAccent()} value={content.ctaPrimary} onChange={(v) => handleChange('ctaPrimary', v)} color={sectionColors.ctaPrimary || THEME.violet} onColorChange={(c) => handleColorChange('ctaPrimary', c)} placeholder="Commencer" />}
      {content?.ctaSecondary !== undefined && <Field label="BOUTON SECONDAIRE" accent={getAccent()} value={content.ctaSecondary} onChange={(v) => handleChange('ctaSecondary', v)} placeholder="En savoir plus" />}
      <ItemsEditor sectionId={sectionId} section={section} onModify={onModify} />
    </div>
  )
}

function LayoutTab({ sectionId, onModify }) {
  const section = useSiteStore((s) => s.getSection(sectionId))
  const updateLayout = useSiteStore((s) => s.updateLayout)
  if (!section) return null
  const layouts = LAYOUTS[section.type] || LAYOUTS.hero
  const currentVariant = section.layout?.variant || layouts[0]?.id
  const currentSpacing = section.layout?.spacing || 'normal'
  const handleVariantChange = (variant) => { updateLayout(sectionId, { variant }); onModify() }
  const handleSpacingChange = (spacing) => { updateLayout(sectionId, { spacing }); onModify() }
  
  return (
    <div className="p-4 space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: THEME.rose }}>Disposition</label>
        <div className="space-y-2">
          {layouts.map((layout, index) => {
            const isActive = currentVariant === layout.id
            return (
              <motion.button key={layout.id} className="w-full flex items-center gap-3 p-3 rounded-xl text-left relative overflow-hidden" style={{ background: isActive ? THEME.gradient : THEME.white, border: `1px solid ${isActive ? 'transparent' : THEME.borderLight}` }} onClick={() => handleVariantChange(layout.id)} whileHover={{ scale: 1.01, borderColor: isActive ? 'transparent' : THEME.violet }} whileTap={{ scale: 0.99 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                {isActive && <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity }} />}
                <div className="w-12 h-8 rounded-lg flex items-center justify-center relative z-10" style={{ background: isActive ? 'rgba(255,255,255,0.1)' : THEME.grayLight }}><LayoutPreview type={layout.id} isActive={isActive} /></div>
                <div className="flex-1 relative z-10">
                  <div className="font-semibold text-sm" style={{ color: isActive ? THEME.textWhite : THEME.textBlack }}>{layout.name}</div>
                  <div className="text-xs" style={{ color: isActive ? 'rgba(255,255,255,0.7)' : THEME.textMutedDark }}>{layout.desc}</div>
                </div>
                {isActive && <motion.div className="w-6 h-6 rounded-full flex items-center justify-center relative z-10" style={{ background: 'rgba(255,255,255,0.2)' }} initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-4 h-4 text-white" /></motion.div>}
              </motion.button>
            )
          })}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: THEME.violet }}>Espacement</label>
        <div className="flex gap-2">
          {SPACING_OPTIONS.map((opt) => {
            const isActive = currentSpacing === opt.id
            return (
              <motion.button key={opt.id} className="flex-1 py-3 rounded-xl text-sm font-semibold relative overflow-hidden" style={{ background: isActive ? THEME.gradient : THEME.white, color: isActive ? THEME.textWhite : THEME.textBlack, border: `1px solid ${isActive ? 'transparent' : THEME.borderLight}` }} onClick={() => handleSpacingChange(opt.id)} whileHover={{ scale: 1.02, borderColor: THEME.violet }} whileTap={{ scale: 0.98 }}>
                {isActive && <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                <span className="relative z-10">{opt.name}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
      <motion.div className="p-3 rounded-xl flex items-center gap-3" style={{ background: THEME.white, border: `1px solid ${THEME.borderLight}` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: THEME.cyan + '20' }}><Zap className="w-4 h-4" style={{ color: THEME.cyan }} /></div>
        <p className="text-xs" style={{ color: THEME.textDark }}>Les changements s'appliquent en temps réel !</p>
      </motion.div>
    </div>
  )
}

function Field({ label, accent, value, onChange, placeholder, multiline }) {
  const Component = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>{label}</label>
      <Component value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all ${multiline ? 'min-h-[90px] resize-none' : ''}`} style={{ background: THEME.white, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} onFocus={(e) => e.target.style.borderColor = accent} onBlur={(e) => e.target.style.borderColor = THEME.borderLight} />
    </div>
  )
}

function FieldHighlight({ label, accent, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>{label}</label>
      <div className="relative rounded-xl p-[2px]" style={{ background: THEME.gradient }}>
        <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-[10px] text-sm font-medium focus:outline-none" style={{ background: THEME.white, color: THEME.textBlack }} />
      </div>
    </div>
  )
}

function FieldWithColor({ label, accent, value, onChange, color, onColorChange, placeholder, multiline }) {
  const [showColors, setShowColors] = useState(false)
  const Component = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>{label}</label>
      <div className="relative flex items-center">
        <Component 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder} 
          className={`w-full px-4 py-3 pr-14 rounded-xl text-sm font-medium focus:outline-none transition-all ${multiline ? 'min-h-[90px] resize-none' : ''}`} 
          style={{ background: THEME.white, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} 
          onFocus={(e) => e.target.style.borderColor = accent} 
          onBlur={(e) => e.target.style.borderColor = THEME.borderLight} 
        />
        <motion.button 
          className={`absolute right-3 w-7 h-7 rounded-lg ${multiline ? 'top-3' : 'top-1/2 -translate-y-1/2'}`}
          style={{ 
            background: color, 
            border: `2px solid ${THEME.navyLight}`, 
            boxShadow: `0 2px 8px ${color}50, inset 0 1px 2px rgba(255,255,255,0.3)` 
          }} 
          onClick={() => setShowColors(!showColors)} 
          whileHover={{ scale: 1.15, boxShadow: `0 4px 12px ${color}60` }} 
          whileTap={{ scale: 0.95 }} 
        />
        <AnimatePresence>
          {showColors && (
            <motion.div 
              className="absolute right-0 top-full mt-2 p-3 rounded-xl z-50" 
              style={{ background: THEME.white, border: `1px solid ${THEME.borderLight}`, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }} 
              initial={{ opacity: 0, y: -10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
            >
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PRESETS.map(({ hex, name }) => (
                  <motion.button 
                    key={hex} 
                    className="w-7 h-7 rounded-lg" 
                    style={{ 
                      background: hex, 
                      border: color === hex ? `2px solid ${THEME.navyDark}` : `2px solid ${THEME.borderLight}`, 
                      boxShadow: color === hex ? `0 0 10px ${hex}60` : 'none' 
                    }} 
                    onClick={() => { onColorChange(hex); setShowColors(false) }} 
                    whileHover={{ scale: 1.2, zIndex: 10 }} 
                    whileTap={{ scale: 0.9 }} 
                    title={name} 
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ItemsEditor({ sectionId, section, onModify }) {
  const [expanded, setExpanded] = useState(null)
  const updateItem = useSiteStore((s) => s.updateItem)
  const addItem = useSiteStore((s) => s.addItem)
  const removeItem = useSiteStore((s) => s.removeItem)
  const getCollection = () => { if (section.type === 'features') return 'items'; if (section.type === 'howItWorks') return 'steps'; if (section.type === 'pricing') return 'plans'; if (section.type === 'faq') return 'items'; return null }
  const getLabels = () => { if (section.type === 'features') return { singular: 'Feature', plural: 'Features' }; if (section.type === 'howItWorks') return { singular: 'Étape', plural: 'Étapes' }; if (section.type === 'pricing') return { singular: 'Plan', plural: 'Plans' }; if (section.type === 'faq') return { singular: 'Question', plural: 'Questions' }; return { singular: 'Item', plural: 'Items' } }
  const collection = getCollection()
  if (!collection) return null
  const items = section[collection] || []
  const labels = getLabels()
  const handleAdd = () => {
    const newItem = { id: Date.now().toString() }
    if (section.type === 'features') { newItem.icon = 'Star'; newItem.color = THEME.violet; newItem.title = 'Nouvelle feature'; newItem.description = 'Description' }
    else if (section.type === 'howItWorks') { newItem.number = items.length + 1; newItem.title = 'Nouvelle étape'; newItem.description = 'Description' }
    else if (section.type === 'pricing') { newItem.name = 'Nouveau plan'; newItem.price = '0€'; newItem.period = '/mois'; newItem.description = 'Description'; newItem.cta = 'Choisir' }
    else if (section.type === 'faq') { newItem.question = 'Nouvelle question ?'; newItem.answer = 'Réponse' }
    addItem(sectionId, collection, newItem); onModify(); setExpanded(items.length)
  }
  return (
    <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${THEME.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold uppercase tracking-wider" style={{ color: THEME.cyan }}>{labels.plural} ({items.length})</label>
        <motion.button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white relative overflow-hidden" style={{ background: THEME.gradient }} onClick={handleAdd} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity }} />
          <Plus className="w-3 h-3 relative z-10" /><span className="relative z-10">Ajouter</span>
        </motion.button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (<ItemAccordion key={item.id || index} item={item} index={index} type={section.type} expanded={expanded === index} onToggle={() => setExpanded(expanded === index ? null : index)} onUpdate={(data) => { updateItem(sectionId, collection, index, data); onModify() }} onRemove={() => { removeItem(sectionId, collection, index); onModify(); setExpanded(null) }} />))}
      </div>
    </div>
  )
}

function ItemAccordion({ item, index, type, expanded, onToggle, onUpdate, onRemove }) {
  const [showIconPicker, setShowIconPicker] = useState(false)
  const getTitle = () => { if (type === 'features') return item.title || 'Feature'; if (type === 'howItWorks') return item.title || 'Étape'; if (type === 'pricing') return item.name || 'Plan'; if (type === 'faq') return item.question || 'Question'; return `Item ${index + 1}` }
  const getIndicator = () => {
    if (type === 'features' && item.icon) return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color || THEME.violet}20` }}><DynamicIcon name={item.icon} size={16} color={item.color || THEME.violet} /></div>
    if (type === 'howItWorks') return <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: THEME.gradient }}>{item.number || index + 1}</div>
    if (type === 'pricing') return <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: THEME.yellow + '20' }}>💰</div>
    if (type === 'faq') return <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: THEME.cyan + '20' }}>❓</div>
    return null
  }
  return (
    <motion.div className="rounded-xl overflow-hidden" style={{ background: THEME.white, border: `1px solid ${expanded ? THEME.violet : THEME.borderLight}` }} layout>
      <button className="w-full flex items-center gap-3 p-3" onClick={onToggle}>
        {getIndicator()}
        <span className="flex-1 text-left text-sm font-medium truncate" style={{ color: THEME.textBlack }}>{getTitle()}</span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-4 h-4" style={{ color: THEME.textMutedDark }} /></motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div className="px-3 pb-3 space-y-3" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            {type === 'features' && (<>
              <div className="relative">
                <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.rose }}>Icône</label>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg w-full" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}` }} onClick={() => setShowIconPicker(!showIconPicker)}>
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${item.color || THEME.violet}20` }}><DynamicIcon name={item.icon} size={14} color={item.color || THEME.violet} /></div>
                  <span className="text-xs" style={{ color: THEME.textDark }}>{item.icon}</span>
                </button>
                <AnimatePresence>
                  {showIconPicker && (
                    <motion.div className="absolute left-0 right-0 mt-2 p-3 rounded-xl z-50 max-h-36 overflow-y-auto" style={{ background: THEME.white, border: `1px solid ${THEME.borderLight}`, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <div className="grid grid-cols-6 gap-1.5">{POPULAR_ICONS.slice(0, 24).map((iconName) => (<motion.button key={iconName} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.icon === iconName ? THEME.gradient : THEME.grayLight }} onClick={() => { onUpdate({ icon: iconName }); setShowIconPicker(false) }} whileHover={{ scale: 1.1 }}><DynamicIcon name={iconName} size={14} color={item.icon === iconName ? 'white' : THEME.textDark} /></motion.button>))}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.violet }}>Couleur</label>
                <div className="flex gap-1.5 flex-wrap">{COLOR_PRESETS.slice(0, 10).map(({ hex }) => (<motion.button key={hex} className="w-7 h-7 rounded-lg" style={{ background: hex, border: item.color === hex ? `2px solid ${THEME.navyDark}` : `1px solid ${THEME.borderLight}`, boxShadow: item.color === hex ? `0 0 8px ${hex}50` : 'none' }} onClick={() => onUpdate({ color: hex })} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} />))}</div>
              </div>
            </>)}
            {(type === 'features' || type === 'howItWorks') && (<div><label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.cyan }}>Titre</label><input value={item.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} placeholder="Titre..." /></div>)}
            {type === 'pricing' && (<><div><label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.rose }}>Nom</label><input value={item.name || ''} onChange={(e) => onUpdate({ name: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} placeholder="Nom du plan..." /></div><div className="flex gap-2"><div className="flex-1"><label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.violet }}>Prix</label><input value={item.price || ''} onChange={(e) => onUpdate({ price: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} placeholder="29€" /></div><div className="w-24"><label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.cyan }}>Période</label><input value={item.period || ''} onChange={(e) => onUpdate({ period: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} placeholder="/mois" /></div></div></>)}
            {type === 'faq' && (<div><label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.rose }}>Question</label><input value={item.question || ''} onChange={(e) => onUpdate({ question: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} placeholder="Votre question..." /></div>)}
            <div><label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: type === 'faq' ? THEME.violet : THEME.rose }}>{type === 'faq' ? 'Réponse' : 'Description'}</label><textarea value={type === 'faq' ? (item.answer || '') : (item.description || '')} onChange={(e) => onUpdate(type === 'faq' ? { answer: e.target.value } : { description: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm min-h-[60px] resize-none" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} placeholder={type === 'faq' ? 'Votre réponse...' : 'Description...'} /></div>
            {type === 'pricing' && (<div><label className="text-xs font-bold uppercase mb-1.5 block" style={{ color: THEME.cyan }}>Bouton</label><input value={item.cta || ''} onChange={(e) => onUpdate({ cta: e.target.value })} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: THEME.grayLight, border: `1px solid ${THEME.borderLight}`, color: THEME.textBlack }} placeholder="Choisir ce plan" /></div>)}
            <motion.button className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold" style={{ background: THEME.red + '15', color: THEME.red, border: `1px solid ${THEME.red}30` }} onClick={onRemove} whileHover={{ background: THEME.red + '25', scale: 1.01 }} whileTap={{ scale: 0.99 }}><Trash2 className="w-3 h-3" />Supprimer</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default EditorPopup
