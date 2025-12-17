// ═══════════════════════════════════════════════════════════════════
// 🏃 ACTION RUNNER - Exécute les actions JSON de Claude
// ═══════════════════════════════════════════════════════════════════

/**
 * Collection mapping par type de section
 */
const COLLECTION_MAP = {
  features: 'items',
  faq: 'items',
  howItWorks: 'steps',
  pricing: 'plans',
}

/**
 * Exécute une liste d'actions sur le store
 * 
 * @param {Array} actions - Liste des actions à exécuter
 * @param {Object} context - Contexte avec les fonctions du store
 * @returns {Object} Résultat de l'exécution
 */
export function runActions(actions, context) {
  const {
    activeSection,
    section,
    updateContent,
    updateLayout,
    updateSectionColor,
    setTheme,
    addItem,
    updateItem,
    removeItem,
    highlightSection,
  } = context

  const results = []
  let successCount = 0
  let errorCount = 0

  if (!actions || !Array.isArray(actions) || actions.length === 0) {
    return {
      success: true,
      executed: 0,
      results: [],
    }
  }

  for (const action of actions) {
    try {
      const result = executeAction(action, {
        activeSection,
        section,
        updateContent,
        updateLayout,
        updateSectionColor,
        setTheme,
        addItem,
        updateItem,
        removeItem,
      })
      
      results.push({ action: action.action, success: true, ...result })
      successCount++
      
      // Highlight la section après modification
      if (activeSection && action.action !== 'setTheme') {
        highlightSection(activeSection)
      }
    } catch (error) {
      console.error(`Erreur action ${action.action}:`, error)
      results.push({ action: action.action, success: false, error: error.message })
      errorCount++
    }
  }

  return {
    success: errorCount === 0,
    executed: successCount,
    errors: errorCount,
    results,
  }
}

/**
 * Exécute une action individuelle
 */
