// ═══════════════════════════════════════════════════════════════════
// 🫧 BULLE LOCAL MODE - Version 6.0 CONTEXT FIX
// Correction: pendingColorSelection + Validation boutons + Natural Language
// ═══════════════════════════════════════════════════════════════════

import { useSiteStore } from '@core/state/siteStore'

// ═══════════════════════════════════════════════════════════════════
// 🎨 COULEURS
// ═══════════════════════════════════════════════════════════════════

const COLORS = {
  // Français
  rose: '#F472B6', violet: '#A78BFA', bleu: '#3B82F6', cyan: '#22D3EE',
  turquoise: '#22D3EE', vert: '#34D399', jaune: '#FBBF24', orange: '#FB923C',
  rouge: '#EF4444', blanc: '#FFFFFF', noir: '#000000', gris: '#9CA3AF',
  // Anglais
  pink: '#F472B6', purple: '#A78BFA', blue: '#3B82F6', green: '#34D399',
  yellow: '#FBBF24', red: '#EF4444', white: '#FFFFFF', black: '#000000',
  gray: '#9CA3AF', grey: '#9CA3AF', teal: '#22D3EE', magenta: '#F472B6',
  // Nuances
  fuchsia: '#F472B6', lavande: '#A78BFA', indigo: '#6366F1', aqua: '#22D3EE',
  lime: '#84CC16', emeraude: '#10B981', corail: '#FB7185', saumon: '#FDA4AF',
  doré: '#FBBF24', or: '#FBBF24', gold: '#FBBF24', silver: '#9CA3AF', argent: '#9CA3AF',
}

// ═══════════════════════════════════════════════════════════════════
// 📚 SYNONYMES
// ═══════════════════════════════════════════════════════════════════

const SYNONYMS = {
  layout: ['layout', 'disposition', 'mise en page', 'agencement', 'organisation', 'structure', 'présentation', 'arrangement'],
  couleurs: ['couleur', 'couleurs', 'color', 'colors', 'teinte', 'nuance', 'coloris', 'palette'],
  texte: ['texte', 'text', 'contenu', 'content', 'écrire', 'rédiger', 'modifier le texte', 'changer le texte'],
  titre: ['titre', 'title', 'heading', 'h1', 'headline', 'accroche', 'intitulé', 'en-tête'],
  soustitre: ['sous-titre', 'sous titre', 'soustitre', 'subtitle', 'description', 'desc', 'chapeau', 'intro'],
  badge: ['badge', 'étiquette', 'tag', 'label', 'pastille', 'chip'],
  bouton: ['bouton', 'button', 'cta', 'call to action', 'btn', 'action', 'lien'],
  changer: ['change', 'changer', 'modifier', 'modifie', 'met', 'mets', 'mettre', 'passe', 'passer', 'transforme', 'transformer', 'remplace', 'remplacer', 'update', 'edit', 'édite', 'éditer'],
  ajouter: ['ajoute', 'ajouter', 'créer', 'crée', 'créé', 'add', 'nouveau', 'nouvelle', 'rajoute', 'rajouter', 'insère', 'insérer'],
  supprimer: ['supprime', 'supprimer', 'enlève', 'enlever', 'retire', 'retirer', 'efface', 'effacer', 'delete', 'remove', 'vire', 'virer', 'dégage'],
  oui: ['oui', 'yes', 'ok', 'okay', 'd\'accord', 'dac', 'ouais', 'yep', 'yup', 'valide', 'valider', 'confirme', 'confirmer', 'parfait', 'super', 'génial', 'cool', 'nickel', 'top', 'go'],
  non: ['non', 'no', 'nope', 'nan', 'annule', 'annuler', 'cancel', 'stop', 'arrête', 'laisse', 'oublie'],
}

const matchesSynonym = (text, category) => {
  const synonyms = SYNONYMS[category] || []
  return synonyms.some(s => text.includes(s))
}

// ═══════════════════════════════════════════════════════════════════
// 🎯 ICÔNES
// ═══════════════════════════════════════════════════════════════════

