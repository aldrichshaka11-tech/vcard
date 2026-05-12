import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Mail, Phone, Globe, MapPin, AtSign, MessageCircle, Calendar, GitBranch, Link as LinkIcon, Pencil, Settings, Palette } from 'lucide-react'
import ImageAdjustModal from './ImageAdjustModal'

const ICON_MAP = {
  email: <Mail size={15} />, phone: <Phone size={15} />, companyUrl: <Globe size={15} />,
  address: <MapPin size={15} />, twitter: <AtSign size={15} />, instagram: <AtSign size={15} />,
  threads: <AtSign size={15} />, linkedin: <AtSign size={15} />, facebook: <AtSign size={15} />,
  youtube: <AtSign size={15} />, snapchat: <AtSign size={15} />, tiktok: <AtSign size={15} />,
  twitch: <AtSign size={15} />, yelp: <AtSign size={15} />, whatsapp: <MessageCircle size={15} />,
  signal: <MessageCircle size={15} />, discord: <MessageCircle size={15} />,
  skype: <MessageCircle size={15} />, telegram: <MessageCircle size={15} />,
  github: <GitBranch size={15} />, calendly: <Calendar size={15} />,
  customLink: <LinkIcon size={15} />,
}

const DEFAULT_LAYOUT = {
  coverHeight: 128, overlap: 48, profileSize: 96, logoSize: 56, cardBgColor: '',
  cover:   { zoom: 1, x: 50, y: 50 },
  profile: { zoom: 1, x: 50, y: 50 },
  logo:    { zoom: 1, x: 50, y: 50 },
}