function executeAction(action, context) {
  const {
    activeSection,
    section,
    updateContent,
    updateLayout,
    updateSectionColor,
    setTheme,
    addItem,
    updateItem,
    removeItem,
  } = context

  switch (action.action) {
    // ═══════════════════════════════════════════════════════════════
    // 🎨 UPDATE COLOR
    // ═══════════════════════════════════════════════════════════════
    case 'updateColor': {
      if (!activeSection) throw new Error('Aucune section sélectionnée')
      if (!action.element) throw new Error('Element manquant')
      if (!action.color) throw new Error('Couleur manquante')
      
      // Valider le format de la couleur
      const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
      if (!colorRegex.test(action.color)) {
        throw new Error(`Couleur invalide: ${action.color}`)
      }
      
      updateSectionColor(activeSection, action.element, action.color)
      return { element: action.element, color: action.color }
    }

    // ═══════════════════════════════════════════════════════════════
    // 📐 UPDATE LAYOUT
    // ═══════════════════════════════════════════════════════════════
    case 'updateLayout': {
      if (!activeSection) throw new Error('Aucune section sélectionnée')
      if (!action.variant) throw new Error('Variant manquant')
      
      updateLayout(activeSection, { variant: action.variant })
      return { variant: action.variant }
    }

    // ═══════════════════════════════════════════════════════════════
    // 📏 UPDATE SPACING
    // ═══════════════════════════════════════════════════════════════
    case 'updateSpacing': {
      if (!activeSection) throw new Error('Aucune section sélectionnée')
      if (!action.spacing) throw new Error('Spacing manquant')
      
      const validSpacings = ['compact', 'normal', 'spacious']
      if (!validSpacings.includes(action.spacing)) {
        throw new Error(`Spacing invalide: ${action.spacing}`)
      }
      
      updateLayout(activeSection, { spacing: action.spacing })
      return { spacing: action.spacing }
    }

    // ═══════════════════════════════════════════════════════════════
    // ✏️ UPDATE CONTENT
    // ═══════════════════════════════════════════════════════════════
    case 'updateContent': {
      if (!activeSection) throw new Error('Aucune section sélectionnée')
      if (!action.field) throw new Error('Field manquant')
      
      updateContent(activeSection, { [action.field]: action.value })
      return { field: action.field, value: action.value }
    }

    // ═══════════════════════════════════════════════════════════════
    // 🎨 SET THEME
    // ═══════════════════════════════════════════════════════════════
    case 'setTheme': {
      if (!action.themeId) throw new Error('ThemeId manquant')
      
      const validThemes = ['aurora', 'corporate', 'pastel', 'neon', 'minimal']
      if (!validThemes.includes(action.themeId)) {
        throw new Error(`Thème invalide: ${action.themeId}`)
      }
      
      setTheme(action.themeId)
      return { themeId: action.themeId }
    }

    // ═══════════════════════════════════════════════════════════════
    // ➕ ADD ITEM
    // ═══════════════════════════════════════════════════════════════
    case 'addItem': {
      if (!activeSection) throw new Error('Aucune section sélectionnée')
      if (!section) throw new Error('Section introuvable')
      if (!action.item) throw new Error('Item manquant')
      
      const collection = COLLECTION_MAP[section.type]
      if (!collection) throw new Error(`Type de section non supporté: ${section.type}`)
      
      addItem(activeSection, collection, action.item)
      return { collection, item: action.item }
    }

    // ═══════════════════════════════════════════════════════════════
    // ✏️ UPDATE ITEM
    // ═══════════════════════════════════════════════════════════════
    case 'updateItem': {
      if (!activeSection) throw new Error('Aucune section sélectionnée')
      if (!section) throw new Error('Section introuvable')
      if (action.index === undefined) throw new Error('Index manquant')
      if (!action.updates) throw new Error('Updates manquant')
      
      const collection = COLLECTION_MAP[section.type]
      if (!collection) throw new Error(`Type de section non supporté: ${section.type}`)
      
      updateItem(activeSection, collection, action.index, action.updates)
      return { collection, index: action.index, updates: action.updates }
    }

    // ═══════════════════════════════════════════════════════════════
    // ➖ REMOVE ITEM
    // ═══════════════════════════════════════════════════════════════
    case 'removeItem': {
      if (!activeSection) throw new Error('Aucune section sélectionnée')
      if (!section) throw new Error('Section introuvable')
      if (action.index === undefined) throw new Error('Index manquant')
      
      const collection = COLLECTION_MAP[section.type]
      if (!collection) throw new Error(`Type de section non supporté: ${section.type}`)
      
      removeItem(activeSection, collection, action.index)
      return { collection, index: action.index }
    }

    // ═══════════════════════════════════════════════════════════════
    // ❓ UNKNOWN ACTION
    // ═══════════════════════════════════════════════════════════════
    default:
      throw new Error(`Action inconnue: ${action.action}`)
  }
}

/**
 * Parse la réponse JSON de Claude
 */
export function parseClaudeResponse(response) {
  try {
    // Essayer de parser directement
    const parsed = JSON.parse(response)
    return {
      success: true,
      data: {
        message: parsed.message || 'Action effectuée !',
        actions: parsed.actions || [],
        suggestions: parsed.suggestions || [],
      },
    }
  } catch (e) {
    // Essayer d'extraire le JSON du texte
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          success: true,
          data: {
            message: parsed.message || 'Action effectuée !',
            actions: parsed.actions || [],
            suggestions: parsed.suggestions || [],
          },
        }
      } catch (e2) {
        // Fallback
      }
    }
    
    return {
      success: false,
      error: 'Impossible de parser la réponse',
      data: {
        message: response || 'Je n\'ai pas compris, peux-tu reformuler ?',
        actions: [],
        suggestions: [],
      },
    }
  }
}

export default {
  runActions,
  parseClaudeResponse,
}