const AVAILABLE_ICONS = [
  { name: 'Zap', label: '⚡ Éclair', keywords: ['éclair', 'zap', 'rapide', 'flash', 'vitesse'] },
  { name: 'Star', label: '⭐ Étoile', keywords: ['étoile', 'star', 'favori', 'best', 'top'] },
  { name: 'Heart', label: '❤️ Cœur', keywords: ['coeur', 'heart', 'amour', 'love'] },
  { name: 'Sparkles', label: '✨ Magie', keywords: ['sparkles', 'magie', 'brillant', 'magic'] },
  { name: 'Shield', label: '🛡️ Sécurité', keywords: ['shield', 'bouclier', 'sécurité', 'protection'] },
  { name: 'Rocket', label: '🚀 Fusée', keywords: ['rocket', 'fusée', 'lancement', 'fast'] },
  { name: 'Globe', label: '🌍 Globe', keywords: ['globe', 'monde', 'international', 'world'] },
  { name: 'Users', label: '👥 Équipe', keywords: ['users', 'équipe', 'team', 'groupe'] },
  { name: 'TrendingUp', label: '📈 Stats', keywords: ['trending', 'croissance', 'stats', 'growth'] },
  { name: 'Palette', label: '🎨 Design', keywords: ['palette', 'couleurs', 'design', 'art'] },
]

// ═══════════════════════════════════════════════════════════════════
// 📐 CONFIG SECTIONS
// ═══════════════════════════════════════════════════════════════════

const SECTION_CONFIG = {
  hero: {
    label: 'Hero', emoji: '🦸',
    colorElements: ['title', 'subtitle', 'badge', 'ctaPrimary'],
    colorLabels: { title: 'Titre', subtitle: 'Sous-titre', badge: 'Badge', ctaPrimary: 'Bouton' },
    textElements: ['title', 'subtitle', 'badge', 'ctaPrimary', 'ctaSecondary'],
    textLabels: { title: 'Le titre', subtitle: 'Le sous-titre', badge: 'Le badge', ctaPrimary: 'Le bouton' },
    textPrompts: { title: '✏️ Quel titre accrocheur ?', subtitle: '✏️ Quelle description ?', badge: '✏️ Quel texte pour le badge ?', ctaPrimary: '✏️ Quel texte pour le bouton ?' },
    hasButton: true,
    layouts: {
      'centered': { label: 'Centré', keywords: ['centré', 'center', 'milieu', 'centre'] },
      'split-left': { label: 'Image droite', keywords: ['image droite', 'droite', 'right'] },
      'split-right': { label: 'Image gauche', keywords: ['image gauche', 'gauche', 'left'] },
    },
    nextSection: 'features', hasItems: false, itemName: null,
    proactiveTips: [
      { condition: (s) => !s.content?.badge, tip: "💡 Un badge attire l'œil !" },
      { condition: (s) => (s.content?.title?.length || 0) > 50, tip: "💡 Un titre court est plus impactant !" },
    ],
  },
  features: {
    label: 'Features', emoji: '✨',
    colorElements: ['title', 'subtitle'],
    colorLabels: { title: 'Titre', subtitle: 'Sous-titre' },
    textElements: ['title', 'subtitle'],
    textLabels: { title: 'Le titre', subtitle: 'Le sous-titre' },
    textPrompts: { title: '✏️ Quel titre ?', subtitle: '✏️ Quelle description ?' },
    hasButton: false,
    layouts: {
      'grid-3': { label: '3 colonnes', keywords: ['3 colonnes', 'trois colonnes', 'grid 3', 'triple'] },
      'grid-2': { label: '2 colonnes', keywords: ['2 colonnes', 'deux colonnes', 'grid 2', 'double'] },
      'list': { label: 'Liste', keywords: ['liste', 'list', 'vertical'] },
    },
    itemName: 'feature', itemNamePlural: 'features', itemCollection: 'items',
    itemFields: ['title', 'description', 'icon', 'color'],
    itemPrompts: { title: '✏️ Quel titre ?', description: '✏️ Quelle description ?', icon: '🎯 Quelle icône ?', color: '🎨 Quelle couleur ?' },
    nextSection: 'howItWorks', hasItems: true,
    proactiveTips: [{ condition: (s) => (s.items?.length || 0) < 3, tip: "💡 3 features minimum !" }],
  },
  howItWorks: {
    label: 'Étapes', emoji: '📋',
    colorElements: ['title', 'subtitle'],
    colorLabels: { title: 'Titre', subtitle: 'Sous-titre' },
    textElements: ['title', 'subtitle'],
    textLabels: { title: 'Le titre', subtitle: 'Le sous-titre' },
    textPrompts: { title: '✏️ Quel titre ?', subtitle: '✏️ Quelle description ?' },
    hasButton: false,
    layouts: {
      'timeline': { label: 'Timeline', keywords: ['timeline', 'chronologie', 'frise'] },
      'cards': { label: 'Cartes', keywords: ['cartes', 'cards', 'bloc'] },
      'minimal': { label: 'Minimal', keywords: ['minimal', 'simple', 'épuré'] },
    },
    itemName: 'étape', itemNamePlural: 'étapes', itemCollection: 'steps',
    itemFields: ['title', 'description'],
    itemPrompts: { title: '✏️ Quel titre ?', description: '✏️ Quelle description ?' },
    nextSection: 'pricing', hasItems: true, proactiveTips: [],
  },
  pricing: {
    label: 'Tarifs', emoji: '💰',
    colorElements: ['title', 'subtitle'],
    colorLabels: { title: 'Titre', subtitle: 'Sous-titre' },
    textElements: ['title', 'subtitle'],
    textLabels: { title: 'Le titre', subtitle: 'Le sous-titre' },
    textPrompts: { title: '✏️ Quel titre ?', subtitle: '✏️ Quelle accroche ?' },
    hasButton: false,
    layouts: {
      'cards': { label: 'Cartes', keywords: ['cartes', 'cards', 'colonnes'] },
      'table': { label: 'Tableau', keywords: ['tableau', 'table', 'comparatif'] },
      'minimal': { label: 'Minimal', keywords: ['minimal', 'simple'] },
    },
    itemName: 'plan', itemNamePlural: 'plans', itemCollection: 'plans',
    itemFields: ['name', 'price', 'description'],
    itemPrompts: { name: '✏️ Quel nom ?', price: '💰 Quel prix ?', description: '✏️ Description ?' },
    nextSection: 'faq', hasItems: true,
    proactiveTips: [{ condition: (s) => !s.plans?.some(p => p.highlighted), tip: "💡 Mets en avant ton meilleur plan !" }],
  },
  faq: {
    label: 'FAQ', emoji: '❓',
    colorElements: ['title', 'subtitle'],
    colorLabels: { title: 'Titre', subtitle: 'Sous-titre' },
    textElements: ['title', 'subtitle'],
    textLabels: { title: 'Le titre', subtitle: 'Le sous-titre' },
    textPrompts: { title: '✏️ Quel titre ?', subtitle: '✏️ Quelle description ?' },
    hasButton: false,
    layouts: {
      'accordion': { label: 'Accordéon', keywords: ['accordéon', 'accordion', 'dépliable'] },
      'grid': { label: 'Grille', keywords: ['grille', 'grid', 'colonnes'] },
      'simple': { label: 'Simple', keywords: ['simple', 'basique'] },
    },
    itemName: 'question', itemNamePlural: 'questions', itemCollection: 'items',
    itemFields: ['question', 'answer'],
    itemPrompts: { question: '❓ Quelle question ?', answer: '💬 Quelle réponse ?' },
    nextSection: null, hasItems: true,
    proactiveTips: [{ condition: (s) => (s.items?.length || 0) < 3, tip: "💡 3 questions minimum !" }],
  },
}

