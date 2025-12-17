import { create } from 'zustand'

// ═══════════════════════════════════════════════════════════════════
// 🎛️ STORE DE L'ÉDITEUR
// ═══════════════════════════════════════════════════════════════════

export const useEditorStore = create((set, get) => ({
  // ═══════════════════════════════════════════════════════════════
  // 📍 SECTION
  // ═══════════════════════════════════════════════════════════════
  
  activeSection: null,
  hoveredSection: null,
  highlightedSection: null,
  highlightTimeout: null,
  highlightedField: null,
  
  // ═══════════════════════════════════════════════════════════════
  // 🎬 MODE
  // ═══════════════════════════════════════════════════════════════
  
  mode: 'edit',
  previewDevice: 'desktop', // 'desktop' | 'tablet' | 'mobile'
  headerOpen: true, // Toggle header visibility
  
  // ═══════════════════════════════════════════════════════════════
  // 🫧 LUMI / BULLE
  // ═══════════════════════════════════════════════════════════════
  
  lumiOpen: true,
  lumiThinking: false,
  lumiMood: 'idle',
  lumiTab: 'chat', // 'chat' uniquement maintenant
  
  // 🎯 EDITOR POPUP (Contenu/Layout)
  editorPopup: null, // null | { type: 'content' | 'layout', sectionId: string }
  
  // ═══════════════════════════════════════════════════════════════
  // 📚 ONBOARDING
  // ═══════════════════════════════════════════════════════════════
  
  showOnboarding: !localStorage.getItem('bulle-v3-onboarding-done'),
  onboardingStep: 0,
  
  // ═══════════════════════════════════════════════════════════════
  // 🔔 TOAST
  // ═══════════════════════════════════════════════════════════════
  
  toast: null,
  
  // ═══════════════════════════════════════════════════════════════
  // 🎊 CONFETTI
  // ═══════════════════════════════════════════════════════════════
  
  showConfetti: false,
  
  // ═══════════════════════════════════════════════════════════════
  // 📦 MODAL
  // ═══════════════════════════════════════════════════════════════
  
  activeModal: null,
  modalData: null,

  // ═══════════════════════════════════════════════════════════════
  // 📍 SECTION ACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  setActiveSection: (id) => {
    set({ 
      activeSection: id,
      lumiTab: 'chat', // Toujours revenir sur Chat quand on change de section
    })
  },
  
  setHoveredSection: (id) => set({ hoveredSection: id }),
  
  clearSelection: () => set({ 
    activeSection: null, 
    hoveredSection: null,
    lumiTab: 'chat',
  }),

  // Highlight section avec animation
  highlightSection: (id) => {
    const { highlightTimeout } = get()
    if (highlightTimeout) clearTimeout(highlightTimeout)
    
    set({ highlightedSection: id })
    
    const timeout = setTimeout(() => {
      if (get().highlightedSection === id) {
        set({ highlightedSection: null, highlightTimeout: null })
      }
    }, 2000)
    
    set({ highlightTimeout: timeout })
  },

  // Highlight un champ spécifique
  highlightField: (fieldId) => {
    set({ highlightedField: fieldId })
    setTimeout(() => {
      if (get().highlightedField === fieldId) {
        set({ highlightedField: null })
      }
    }, 3000)
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 🎬 MODE ACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  setMode: (mode) => set({ mode }),
  setPreviewDevice: (device) => set({ previewDevice: device }),
  toggleHeader: () => set((s) => ({ headerOpen: !s.headerOpen })),
  
  toggleMode: () => {
    const current = get().mode
    set({ mode: current === 'edit' ? 'preview' : 'edit' })
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 🫧 LUMI ACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  openLumi: () => set({ lumiOpen: true }),
  closeLumi: () => set({ lumiOpen: false }),
  toggleLumi: () => set((s) => ({ lumiOpen: !s.lumiOpen })),
  setLumiThinking: (v) => set({ lumiThinking: v, lumiMood: v ? 'thinking' : 'idle' }),
  setLumiMood: (mood) => set({ lumiMood: mood }),
  setLumiTab: (tab) => set({ lumiTab: tab }),
  
  // 🎯 Editor Popup Actions
  openEditorPopup: (type, sectionId) => set({ 
    editorPopup: { type, sectionId },
    lumiOpen: true, // S'assurer que Bulle est ouvert
  }),
  closeEditorPopup: () => set({ editorPopup: null }),
  
  // Switch tab + optionally highlight a field
  switchToTabAndHighlight: (tab, fieldId = null) => {
    set({ lumiTab: tab })
    if (fieldId) {
      get().highlightField(fieldId)
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 📚 ONBOARDING ACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  nextOnboardingStep: () => set((s) => ({ onboardingStep: s.onboardingStep + 1 })),
  
  skipOnboarding: () => {
    localStorage.setItem('bulle-v3-onboarding-done', 'true')
    set({ showOnboarding: false })
  },
  
  completeOnboarding: () => {
    localStorage.setItem('bulle-v3-onboarding-done', 'true')
    set({ showOnboarding: false, lumiOpen: true })
  },
  
  resetOnboarding: () => {
    localStorage.removeItem('bulle-v3-onboarding-done')
    set({ showOnboarding: true, onboardingStep: 0 })
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 🔔 TOAST ACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  showToast: (message, type = 'success', duration = 3000) => {
    const id = Date.now()
    set({ toast: { message, type, id } })
    setTimeout(() => {
      if (get().toast?.id === id) set({ toast: null })
    }, duration)
  },
  
  hideToast: () => set({ toast: null }),
  
  // ═══════════════════════════════════════════════════════════════
  // 🎊 CONFETTI ACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  triggerConfetti: () => {
    set({ showConfetti: true })
    setTimeout(() => set({ showConfetti: false }), 5000)
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 📦 MODAL ACTIONS
  // ═══════════════════════════════════════════════════════════════
  
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}))
