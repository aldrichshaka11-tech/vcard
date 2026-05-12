import { useState } from 'react'
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Palette } from 'lucide-react'

const BG_SWATCHES = [
  '#ffffff','#f8fafc','#f1f5f9','#e2e8f0',
  '#fef3c7','#fce7f3','#ede9fe','#dbeafe',
  '#dcfce7','#ffedd5','#1e293b','#0f172a',
]

const DEFAULT_LAYOUT = {
  coverHeight: 128, overlap: 48, profileSize: 96, logoSize: 56, cardBgColor: '',
  cover:   { zoom: 1, x: 50, y: 50 },
  profile: { zoom: 1, x: 50, y: 50 },
  logo:    { zoom: 1, x: 50, y: 50 },
}

// onChange → called on every slider move (live preview)
// onSave   → called on Save click (commit)
// onClose  → called on Cancel (reverts to snapshot)
export default function ImageAdjustModal({ type, layout, onChange, onSave, onClose }) {
  // snapshot = state at modal open, used for Cancel revert
  const [snapshot] = useState(() => JSON.parse(JSON.stringify(layout)))

  const imgVal = layout[type] || { zoom: 1, x: 50, y: 50 }

  const updateImg = (subKey, val) => {
    onChange({
      ...layout,
      [type]: { ...imgVal, [subKey]: val },
    })
  }

  const updateLayout = (key, val) => {
    onChange({ ...layout, [key]: val })
  }

  const reset = () => {
    if (['cover', 'profile', 'logo'].includes(type)) {
      onChange({ ...layout, [type]: { zoom: 1, x: 50, y: 50 } })
    } else if (type === 'layout') {
      onChange({ ...layout, coverHeight: 128, overlap: 48, profileSize: 96, logoSize: 56 })
    } else if (type === 'bg') {
      onChange({ ...layout, cardBgColor: '' })
    }
  }

  const handleCancel = () => {
    onChange(snapshot) // revert live preview to snapshot
    onClose()
  }

  const handleSave = () => {
    onSave(layout) // commit current state
    onClose()
  }

  const TITLES = {
    cover: 'Cover Photo', profile: 'Profile Photo',
    logo: 'Company Logo', layout: 'Edit Layout', bg: 'Card Background',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-xs animate-scale-in border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">{TITLES[type]}</h3>
          <button onClick={handleCancel}
            className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <X size={13} />
          </button>
        </div>

        <div className="px-4 py-4 space-y-4">

          {/* Image adjustment sliders */}
          {['cover', 'profile', 'logo'].includes(type) && (
            <>
              {/* Zoom */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Zoom</span>
                  <span className="text-xs text-indigo-600 font-semibold">{Math.round(imgVal.zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateImg('zoom', Math.max(0.5, +(imgVal.zoom - 0.1).toFixed(1)))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors flex-shrink-0">
                    <ZoomOut size={13} />
                  </button>
                  <input type="range" min="50" max="300" step="5"
                    value={Math.round(imgVal.zoom * 100)}
                    onChange={e => updateImg('zoom', +(e.target.value / 100).toFixed(2))}
                    className="flex-1 h-1.5 accent-indigo-500 cursor-pointer" />
                  <button onClick={() => updateImg('zoom', Math.min(3, +(imgVal.zoom + 0.1).toFixed(1)))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition-colors flex-shrink-0">
                    <ZoomIn size={13} />
                  </button>
                </div>
              </div>

              {/* Horizontal */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Horizontal</span>
                  <span className="text-xs text-indigo-600 font-semibold">{imgVal.x}%</span>
                </div>
                <input type="range" min="0" max="100" step="1"
                  value={imgVal.x}
                  onChange={e => updateImg('x', +e.target.value)}
                  className="w-full h-1.5 accent-indigo-500 cursor-pointer" />
                <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                  <span>Left</span><span>Center</span><span>Right</span>
                </div>
              </div>

              {/* Vertical */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vertical</span>
                  <span className="text-xs text-indigo-600 font-semibold">{imgVal.y}%</span>
                </div>
                <input type="range" min="0" max="100" step="1"
                  value={imgVal.y}
                  onChange={e => updateImg('y', +e.target.value)}
                  className="w-full h-1.5 accent-indigo-500 cursor-pointer" />
                <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                  <span>Top</span><span>Center</span><span>Bottom</span>
                </div>
              </div>
            </>
          )}

          {/* Layout controls */}
          {type === 'layout' && (
            <>
              {[
                { key: 'coverHeight', label: 'Cover Height',       min: 64, max: 220, step: 8, unit: 'px' },
                { key: 'profileSize', label: 'Profile Photo Size', min: 64, max: 128, step: 8, unit: 'px' },
                { key: 'logoSize',    label: 'Company Logo Size',  min: 40, max: 80,  step: 4, unit: 'px' },
                { key: 'overlap',     label: 'Overlap',            min: 16, max: 72,  step: 4, unit: 'px' },
              ].map(({ key, label, min, max, step, unit }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                    <span className="text-xs text-indigo-600 font-semibold">{layout[key]}{unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step}
                    value={layout[key]}
                    onChange={e => updateLayout(key, +e.target.value)}
                    className="w-full h-1.5 accent-indigo-500 cursor-pointer" />
                  <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                    <span>{min}{unit}</span><span>{max}{unit}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Background color */}
          {type === 'bg' && (
            <>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Presets</span>
                <div className="grid grid-cols-6 gap-2">
                  {BG_SWATCHES.map(color => (
                    <button key={color} onClick={() => updateLayout('cardBgColor', color)}
                      className="w-8 h-8 rounded-xl border-2 transition-all hover:scale-110 flex items-center justify-center"
                      style={{ background: color, borderColor: layout.cardBgColor === color ? '#6366f1' : '#e2e8f0' }}>
                      {layout.cardBgColor === color && <Check size={11} className="text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Custom</span>
                <div className="flex items-center gap-2">
                  <input type="color" value={layout.cardBgColor || '#ffffff'}
                    onChange={e => updateLayout('cardBgColor', e.target.value)}
                    className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 flex-shrink-0" />
                  <input type="text" value={layout.cardBgColor || ''}
                    onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && updateLayout('cardBgColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button onClick={() => updateLayout('cardBgColor', '')}
                    className="px-2.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-100 flex-shrink-0">
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-4 pb-4">
          <button onClick={reset}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
            <RotateCcw size={11} /> Reset
          </button>
          <button onClick={handleCancel}
            className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl transition-all">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
