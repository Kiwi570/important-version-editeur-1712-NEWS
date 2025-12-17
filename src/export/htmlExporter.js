// ═══════════════════════════════════════════════════════════════════
// 📄 HTML EXPORTER - Génère le HTML statique
// ═══════════════════════════════════════════════════════════════════

import { getTheme } from '@core/theme/themes'

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Génère le HTML pour une section Hero
 */
function generateHeroHTML(section, sectionId) {
  const { content, layout, colors } = section
  const variant = layout?.variant || 'centered'
  const spacing = layout?.spacing || 'normal'
  
  const spacingClass = spacing === 'compact' ? 'section-compact' : spacing === 'spacious' ? 'section-spacious' : 'section'
  
  // Title with highlight
  let titleHtml = escapeHtml(content.title || '')
  if (content.titleHighlight) {
    titleHtml = titleHtml.replace(
      content.titleHighlight,
      `<span class="text-gradient">${escapeHtml(content.titleHighlight)}</span>`
    )
  }
  
  return `
  <!-- HERO SECTION -->
  <section id="${sectionId}" class="hero ${spacingClass}">
    <div class="hero-bg">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
    </div>
    
    <div class="hero-content">
      ${content.badge ? `<span class="badge">${escapeHtml(content.badge)}</span>` : ''}
      
      <h1 class="hero-title">${titleHtml}</h1>
      
      ${content.subtitle ? `<p class="hero-subtitle">${escapeHtml(content.subtitle)}</p>` : ''}
      
      <div class="hero-cta">
        ${content.ctaPrimary ? `<a href="#" class="btn btn-primary">${escapeHtml(content.ctaPrimary)}</a>` : ''}
        ${content.ctaSecondary ? `<a href="#" class="btn btn-secondary">${escapeHtml(content.ctaSecondary)}</a>` : ''}
      </div>
    </div>
  </section>
`
}

/**
 * Génère le HTML pour une section Features
 */
function generateFeaturesHTML(section, sectionId) {
  const { content, items, layout } = section
  const variant = layout?.variant || 'grid-3'
  const spacing = layout?.spacing || 'normal'
  
  const spacingClass = spacing === 'compact' ? 'section-compact' : spacing === 'spacious' ? 'section-spacious' : 'section'
  const gridClass = variant === 'grid-2' ? 'features-grid-2' : variant === 'list' ? 'features-list' : 'features-grid'
  
  const itemsHtml = (items || []).map((item, i) => `
      <div class="card feature-card animate-fade-in" style="animation-delay: ${i * 0.1}s">
        <div class="feature-icon" style="background: ${item.color || '#A78BFA'}20; color: ${item.color || '#A78BFA'}">
          ✦
        </div>
        <h3 class="feature-title">${escapeHtml(item.title)}</h3>
        <p class="feature-description">${escapeHtml(item.description)}</p>
      </div>
  `).join('')
  
  return `
  <!-- FEATURES SECTION -->
  <section id="${sectionId}" class="features ${spacingClass}">
    <div class="container">
      <div class="text-center">
        <h2>${escapeHtml(content?.title || 'Fonctionnalités')}</h2>
        ${content?.subtitle ? `<p class="mt-4">${escapeHtml(content.subtitle)}</p>` : ''}
      </div>
      
      <div class="${gridClass}">
        ${itemsHtml}
      </div>
    </div>
  </section>
`
}

/**
 * Génère le HTML pour une section How It Works
 */
function generateHowItWorksHTML(section, sectionId) {
  const { content, steps, layout } = section
  const variant = layout?.variant || 'timeline'
  const spacing = layout?.spacing || 'normal'
  
  const spacingClass = spacing === 'compact' ? 'section-compact' : spacing === 'spacious' ? 'section-spacious' : 'section'
  
  const stepsHtml = (steps || []).map((step, i) => `
      <div class="step-item animate-fade-in" style="animation-delay: ${i * 0.15}s">
        <div class="step-number">${step.number || i + 1}</div>
        <div class="step-content">
          <h3 class="step-title">${escapeHtml(step.title)}</h3>
          <p class="step-description">${escapeHtml(step.description)}</p>
        </div>
      </div>
  `).join('')
  
  return `
  <!-- HOW IT WORKS SECTION -->
  <section id="${sectionId}" class="steps ${spacingClass}">
    <div class="container">
      <div class="text-center">
        <h2>${escapeHtml(content?.title || 'Comment ça marche')}</h2>
        ${content?.subtitle ? `<p class="mt-4">${escapeHtml(content.subtitle)}</p>` : ''}
      </div>
      
      <div class="steps-timeline">
        ${stepsHtml}
      </div>
    </div>
  </section>
`
}

/**
 * Génère le HTML pour une section Pricing
 */
