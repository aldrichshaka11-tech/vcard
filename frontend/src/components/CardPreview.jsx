import { useState } from 'react'
import { Mail, Phone, Globe, MapPin, AtSign, MessageCircle, Calendar, GitBranch, Link as LinkIcon, Pencil, Settings, Palette } from 'lucide-react'
import ImageAdjustModal from '../editor/ImageAdjustModal'

const ICON_MAP = {
  email: <Mail size={16} />, phone: <Phone size={16} />, website: <Globe size={16} />,
  address: <MapPin size={16} />, twitter: <AtSign size={16} />, instagram: <AtSign size={16} />,
  threads: <AtSign size={16} />, linkedin: <AtSign size={16} />, facebook: <AtSign size={16} />,
  youtube: <AtSign size={16} />, snapchat: <AtSign size={16} />, tiktok: <AtSign size={16} />,
  twitch: <AtSign size={16} />, yelp: <AtSign size={16} />, whatsapp: <MessageCircle size={16} />,
  signal: <MessageCircle size={16} />, discord: <MessageCircle size={16} />,
  skype: <MessageCircle size={16} />, telegram: <MessageCircle size={16} />,
  github: <GitBranch size={16} />, calendly: <Calendar size={16} />,
}

const DEFAULT_LAYOUT = {
  coverHeight: 128, overlap: 48, profileSize: 96, logoSize: 56, cardBgColor: '',
  cover:   { zoom: 1, x: 50, y: 50 },
  profile: { zoom: 1, x: 50, y: 50 },
  logo:    { zoom: 1, x: 50, y: 50 },
}

