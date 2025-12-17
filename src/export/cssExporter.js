// ═══════════════════════════════════════════════════════════════════
// 🎨 CSS EXPORTER - Génère le CSS statique
// ═══════════════════════════════════════════════════════════════════

import { getTheme } from '@core/theme/themes'

/**
 * Génère le CSS complet pour l'export
 */
export function generateCSS(site, options = {}) {
  const theme = getTheme(site.theme || 'aurora')
  const { minify = false } = options
  
  // Valeurs par défaut si le thème n'est pas complet
  const colors = theme.colors || {}
  const accent = colors.accent || { primary: '#A78BFA', secondary: '#F472B6', tertiary: '#22D3EE' }
  const text = colors.text || { primary: '#FFFFFF', secondary: '#E5E7EB', muted: '#9CA3AF', light: '#6B7280' }
  const gradient = theme.gradient || 'linear-gradient(135deg, #A78BFA 0%, #F472B6 50%, #22D3EE 100%)'
  
  let css = `
/* ═══════════════════════════════════════════════════════════════════
   🫧 BULLE EDITOR - CSS EXPORTÉ
   Thème: ${site.theme || 'aurora'}
   Généré le: ${new Date().toLocaleDateString('fr-FR')}
   ═══════════════════════════════════════════════════════════════════ */

/* ═══ RESET & BASE ═══ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: ${colors.background || '#0a0a0f'};
  color: ${text.primary};
  line-height: 1.6;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font: inherit;
}

/* ═══ TYPOGRAPHY ═══ */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  color: ${text.primary};
}

h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2rem); }
h4 { font-size: 1.25rem; }

p {
  color: ${text.secondary};
}

/* ═══ LAYOUT ═══ */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section {
  padding: 5rem 0;
}

.section-compact {
  padding: 3rem 0;
}

.section-spacious {
  padding: 7rem 0;
}

/* ═══ THEME COLORS ═══ */
:root {
  --color-bg: ${colors.background || '#0a0a0f'};
  --color-bg-secondary: ${colors.backgroundSecondary || '#12121a'};
  --color-surface: ${colors.surface || '#1a1a2e'};
  --color-border: ${colors.border || 'rgba(255, 255, 255, 0.1)'};
  --color-text: ${text.primary};
  --color-text-secondary: ${text.secondary};
  --color-text-muted: ${text.muted};
  --color-accent: ${accent.primary};
  --color-accent-secondary: ${accent.secondary};
  --gradient-primary: ${gradient};
  --gradient-text: ${gradient};
}

/* ═══ GRADIENTS & EFFECTS ═══ */
.text-gradient {
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bg-gradient {
  background: ${gradient};
}

.glass {
  background: ${colors.surface || '#1a1a2e'};
  backdrop-filter: blur(12px);
  border: 1px solid ${colors.border || 'rgba(255, 255, 255, 0.1)'};
}

.glow {
  box-shadow: 0 0 40px ${accent.primary}30;
}

/* ═══ BUTTONS ═══ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: ${gradient};
  color: white;
  box-shadow: 0 4px 20px ${accent.primary}40;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px ${accent.primary}50;
}

.btn-secondary {
  background: transparent;
  color: ${text.primary};
  border: 1px solid ${colors.border || 'rgba(255, 255, 255, 0.1)'};
}

.btn-secondary:hover {
  background: ${colors.surface || '#1a1a2e'};
  border-color: ${accent.primary};
}

/* ═══ CARDS ═══ */
.card {
  background: ${colors.surface || '#1a1a2e'};
  border: 1px solid ${colors.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  border-color: ${accent.primary}40;
}

/* ═══ BADGES ═══ */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${accent.primary}15;
  color: ${accent.primary};
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* ═══ HERO SECTION ═══ */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${colors.background || '#0a0a0f'};
}

.hero-content {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
  position: relative;
  z-index: 10;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: ${text.muted};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Hero Background Bubbles */
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}

.bubble-1 {
  width: 400px;
  height: 400px;
  background: ${accent.primary};
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.bubble-2 {
  width: 300px;
  height: 300px;
  background: ${accent.secondary};
  top: 60%;
  right: 15%;
  animation-delay: -2s;
}

.bubble-3 {
  width: 250px;
  height: 250px;
  background: ${accent.tertiary || accent.primary};
  bottom: 20%;
  left: 30%;
  animation-delay: -4s;
}

/* ═══ FEATURES SECTION ═══ */
.features {
  background: ${colors.backgroundSecondary || '#12121a'};
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.feature-description {
  color: ${text.muted};
  font-size: 0.95rem;
}

/* ═══ HOW IT WORKS SECTION ═══ */
.steps {
  background: ${colors.background || '#0a0a0f'};
}

.steps-timeline {
  position: relative;
  max-width: 800px;
  margin: 3rem auto 0;
}

.step-item {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${gradient};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  padding-top: 0.5rem;
}

.step-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.step-description {
  color: ${text.muted};
}

/* ═══ PRICING SECTION ═══ */
.pricing {
  background: ${colors.backgroundSecondary || '#12121a'};
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.pricing-card {
  text-align: center;
  padding: 2.5rem 2rem;
  position: relative;
}

.pricing-card.highlighted {
  border-color: ${accent.primary};
  transform: scale(1.05);
  z-index: 1;
}

.pricing-name {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.pricing-price {
  font-size: 3rem;
  font-weight: 800;
  color: ${text.primary};
  margin-bottom: 0.25rem;
}

.pricing-period {
  color: ${text.muted};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.pricing-features {
  list-style: none;
  margin-bottom: 2rem;
}

.pricing-features li {
  padding: 0.5rem 0;
  color: ${text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.pricing-features li::before {
  content: "✓";
  color: ${accent.primary};
  font-weight: bold;
}

/* ═══ FAQ SECTION ═══ */
.faq {
  background: ${colors.background || '#0a0a0f'};
}

.faq-list {
  max-width: 800px;
  margin: 3rem auto 0;
}

.faq-item {
  margin-bottom: 1rem;
}

.faq-question {
  width: 100%;
  text-align: left;
  padding: 1.25rem 1.5rem;
  background: ${colors.surface || '#1a1a2e'};
  border: 1px solid ${colors.border || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 0.75rem;
  font-weight: 600;
  color: ${text.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-question:hover {
  border-color: ${accent.primary}40;
}

.faq-answer {
  padding: 1rem 1.5rem;
  color: ${text.muted};
  line-height: 1.7;
}

/* ═══ FOOTER ═══ */
.footer {
  background: ${colors.backgroundSecondary || '#12121a'};
  border-top: 1px solid ${colors.border || 'rgba(255, 255, 255, 0.1)'};
  padding: 3rem 0;
  text-align: center;
}

.footer p {
  color: ${text.muted};
  font-size: 0.9rem;
}

/* ═══ ANIMATIONS ═══ */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(5deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .section {
    padding: 3rem 0;
  }
  
  .hero-content {
    padding: 1.5rem;
  }
  
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 280px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-card.highlighted {
    transform: none;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .step-number {
    margin: 0 auto;
  }
}

/* ═══ UTILITIES ═══ */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-8 { gap: 2rem; }

.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-8 { margin-bottom: 2rem; }

.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }

/* ═══ PRINT STYLES ═══ */
@media print {
  .hero-bg,
  .bubble {
    display: none;
  }
  
  body {
    background: white;
    color: black;
  }
}
`

  if (minify) {
    css = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .replace(/;\}/g, '}')
      .trim()
  }

  return css
}

export default generateCSS
