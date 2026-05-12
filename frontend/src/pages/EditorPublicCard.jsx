import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Mail, Phone, Globe, MapPin, AtSign, MessageCircle, Calendar, GitBranch, Link as LinkIcon, Share2, Download } from 'lucide-react'
import api from '../api/axios'

const ICON_MAP = {
  email: <Mail size={16} />, phone: <Phone size={16} />, companyUrl: <Globe size={16} />,
  address: <MapPin size={16} />, twitter: <AtSign size={16} />, instagram: <AtSign size={16} />,
  threads: <AtSign size={16} />, linkedin: <AtSign size={16} />, facebook: <AtSign size={16} />,
  youtube: <AtSign size={16} />, snapchat: <AtSign size={16} />, tiktok: <AtSign size={16} />,
  twitch: <AtSign size={16} />, yelp: <AtSign size={16} />, whatsapp: <MessageCircle size={16} />,
  signal: <MessageCircle size={16} />, discord: <MessageCircle size={16} />,
  skype: <MessageCircle size={16} />, telegram: <MessageCircle size={16} />,
  github: <GitBranch size={16} />, calendly: <Calendar size={16} />, customLink: <LinkIcon size={16} />,
}

export default function EditorPublicCard() {
  const { slug, cardId } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState({ name: '', email: '', phone: '', note: '' })
  const [sendingLead, setSendingLead] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)

  const PUBLIC_BASE = import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin
  const cardUrl = cardId ? `${PUBLIC_BASE}/card/id/${cardId}` : `${PUBLIC_BASE}/card/${slug}`

  useEffect(() => {
    const endpoint = cardId
      ? `/cards/public/id/${cardId}`
      : `/cards/public/${slug}`
    api.get(endpoint)
      .then((res) => {
        const c = res.data.card
        setCard(c)
        api.post('/analytics/view', { card_id: c.id }).catch(() => {})
        // Dynamic page title for link previews
        const name = c.links?.find(l => l.type === 'meta_name')?.url || c.name || 'Digital Card'
        const company = c.links?.find(l => l.type === 'meta_company')?.url || c.company || ''
        document.title = company ? `${name} | ${company} | Kaira Card` : `${name} | Kaira Card`
      })
      .catch(() => setCard(null))
      .finally(() => setLoading(false))
  }, [slug, cardId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-3">🪪</p>
          <h1 className="text-xl font-bold text-gray-800">Card not available</h1>
          <p className="text-sm text-gray-500 mt-1">This slug is not published yet or card is inactive.</p>
        </div>
      </div>
    )
  }

  const metaByType = (type) => (Array.isArray(card.links) ? card.links.find((l) => l.type === type)?.url || '' : '')
  const displayName = metaByType('meta_name') || card.name || 'Your Name'
  const displayEmail = metaByType('meta_email') || card.email || ''
  const displayCompany = metaByType('meta_company') || card.company || ''
  const displayTitle = card.title || ''
  const displayBio = card.bio || ''
  const department = metaByType('meta_department')
  const accreditations = metaByType('meta_accreditations')
  const address = metaByType('meta_address')
  const leadSource = metaByType('meta_leadSource')
  const leadTags = metaByType('meta_leadTags')
  const followUpDate = metaByType('meta_followUpDate')
  const ctaLabel = metaByType('meta_ctaLabel')
  const themeColor = metaByType('meta_themeColor') || card.theme || '#6366f1'

  // Layout values stored as meta links
  const layoutRaw = metaByType('meta_layout')
  const DEFAULT_LAYOUT = { coverHeight: 128, overlap: 48, profileSize: 96, logoSize: 56, cardBgColor: '', cover: { zoom:1,x:50,y:50 }, profile: { zoom:1,x:50,y:50 }, logo: { zoom:1,x:50,y:50 } }
  const layout = layoutRaw ? { ...DEFAULT_LAYOUT, ...JSON.parse(layoutRaw) } : DEFAULT_LAYOUT
  const coverH   = layout.coverHeight
  const overlap  = layout.overlap
  const profSize = layout.profileSize
  const logoSize = layout.logoSize
  const cardBg   = layout.cardBgColor

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
  
  const vBgEnabled = metaByType('meta_vBg_enabled') === 'true'
  const vBgPreset = metaByType('meta_vBg_preset') || ''
  const vBgCustomFile = metaByType('meta_vBg_custom') || ''
  
  // Dynamic base URL for local vs production
  const uploadsBase = import.meta.env.MODE === 'production'
    ? `${import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'}/uploads/`
    : 'http://localhost:8000/uploads/'

  const bgStyle = cardBg
    ? { background: cardBg }
    : vBgEnabled
      ? vBgCustomFile
        ? { backgroundImage: `url(${vBgCustomFile.startsWith('http') ? vBgCustomFile : uploadsBase + vBgCustomFile})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: vBgPreset ? `linear-gradient(135deg, ${vBgPreset})` : '#f3f4f6' }
      : { background: '#f3f4f6' }

  const fields = [
    displayEmail && { key: 'email', label: 'Email', value: displayEmail, href: `mailto:${displayEmail}` },
    address && { key: 'address', label: 'Address', value: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}` },
    ...(Array.isArray(card.links) ? card.links.filter((link) => !String(link.type || '').startsWith('meta_')).map((link) => ({
      key: link.type || 'customLink',
      label: link.label || 'Link',
      value: link.url,
      href: link.url.startsWith('http') || link.url.startsWith('mailto') || link.url.startsWith('tel') ? link.url : `https://${link.url}`,
    })) : []),
  ].filter(Boolean)

  const profileFile = metaByType('meta_profile')
  const coverFile = metaByType('meta_cover')
  const logoFile = metaByType('meta_logo')
  
  // Helper to construct image URL - check if already a full URL
  const getImageUrl = (filename) => {
    if (!filename) return ''
    if (filename.startsWith('http')) return filename // Already full URL
    return `${uploadsBase}${filename}` // Construct full URL
  }
  
  const profilePhotoUrl = getImageUrl(profileFile || card.photo)
  const coverPhotoUrl = getImageUrl(coverFile)
  const logoUrl = getImageUrl(logoFile)

  const saveVCF = () => {
    const phone = Array.isArray(card.links) ? card.links.find((l) => l.type === 'phone')?.url || '' : ''
    const website = Array.isArray(card.links) ? card.links.find((l) => l.type === 'website')?.url || '' : ''

    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `FN:${displayName || 'Contact'}`,
      `N:${displayName || 'Contact'};;;;`,
      displayCompany ? `ORG:${displayCompany}` : '',
      card.title     ? `TITLE:${card.title}`   : '',
      phone          ? `TEL;TYPE=CELL:${phone}` : '',
      displayEmail   ? `EMAIL;TYPE=INTERNET:${displayEmail}` : '',
      website        ? `URL:${website}` : '',
      'END:VCARD',
    ].filter(Boolean)

    const vcfContent = lines.join('\r\n') + '\r\n'
    // Use text/x-vcard for better Android compatibility
    const blob = new Blob([vcfContent], { type: 'text/x-vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(displayName || 'contact').replace(/\s+/g, '-').toLowerCase()}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareCard = async () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: displayName || 'Digital Card', text: card.bio || 'Connect with me', url }).catch(() => {})
      return
    }
    navigator.clipboard.writeText(url).catch(() => {})
    alert('Link copied to clipboard!')
  }

  const submitLead = async (e) => {
    e.preventDefault()
    setSendingLead(true)
    try {
      await api.post('/leads', {
        slug: slug || String(cardId),
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        note: lead.note,
      })
      alert('Thanks! Your details were shared successfully.')
      setLead({ name: '', email: '', phone: '', note: '' })
      setShowLeadForm(false)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit your details.')
    } finally {
      setSendingLead(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-10">
      {/* Neon border card wrapper */}
      <div style={{ padding: '2px', borderRadius: '1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4, #6366f1)', backgroundSize: '300% 300%', animation: 'neonBorder 4s ease infinite', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
        <style>{`
          @keyframes neonBorder {
            0%   { background-position: 0% 50%; box-shadow: 0 0 24px rgba(99,102,241,0.4); }
            50%  { background-position: 100% 50%; box-shadow: 0 0 40px rgba(139,92,246,0.55), 0 0 80px rgba(6,182,212,0.2); }
            100% { background-position: 0% 50%; box-shadow: 0 0 24px rgba(99,102,241,0.4); }
          }
        `}</style>
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl overflow-hidden" style={bgStyle}>
          {/* Cover — position relative so profile/logo can overlap */}
          <div className="relative rounded-t-3xl overflow-hidden" style={{ height: `${coverH}px` }}>
            {coverPhotoUrl ? (
              <img src={coverPhotoUrl} alt="cover"
                style={{ ...imgStyle('cover'), position: 'absolute', inset: 0 }} />
            ) : (
              <div className="w-full h-full rounded-t-3xl"
                style={{ background: `linear-gradient(135deg, ${themeColor}cc, ${themeColor}55)` }} />
            )}
          </div>

          {/* Profile + Logo — absolutely positioned to overlap cover */}
          <div className="relative" style={{ height: `${profSize - overlap}px` }}>
            {/* Profile photo — left */}
            <div className="absolute" style={{ left: '24px', top: `-${overlap}px` }}>
              <div className="rounded-full border-4 border-white shadow-xl overflow-hidden"
                style={{ width: `${profSize}px`, height: `${profSize}px` }}>
                {profilePhotoUrl ? (
                  <img src={profilePhotoUrl} alt={displayName} style={imgStyle('profile')} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold"
                    style={{ background: themeColor, color: '#fff', fontSize: `${profSize * 0.33}px` }}>
                    {displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
            </div>

            {/* Company logo — right */}
            {logoUrl && (
              <div className="absolute" style={{ right: '24px', top: `-${Math.round(logoSize / 2)}px` }}>
                <div className="rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden p-1.5"
                  style={{ width: `${logoSize}px`, height: `${logoSize}px` }}>
                  <img src={logoUrl} alt="logo" style={imgStyle('logo')} className="rounded-lg" />
                </div>
              </div>
            )}
          </div>

        {/* Info */}
        <div className="px-6 pb-6 space-y-3 pt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            {displayTitle && <p className="text-sm text-gray-600 mt-0.5">{displayTitle}</p>}
            {department && <p className="text-xs text-gray-400">{department}</p>}
            {displayCompany && <p className="text-sm font-medium text-gray-700 mt-1">{displayCompany}</p>}
            {accreditations && (
              <div className="flex flex-wrap gap-1 mt-2">
                {accreditations.split(',').map((a, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${themeColor}20`, color: themeColor }}>
                    {a.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {displayBio && (
            <p className="text-sm text-gray-500 leading-relaxed">{displayBio}</p>
          )}

          {/* Fields */}
          {fields.length > 0 && (
            <div className="space-y-2 pt-2">
              {fields.map((f, i) => {
                const row = (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: `${themeColor}10` }}>
                    <span style={{ color: themeColor }}>{ICON_MAP[f.key] || <LinkIcon size={16} />}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">{f.label}</p>
                      <p className="text-sm text-gray-700 truncate">{f.value}</p>
                    </div>
                  </div>
                )
                return f.href ? <a key={f.key} href={f.href} target="_blank" rel="noreferrer" className="block">{row}</a> : <div key={f.key}>{row}</div>
              })}
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-2 pt-3">
            <button onClick={shareCard} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: themeColor }}>
              Share
            </button>
            <button onClick={saveVCF} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all text-center" style={{ borderColor: themeColor, color: themeColor }}>
              Save Contact
            </button>
          </div>

          {/* Share Details Button */}
          {!showLeadForm && (
            <button 
              onClick={() => setShowLeadForm(true)}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all text-center" 
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Share Your Details
            </button>
          )}

          {/* Lead Form */}
          {showLeadForm && (
            <form onSubmit={submitLead} className="mt-5 border border-gray-100 rounded-2xl p-3 space-y-2 bg-white/80 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Share your details</p>
                <button type="button" onClick={() => setShowLeadForm(false)} className="text-gray-400 hover:text-gray-600 text-xs">✕ Close</button>
              </div>
              <input className="input-field text-sm" placeholder="Your name" value={lead.name} onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))} />
              <div className="grid grid-cols-2 gap-2">
                <input className="input-field text-sm" placeholder="Email" type="email" value={lead.email} onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))} />
                <input className="input-field text-sm" placeholder="Phone" value={lead.phone} onChange={(e) => setLead((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <textarea className="input-field text-sm resize-none" rows={2} placeholder="Context or note" value={lead.note} onChange={(e) => setLead((p) => ({ ...p, note: e.target.value }))} />
              <button type="submit" disabled={sendingLead} className="w-full text-sm font-semibold border-2 py-2.5 rounded-xl transition-all" style={{ borderColor: themeColor, color: themeColor }}>
                {sendingLead ? 'Submitting...' : 'Submit Contact'}
              </button>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