// ═══════════════════════════════════════════════════════════════════
// 💬 HELPERS
// ═══════════════════════════════════════════════════════════════════

const random = (arr) => arr[Math.floor(Math.random() * arr.length)]
const cleanSuggestions = (s) => [...new Set(s.filter(Boolean))].slice(0, 6)

function getSmartSuggestions(config, section, modCount) {
  const suggestions = []
  if (config?.hasButton) {
    suggestions.push('Le layout', 'Les couleurs', 'Le texte', 'Le bouton')
  } else if (config?.hasItems) {
    suggestions.push('Le layout', 'Les couleurs', 'Le texte')
    const items = section?.[config.itemCollection] || []
    if (items.length < 4) suggestions.push(`Ajouter une ${config.itemName}`)
  } else {
    suggestions.push('Le layout', 'Les couleurs', 'Le texte', 'Le thème')
  }
  if (modCount >= 3) suggestions[2] = '✨ Parfait !'
  if (modCount >= 5) suggestions[3] = '➡️ Section suivante'
  return cleanSuggestions(suggestions)
}

function getProactiveTip(sectionType, section) {
  const config = SECTION_CONFIG[sectionType]
  if (!config?.proactiveTips) return null
  for (const tip of config.proactiveTips) {
    if (tip.condition(section)) return tip.tip
  }
  return null
}

function getAllLayoutLabels(sectionType) {
  const config = SECTION_CONFIG[sectionType]
  if (!config) return []
  return Object.values(config.layouts).map(l => l.label)
}

function getCurrentLayoutLabel(sectionType, currentLayout) {
  const config = SECTION_CONFIG[sectionType]
  if (!config?.layouts[currentLayout]) return currentLayout
  return config.layouts[currentLayout].label
}

