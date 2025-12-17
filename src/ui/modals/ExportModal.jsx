import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Download, Copy, Check, FileCode, FileText, 
  Package, Eye, Code, Palette, Zap, ExternalLink,
  Smartphone, Monitor, Loader2
} from 'lucide-react'
import { useSiteStore } from '@core/state/siteStore'
import { useEditorStore } from '@core/state/editorStore'
import { useTheme } from '@core/theme/ThemeProvider'
import { generateHTML, generateHTMLWithInlineCSS } from '@export/htmlExporter'
import { generateCSS } from '@export/cssExporter'
import { downloadZip, downloadFile, copyToClipboard, exportHTMLOnly, exportCSSOnly } from '@export/zipGenerator'

// ═══════════════════════════════════════════════════════════════════
// 📦 EXPORT MODAL - Interface d'export complète
// ═══════════════════════════════════════════════════════════════════

const EXPORT_TABS = [
  { id: 'preview', icon: Eye, label: 'Preview' },
  { id: 'html', icon: FileCode, label: 'HTML' },
  { id: 'css', icon: Palette, label: 'CSS' },
  { id: 'download', icon: Package, label: 'Télécharger' },
]

const EXPORT_FORMATS = [
  {
    id: 'separate',
    icon: Package,
    name: 'HTML + CSS séparés',
    description: 'Structure classique avec fichiers séparés',
    files: ['index.html', 'styles.css', 'README.md'],
  },
  {
    id: 'single',
    icon: FileCode,
    name: 'Fichier unique',
    description: 'Tout le CSS est inline dans le HTML',
    files: ['index.html', 'README.md'],
  },
  {
    id: 'html-only',
    icon: FileText,
    name: 'HTML seul',
    description: 'Code HTML sans styles',
    files: ['index.html'],
  },
  {
    id: 'css-only',
    icon: Palette,
    name: 'CSS seul',
    description: 'Feuille de styles uniquement',
    files: ['styles.css'],
  },
]