function generatePricingHTML(section, sectionId) {
  const { content, plans, layout } = section
  const spacing = layout?.spacing || 'normal'
  
  const spacingClass = spacing === 'compact' ? 'section-compact' : spacing === 'spacious' ? 'section-spacious' : 'section'
  
  const plansHtml = (plans || []).map((plan, i) => {
    const featuresHtml = (plan.features || []).map(f => 
      `<li>${escapeHtml(f)}</li>`
    ).join('')
    
    return `
      <div class="card pricing-card ${plan.highlighted ? 'highlighted' : ''} animate-fade-in" style="animation-delay: ${i * 0.1}s">
        ${plan.badge ? `<span class="badge">${escapeHtml(plan.badge)}</span>` : ''}
        <h3 class="pricing-name">${escapeHtml(plan.name)}</h3>
        <div class="pricing-price">${escapeHtml(plan.price)}</div>
        <div class="pricing-period">${escapeHtml(plan.period || '/mois')}</div>
        ${plan.description ? `<p>${escapeHtml(plan.description)}</p>` : ''}
        <ul class="pricing-features">
          ${featuresHtml}
        </ul>
        <a href="#" class="btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}">${escapeHtml(plan.cta || 'Choisir')}</a>
      </div>
    `
  }).join('')
  
  return `
  <!-- PRICING SECTION -->
  <section id="${sectionId}" class="pricing ${spacingClass}">
    <div class="container">
      <div class="text-center">
        <h2>${escapeHtml(content?.title || 'Nos tarifs')}</h2>
        ${content?.subtitle ? `<p class="mt-4">${escapeHtml(content.subtitle)}</p>` : ''}
      </div>
      
      <div class="pricing-grid">
        ${plansHtml}
      </div>
    </div>
  </section>
`
}

/**
 * Génère le HTML pour une section FAQ
 */
function generateFaqHTML(section, sectionId) {
  const { content, items, layout } = section
  const variant = layout?.variant || 'accordion'
  const spacing = layout?.spacing || 'normal'
  
  const spacingClass = spacing === 'compact' ? 'section-compact' : spacing === 'spacious' ? 'section-spacious' : 'section'
  
  const itemsHtml = (items || []).map((item, i) => `
      <div class="faq-item animate-fade-in" style="animation-delay: ${i * 0.1}s">
        <button class="faq-question" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('hidden')">
          ${escapeHtml(item.question)}
          <span>▼</span>
        </button>
        <div class="faq-answer hidden">
          ${escapeHtml(item.answer)}
        </div>
      </div>
  `).join('')
  
  return `
  <!-- FAQ SECTION -->
  <section id="${sectionId}" class="faq ${spacingClass}">
    <div class="container">
      <div class="text-center">
        <h2>${escapeHtml(content?.title || 'Questions fréquentes')}</h2>
        ${content?.subtitle ? `<p class="mt-4">${escapeHtml(content.subtitle)}</p>` : ''}
      </div>
      
      <div class="faq-list">
        ${itemsHtml}
      </div>
    </div>
  </section>
`
}

/**
 * Génère le HTML d'une section selon son type
 */
function generateSectionHTML(section, sectionId) {
  switch (section.type) {
    case 'hero':
      return generateHeroHTML(section, sectionId)
    case 'features':
      return generateFeaturesHTML(section, sectionId)
    case 'howItWorks':
      return generateHowItWorksHTML(section, sectionId)
    case 'pricing':
      return generatePricingHTML(section, sectionId)
    case 'faq':
      return generateFaqHTML(section, sectionId)
    default:
      return `<!-- Unknown section type: ${section.type} -->`
  }
}

/**
 * Génère le document HTML complet
 */
export function generateHTML(site, options = {}) {
  const { 
    includeCSS = true,
    cssFileName = 'styles.css',
    title = 'Ma Landing Page',
    description = 'Créée avec Bulle Editor',
    minify = false,
  } = options
  
  const theme = getTheme(site.theme || 'aurora')
  
  // Générer toutes les sections
  const sectionsHTML = (site.sectionsOrder || [])
    .filter(id => site.sectionsVisibility?.[id] !== false)
    .map(id => {
      const section = site.sections?.[id]
      if (!section) return ''
      return generateSectionHTML(section, id)
    })
    .join('\n')
  
  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)}</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  ${includeCSS ? `<!-- Styles -->
  <link rel="stylesheet" href="${cssFileName}">` : ''}
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🫧</text></svg>">
</head>
<body>
  <main>
${sectionsHTML}
  </main>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>Créé avec 💜 par <strong>Bulle Editor</strong></p>
    </div>
  </footer>
  
  <!-- Scroll animations -->
  <script>
    // Fade in on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.animate-fade-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  </script>
</body>
</html>`

  if (minify) {
    html = html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim()
  }

  return html
}

/**
 * Génère le HTML avec CSS inline
 */
export function generateHTMLWithInlineCSS(site, css, options = {}) {
  const {
    title = 'Ma Landing Page',
    description = 'Créée avec Bulle Editor',
    minify = false,
  } = options
  
  const theme = getTheme(site.theme || 'aurora')
  
  // Générer toutes les sections
  const sectionsHTML = (site.sectionsOrder || [])
    .filter(id => site.sectionsVisibility?.[id] !== false)
    .map(id => {
      const section = site.sections?.[id]
      if (!section) return ''
      return generateSectionHTML(section, id)
    })
    .join('\n')
  
  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(title)}</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Inline Styles -->
  <style>
${css}
  </style>
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🫧</text></svg>">
</head>
<body>
  <main>
${sectionsHTML}
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>Créé avec 💜 par <strong>Bulle Editor</strong></p>
    </div>
  </footer>
  
  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-fade-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  </script>
</body>
</html>`

  return html
}

export default {
  generateHTML,
  generateHTMLWithInlineCSS,
  generateSectionHTML,
}