function getNextSectionSuggestion(sectionType) {
  const config = SECTION_CONFIG[sectionType]
  if (!config?.nextSection) return null
  const next = SECTION_CONFIG[config.nextSection]
  return next ? `Section ${next.label}` : null
}

// ═══════════════════════════════════════════════════════════════════
// 🔍 DÉTECTEURS
// ═══════════════════════════════════════════════════════════════════

function detectColor(msg) {
  const hexMatch = msg.match(/#[0-9A-Fa-f]{6}/)
  if (hexMatch) return { name: hexMatch[0], hex: hexMatch[0] }
  for (const [name, hex] of Object.entries(COLORS)) {
    if (msg.includes(name)) return { name, hex }
  }
  return null
}

function detectLayout(msg, sectionType) {
  const config = SECTION_CONFIG[sectionType]
  if (!config) return null
  for (const [id, layout] of Object.entries(config.layouts)) {
    if (layout.keywords.some(k => msg.includes(k))) return { id, label: layout.label }
  }
  return null
}

function detectIcon(msg) {
  for (const icon of AVAILABLE_ICONS) {
    if (icon.keywords.some(k => msg.includes(k))) return icon
  }
  return null
}

function detectNumber(msg) {
  const match = msg.match(/(\d+)/)
  if (match) return parseInt(match[1])
  const words = { 'un': 1, 'une': 1, 'deux': 2, 'trois': 3, 'quatre': 4, 'cinq': 5, 'dernier': -1, 'dernière': -1, 'derniere': -1 }
  for (const [word, num] of Object.entries(words)) {
    if (msg.includes(word)) return num
  }
  return null
}

function detectElement(msg) {
  if (matchesSynonym(msg, 'titre') && !msg.includes('sous')) return 'title'
  if (matchesSynonym(msg, 'soustitre') || msg.includes('sous-titre') || msg.includes('sous titre')) return 'subtitle'
  if (matchesSynonym(msg, 'badge')) return 'badge'
  if (matchesSynonym(msg, 'bouton')) return 'ctaPrimary'
  return null
}

// ═══════════════════════════════════════════════════════════════════
// 🚀 PROCESSEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

export function processMessage(message, context) {
  const msg = message.toLowerCase().trim()
  const originalMessage = message.trim()
  const store = useSiteStore.getState()
  const { 
    activeSection, 
    pendingElement,
    pendingTextElement,
    pendingColorSelection = false, // 🆕 NOUVEAU
    pendingColor = null, // 🆕 NOUVEAU
    layoutPreviewMode = false,
    originalLayoutVariant = null,
    colorPreviewMode = false,
    originalColorValue = null,
    colorPreviewElement = null,
    itemEditMode = null,
    lastSubject = null,
    modificationCount = 0,
    satisfactionCount = 0,
  } = context

  // Guards
  if (!activeSection) {
    return {
      success: false,
      message: `👋 Sélectionne une section pour commencer !`,
      suggestions: ['Hero', 'Features', 'Étapes', 'Tarifs', 'FAQ'],
    }
  }

  const section = store.getSection(activeSection)
  if (!section) return { success: false, message: `🤔 Section introuvable...`, suggestions: [] }

  const sectionType = section.type || activeSection
  const config = SECTION_CONFIG[sectionType]
  const sectionLabel = config?.label || sectionType
  const currentLayout = section.layout?.variant || 'default'

  // ═══════════════════════════════════════════════════════════════
  // ✏️ MODE ÉDITION TEXTE (priorité max)
  // ═══════════════════════════════════════════════════════════════
  
  if (pendingTextElement) {
    if (msg.includes('annuler') || msg === 'annule') {
      return {
        success: true,
        message: `↩️ Annulé !`,
        suggestions: getSmartSuggestions(config, section, modificationCount),
        context: { pendingTextElement: null },
      }
    }
    
    store.updateSectionContent(activeSection, pendingTextElement, originalMessage)
    const elementLabel = config.textLabels?.[pendingTextElement] || pendingTextElement
    return {
      success: true,
      message: `✨ ${elementLabel} mis à jour !\n\n"${originalMessage.substring(0, 50)}${originalMessage.length > 50 ? '...' : ''}"`,
      suggestions: getSmartSuggestions(config, section, modificationCount + 1),
      toast: `✏️ ${elementLabel} modifié !`,
      context: { pendingTextElement: null, lastSubject: pendingTextElement },
      incrementModCount: true,
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 📦 MODE ÉDITION ITEM
  // ═══════════════════════════════════════════════════════════════
  
  if (itemEditMode) {
    return handleItemEditFlow(msg, originalMessage, itemEditMode, config, section, activeSection, store, modificationCount)
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ VALIDATION LAYOUT PREVIEW
  // ═══════════════════════════════════════════════════════════════
  
  if (layoutPreviewMode) {
    if (matchesSynonym(msg, 'oui')) {
      return {
        success: true,
        message: `✨ Layout validé !`,
        suggestions: getSmartSuggestions(config, section, modificationCount + 1),
        toast: `📐 Layout appliqué !`,
        context: { layoutPreviewMode: false, originalLayoutVariant: null },
        incrementModCount: true,
      }
    }
    if (matchesSynonym(msg, 'non')) {
      if (originalLayoutVariant) store.updateLayout(activeSection, { variant: originalLayoutVariant })
      return {
        success: true,
        message: `↩️ Layout annulé !`,
        suggestions: getSmartSuggestions(config, section, modificationCount),
        context: { layoutPreviewMode: false, originalLayoutVariant: null },
      }
    }
    const detectedLayout = detectLayout(msg, sectionType)
    if (detectedLayout) {
      store.updateLayout(activeSection, { variant: detectedLayout.id })
      return { success: true, silentPreview: true, context: { layoutPreviewMode: true, originalLayoutVariant } }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ VALIDATION COULEUR PREVIEW
  // ═══════════════════════════════════════════════════════════════
  
  if (colorPreviewMode) {
    if (matchesSynonym(msg, 'oui')) {
      return {
        success: true,
        message: `✨ Couleur validée !`,
        suggestions: getSmartSuggestions(config, section, modificationCount + 1),
        toast: `🎨 Couleur appliquée !`,
        context: { colorPreviewMode: false, originalColorValue: null, colorPreviewElement: null, lastSubject: colorPreviewElement, pendingColorSelection: false },
        incrementModCount: true,
      }
    }
    if (matchesSynonym(msg, 'non')) {
      if (originalColorValue && colorPreviewElement) {
        store.updateSectionColor(activeSection, colorPreviewElement, originalColorValue)
      }
      return {
        success: true,
        message: `↩️ Couleur annulée !`,
        suggestions: getSmartSuggestions(config, section, modificationCount),
        context: { colorPreviewMode: false, originalColorValue: null, colorPreviewElement: null, pendingColorSelection: false },
      }
    }
    const detectedColor = detectColor(msg)
    if (detectedColor && colorPreviewElement) {
      store.updateSectionColor(activeSection, colorPreviewElement, detectedColor.hex)
      return { success: true, silentPreview: true, context: { colorPreviewMode: true, originalColorValue, colorPreviewElement } }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🆕 MODE SÉLECTION COULEUR (après "Les couleurs")
  // ═══════════════════════════════════════════════════════════════
  
  if (pendingColorSelection) {
    const element = detectElement(msg)
    if (element && config.colorElements.includes(element)) {
      // L'utilisateur a choisi un élément → demander la couleur
      return {
        success: true,
        message: `🎨 Quelle couleur pour le ${config.colorLabels[element]} ?`,
        suggestions: ['Rose', 'Violet', 'Bleu', '🎨 Palette'],
        suggestionsType: 'colors',
        context: { 
          pendingElement: element, 
          pendingColorSelection: false, // On sort du mode sélection
          lastSubject: element 
        },
      }
    }
    
    // Si c'est une couleur directement
    const detectedColor = detectColor(msg)
    if (detectedColor) {
      // On a une couleur mais pas d'élément → demander l'élément
      return {
        success: true,
        message: `🎨 ${detectedColor.name}, super choix !\n\nSur quel élément ?`,
        suggestions: config.colorElements.map(e => config.colorLabels[e]),
        context: { pendingColorSelection: true, pendingColor: detectedColor },
      }
    }
    
    // Annulation
    if (matchesSynonym(msg, 'non')) {
      return {
        success: true,
        message: `👍 OK !`,
        suggestions: getSmartSuggestions(config, section, modificationCount),
        context: { pendingColorSelection: false, pendingColor: null },
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎨 MODE SÉLECTION ÉLÉMENT POUR COULEUR (pendingElement actif)
  // ═══════════════════════════════════════════════════════════════
  
  if (pendingElement) {
    const detectedColor = detectColor(msg)
    if (detectedColor) {
      const originalColor = section.colors?.[pendingElement]
      store.updateSectionColor(activeSection, pendingElement, detectedColor.hex)
      return {
        success: true,
        message: `🎨 ${config.colorLabels[pendingElement]} en ${detectedColor.name} !\n\n👀 Aperçu appliqué. Tu valides ?`,
        suggestions: ['✓ Valider', '✕ Annuler', 'Rose', 'Violet', 'Bleu'],
        context: { 
          colorPreviewMode: true, 
          originalColorValue: originalColor, 
          colorPreviewElement: pendingElement, 
          pendingElement: null,
          pendingColorSelection: false 
        },
      }
    }
    if (msg.includes('palette') || msg.includes('plus')) {
      return { success: true, message: `🎨 Palette ouverte !`, suggestions: [], openPalette: true, context: { pendingElement } }
    }
    if (matchesSynonym(msg, 'non')) {
      return {
        success: true,
        message: `👍 OK !`,
        suggestions: getSmartSuggestions(config, section, modificationCount),
        context: { pendingElement: null, pendingColorSelection: false },
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🧠 DÉTECTION COMMANDES NATURELLES DIRECTES
  // ═══════════════════════════════════════════════════════════════
  
  const hasChangeVerb = matchesSynonym(msg, 'changer')
  const element = detectElement(msg)
  const color = detectColor(msg)
  const layout = detectLayout(msg, sectionType)
  
  // "Met le titre en rose" → direct !
  if (hasChangeVerb && element && color && config.colorElements.includes(element)) {
    const originalColor = section.colors?.[element]
    store.updateSectionColor(activeSection, element, color.hex)
    return {
      success: true,
      message: `🎨 ${config.colorLabels[element]} en ${color.name} !\n\n👀 Aperçu appliqué. Tu valides ?`,
      suggestions: ['✓ Valider', '✕ Annuler', 'Rose', 'Violet', 'Bleu'],
      context: { 
        colorPreviewMode: true, 
        originalColorValue: originalColor, 
        colorPreviewElement: element,
        lastSubject: element 
      },
    }
  }

  // Layout direct : "passe en 3 colonnes"
  if (layout) {
    const originalVariant = section.layout?.variant
    store.updateLayout(activeSection, { variant: layout.id })
    const allLayouts = getAllLayoutLabels(sectionType)
    return {
      success: true,
      message: `📐 Layout "${layout.label}" !\n\n👀 Aperçu appliqué. Tu valides ?`,
      suggestions: [...allLayouts, '✓ Valider', '✕ Annuler'],
      context: { layoutPreviewMode: true, originalLayoutVariant: originalVariant },
    }
  }

  // Couleur seule (sans élément) → utiliser contexte ou demander
  if (color && !element) {
    if (lastSubject && config.colorElements.includes(lastSubject)) {
      const originalColor = section.colors?.[lastSubject]
      store.updateSectionColor(activeSection, lastSubject, color.hex)
      return {
        success: true,
        message: `🎨 ${config.colorLabels[lastSubject]} en ${color.name} !\n\n👀 Tu valides ?`,
        suggestions: ['✓ Valider', '✕ Annuler', 'Rose', 'Violet', 'Bleu'],
        context: { 
          colorPreviewMode: true, 
          originalColorValue: originalColor, 
          colorPreviewElement: lastSubject 
        },
      }
    }
    return {
      success: true,
      message: `🎨 ${color.name}, super choix !\n\nSur quel élément ?`,
      suggestions: config.colorElements.map(e => config.colorLabels[e]),
      context: { pendingColorSelection: true, pendingColor: color },
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 📐 CATÉGORIE LAYOUT
  // ═══════════════════════════════════════════════════════════════
  
  if (matchesSynonym(msg, 'layout')) {
    const currentLabel = getCurrentLayoutLabel(sectionType, currentLayout)
    const allLayouts = getAllLayoutLabels(sectionType)
    const originalVariant = section.layout?.variant
    
    return {
      success: true,
      message: `📐 Layout actuel : ${currentLabel}\n\nClique pour tester, puis valide !`,
      suggestions: [...allLayouts, '✓ Valider', '✕ Annuler'],
      context: { layoutPreviewMode: true, originalLayoutVariant: originalVariant },
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎨 CATÉGORIE COULEURS → Active pendingColorSelection !
  // ═══════════════════════════════════════════════════════════════
  
  if (matchesSynonym(msg, 'couleurs')) {
    const elements = config.colorElements.map(e => config.colorLabels[e])
    return {
      success: true,
      message: `🎨 Quel élément colorer ?`,
      suggestions: elements.slice(0, 4),
      context: { pendingColorSelection: true }, // 🆕 IMPORTANT !
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ✏️ CATÉGORIE TEXTE
  // ═══════════════════════════════════════════════════════════════
  
  if (matchesSynonym(msg, 'texte')) {
    const elements = config.textElements.map(e => config.textLabels[e])
    return {
      success: true,
      message: `✏️ Quel texte modifier ?`,
      suggestions: elements.slice(0, 4),
      context: { pendingColorSelection: false }, // S'assurer qu'on n'est pas en mode couleur
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ✏️ SÉLECTION ÉLÉMENT TEXTE (sans pendingColorSelection)
  // ═══════════════════════════════════════════════════════════════
  
  if (element && config.textElements.includes(element) && !pendingColorSelection && !color) {
    return { 
      success: true, 
      message: config.textPrompts[element], 
      hint: `💬 Actuel : "${section.content?.[element] || ''}"`, 
      suggestions: [], 
      context: { pendingTextElement: element, lastSubject: element, pendingColorSelection: false } 
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ➕ AJOUTER ITEM
  // ═══════════════════════════════════════════════════════════════
  
  if (matchesSynonym(msg, 'ajouter') && config?.hasItems) {
    const num = detectNumber(msg)
    if (num && num > 1) {
      for (let i = 0; i < Math.min(num, 5); i++) {
        store.addItem(activeSection, config.itemCollection, { 
          title: `${config.itemName} ${(section[config.itemCollection]?.length || 0) + i + 1}`,
          description: 'Description',
          icon: 'Star',
          color: '#A78BFA'
        })
      }
      return {
        success: true,
        message: `✨ ${Math.min(num, 5)} ${config.itemNamePlural} ajoutées !`,
        suggestions: getSmartSuggestions(config, section, modificationCount + 1),
        toast: `➕ ${Math.min(num, 5)} ajoutées !`,
        incrementModCount: true,
      }
    }
    const firstField = config.itemFields[0]
    return {
      success: true,
      message: `➕ Nouvelle ${config.itemName} !\n\n${config.itemPrompts[firstField]}`,
      suggestions: [],
      context: { itemEditMode: { action: 'add', step: 0, data: {}, fields: config.itemFields } }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🗑️ SUPPRIMER
  // ═══════════════════════════════════════════════════════════════
  
  if (matchesSynonym(msg, 'supprimer') && config?.hasItems) {
    const items = section[config.itemCollection] || []
    if (items.length === 0) {
      return { success: false, message: `🤷 Rien à supprimer !`, suggestions: getSmartSuggestions(config, section, modificationCount) }
    }
    const num = detectNumber(msg)
    if (num !== null) {
      const index = num === -1 ? items.length - 1 : num - 1
      if (index >= 0 && index < items.length) {
        return {
          success: true,
          message: `🗑️ Supprimer "${items[index].title || items[index].name || items[index].question}" ?`,
          suggestions: ['✓ Oui', '✕ Non'],
          context: { itemEditMode: { action: 'delete', step: 'confirm', index } }
        }
      }
    }
    return {
      success: true,
      message: `🗑️ Laquelle supprimer ?`,
      suggestions: ['La dernière', ...items.slice(0, 3).map((_, i) => `${i + 1}`)],
      context: { itemEditMode: { action: 'delete', step: 'choose-item' } }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🔄 EXPORT / NAVIGATION / ANNULER / AIDE
  // ═══════════════════════════════════════════════════════════════
  
  if (msg.includes('export') || msg.includes('télécharger') || msg.includes('publier')) {
    return { success: true, message: `📤 C'est parti pour l'export !`, suggestions: [], action: 'export' }
  }

  if (msg.includes('suivante') || msg.includes('next') || msg.includes('passer')) {
    if (config?.nextSection) {
      const nextConfig = SECTION_CONFIG[config.nextSection]
      return {
        success: true,
        message: `➡️ ${nextConfig.emoji} ${nextConfig.label} !`,
        suggestions: getSmartSuggestions(nextConfig, store.getSection(config.nextSection), 0),
        action: 'navigate',
        navigateTo: config.nextSection,
      }
    }
    return { success: true, message: `🎉 Tu as tout fait ! Exporter ?`, suggestions: ['Exporter', 'Hero', '✨ Parfait'] }
  }

  if (msg.includes('annule') || msg.includes('undo') || msg.includes('retour')) {
    if (store.canUndo()) {
      store.undo()
      return { success: true, message: `↩️ Annulé !`, suggestions: getSmartSuggestions(config, section, modificationCount), toast: `↩️ Annulé` }
    }
    return { success: false, message: `🤷 Rien à annuler !`, suggestions: getSmartSuggestions(config, section, modificationCount) }
  }

  if (msg.includes('aide') || msg === '?' || msg.includes('help')) {
    return {
      success: true,
      message: `💡 Je comprends plein de choses !\n\n• "Met le titre en rose"\n• "Le layout"\n• "Les couleurs"\n• "Ajoute 3 features"\n• "Supprime la dernière"`,
      suggestions: getSmartSuggestions(config, section, modificationCount),
    }
  }

  // Positif
  if (matchesSynonym(msg, 'oui')) {
    return { success: true, message: random([`🎉 Super !`, `✨ Parfait !`, `👍 Génial !`]), suggestions: getSmartSuggestions(config, section, modificationCount) }
  }

  // Salutations
  const greetings = ['salut', 'hello', 'hey', 'bonjour', 'coucou', 'yo', 'hi']
  if (greetings.some(g => msg.startsWith(g) || msg === g)) {
    return { success: true, message: `Hey ! 🫧 On bosse sur ${sectionLabel}\n\nQu'est-ce qu'on fait ?`, suggestions: getSmartSuggestions(config, section, modificationCount) }
  }

  // Fallback
  return {
    success: false,
    message: `🤔 J'ai pas compris...\n\nEssaie :\n• "Met le titre en rose"\n• "La disposition"\n• "Les couleurs"`,
    suggestions: ['Aide', ...getSmartSuggestions(config, section, modificationCount).slice(0, 3)],
  }
}

// ═══════════════════════════════════════════════════════════════════
// 📦 FLOW ÉDITION ITEMS
// ═══════════════════════════════════════════════════════════════════

function handleItemEditFlow(msg, originalMessage, itemEditMode, config, section, activeSection, store, modificationCount) {
  const { action, step, data = {}, index, fields = [] } = itemEditMode

  if (matchesSynonym(msg, 'non')) {
    return { success: true, message: `↩️ Annulé !`, suggestions: getSmartSuggestions(config, section, modificationCount), context: { itemEditMode: null } }
  }

  // ADD
  if (action === 'add') {
    const currentField = fields[step]
    if (currentField === 'icon') data.icon = detectIcon(msg)?.name || 'Star'
    else if (currentField === 'color') data.color = detectColor(msg)?.hex || '#A78BFA'
    else data[currentField] = originalMessage
    
    if (step + 1 < fields.length) {
      const nextField = fields[step + 1]
      let suggestions = []
      if (nextField === 'icon') suggestions = AVAILABLE_ICONS.slice(0, 4).map(i => i.label)
      else if (nextField === 'color') suggestions = ['Rose', 'Violet', 'Bleu', 'Vert']
      return {
        success: true,
        message: `✓ OK !\n\n${config.itemPrompts[nextField]}`,
        suggestions,
        context: { itemEditMode: { action: 'add', step: step + 1, data, fields } }
      }
    }
    
    store.addItem(activeSection, config.itemCollection, data)
    return {
      success: true,
      message: `✨ ${config.itemName} ajoutée !`,
      suggestions: [`Ajouter une ${config.itemName}`, '✨ Parfait'],
      toast: `➕ Ajouté !`,
      context: { itemEditMode: null },
      incrementModCount: true,
    }
  }

  // DELETE
  if (action === 'delete') {
    const items = section[config.itemCollection] || []
    
    if (step === 'choose-item') {
      const num = detectNumber(msg)
      if (num !== null) {
        const idx = num === -1 ? items.length - 1 : num - 1
        if (idx >= 0 && idx < items.length) {
          return {
            success: true,
            message: `🗑️ Supprimer "${items[idx].title || items[idx].name || items[idx].question}" ?`,
            suggestions: ['✓ Oui', '✕ Non'],
            context: { itemEditMode: { action: 'delete', step: 'confirm', index: idx } }
          }
        }
      }
      return { success: false, message: `🤔 Lequel ?`, suggestions: ['La dernière', '1', '2', '3'], context: { itemEditMode } }
    }
    
    if (step === 'confirm') {
      if (matchesSynonym(msg, 'oui')) {
        store.removeItem(activeSection, config.itemCollection, index)
        return { success: true, message: `🗑️ Supprimé !`, suggestions: getSmartSuggestions(config, section, modificationCount), toast: `🗑️ Supprimé`, context: { itemEditMode: null }, incrementModCount: true }
      }
      return { success: true, message: `👍 OK, on garde !`, suggestions: getSmartSuggestions(config, section, modificationCount), context: { itemEditMode: null } }
    }
  }

  return { success: false, message: `🤔 Perdu...`, suggestions: getSmartSuggestions(config, section, modificationCount), context: { itemEditMode: null } }
}

export { getSmartSuggestions, getProactiveTip }
export default processMessage
