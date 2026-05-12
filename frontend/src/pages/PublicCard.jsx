import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Download, Share2, Globe, Phone, Mail, Link as LinkIcon,
  GitBranch, AtSign, MessageCircle
} from 'lucide-react'
import api from '../api/axios'
import QRModal from '../components/QRModal'

const THEMES = {
  default:  { gradient: 'from-indigo-600 via-purple-600 to-purple-700',  bg: 'bg-gradient-to-br from-indigo-50 to-purple-50' },
  ocean:    { gradient: 'from-cyan-500 via-blue-500 to-blue-700',         bg: 'bg-gradient-to-br from-cyan-50 to-blue-50' },
  forest:   { gradient: 'from-green-500 via-emerald-500 to-emerald-700',  bg: 'bg-gradient-to-br from-green-50 to-emerald-50' },
  sunset:   { gradient: 'from-orange-500 via-rose-500 to-pink-600',       bg: 'bg-gradient-to-br from-orange-50 to-pink-50' },
  midnight: { gradient: 'from-gray-700 via-gray-800 to-gray-950',         bg: 'bg-gradient-to-br from-gray-100 to-gray-200' },
}

const LINK_CONFIG = {
  linkedin:  { icon: <AtSign size={17} />, color: 'bg-[#0077b5] hover:bg-[#006399]' },
  github:    { icon: <GitBranch size={17} />, color: 'bg-[#24292e] hover:bg-[#1a1e22]' },
  twitter:   { icon: <AtSign    size={17} />, color: 'bg-[#1da1f2] hover:bg-[#0d8fd9]' },
  instagram: { icon: <AtSign size={17} />, color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90' },
  phone:     { icon: <Phone     size={17} />, color: 'bg-green-600 hover:bg-green-700' },
  whatsapp:  { icon: <MessageCircle size={17} />, color: 'bg-[#25d366] hover:bg-[#1ebe5d]' },
  email:     { icon: <Mail      size={17} />, color: 'bg-red-500 hover:bg-red-600' },
  website:   { icon: <Globe     size={17} />, color: 'bg-indigo-600 hover:bg-indigo-700' },
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyeNiaF_qV0h8GoMSq90Guhwu2PbStUx_M942fQnPtKw0mPRKhej89A1fvjXQEp2U_u/exec'

export default function PublicCard() {
  const { slug } = useParams()
  const [card, setCard] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' })
  const [formStatus, setFormStatus] = useState('')  // '', 'sending', 'sent', 'error'

  useEffect(() => {
    api.get(`/cards/public/${slug}`)
      .then((res) => {
        const c = res.data.card
        setCard(c)
        api.post('/analytics/view', { card_id: c.id }).catch(() => {})
      })
      .catch(() => setNotFound(true))
  }, [slug])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('sending')
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ slug, ...form }),
      })
      setFormStatus('sent')
      setForm({ name: '', email: '', mobile: '', message: '' })
      setTimeout(() => {
        setShowForm(false)
        setFormStatus('')
      }, 2000)
    } catch {
      setFormStatus('error')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: card?.name, url }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center animate-scale-in">
          <p className="text-6xl mb-4">🪪</p>
          <h1 className="text-xl font-bold text-gray-800">Card not found</h1>
          <p className="text-gray-500 text-sm mt-1">This card doesn't exist or has been deactivated.</p>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const theme = THEMES[card.theme] || THEMES.default
  
  // Dynamic base URL for local vs production
  const base = import.meta.env.MODE === 'production'
    ? `${import.meta.env.VITE_API_BASE?.replace('/api', '') || 'https://kairatechnologies.co.in/demo/vcard'}/uploads/`
    : 'http://localhost:8000/uploads/'
  
  const getUrl = (filename) => {
    if (!filename) return null
    if (filename.startsWith('http')) return filename // Already full URL
    return `${base}${filename}` // Construct full URL
  }

  const linkByType = (type) => card.links?.find(l => l.type === type)?.url || ''
  const profileFilename = linkByType('meta_profile') || card.photo
  const coverFilename = linkByType('meta_cover')
  const logoFilename = linkByType('meta_logo')
  
  // Virtual background support
  const vBgEnabled = linkByType('meta_vBg_enabled') === 'true'
  const vBgPreset = linkByType('meta_vBg_preset') || ''
  const vBgCustomFile = linkByType('meta_vBg_custom') || ''

  const photoUrl = profileFilename ? getUrl(profileFilename) : null
  const coverUrl = coverFilename ? getUrl(coverFilename) : null
  const logoUrl = logoFilename ? getUrl(logoFilename) : null
  const vcfUrl = `/api/vcf/${slug}`
  
  // Build card background style
  const cardBgStyle = vBgEnabled
    ? vBgCustomFile
      ? { backgroundImage: `url(${vBgCustomFile.startsWith('http') ? vBgCustomFile : base + vBgCustomFile})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : vBgPreset
        ? { background: vBgPreset }
        : {}
    : {}

  return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center px-4 py-10`}>
      <div className="w-full max-w-sm animate-scale-in">
        <div className="bg-white rounded-3xl card-shadow overflow-hidden" style={cardBgStyle}>

          {/* Cover photo */}
          {coverUrl
            ? <img src={coverUrl} alt="Cover" className="h-32 w-full object-cover" loading="lazy" />
            : <div className={`bg-gradient-to-br ${theme.gradient} h-24`} />
          }

          {/* Body */}
          <div className="bg-white px-6 pb-8 space-y-4">
            {/* Profile photo + logo — matches editor layout exactly */}
            <div className="relative pt-6 pb-2">
              {logoUrl && (
                <img src={logoUrl} alt="logo" className="absolute top-4 right-0 w-12 h-12 object-contain rounded-lg bg-white/80 border border-gray-100 p-1" loading="lazy" />
              )}
              {photoUrl ? (
                <img src={photoUrl} alt={card.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" loading="eager" />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-white" style={{ background: '#6366f1' }}>
                  {card.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Name / title / company */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{card.name}</h1>
              {card.title && <p className="text-sm text-gray-600 mt-0.5">{card.title}</p>}
              {card.company && <p className="text-sm font-medium text-gray-700 mt-1">{card.company}</p>}
            </div>
            {card.bio && (
              <p className="text-gray-500 text-sm text-center leading-relaxed">{card.bio}</p>
            )}

            {/* Links — skip internal meta_ entries */}
            {card.links?.filter(l => !l.type?.startsWith('meta_')).length > 0 && (
              <div className="space-y-2.5">
                {card.links.filter(l => !l.type?.startsWith('meta_')).map((link, i) => {
                  const type = link.type?.toLowerCase()
                  const config = LINK_CONFIG[type] || { icon: <LinkIcon size={17} />, color: 'bg-gray-700 hover:bg-gray-800' }
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-3 ${config.color} text-white px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm`}
                    >
                      <span className="w-5 flex-shrink-0">{config.icon}</span>
                      <span className="truncate">{link.label || link.url}</span>
                    </a>
                  )
                })}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <a
                href={vcfUrl}
                download
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <Download size={16} /> Save Contact
              </a>
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 py-3 rounded-2xl text-sm font-semibold transition-all"
              >
                <Share2 size={16} /> {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Contact form toggle */}
            <div className="border-t border-gray-100 pt-4">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                >
                  📩 Share your details
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Send a message</p>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ×
                    </button>
                  </div>
                  {formStatus === 'sent' ? (
                    <p className="text-green-600 text-sm text-center py-4">✅ Message sent!</p>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-2.5">
                      <input
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                      />
                      <input
                        placeholder="Mobile"
                        value={form.mobile}
                        onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                      />
                      <textarea
                        required
                        rows={3}
                        placeholder="Message"
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none"
                      />
                      {formStatus === 'error' && <p className="text-red-500 text-xs">Failed to send. Try again.</p>}
                      <button
                        type="submit"
                        disabled={formStatus === 'sending'}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                      >
                        {formStatus === 'sending' ? 'Sending…' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Powered by */}
            <p className="text-center text-xs text-gray-300 pt-1">
              Powered by <span className="font-semibold text-gray-400">SmartCard</span>
            </p>
          </div>
        </div>
      </div>

      {showQR && <QRModal slug={slug} onClose={() => setShowQR(false)} />}
    </div>
  )
}
