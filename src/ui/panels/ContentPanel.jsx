import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'
import DynamicIcon, { POPULAR_ICONS } from '@ui/common/DynamicIcon'

// ═══════════════════════════════════════════════════════════════════
// ✏️ CONTENT PANEL
// ═══════════════════════════════════════════════════════════════════

const COLOR_PRESETS = [
  '#A78BFA', '#F472B6', '#22D3EE', '#34D399', '#FBBF24',
  '#FB923C', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899',
  '#FFFFFF', '#9CA3AF', '#6B7280', '#374151', '#111827',
]

function ContentPanel() {
  const activeSection = useEditorStore((s) => s.activeSection)
  const highlightSection = useEditorStore((s) => s.highlightSection)
  const section = useSiteStore((s) => activeSection ? s.getSection(activeSection) : null)
  const updateContent = useSiteStore((s) => s.updateContent)
  const updateSectionColor = useSiteStore((s) => s.updateSectionColor)
  const updateItem = useSiteStore((s) => s.updateItem)
  const addItem = useSiteStore((s) => s.addItem)
  const removeItem = useSiteStore((s) => s.removeItem)
  
  const { colors, gradient } = useTheme()

  if (!activeSection || !section) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <motion.div
            className="text-5xl mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👆
          </motion.div>
          <p style={{ color: colors.text.muted }}>
            Sélectionne une section pour modifier son contenu
          </p>
        </div>
      </div>
    )
  }

  const { content, colors: sectionColors = {} } = section

  const handleContentChange = (field, value) => {
    updateContent(activeSection, { [field]: value })
    highlightSection(activeSection)
  }

  const handleColorChange = (element, color) => {
    updateSectionColor(activeSection, element, color)
    highlightSection(activeSection)
  }

  // Determine which fields to show based on section type
  const getCollection = () => {
    if (section.type === 'features') return 'items'
    if (section.type === 'howItWorks') return 'steps'
    if (section.type === 'pricing') return 'plans'
    if (section.type === 'faq') return 'items'
    return null
  }

  const getItemFields = () => {
    if (section.type === 'features') return ['icon', 'color', 'title', 'description']
    if (section.type === 'howItWorks') return ['number', 'title', 'description']
    if (section.type === 'pricing') return ['name', 'price', 'period', 'description', 'cta']
    if (section.type === 'faq') return ['question', 'answer']
    return []
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {/* Section badge */}
      <div 
        className="px-3 py-2 rounded-lg text-xs font-medium"
        style={{ 
          background: `${colors.accent.primary}15`,
          color: colors.accent.primary,
        }}
      >
        Section: {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
      </div>

      {/* Title */}
      {content?.title !== undefined && (
        <FieldGroup label="Titre" colors={colors}>
          <TextInput
            value={content.title}
            onChange={(v) => handleContentChange('title', v)}
            colors={colors}
            multiline
          />
          <ColorPicker
            value={sectionColors.title || '#FFFFFF'}
            onChange={(c) => handleColorChange('title', c)}
            colors={colors}
          />
        </FieldGroup>
      )}

      {/* Title Highlight */}
      {content?.titleHighlight !== undefined && (
        <FieldGroup label="Mot en gradient" colors={colors}>
          <TextInput
            value={content.titleHighlight}
            onChange={(v) => handleContentChange('titleHighlight', v)}
            placeholder="Le mot animé"
            colors={colors}
          />
        </FieldGroup>
      )}

      {/* Subtitle */}
      {content?.subtitle !== undefined && (
        <FieldGroup label="Sous-titre" colors={colors}>
          <TextInput
            value={content.subtitle}
            onChange={(v) => handleContentChange('subtitle', v)}
            colors={colors}
            multiline
          />
          <ColorPicker
            value={sectionColors.subtitle || '#9CA3AF'}
            onChange={(c) => handleColorChange('subtitle', c)}
            colors={colors}
          />
        </FieldGroup>
      )}

      {/* Badge */}
      {content?.badge !== undefined && (
        <FieldGroup label="Badge" colors={colors}>
          <TextInput
            value={content.badge}
            onChange={(v) => handleContentChange('badge', v)}
            placeholder="✨ Nouveau"
            colors={colors}
          />
          <ColorPicker
            value={sectionColors.badge || '#A78BFA'}
            onChange={(c) => handleColorChange('badge', c)}
            colors={colors}
          />
        </FieldGroup>
      )}

      {/* CTA Primary */}
      {content?.ctaPrimary !== undefined && (
        <FieldGroup label="Bouton principal" colors={colors}>
          <TextInput
            value={content.ctaPrimary}
            onChange={(v) => handleContentChange('ctaPrimary', v)}
            colors={colors}
          />
          <ColorPicker
            value={sectionColors.ctaPrimary || '#A78BFA'}
            onChange={(c) => handleColorChange('ctaPrimary', c)}
            colors={colors}
          />
        </FieldGroup>
      )}

      {/* CTA Secondary */}
      {content?.ctaSecondary !== undefined && (
        <FieldGroup label="Bouton secondaire" colors={colors}>
          <TextInput
            value={content.ctaSecondary}
            onChange={(v) => handleContentChange('ctaSecondary', v)}
            colors={colors}
          />
        </FieldGroup>
      )}

      {/* Items/Steps/Plans Editor */}
      {getCollection() && (
        <ItemsEditor
          label={section.type === 'features' ? 'Features' : 
                 section.type === 'howItWorks' ? 'Étapes' :
                 section.type === 'pricing' ? 'Plans' : 'Questions'}
          items={section[getCollection()] || []}
          sectionId={activeSection}
          collection={getCollection()}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
          highlightSection={highlightSection}
          colors={colors}
          gradient={gradient}
          itemFields={getItemFields()}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 🧩 SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════

function FieldGroup({ label, children, colors }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium" style={{ color: colors.text.muted }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, multiline, colors }) {
  const Component = multiline ? 'textarea' : 'input'
  return (
    <Component
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-lg text-sm outline-none transition-all ${multiline ? 'min-h-[80px] resize-none' : ''}`}
      style={{ background: colors.surface, border: `1px solid ${colors.border}`, color: colors.text.primary }}
    />
  )
}

function ColorPicker({ value, onChange, colors }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg w-full"
        style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-5 h-5 rounded-md" style={{ background: value, border: `1px solid ${colors.border}` }} />
        <span className="text-xs font-mono flex-1 text-left" style={{ color: colors.text.muted }}>{value}</span>
        <ChevronDown className="w-4 h-4" style={{ color: colors.text.muted, transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 right-0 mt-2 p-3 rounded-xl z-50"
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg ${value === color ? 'ring-2 ring-offset-2 scale-110' : ''}`}
                  style={{ background: color, ringColor: colors.accent.primary }}
                  onClick={() => { onChange(color); setIsOpen(false) }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ItemsEditor({ label, items, sectionId, collection, updateItem, addItem, removeItem, highlightSection, colors, gradient, itemFields }) {
  const [expanded, setExpanded] = useState(null)
  
  const handleAdd = () => {
    const newItem = {}
    if (itemFields.includes('title')) newItem.title = 'Nouveau'
    if (itemFields.includes('description')) newItem.description = 'Description'
    if (itemFields.includes('icon')) newItem.icon = 'Star'
    if (itemFields.includes('color')) newItem.color = '#A78BFA'
    if (itemFields.includes('number')) newItem.number = items.length + 1
    if (itemFields.includes('question')) newItem.question = 'Nouvelle question ?'
    if (itemFields.includes('answer')) newItem.answer = 'Réponse...'
    if (itemFields.includes('name')) newItem.name = 'Nouveau plan'
    if (itemFields.includes('price')) newItem.price = '0€'
    if (itemFields.includes('period')) newItem.period = '/mois'
    if (itemFields.includes('cta')) newItem.cta = 'Choisir'
    addItem(sectionId, collection, newItem)
    highlightSection(sectionId)
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium" style={{ color: colors.text.muted }}>{label} ({items.length})</label>
        <motion.button
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
          style={{ background: colors.surface }}
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-3 h-3" style={{ color: colors.accent.primary }} />
          <span style={{ color: colors.text.muted }}>Ajouter</span>
        </motion.button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div key={item.id} className="rounded-lg overflow-hidden" style={{ background: colors.surface, border: `1px solid ${colors.border}` }} layout>
            <button className="w-full flex items-center gap-3 p-3" onClick={() => setExpanded(expanded === index ? null : index)}>
              {item.icon && <DynamicIcon name={item.icon} size={16} color={item.color || colors.accent.primary} />}
              {item.number && <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: gradient }}>{item.number}</span>}
              <span className="flex-1 text-left text-sm truncate" style={{ color: colors.text.primary }}>{item.title || item.question || item.name || `Item ${index + 1}`}</span>
              <ChevronDown className="w-4 h-4" style={{ color: colors.text.muted, transform: expanded === index ? 'rotate(180deg)' : 'none' }} />
            </button>
            <AnimatePresence>
              {expanded === index && (
                <motion.div className="px-3 pb-3 space-y-3" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  {itemFields.map((field) => (
                    <div key={field}>
                      {field === 'icon' ? (
                        <IconSelector value={item.icon} onChange={(v) => { updateItem(sectionId, collection, index, { icon: v }); highlightSection(sectionId) }} colors={colors} />
                      ) : field === 'color' ? (
                        <ColorPicker value={item.color || '#A78BFA'} onChange={(v) => { updateItem(sectionId, collection, index, { color: v }); highlightSection(sectionId) }} colors={colors} />
                      ) : (
                        <div>
                          <label className="text-[10px] uppercase mb-1 block" style={{ color: colors.text.light }}>{field}</label>
                          <TextInput value={item[field]} onChange={(v) => { updateItem(sectionId, collection, index, { [field]: v }); highlightSection(sectionId) }} placeholder={field} colors={colors} multiline={field === 'description' || field === 'answer'} />
                        </div>
                      )}
                    </div>
                  ))}
                  <motion.button className="w-full py-2 rounded-lg flex items-center justify-center gap-2 text-xs" style={{ background: '#EF444410', color: '#EF4444' }} onClick={() => { removeItem(sectionId, collection, index); highlightSection(sectionId) }} whileHover={{ background: '#EF444420' }}>
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function IconSelector({ value, onChange, colors }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative">
      <label className="text-[10px] uppercase mb-1 block" style={{ color: colors.text.light }}>Icône</label>
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg w-full" style={{ background: colors.backgroundSecondary, border: `1px solid ${colors.border}` }} onClick={() => setIsOpen(!isOpen)}>
        <DynamicIcon name={value} size={16} color={colors.accent.primary} />
        <span className="text-xs" style={{ color: colors.text.muted }}>{value}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute left-0 right-0 mt-2 p-3 rounded-xl z-50 max-h-48 overflow-y-auto" style={{ background: colors.surface, border: `1px solid ${colors.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid grid-cols-6 gap-2">
              {POPULAR_ICONS.slice(0, 36).map((iconName) => (
                <button key={iconName} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: value === iconName ? colors.accent.primary + '20' : 'transparent' }} onClick={() => { onChange(iconName); setIsOpen(false) }}>
                  <DynamicIcon name={iconName} size={16} color={value === iconName ? colors.accent.primary : colors.text.muted} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ContentPanel
