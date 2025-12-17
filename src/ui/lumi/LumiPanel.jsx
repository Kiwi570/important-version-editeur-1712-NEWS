import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, MessageCircle, Sparkles, Palette, Layout, PenTool, MousePointer, HelpCircle, Zap, Plus, Trash2, Edit3, ChevronRight } from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'
import { processMessage, getProactiveTip } from '@lumi/modes/localMode'
import ColorSuggestions from './ColorSuggestions'
import ColorPaletteModal from './ColorPaletteModal'
import EditorPopup from './EditorPopup'

// ═══════════════════════════════════════════════════════════════════
// 🫧 BULLE PANEL - Version 7.0 CONTEXT FIX
// Correction: pendingColorSelection + Validation boutons
// ═══════════════════════════════════════════════════════════════════

const THEME = {
  bg: '#0a0a0f',
  bgSecondary: '#12121a',
  surface: '#1a1a2e',
  surfaceHover: '#252542',
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: '#E2E8F0',
  white: '#FFFFFF',
  grayLight: '#F1F5F9',
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textMuted: '#9CA3AF',
  textDark: '#1F2937',
  textBlack: '#111827',
  rose: '#F472B6',
  violet: '#A78BFA',
  cyan: '#22D3EE',
  green: '#34D399',
  yellow: '#FBBF24',
  blue: '#3B82F6',
  gradient: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 50%, #22D3EE 100%)',
}

const SECTION_CONFIG = {
  hero: { emoji: '🦸', label: 'Hero', color: THEME.rose, greeting: 'Hey ! 🦸 On bosse sur le Hero !\n\nQu\'est-ce que tu veux modifier ?', suggestions: ['Le layout', 'Les couleurs', 'Le texte', 'Le bouton'] },
  features: { emoji: '✨', label: 'Features', color: THEME.violet, greeting: 'Cool ! ✨ Section Features activée !\n\nOn personnalise quoi ?', suggestions: ['Le layout', 'Les couleurs', 'Le texte', 'Ajouter une feature'] },
  howItWorks: { emoji: '📋', label: 'Étapes', color: THEME.blue, greeting: 'Super ! 📋 On travaille sur les Étapes !\n\nQue veux-tu changer ?', suggestions: ['Le layout', 'Les couleurs', 'Le texte', 'Ajouter une étape'] },
  pricing: { emoji: '💰', label: 'Tarifs', color: THEME.yellow, greeting: 'Nice ! 💰 Section Tarifs en vue !\n\nOn modifie quoi ?', suggestions: ['Le layout', 'Les couleurs', 'Le texte', 'Ajouter un plan'] },
  faq: { emoji: '❓', label: 'FAQ', color: THEME.cyan, greeting: 'Parfait ! ❓ On s\'occupe de la FAQ !\n\nQu\'est-ce qu\'on fait ?', suggestions: ['Le layout', 'Les couleurs', 'Le texte', 'Ajouter une question'] },
}

const createInitialMessages = () => {
  const messages = {}
  for (const [sectionId, config] of Object.entries(SECTION_CONFIG)) {
    messages[sectionId] = [{ id: `${sectionId}-1`, role: 'assistant', content: config.greeting, suggestions: config.suggestions, mood: 'happy' }]
  }
  return messages
}

const SUGGESTION_ICONS = { 
  'le layout': Layout, 'les couleurs': Palette, 'le texte': PenTool, 
  'le titre': PenTool, 'le bouton': MousePointer, 'aide': HelpCircle, 
  'ajouter': Plus, 'modifier': Edit3, 'supprimer': Trash2,
  'parfait': Sparkles, 'exporter': Zap, 'suivante': ChevronRight,
  'valider': Sparkles, 'annuler': X,
  'default': Sparkles 
}

// Mapping label → id pour le mode preview silencieux
const LAYOUT_LABEL_TO_ID = {
  'Centré': 'centered', 'Image droite': 'split-left', 'Image gauche': 'split-right',
  '3 colonnes': 'grid-3', '2 colonnes': 'grid-2', 'Liste': 'list',
  'Timeline': 'timeline', 'Cartes': 'cards', 'Minimal': 'minimal',
  'Accordéon': 'accordion', 'Grille': 'grid', 'Simple': 'simple', 'Tableau': 'table',
}

