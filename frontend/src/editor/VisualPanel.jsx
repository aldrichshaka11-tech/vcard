import { useRef, useState, useEffect } from 'react'
import { Camera, Image, Building2, Palette, Monitor, Check } from 'lucide-react'
import { THEME_COLORS, VIRTUAL_BG_PRESETS } from './useCardStore'
import api from '../api/axios'
import FeatureGate, { FEATURES } from '../components/FeatureGate'
import { useAuth } from '../api/useAuth'

function ImageUpload({ label, icon, value, onChange, round }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const [sizeWarning, setSizeWarning] = useState('')

  const MAX_SIZE_MB = 5
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

  // Sync preview with parent value changes
  useEffect(() => {
    if (value && !value.startsWith('blob:')) {
      setPreview(value)
    }
  }, [value])

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Size check before upload
    if (file.size > MAX_SIZE_BYTES) {
      const fileMB = (file.size / (1024 * 1024)).toFixed(1)
      setSizeWarning(`Image is ${fileMB} MB. Please upload an image smaller than ${MAX_SIZE_MB} MB.`)
      e.target.value = ''
      return
    }

    setSizeWarning('')
    setUploading(true)
    try {
      const blobUrl = URL.createObjectURL(file)
      setPreview(blobUrl)
      const formData = new FormData()
      formData.append('photo', file)
      const res = await api.post('/cards/upload', formData)
      const filename = res.data?.filename
      if (!filename) throw new Error('No filename in response')
      const baseUrl = import.meta.env.MODE === 'production'
        ? (import.meta.env.VITE_API_BASE?.replace('/api', '') || '')
        : 'http://localhost:8000'
      const serverUrl = `${baseUrl}/uploads/${filename}`
      onChange(serverUrl)
      setTimeout(() => {
        setPreview(serverUrl)
        URL.revokeObjectURL(blobUrl)
      }, 500)
    } catch (err) {
      alert(`Failed to upload ${label.toLowerCase()}. ${err.response?.data?.error || err.message}`)
      setPreview(value || '')
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={() => { setSizeWarning(''); ref.current?.click() }}
        disabled={uploading}
        className={`relative group overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-all bg-gray-50 hover:bg-indigo-50 flex items-center justify-center ${round ? 'w-20 h-20 rounded-full' : 'w-full h-20 rounded-xl'} ${uploading ? 'opacity-50 cursor-wait' : ''}`}
      >
        {uploading ? (
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        ) : preview ? (
          <img 
            src={preview} 
            alt={label} 
            className={`w-full h-full object-cover ${round ? 'rounded-full' : 'rounded-xl'}`}
            onError={(e) => {
              console.error(`[${label}] Image failed to load:`, preview)
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <span className="text-gray-400 group-hover:text-indigo-400 transition-colors">{icon}</span>
        )}
        {!uploading && preview && (
          <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${round ? 'rounded-full' : 'rounded-xl'}`}>
            <Camera size={18} className="text-white" />
          </div>
        )}
      </button>
      <span className="text-xs text-gray-400 font-medium">{uploading ? 'Uploading...' : label}</span>
      {sizeWarning && (
        <p className="text-[10px] text-red-500 font-medium text-center leading-tight px-1">
          ⚠ {sizeWarning}
        </p>
      )}
      <input 
        ref={ref} 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFile} 
        disabled={uploading} 
      />
    </div>
  )
}

export default function VisualPanel({ card, update, updateNested }) {
  const { getFeatureLimit } = useAuth()
  const maxColors = getFeatureLimit(FEATURES.THEME_COLORS)
  const allowedColors = maxColors === -1 ? THEME_COLORS : THEME_COLORS.slice(0, maxColors)
  
  return (
    <div className="space-y-5">
      {/* Photos row */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-pink-200 transition-all">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Image size={14} className="text-pink-400" /> Photos & Logo
        </p>
        <div className="grid grid-cols-3 gap-3">
          <FeatureGate feature={FEATURES.COVER_PHOTO}>
            <ImageUpload label="Cover Photo" icon={<Image size={22} />} value={card.coverPhoto} onChange={v => update('coverPhoto', v)} />
          </FeatureGate>
          <ImageUpload label="Profile Photo" icon={<Camera size={22} />} value={card.profilePhoto} onChange={v => update('profilePhoto', v)} round />
          <FeatureGate feature={FEATURES.COMPANY_LOGO}>
            <ImageUpload label="Company Logo" icon={<Building2 size={22} />} value={card.companyLogo} onChange={v => update('companyLogo', v)} />
          </FeatureGate>
        </div>
      </div>

      {/* Theme color */}
      <div className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Palette size={14} className="text-indigo-400" /> Theme Color {maxColors !== -1 && <span className="text-xs text-gray-400">({maxColors} colors available)</span>}
        </p>
        <div className="grid grid-cols-10 gap-2 mb-3">
          {allowedColors.map(color => (
            <button
              key={color}
              onClick={() => update('themeColor', color)}
              className="w-7 h-7 rounded-lg transition-all hover:scale-110 flex items-center justify-center"
              style={{ background: color }}
            >
              {card.themeColor === color && <Check size={12} className="text-white" />}
            </button>
          ))}
          {maxColors !== -1 && THEME_COLORS.slice(maxColors).map(color => (
            <div
              key={color}
              className="w-7 h-7 rounded-lg opacity-30 relative cursor-pointer group"
              style={{ background: color }}
              title="Premium color - Upgrade to unlock"
              onClick={() => {
                // Navigate to pricing page when clicking locked colors
                window.location.href = '/pricing'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-[8px] text-gray-600">🔒</span>
                </div>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Premium Color
              </div>
            </div>
          ))}
        </div>
        
        {/* Premium upgrade message for free users */}
        {maxColors !== -1 && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-purple-700">Unlock More Colors</p>
                <p className="text-xs text-purple-600 mt-1">Get {THEME_COLORS.length - maxColors} additional colors with premium</p>
              </div>
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}
        
        <FeatureGate feature={FEATURES.CUSTOM_COLORS}>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={card.themeColor}
              onChange={e => update('themeColor', e.target.value)}
              className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={card.themeColor}
              onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && update('themeColor', e.target.value)}
              className="input-field font-mono text-sm"
              placeholder="#6366f1"
            />
          </div>
        </FeatureGate>
      </div>

      {/* Virtual background */}
      <FeatureGate feature={FEATURES.VIRTUAL_BACKGROUND}>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-teal-100 transition-all">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <Monitor size={14} className="text-teal-400" /> Virtual Background
            </p>
            <button
              onClick={() => updateNested('virtualBg', 'enabled', !card.virtualBg.enabled)}
              className={`relative w-10 h-5 rounded-full transition-colors ${card.virtualBg.enabled ? 'bg-teal-500' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${card.virtualBg.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {card.virtualBg.enabled && (
            <div className="space-y-3">
              {/* Clear button */}
              {(card.virtualBg.preset || card.virtualBg.custom) && (
                <button
                  onClick={() => { updateNested('virtualBg', 'preset', ''); updateNested('virtualBg', 'custom', '') }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  × Clear background
                </button>
              )}
              {/* Presets */}
              <div className="grid grid-cols-3 gap-2">
                {VIRTUAL_BG_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      // selecting preset clears custom
                      updateNested('virtualBg', 'custom', '')
                      updateNested('virtualBg', 'preset', p.color)
                    }}
                    className={`h-14 rounded-xl border-2 transition-all hover:scale-105 relative overflow-hidden ${
                      card.virtualBg.preset === p.color && !card.virtualBg.custom
                        ? 'border-teal-500 scale-105'
                        : 'border-transparent'
                    }`}
                    style={{ background: p.color }}
                    title={p.label}
                  >
                    <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-white/80 font-medium">{p.label}</span>
                  </button>
                ))}
              </div>
              {/* Custom upload */}
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Or upload custom background</p>
                <label className={`flex items-center gap-2 cursor-pointer btn-secondary text-xs py-2 ${
                  card.virtualBg.custom ? 'border-teal-400 text-teal-600' : ''
                }`}>
                  <Image size={14} />
                  {card.virtualBg.custom ? 'Change image' : 'Upload image'}
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const file = e.target.files[0]
                    if (!file) return
                    // size check
                    if (file.size > 5 * 1024 * 1024) {
                      alert('Image must be under 5 MB.')
                      return
                    }
                    const blobUrl = URL.createObjectURL(file)
                    // uploading custom clears preset
                    updateNested('virtualBg', 'preset', '')
                    updateNested('virtualBg', 'custom', blobUrl)
                    try {
                      const formData = new FormData()
                      formData.append('photo', file)
                      const res = await api.post('/cards/upload', formData)
                      const filename = res.data.filename
                      const baseUrl = import.meta.env.MODE === 'production'
                        ? (import.meta.env.VITE_API_BASE?.replace('/api', '') || '')
                        : 'http://localhost:8000'
                      const serverUrl = `${baseUrl}/uploads/${filename}`
                      setTimeout(() => {
                        updateNested('virtualBg', 'custom', serverUrl)
                        URL.revokeObjectURL(blobUrl)
                      }, 500)
                    } catch {
                      updateNested('virtualBg', 'custom', '')
                    }
                  }} />
                </label>
              </div>
              {/* Text Color Toggle */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2 font-medium">Card Text Color</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateNested('virtualBg', 'fontColor', 'dark')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${(!card.virtualBg.fontColor || card.virtualBg.fontColor === 'dark') ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                  >
                    Dark Text
                  </button>
                  <button
                    onClick={() => updateNested('virtualBg', 'fontColor', 'light')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${card.virtualBg.fontColor === 'light' ? 'bg-white text-gray-900 border-gray-300 shadow-sm' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                  >
                    Light Text
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </FeatureGate>
    </div>
  )
}
