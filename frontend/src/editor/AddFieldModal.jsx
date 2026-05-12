import { useState } from 'react'
import { X } from 'lucide-react'

const FIELD_TYPES = ['Text', 'URL', 'Phone', 'Email', 'Custom Label']

export default function AddFieldModal({ section, onAdd, onClose }) {
  const [type, setType] = useState('Text')
  const [label, setLabel] = useState('')

  const handleAdd = () => {
    if (!label.trim()) return
    onAdd(section, {
      id: `custom_${Date.now()}`,
      type,
      label: label.trim(),
      value: '',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900">Add Custom Field</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Field Type</label>
            <div className="grid grid-cols-3 gap-2">
              {FIELD_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border-2 transition-all ${type === t ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Field Label</label>
            <input
              autoFocus
              className="input-field"
              placeholder="e.g. Portfolio, Fax, Office..."
              value={label}
              onChange={e => setLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleAdd} disabled={!label.trim()} className="btn-primary flex-1">Add Field</button>
        </div>
      </div>
    </div>
  )
}