// Mapping couleurs pour preview silencieux
const COLOR_NAME_TO_HEX = {
  'Rose': '#F472B6', 'Violet': '#A78BFA', 'Bleu': '#3B82F6', 'Cyan': '#22D3EE',
  'Vert': '#34D399', 'Jaune': '#FBBF24', 'Orange': '#FB923C', 'Rouge': '#EF4444',
}

function getSuggestionIcon(suggestion) {
  const lower = suggestion.toLowerCase()
  for (const [key, Icon] of Object.entries(SUGGESTION_ICONS)) { if (lower.includes(key)) return Icon }
  return SUGGESTION_ICONS.default
}

function LumiPanel() {
  const [messagesPerSection, setMessagesPerSection] = useState(createInitialMessages)
  const [input, setInput] = useState('')
  
  // 🆕 États de contexte améliorés
  const [pendingElement, setPendingElement] = useState(null)
  const [pendingTextElement, setPendingTextElement] = useState(null)
  const [pendingColorSelection, setPendingColorSelection] = useState(false) // 🆕 NOUVEAU !
  const [pendingColor, setPendingColor] = useState(null) // 🆕 Couleur en attente d'élément
  
  const [layoutPreviewMode, setLayoutPreviewMode] = useState(false)
  const [originalLayoutVariant, setOriginalLayoutVariant] = useState(null)
  const [colorPreviewMode, setColorPreviewMode] = useState(false)
  const [originalColorValue, setOriginalColorValue] = useState(null)
  const [colorPreviewElement, setColorPreviewElement] = useState(null)
  
  const [itemEditMode, setItemEditMode] = useState(null)
  const [modCounts, setModCounts] = useState({})
  const [satisfactionCount, setSatisfactionCount] = useState(0)
  const [isInClosureMode, setIsInClosureMode] = useState(false)
  const [lastSubject, setLastSubject] = useState(null) // 🆕 Contexte mémorisé
  
  const [inputFocused, setInputFocused] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [originalColor, setOriginalColor] = useState(null)
  const [proactiveTip, setProactiveTip] = useState(null)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const activeSection = useEditorStore((s) => s.activeSection)
  const setActiveSection = useEditorStore((s) => s.setActiveSection)
  const lumiThinking = useEditorStore((s) => s.lumiThinking)
  const closeLumi = useEditorStore((s) => s.closeLumi)
  const setLumiThinking = useEditorStore((s) => s.setLumiThinking)
  const highlightSection = useEditorStore((s) => s.highlightSection)
  const showToast = useEditorStore((s) => s.showToast)
  const openModal = useEditorStore((s) => s.openModal)
  const editorPopup = useEditorStore((s) => s.editorPopup)
  const openEditorPopup = useEditorStore((s) => s.openEditorPopup)
  
  const section = useSiteStore((s) => activeSection ? s.getSection(activeSection) : null)
  const updateSectionColor = useSiteStore((s) => s.updateSectionColor)
  const updateLayout = useSiteStore((s) => s.updateLayout)
  
  const { colors, gradient } = useTheme()
  const currentMessages = activeSection ? (messagesPerSection[activeSection] || []) : []
  const currentConfig = activeSection ? SECTION_CONFIG[activeSection] : null
  const currentModCount = activeSection ? (modCounts[activeSection] || 0) : 0

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [currentMessages])
  useEffect(() => { if (inputRef.current && !editorPopup) inputRef.current.focus() }, [activeSection, editorPopup])
  
  // Reset complet au changement de section
  useEffect(() => { 
    setPendingElement(null)
    setPendingTextElement(null)
    setPendingColorSelection(false) // 🆕
    setPendingColor(null) // 🆕
    setLayoutPreviewMode(false)
    setOriginalLayoutVariant(null)
    setColorPreviewMode(false)
    setOriginalColorValue(null)
    setColorPreviewElement(null)
    setItemEditMode(null)
    setSatisfactionCount(0)
    setIsInClosureMode(false)
    setLastSubject(null) // 🆕
    
    // Tip proactif au changement de section
    if (activeSection && section) {
      const sectionType = section.type || activeSection
      const tip = getProactiveTip(sectionType, section)
      setProactiveTip(tip)
    }
  }, [activeSection])

  // 🆕 Contexte enrichi avec tous les nouveaux états
  const getContext = () => ({ 
    activeSection, 
    section, 
    pendingElement, 
    pendingTextElement,
    pendingColorSelection, // 🆕
    pendingColor, // 🆕
    layoutPreviewMode, 
    originalLayoutVariant,
    colorPreviewMode, 
    originalColorValue, 
    colorPreviewElement,
    itemEditMode,
    lastSubject, // 🆕
    modificationCount: currentModCount, 
    satisfactionCount, 
    isInClosureMode 
  })

  const addMessageToCurrentSection = (message) => {
    if (!activeSection) return
    setMessagesPerSection(prev => ({ ...prev, [activeSection]: [...(prev[activeSection] || []), message] }))
  }

  const handleSend = async (textToSend = null) => {
    const messageText = textToSend || input.trim()
    if (!messageText || !activeSection) return
    const userMessage = { id: Date.now().toString(), role: 'user', content: messageText }
    addMessageToCurrentSection(userMessage)
    setInput('')
    setLumiThinking(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
      const result = processMessage(messageText, getContext())
      
      // Gestion du preview silencieux (pas de nouveau message)
      if (result.silentPreview) {
        if (result.context?.layoutPreviewMode !== undefined) setLayoutPreviewMode(result.context.layoutPreviewMode)
        if (result.context?.originalLayoutVariant !== undefined) setOriginalLayoutVariant(result.context.originalLayoutVariant)
        if (result.context?.colorPreviewMode !== undefined) setColorPreviewMode(result.context.colorPreviewMode)
        if (result.context?.originalColorValue !== undefined) setOriginalColorValue(result.context.originalColorValue)
        if (result.context?.colorPreviewElement !== undefined) setColorPreviewElement(result.context.colorPreviewElement)
        setLumiThinking(false)
        return
      }
      
      // 🆕 Gestion complète du contexte
      if (result.context) {
        if (result.context.pendingElement !== undefined) setPendingElement(result.context.pendingElement)
        if (result.context.pendingTextElement !== undefined) setPendingTextElement(result.context.pendingTextElement)
        if (result.context.pendingColorSelection !== undefined) setPendingColorSelection(result.context.pendingColorSelection)
        if (result.context.pendingColor !== undefined) setPendingColor(result.context.pendingColor)
        if (result.context.layoutPreviewMode !== undefined) setLayoutPreviewMode(result.context.layoutPreviewMode)
        if (result.context.originalLayoutVariant !== undefined) setOriginalLayoutVariant(result.context.originalLayoutVariant)
        if (result.context.colorPreviewMode !== undefined) setColorPreviewMode(result.context.colorPreviewMode)
        if (result.context.originalColorValue !== undefined) setOriginalColorValue(result.context.originalColorValue)
        if (result.context.colorPreviewElement !== undefined) setColorPreviewElement(result.context.colorPreviewElement)
        if (result.context.itemEditMode !== undefined) setItemEditMode(result.context.itemEditMode)
        if (result.context.lastSubject !== undefined) setLastSubject(result.context.lastSubject)
      }
      
      // Reset des états si non présents dans le contexte
      if (!result.context?.pendingTextElement) setPendingTextElement(null)
      if (result.context?.pendingColorSelection === false) setPendingColorSelection(false)
      
      // Autres actions
      if (result.incrementModCount && activeSection) {
        setModCounts(prev => ({ ...prev, [activeSection]: (prev[activeSection] || 0) + 1 }))
      }
      if (result.incrementSatisfaction) setSatisfactionCount(prev => prev + 1)
      if (result.resetSatisfaction) setSatisfactionCount(0)
      if (result.enterClosureMode) setIsInClosureMode(true)
      if (result.action === 'navigate' && result.navigateTo) setActiveSection(result.navigateTo)
      if (result.action === 'export' || result.openExport) openModal('export')
      if (result.openPalette) setShowPalette(true)
      if (result.toast) showToast(result.toast, 'success')

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.message,
        hint: result.hint,
        suggestions: result.suggestions || [],
        suggestionsType: result.suggestionsType,
        mood: result.success ? 'happy' : 'confused'
      }
      addMessageToCurrentSection(assistantMessage)
      
      if (result.success) highlightSection(activeSection)
      
    } finally {
      setLumiThinking(false)
    }
  }

  // Handler suggestion click avec preview silencieux
  const handleSuggestionClick = (suggestion) => {
    // Preview silencieux pour layouts - PAS de nouveau message
    if (layoutPreviewMode && LAYOUT_LABEL_TO_ID[suggestion]) {
      const layoutId = LAYOUT_LABEL_TO_ID[suggestion]
      updateLayout(activeSection, { variant: layoutId })
      highlightSection(activeSection)
      return
    }
    
    // Preview silencieux pour couleurs - PAS de nouveau message
    if (colorPreviewMode && COLOR_NAME_TO_HEX[suggestion] && colorPreviewElement) {
      const colorHex = COLOR_NAME_TO_HEX[suggestion]
      updateSectionColor(activeSection, colorPreviewElement, colorHex)
      highlightSection(activeSection)
      return
    }
    
    // Sinon, envoi normal
    handleSend(suggestion)
  }

  const handleOpenPalette = (element) => {
    const targetElement = element || pendingElement
    if (section?.colors?.[targetElement]) setOriginalColor(section.colors[targetElement])
    if (element) setPendingElement(element)
    setShowPalette(true)
  }

  const handleColorSelect = (color) => {
    if (pendingElement && activeSection) {
      updateSectionColor(activeSection, pendingElement, color)
      highlightSection(activeSection)
      showToast(`🎨 Couleur appliquée !`, 'success')
      setModCounts(prev => ({ ...prev, [activeSection]: (prev[activeSection] || 0) + 1 }))
      const assistantMessage = { id: Date.now().toString(), role: 'assistant', content: `✨ Magnifique ! La couleur est parfaite !\n\nOn continue ?`, suggestions: ['Le layout', 'Autre couleur', 'Parfait !'], mood: 'happy' }
      addMessageToCurrentSection(assistantMessage)
    }
    setPendingElement(null)
    setPendingColorSelection(false)
    setShowPalette(false)
  }

  return (
    <motion.div className="w-[380px] h-full flex flex-col relative overflow-hidden" style={{ background: THEME.bgSecondary, borderLeft: `1px solid ${THEME.border}` }} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
      <AnimatePresence>{showPalette && <ColorPaletteModal onSelect={handleColorSelect} onClose={() => setShowPalette(false)} currentColor={originalColor} />}</AnimatePresence>
      <AnimatePresence>{editorPopup && <EditorPopup />}</AnimatePresence>

      {/* Header */}
      <div className="h-20 px-4 flex items-center justify-between shrink-0" style={{ background: '#1a1a2e', borderBottom: `1px solid ${THEME.border}` }}>
        <div className="flex items-center gap-3">
          <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl relative" style={{ background: THEME.gradient }} animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            🫧
            <motion.div className="absolute inset-0 rounded-xl" style={{ background: THEME.gradient }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.div>
          <div>
            <h2 className="font-bold text-sm" style={{ color: '#FFFFFF' }}>Bulle</h2>
            <p className="text-xs" style={{ color: THEME.textMuted }}>{activeSection ? `${currentConfig?.emoji} ${currentConfig?.label}` : 'Sélectionne une section'}</p>
          </div>
        </div>
        <motion.button className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={closeLumi} whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.9 }}><X className="w-4 h-4" style={{ color: '#FFFFFF' }} /></motion.button>
      </div>

      {/* Barre de contexte - Section active */}
      {!editorPopup && activeSection && (
        <div className="p-2" style={{ background: '#FFFFFF' }}>
          <div className="px-4 py-2 rounded-xl flex items-center justify-between" style={{ background: THEME.gradient }}>
            <p className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
              {currentConfig?.emoji} Section {currentConfig?.label}
            </p>
            <motion.button
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              onClick={() => openEditorPopup('content', activeSection)}
              whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <PenTool className="w-4 h-4" style={{ color: '#FFFFFF' }} />
            </motion.button>
          </div>
          
          {/* Tip proactif */}
          {proactiveTip && (
            <motion.div 
              className="mt-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: THEME.grayLight, color: THEME.textMuted }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {proactiveTip}
            </motion.div>
          )}
        </div>
      )}

      {/* Chat Messages - FOND BLANC */}
      {!editorPopup && (
        <div className="flex-1 overflow-y-auto" style={{ background: '#FFFFFF' }}>
          <ChatTab 
            messages={currentMessages} 
            messagesEndRef={messagesEndRef} 
            lumiThinking={lumiThinking} 
            onSuggestionClick={handleSuggestionClick} 
            onOpenPalette={handleOpenPalette} 
            sectionConfig={currentConfig}
            layoutPreviewMode={layoutPreviewMode}
            colorPreviewMode={colorPreviewMode}
          />
        </div>
      )}

      {/* Input - FOND DÉGRADÉ */}
      {!editorPopup && (
        <div className="p-4" style={{ background: THEME.gradient, borderTop: `1px solid ${THEME.border}` }}>
          <motion.div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FFFFFF', border: (inputFocused || pendingTextElement) ? `2px solid ${THEME.violet}` : `2px solid ${THEME.borderLight}`, boxShadow: (inputFocused || pendingTextElement) ? `0 0 20px ${THEME.violet}20` : 'none' }} animate={{ scale: inputFocused ? 1.01 : 1 }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: THEME.grayLight }}><MessageCircle className="w-4 h-4" style={{ color: THEME.violet }} /></div>
            <input 
              ref={inputRef} 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              onFocus={() => setInputFocused(true)} 
              onBlur={() => setInputFocused(false)} 
              placeholder={
                pendingTextElement 
                  ? `✏️ Tape ton nouveau texte ici...` 
                  : pendingColorSelection
                    ? `🎨 Quel élément colorer ?`
                    : itemEditMode
                      ? `💬 Ta réponse...`
                      : (activeSection ? `Message pour ${currentConfig?.label}...` : "Sélectionne une section...")
              } 
              disabled={!activeSection} 
              className="flex-1 bg-transparent outline-none text-sm" 
              style={{ color: THEME.textDark }} 
            />
            <motion.button className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden" style={{ background: THEME.gradient }} onClick={() => handleSend()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={!input.trim() || !activeSection}>
              <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <Send className="w-4 h-4 relative z-10 text-white" />
            </motion.button>
          </motion.div>
          
          {/* Mode indicator */}
          {(layoutPreviewMode || colorPreviewMode) && (
            <motion.div 
              className="mt-2 text-center text-xs py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              👀 Mode aperçu • Clique pour tester, puis valide
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  )
}

function ChatTab({ messages, messagesEndRef, lumiThinking, onSuggestionClick, onOpenPalette, sectionConfig, layoutPreviewMode, colorPreviewMode }) {
  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => (
        <motion.div key={message.id} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, delay: index === messages.length - 1 ? 0.1 : 0 }}>
          <motion.div className={`p-4 max-w-[88%] ${message.role === 'user' ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-bl-md'}`} style={{ background: message.role === 'user' ? THEME.gradient : THEME.surface, color: THEME.textPrimary, boxShadow: message.role === 'user' ? `0 8px 32px ${THEME.violet}30` : `0 4px 20px rgba(0,0,0,0.15)` }} whileHover={{ scale: 1.01 }}>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            {message.hint && (
              <p className="text-xs italic mt-2 opacity-60" style={{ color: THEME.textMuted }}>{message.hint}</p>
            )}
          </motion.div>
          
          {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
            message.suggestionsType === 'colors' ? (
              <ColorSuggestions onColorSelect={onSuggestionClick} onOpenPalette={onOpenPalette} />
            ) : (
              <motion.div className="flex flex-wrap gap-2 mt-3 max-w-[88%]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {message.suggestions.map((suggestion, i) => {
                  const Icon = getSuggestionIcon(suggestion)
                  const isValidate = suggestion.includes('✓') || suggestion.toLowerCase().includes('valider')
                  const isCancel = suggestion.includes('✕') || suggestion.toLowerCase().includes('annuler')
                  
                  return (
                    <motion.button 
                      key={i} 
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left relative" 
                      style={{ 
                        background: isValidate ? THEME.green : isCancel ? '#EF4444' : THEME.surface, 
                        color: THEME.white, 
                        border: (isValidate || isCancel) ? 'none' : '2px solid transparent', 
                        backgroundImage: (isValidate || isCancel) ? 'none' : `linear-gradient(${THEME.surface}, ${THEME.surface}), ${THEME.gradient}`, 
                        backgroundOrigin: 'border-box', 
                        backgroundClip: 'padding-box, border-box' 
                      }} 
                      onClick={() => onSuggestionClick(suggestion)} 
                      whileHover={{ scale: 1.02, boxShadow: `0 4px 15px ${isValidate ? THEME.green : isCancel ? '#EF4444' : THEME.violet}30` }} 
                      whileTap={{ scale: 0.98 }} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-white" />
                      <span className="truncate">{suggestion}</span>
                    </motion.button>
                  )
                })}
              </motion.div>
            )
          )}
        </motion.div>
      ))}
      
      <AnimatePresence>
        {lumiThinking && (
          <motion.div className="flex items-end gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <motion.div className="px-6 py-4 rounded-2xl rounded-bl-md flex items-center gap-2" style={{ background: THEME.surface, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              {[0, 1, 2].map((i) => (<motion.div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: THEME.gradient }} animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} />
    </div>
  )
}

export default LumiPanel