function ExportModal() {
  const [activeTab, setActiveTab] = useState('preview')
  const [exportFormat, setExportFormat] = useState('separate')
  const [projectName, setProjectName] = useState('ma-landing-page')
  const [minify, setMinify] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [previewDevice, setPreviewDevice] = useState('desktop')
  
  const modal = useEditorStore((s) => s.modal)
  const closeModal = useEditorStore((s) => s.closeModal)
  const showToast = useEditorStore((s) => s.showToast)
  
  const site = useSiteStore((s) => s.site)
  
  const { colors, gradient } = useTheme()

  // Générer le code
  const generatedHTML = useMemo(() => {
    if (!site) return ''
    const css = generateCSS(site, { minify })
    return generateHTMLWithInlineCSS(site, css, { minify })
  }, [site, minify])

  const generatedCSS = useMemo(() => {
    if (!site) return ''
    return generateCSS(site, { minify })
  }, [site, minify])

  // Handle copy
  const handleCopy = async (code) => {
    await copyToClipboard(code)
    setCopied(true)
    showToast('📋 Code copié !', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle download
  const handleDownload = async () => {
    if (!site) return
    
    setDownloading(true)
    
    try {
      if (exportFormat === 'html-only') {
        const html = exportHTMLOnly(site, { minify, inline: true })
        downloadFile(html, 'index.html', 'text/html')
      } else if (exportFormat === 'css-only') {
        const css = exportCSSOnly(site, { minify })
        downloadFile(css, 'styles.css', 'text/css')
      } else {
        await downloadZip(site, exportFormat, { projectName, minify })
      }
      
      showToast('✅ Export réussi !', 'success')
    } catch (error) {
      console.error('Export error:', error)
      showToast('❌ Erreur lors de l\'export', 'error')
    } finally {
      setDownloading(false)
    }
  }

  if (modal !== 'export') return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Modal */}
        <motion.div
          className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: colors.backgroundSecondary,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
          }}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4"
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: gradient }}
              >
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 
                  className="font-bold text-lg"
                  style={{ color: colors.text.primary }}
                >
                  Exporter ton site
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: colors.text.muted }}
                >
                  Télécharge ton code HTML/CSS prêt à déployer
                </p>
              </div>
            </div>
            
            <motion.button
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: colors.surface }}
              onClick={closeModal}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" style={{ color: colors.text.muted }} />
            </motion.button>
          </div>

          {/* Tabs */}
          <div 
            className="flex p-2 gap-1"
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            {EXPORT_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              
              return (
                <motion.button
                  key={tab.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg relative"
                  style={{
                    background: isActive ? `${colors.accent.primary}15` : 'transparent',
                    color: isActive ? colors.accent.primary : colors.text.muted,
                  }}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ background: `${colors.accent.primary}10` }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: gradient }}
                      layoutId="exportTab"
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'preview' && (
              <PreviewTab 
                html={generatedHTML}
                previewDevice={previewDevice}
                setPreviewDevice={setPreviewDevice}
                colors={colors}
                gradient={gradient}
              />
            )}
            
            {activeTab === 'html' && (
              <CodeTab 
                code={generatedHTML}
                language="html"
                onCopy={() => handleCopy(generatedHTML)}
                copied={copied}
                colors={colors}
                gradient={gradient}
              />
            )}
            
            {activeTab === 'css' && (
              <CodeTab 
                code={generatedCSS}
                language="css"
                onCopy={() => handleCopy(generatedCSS)}
                copied={copied}
                colors={colors}
                gradient={gradient}
              />
            )}
            
            {activeTab === 'download' && (
              <DownloadTab
                exportFormat={exportFormat}
                setExportFormat={setExportFormat}
                projectName={projectName}
                setProjectName={setProjectName}
                minify={minify}
                setMinify={setMinify}
                onDownload={handleDownload}
                downloading={downloading}
                colors={colors}
                gradient={gradient}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 👁️ PREVIEW TAB
// ═══════════════════════════════════════════════════════════════════

function PreviewTab({ html, previewDevice, setPreviewDevice, colors, gradient }) {
  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Device toggle */}
      <div 
        className="flex items-center justify-center gap-2 p-3"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        {['desktop', 'tablet', 'mobile'].map((device) => (
          <motion.button
            key={device}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: previewDevice === device ? gradient : colors.surface,
              color: previewDevice === device ? 'white' : colors.text.muted,
            }}
            onClick={() => setPreviewDevice(device)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {device === 'desktop' && <Monitor className="w-4 h-4" />}
            {device === 'tablet' && <Smartphone className="w-4 h-4" />}
            {device === 'mobile' && <Smartphone className="w-3 h-3" />}
            <span className="text-sm font-medium capitalize">{device}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Preview iframe */}
      <div 
        className="flex-1 overflow-auto p-4 flex justify-center"
        style={{ background: colors.surface }}
      >
        <motion.div
          className="relative rounded-xl overflow-hidden shadow-2xl"
          style={{
            width: deviceWidths[previewDevice],
            maxWidth: previewDevice === 'desktop' ? '100%' : deviceWidths[previewDevice],
            height: previewDevice === 'mobile' ? '667px' : 'auto',
            minHeight: '500px',
          }}
          layout
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <iframe
            srcDoc={html}
            title="Preview"
            className="w-full h-full border-0"
            style={{ 
              minHeight: '500px',
              background: 'white',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 💻 CODE TAB
// ═══════════════════════════════════════════════════════════════════

function CodeTab({ code, language, onCopy, copied, colors, gradient }) {
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div 
        className="flex items-center justify-between p-3"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center gap-2">
          <span 
            className="text-sm font-medium"
            style={{ color: colors.text.muted }}
          >
            {language.toUpperCase()} • {(code.length / 1024).toFixed(1)} KB
          </span>
        </div>
        
        <motion.button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ 
            background: copied ? '#34D399' : gradient,
          }}
          onClick={onCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Copié !</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Copier</span>
            </>
          )}
        </motion.button>
      </div>
      
      {/* Code area */}
      <div 
        className="flex-1 overflow-auto p-4"
        style={{ background: '#0a0a0f' }}
      >
        <pre 
          className="text-sm font-mono leading-relaxed"
          style={{ color: '#e2e8f0' }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// 📥 DOWNLOAD TAB
// ═══════════════════════════════════════════════════════════════════

function DownloadTab({ 
  exportFormat, 
  setExportFormat, 
  projectName, 
  setProjectName,
  minify,
  setMinify,
  onDownload,
  downloading,
  colors, 
  gradient 
}) {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Project name */}
        <div>
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: colors.text.secondary }}
          >
            Nom du projet
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value.replace(/[^a-z0-9-]/gi, '-').toLowerCase())}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.text.primary,
            }}
            placeholder="ma-landing-page"
          />
        </div>

        {/* Export format */}
        <div>
          <label 
            className="block text-sm font-medium mb-3"
            style={{ color: colors.text.secondary }}
          >
            Format d'export
          </label>
          <div className="grid grid-cols-2 gap-3">
            {EXPORT_FORMATS.map((format) => {
              const isActive = exportFormat === format.id
              const Icon = format.icon
              
              return (
                <motion.button
                  key={format.id}
                  className="p-4 rounded-xl text-left relative overflow-hidden"
                  style={{
                    background: isActive ? `${colors.accent.primary}15` : colors.surface,
                    border: `2px solid ${isActive ? colors.accent.primary : colors.border}`,
                  }}
                  onClick={() => setExportFormat(format.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: isActive ? gradient : colors.backgroundSecondary,
                      }}
                    >
                      <Icon 
                        className="w-5 h-5" 
                        style={{ color: isActive ? 'white' : colors.text.muted }}
                      />
                    </div>
                    <div>
                      <div 
                        className="font-semibold text-sm"
                        style={{ color: colors.text.primary }}
                      >
                        {format.name}
                      </div>
                      <div 
                        className="text-xs mt-0.5"
                        style={{ color: colors.text.muted }}
                      >
                        {format.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {format.files.map((file) => (
                          <span
                            key={file}
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{
                              background: colors.backgroundSecondary,
                              color: colors.text.light,
                            }}
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: gradient }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Options */}
        <div>
          <label 
            className="block text-sm font-medium mb-3"
            style={{ color: colors.text.secondary }}
          >
            Options
          </label>
          <div className="space-y-2">
            <label 
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >
              <input
                type="checkbox"
                checked={minify}
                onChange={(e) => setMinify(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <div>
                <div 
                  className="font-medium text-sm"
                  style={{ color: colors.text.primary }}
                >
                  <Zap className="w-4 h-4 inline mr-1" />
                  Minifier le code
                </div>
                <div 
                  className="text-xs"
                  style={{ color: colors.text.muted }}
                >
                  Réduit la taille des fichiers (recommandé pour production)
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Download button */}
        <motion.button
          className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
          style={{ 
            background: downloading ? colors.surface : gradient,
            opacity: downloading ? 0.7 : 1,
          }}
          onClick={onDownload}
          disabled={downloading}
          whileHover={downloading ? {} : { scale: 1.02 }}
          whileTap={downloading ? {} : { scale: 0.98 }}
        >
          {downloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Télécharger {projectName}.zip</span>
            </>
          )}
        </motion.button>

        {/* Deploy suggestions */}
        <div 
          className="p-4 rounded-xl"
          style={{ 
            background: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div 
            className="text-sm font-medium mb-3"
            style={{ color: colors.text.secondary }}
          >
            🚀 Déployer sur
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Netlify', url: 'https://app.netlify.com/drop' },
              { name: 'Vercel', url: 'https://vercel.com/new' },
              { name: 'GitHub Pages', url: 'https://pages.github.com/' },
            ].map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  background: colors.backgroundSecondary,
                  color: colors.text.muted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary
                  e.currentTarget.style.borderColor = colors.accent.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.muted
                }}
              >
                {platform.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
