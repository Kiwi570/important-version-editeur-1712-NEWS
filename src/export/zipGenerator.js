// ═══════════════════════════════════════════════════════════════════
// 📦 ZIP GENERATOR - Crée le package téléchargeable
// ═══════════════════════════════════════════════════════════════════

import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { generateHTML, generateHTMLWithInlineCSS } from './htmlExporter'
import { generateCSS } from './cssExporter'

/**
 * Génère le README pour le package
 */
function generateReadme(site, options = {}) {
  const { projectName = 'ma-landing-page' } = options
  
  return `# ${projectName}

Landing page créée avec 🫧 Bulle Editor

## 📁 Structure des fichiers

\`\`\`
${projectName}/
├── index.html      # Page principale
├── styles.css      # Feuille de styles
├── assets/         # Images et ressources
└── README.md       # Ce fichier
\`\`\`

## 🚀 Utilisation

### Option 1: Ouvrir directement
Double-cliquez sur \`index.html\` pour voir votre page dans le navigateur.

### Option 2: Serveur local
\`\`\`bash
# Avec Python
python -m http.server 8000

# Avec Node.js (npx)
npx serve .

# Avec PHP
php -S localhost:8000
\`\`\`

Puis ouvrez http://localhost:8000

## 🎨 Personnalisation

### Modifier les couleurs
Éditez les variables CSS dans \`styles.css\` :
\`\`\`css
:root {
  --color-accent: #A78BFA;
  --gradient-primary: linear-gradient(135deg, #A78BFA, #F472B6);
  /* etc... */
}
\`\`\`

### Modifier le contenu
Éditez directement le HTML dans \`index.html\`.

## 📱 Responsive

La page est optimisée pour :
- 📱 Mobile (< 768px)
- 📱 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🔗 Déploiement

### Netlify
1. Glissez-déposez le dossier sur [netlify.com/drop](https://netlify.com/drop)

### Vercel
1. Installez la CLI: \`npm i -g vercel\`
2. Lancez: \`vercel\`

### GitHub Pages
1. Créez un repo GitHub
2. Uploadez les fichiers
3. Activez GitHub Pages dans Settings

---

Créé avec 💜 par [Bulle Editor](https://bulle.editor)
`
}

/**
 * Génère un fichier de configuration de base
 */
function generateConfigFile(site) {
  return JSON.stringify({
    name: 'ma-landing-page',
    version: '1.0.0',
    generator: 'Bulle Editor v2.2',
    theme: site.theme || 'aurora',
    exportedAt: new Date().toISOString(),
    sections: site.sectionsOrder || [],
  }, null, 2)
}

/**
 * Export format: HTML + CSS séparés
 */
export async function exportSeparateFiles(site, options = {}) {
  const {
    projectName = 'ma-landing-page',
    includeReadme = true,
    minify = false,
  } = options
  
  const zip = new JSZip()
  const folder = zip.folder(projectName)
  
  // HTML
  const html = generateHTML(site, { 
    includeCSS: true, 
    cssFileName: 'styles.css',
    minify,
  })
  folder.file('index.html', html)
  
  // CSS
  const css = generateCSS(site, { minify })
  folder.file('styles.css', css)
  
  // Assets folder
  const assets = folder.folder('assets')
  assets.file('.gitkeep', '# Add your images here')
  
  // README
  if (includeReadme) {
    folder.file('README.md', generateReadme(site, { projectName }))
  }
  
  // Config
  folder.file('bulle.config.json', generateConfigFile(site))
  
  // Generate ZIP
  const blob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  })
  
  return blob
}

/**
 * Export format: HTML unique avec CSS inline
 */
export async function exportSingleFile(site, options = {}) {
  const {
    projectName = 'ma-landing-page',
    minify = false,
  } = options
  
  const css = generateCSS(site, { minify })
  const html = generateHTMLWithInlineCSS(site, css, { minify })
  
  const zip = new JSZip()
  const folder = zip.folder(projectName)
  
  folder.file('index.html', html)
  folder.file('README.md', generateReadme(site, { projectName }))
  
  const blob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
  })
  
  return blob
}

/**
 * Export format: HTML seul (sans ZIP)
 */
export function exportHTMLOnly(site, options = {}) {
  const { minify = false, inline = true } = options
  
  if (inline) {
    const css = generateCSS(site, { minify })
    return generateHTMLWithInlineCSS(site, css, { minify })
  }
  
  return generateHTML(site, { includeCSS: false, minify })
}

/**
 * Export format: CSS seul
 */
export function exportCSSOnly(site, options = {}) {
  const { minify = false } = options
  return generateCSS(site, { minify })
}

/**
 * Télécharge le fichier
 */
export function downloadFile(content, filename, type = 'text/plain') {
  const blob = content instanceof Blob 
    ? content 
    : new Blob([content], { type })
  
  saveAs(blob, filename)
}

/**
 * Télécharge le ZIP
 */
export async function downloadZip(site, format = 'separate', options = {}) {
  const { projectName = 'ma-landing-page' } = options
  
  let blob
  if (format === 'single') {
    blob = await exportSingleFile(site, options)
  } else {
    blob = await exportSeparateFiles(site, options)
  }
  
  saveAs(blob, `${projectName}.zip`)
  return true
}

/**
 * Copie le code dans le presse-papiers
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

export default {
  exportSeparateFiles,
  exportSingleFile,
  exportHTMLOnly,
  exportCSSOnly,
  downloadFile,
  downloadZip,
  copyToClipboard,
}