export default function CardPreview({ card = {}, editable = false, onLayoutChange }) {
  const [modal, setModal] = useState(null)

  const theme = card.themeColor || '#6366f1'
  const layout = { ...DEFAULT_LAYOUT, ...(card.layout || {}) }
  const coverH   = layout.coverHeight
  const overlap  = layout.overlap
  const profSize = layout.profileSize
  const logoSize = layout.logoSize
  const cardBg   = layout.cardBgColor

  // bgStyle: virtualBg preset/custom, then cardBgColor, then default gray
  // Priority: custom image > preset gradient > cardBgColor > default
  const bgStyle = (() => {
    if (card.virtualBg?.enabled) {
      // custom image wins over preset
      if (card.virtualBg.custom) {
        return {
          backgroundImage: `url(${card.virtualBg.custom})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'local',
        }
      }
      if (card.virtualBg.preset) {
        return { background: card.virtualBg.preset }
      }
    }
    if (cardBg) return { background: cardBg }
    return { background: '#f3f4f6' }
  })()

  const imgStyle = (imgKey) => {
    const v = layout[imgKey] || { zoom: 1, x: 50, y: 50 }
    return {
      width: '100%', height: '100%', objectFit: 'cover',
      objectPosition: `${v.x}% ${v.y}%`,
      transform: `scale(${v.zoom})`,
      transformOrigin: `${v.x}% ${v.y}%`,
    }
  }

  const fields = [
    card.email      && { key: 'email',      label: 'Email',   value: card.email },
    card.phone      && { key: 'phone',      label: 'Phone',   value: card.phone },
    card.companyUrl && { key: 'companyUrl', label: 'Website', value: card.companyUrl },
    card.customLink && { key: 'customLink', label: card.customLinkLabel || 'Link', value: card.customLink },
    card.address    && { key: 'address',    label: 'Address', value: card.address },
    card.twitter    && { key: 'twitter',    label: 'X',       value: card.twitter },
    card.instagram  && { key: 'instagram',  label: 'Instagram', value: card.instagram },
    card.threads    && { key: 'threads',    label: 'Threads', value: card.threads },
    card.linkedin   && { key: 'linkedin',   label: 'LinkedIn', value: card.linkedin },
    card.facebook   && { key: 'facebook',   label: 'Facebook', value: card.facebook },
    card.youtube    && { key: 'youtube',    label: 'YouTube', value: card.youtube },
    card.snapchat   && { key: 'snapchat',   label: 'Snapchat', value: card.snapchat },
    card.tiktok     && { key: 'tiktok',     label: 'TikTok',  value: card.tiktok },
    card.twitch     && { key: 'twitch',     label: 'Twitch',  value: card.twitch },
    card.yelp       && { key: 'yelp',       label: 'Yelp',    value: card.yelp },
    card.whatsapp   && { key: 'whatsapp',   label: 'WhatsApp', value: card.whatsapp },
    card.signal     && { key: 'signal',     label: 'Signal',  value: card.signal },
    card.discord    && { key: 'discord',    label: 'Discord', value: card.discord },
    card.skype      && { key: 'skype',      label: 'Skype',   value: card.skype },
    card.telegram   && { key: 'telegram',   label: 'Telegram', value: card.telegram },
    card.github     && { key: 'github',     label: 'GitHub',  value: card.github },
    card.calendly   && { key: 'calendly',   label: 'Calendly', value: card.calendly },
  ].filter(Boolean)

  Object.values(card.customFields || {}).flat().forEach(cf => {
    if (cf.value) fields.push({ key: cf.id, label: cf.label, value: cf.value })
  })

  const tags = (card.leadTags || '').split(',').map(t => t.trim()).filter(Boolean)

  // Hex → rgba helper for tinted backgrounds
  const hexAlpha = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  return (
    <>
      {/* ── Phone frame ── */}
      <div className="relative mx-auto select-none" style={{ width: 300 }}>

        {/* Phone shell */}
        <div className="relative rounded-[2.8rem] bg-gray-900 shadow-2xl"
          style={{ padding: '12px 10px 16px', boxShadow: '0 30px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)' }}>

          {/* Side buttons */}
          <div className="absolute left-[-3px] top-24 w-1 h-8 bg-gray-700 rounded-l-sm" />
          <div className="absolute left-[-3px] top-36 w-1 h-12 bg-gray-700 rounded-l-sm" />
          <div className="absolute left-[-3px] top-52 w-1 h-12 bg-gray-700 rounded-l-sm" />
          <div className="absolute right-[-3px] top-32 w-1 h-16 bg-gray-700 rounded-r-sm" />

          {/* Screen bezel */}
          <div className="rounded-[2.2rem] overflow-hidden bg-white" style={{ height: 580 }}>

            {/* Notch */}
            <div className="relative flex justify-center pt-2 pb-1 bg-gray-900">
              <div className="w-24 h-5 bg-gray-900 rounded-b-2xl flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                <div className="w-8 h-1.5 rounded-full bg-gray-800" />
              </div>
            </div>

            {/* Scrollable card content */}
            <div className="overflow-y-auto" style={{ height: 548 }}>
              {/* bgStyle wraps entire card so virtualBg shows behind everything */}
              <div style={{ ...bgStyle, minHeight: '100%' }}>

                {/* Cover */}
                <div className="relative group" style={{ height: `${coverH}px` }}>
                  {card.coverPhoto ? (
                    <img src={card.coverPhoto} alt="cover"
                      style={{ ...imgStyle('cover'), position: 'absolute', inset: 0 }} />
                  ) : (
                    // When virtualBg is active, cover area is transparent so bg shows through
                    // When no virtualBg, show a plain gray placeholder
                    <div className="w-full h-full"
                      style={{ background: card.virtualBg?.enabled ? 'transparent' : '#e5e7eb' }} />
                  )}
                  {editable && card.coverPhoto && (
                    <button onClick={() => setModal('cover')}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
                      <Pencil size={10} />
                    </button>
                  )}
                </div>

                {/* Profile + Logo overlap row */}
                <div className="relative" style={{ height: `${profSize - overlap}px` }}>
                  {/* Profile */}
                  <div className="absolute group" style={{ left: 16, top: `-${overlap}px` }}>
                    <div className="rounded-full border-4 border-white shadow-lg overflow-hidden"
                      style={{ width: profSize, height: profSize }}>
                      {card.profilePhoto ? (
                        <img src={card.profilePhoto} alt={card.name} style={imgStyle('profile')} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold bg-gray-200 text-gray-500"
                          style={{ fontSize: profSize * 0.33 }}>
                          {card.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    {editable && card.profilePhoto && (
                      <button onClick={() => setModal('profile')}
                        className="absolute bottom-0 right-0 w-5 h-5 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-10"
                        style={{ background: theme }}>
                        <Pencil size={8} />
                      </button>
                    )}
                  </div>

                  {/* Logo */}
                  {card.companyLogo && (
                    <div className="absolute group" style={{ right: 16, top: `-${Math.round(logoSize / 2)}px` }}>
                      <div className="rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden p-1"
                        style={{ width: logoSize, height: logoSize }}>
                        <img src={card.companyLogo} alt="logo" style={imgStyle('logo')} className="rounded-lg" />
                      </div>
                      {editable && (
                        <button onClick={() => setModal('logo')}
                          className="absolute -bottom-1 -right-1 w-4 h-4 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-10"
                          style={{ background: theme }}>
                          <Pencil size={7} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit toolbar */}
                {editable && (
                  <div className="flex gap-1.5 px-4 pb-1">
                    <button onClick={() => setModal('layout')}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200">
                      <Settings size={9} /> Layout
                    </button>
                    <button onClick={() => setModal('bg')}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors border border-gray-200">
                      <Palette size={9} /> BG
                    </button>
                  </div>
                )}

                {/* Info */}
                <div className="px-4 pb-6 space-y-2.5 pt-1">
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">{card.name || 'Your Name'}</h1>
                    {card.jobTitle    && <p className="text-xs text-gray-600 mt-0.5">{card.jobTitle}</p>}
                    {card.department  && <p className="text-[11px] text-gray-400">{card.department}</p>}
                    {card.companyName && <p className="text-xs font-semibold text-gray-700 mt-0.5">{card.companyName}</p>}
                    {card.accreditations && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {card.accreditations.split(',').map((a, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{ background: hexAlpha(theme, 0.12), color: theme }}>
                            {a.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {card.headline && (
                    <p className="text-[11px] text-gray-500 leading-relaxed">{card.headline}</p>
                  )}

                  {/* Lead context */}
                  {(card.leadSource || tags.length > 0 || card.followUpDate) && (
                    <div className="rounded-lg border border-gray-100 p-2 space-y-1 bg-white/80">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Lead Context</p>
                      {card.leadSource   && <p className="text-[10px] text-gray-600">Source: {card.leadSource}</p>}
                      {card.followUpDate && <p className="text-[10px] text-gray-600">Follow-up: {card.followUpDate}</p>}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fields — icon color driven by themeColor */}
                  {fields.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {fields.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                          style={{ background: hexAlpha(theme, 0.07) }}>
                          <span style={{ color: theme }}>{ICON_MAP[f.key] || <LinkIcon size={15} />}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] text-gray-400 leading-none mb-0.5">{f.label}</p>
                            <p className="text-[11px] text-gray-700 truncate">{f.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons — background and border driven by themeColor */}
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 py-2 rounded-lg text-[11px] font-bold text-white transition-all"
                      style={{ background: theme }}>
                      Share
                    </button>
                    <a href={card.ctaUrl || '#'}
                      target={card.ctaUrl ? '_blank' : undefined}
                      rel={card.ctaUrl ? 'noreferrer' : undefined}
                      className="flex-1 py-2 rounded-lg text-[11px] font-bold border-2 transition-all text-center"
                      style={{ borderColor: theme, color: theme }}>
                      {card.ctaLabel || 'Save Contact'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center mt-2">
          <div className="w-20 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>

      {modal && createPortal(
        <ImageAdjustModal
          type={modal}
          layout={layout}
          onChange={(newLayout) => { if (onLayoutChange) onLayoutChange(newLayout) }}
          onSave={(newLayout) => { if (onLayoutChange) onLayoutChange(newLayout) }}
          onClose={() => setModal(null)}
        />,
        document.body
      )}
    </>
  )
}