// editable=true → show edit icons (editor preview only)
// onLayoutChange → callback to save layout back to card store
export default function CardPreview({ card = {}, editable = false, onLayoutChange }) {
  const [modal, setModal] = useState(null) // null | 'cover' | 'profile' | 'logo' | 'layout' | 'bg'

  const uploadsBase = import.meta.env.MODE === 'production'
    ? '/uploads/'
    : 'http://localhost:8000/uploads/'

  const links = card.links || []
  const metaByType = (type) => links.find(l => l.type === type)?.url || ''

  const themeColor = metaByType('meta_themeColor') || '#6366f1'
  const vBgEnabled = metaByType('meta_vBg_enabled') === 'true'
  const vBgPreset  = metaByType('meta_vBg_preset') || ''
  const vBgCustomFile = metaByType('meta_vBg_custom') || ''

  const layout = { ...DEFAULT_LAYOUT, ...(card.layout || {}) }
  const coverH   = layout.coverHeight
  const overlap  = layout.overlap
  const profSize = layout.profileSize
  const logoSize = layout.logoSize
  const cardBg   = layout.cardBgColor

  const bgStyle = cardBg
    ? { background: cardBg }
    : vBgEnabled
      ? vBgCustomFile
        ? { backgroundImage: `url(${vBgCustomFile.startsWith('http') ? vBgCustomFile : uploadsBase + vBgCustomFile})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : vBgPreset ? { background: vBgPreset } : { background: '#f3f4f6' }
      : { background: '#f3f4f6' }

  const getImageUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename
    return `${uploadsBase}${filename}`
  }

  const profilePhotoUrl = getImageUrl(metaByType('meta_profile') || card.photo)
  const coverPhotoUrl   = getImageUrl(metaByType('meta_cover'))
  const logoUrl         = getImageUrl(metaByType('meta_logo'))

  const displayName    = metaByType('meta_name')    || card.name    || 'Your Name'
  const displayEmail   = metaByType('meta_email')   || card.email   || ''
  const displayCompany = metaByType('meta_company') || card.company || ''
  const department     = metaByType('meta_department')
  const accreditations = metaByType('meta_accreditations')
  const ctaLabel       = metaByType('meta_ctaLabel')

  const fields = [
    displayEmail && { key: 'email', label: 'Email', value: displayEmail },
    ...links.filter(l => !String(l.type || '').startsWith('meta_')).map(l => ({
      key: l.type || 'link', label: l.label || l.type || 'Link', value: l.url,
    })),
  ].filter(Boolean)

  // Image style with zoom + position
  const imgStyle = (imgKey) => {
    const v = layout[imgKey] || { zoom: 1, x: 50, y: 50 }
    return {
      objectFit: 'cover',
      objectPosition: `${v.x}% ${v.y}%`,
      transform: `scale(${v.zoom})`,
      transformOrigin: `${v.x}% ${v.y}%`,
      width: '100%',
      height: '100%',
    }
  }

  const EditBtn = ({ onClick, className = '' }) => (
    <button onClick={onClick}
      className={`absolute flex items-center justify-center w-6 h-6 bg-black/60 hover:bg-indigo-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 ${className}`}>
      <Pencil size={10} />
    </button>
  )

  const handleSave = (newLayout) => {
    if (onLayoutChange) onLayoutChange(newLayout)
  }

  return (
    <>
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-3xl overflow-visible shadow-sm border border-gray-200" style={bgStyle}>

          {/* Cover photo */}
          <div className="relative group rounded-t-3xl overflow-hidden" style={{ height: `${coverH}px` }}>
            {coverPhotoUrl ? (
              <div className="w-full h-full overflow-hidden">
                <img src={coverPhotoUrl} alt="cover"
                  style={{ ...imgStyle('cover'), position: 'absolute', inset: 0 }} />
              </div>
            ) : (
              <div className="w-full h-full rounded-t-3xl bg-gray-100" />
            )}
            {editable && coverPhotoUrl && (
              <EditBtn onClick={() => setModal('cover')} className="top-2 right-2" />
            )}
          </div>

          {/* Profile + Logo — absolutely positioned to overlap cover */}
          <div className="relative" style={{ height: `${profSize - overlap}px` }}>
            {/* Profile photo — left */}
            <div className="absolute group" style={{ left: '24px', top: `-${overlap}px` }}>
              <div className="rounded-full border-4 border-white shadow-xl overflow-hidden"
                style={{ width: `${profSize}px`, height: `${profSize}px` }}>
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt={displayName} style={imgStyle('profile')} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold bg-gray-200 text-gray-500"
                    style={{ fontSize: `${profSize * 0.33}px` }}>
                    {displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              {editable && profilePhotoUrl && (
                <button onClick={() => setModal('profile')}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors z-10">
                  <Pencil size={10} />
                </button>
              )}
            </div>

            {/* Company logo — right */}
            {logoUrl && (
              <div className="absolute group" style={{ right: '24px', top: `-${Math.round(layout.logoSize / 2)}px` }}>
                <div className="rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden p-1.5"
                  style={{ width: `${logoSize}px`, height: `${logoSize}px` }}>
                  <img src={logoUrl} alt="logo" style={imgStyle('logo')} className="rounded-lg" />
                </div>
                {editable && (
                  <button onClick={() => setModal('logo')}
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors z-10">
                    <Pencil size={8} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Edit toolbar — only in editor */}
          {editable && (
            <div className="flex gap-2 px-6 pb-2">
              <button onClick={() => setModal('layout')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-gray-200">
                <Settings size={11} /> Layout
              </button>
              <button onClick={() => setModal('bg')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-gray-200">
                <Palette size={11} /> Background
              </button>
            </div>
          )}

          {/* Info */}
          <div className="px-6 pb-6 space-y-3 pt-1">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
              {card.title && <p className="text-sm text-gray-600 mt-0.5">{card.title}</p>}
              {department && <p className="text-xs text-gray-400">{department}</p>}
              {displayCompany && <p className="text-sm font-medium text-gray-700 mt-1">{displayCompany}</p>}
              {accreditations && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {accreditations.split(',').map((a, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${themeColor}20`, color: themeColor }}>
                      {a.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {card.bio && <p className="text-sm text-gray-500 leading-relaxed">{card.bio}</p>}

            {fields.length > 0 && (
              <div className="space-y-2 pt-1">
                {fields.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: `${themeColor}10` }}>
                    <span style={{ color: themeColor }}>{ICON_MAP[f.key] || <LinkIcon size={16} />}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">{f.label}</p>
                      <p className="text-sm text-gray-700 truncate">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: themeColor }}>Share</button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2"
                style={{ borderColor: themeColor, color: themeColor }}>
                {ctaLabel || 'Save Contact'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ImageAdjustModal
          type={modal}
          label={modal === 'cover' ? 'Cover Photo' : modal === 'profile' ? 'Profile Photo' : 'Company Logo'}
          layout={layout}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
