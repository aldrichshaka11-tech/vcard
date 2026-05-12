import { useState } from 'react'
import { ChevronDown, Plus, X, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddFieldModal from './AddFieldModal'

// Tier visual config
const TIER_CONFIG = {
  1: { label: 'Level 1', dot: 'bg-indigo-500',   badge: 'bg-indigo-50 text-indigo-600 border-indigo-200',   border: 'border-indigo-200', header: 'hover:bg-indigo-50/60', ring: 'hover:border-indigo-300' },
  2: { label: 'Level 2', dot: 'bg-violet-500',   badge: 'bg-violet-50 text-violet-600 border-violet-200',   border: 'border-violet-200', header: 'hover:bg-violet-50/60', ring: 'hover:border-violet-300' },
  3: { label: 'Level 3', dot: 'bg-pink-500',     badge: 'bg-pink-50 text-pink-600 border-pink-200',         border: 'border-pink-200',   header: 'hover:bg-pink-50/60',   ring: 'hover:border-pink-300' },
  4: { label: 'Level 4', dot: 'bg-amber-500',    badge: 'bg-amber-50 text-amber-600 border-amber-200',      border: 'border-amber-200',  header: 'hover:bg-amber-50/60',  ring: 'hover:border-amber-300' },
  5: { label: 'Level 5', dot: 'bg-teal-500',     badge: 'bg-teal-50 text-teal-600 border-teal-200',         border: 'border-teal-200',   header: 'hover:bg-teal-50/60',   ring: 'hover:border-teal-300' },
  6: { label: 'Level 6', dot: 'bg-green-500',    badge: 'bg-green-50 text-green-600 border-green-200',      border: 'border-green-200',  header: 'hover:bg-green-50/60',  ring: 'hover:border-green-300' },
}

function SortableField({ field, onRemove, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group animate-fade-in-up">
      <button {...attributes} {...listeners} className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0">
        <GripVertical size={16} />
      </button>
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-1">{field.label}</p>
        <input
          className="input-field text-sm"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
          value={field.value}
          onChange={e => onUpdate(field.id, e.target.value)}
          type={field.type === 'Email' ? 'email' : field.type === 'Phone' ? 'tel' : field.type === 'URL' ? 'url' : 'text'}
        />
      </div>
      <button onClick={() => onRemove(field.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 mt-4">
        <X size={16} />
      </button>
    </div>
  )
}

export default function Section({ title, icon, tier = 1, section, children, customFields, onAddField, onRemoveField, onUpdateField, onReorderFields }) {
  const [open, setOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))
  const t = TIER_CONFIG[tier] || TIER_CONFIG[1]

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = customFields.findIndex(f => f.id === active.id)
    const newIndex = customFields.findIndex(f => f.id === over.id)
    onReorderFields(section, arrayMove(customFields, oldIndex, newIndex))
  }

  return (
    <div className={`bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all ${t.ring}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-gray-50/80 transition-colors ${t.header}`}
      >
        <div className="flex items-center gap-2.5">
          {/* Tier dot */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`} />
          <span className="text-indigo-400">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">{title}</span>
          {/* Tier badge */}
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${t.badge}`}>
            {t.label}
          </span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 py-4 space-y-4 bg-white">
          {/* Left accent bar matching tier color */}
          <div className={`-mx-4 px-4 border-l-4 ${t.border} space-y-4`}>
            {children}
          </div>

          {/* Custom fields with drag-to-reorder */}
          {customFields?.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={customFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3 pt-1">
                  {customFields.map(field => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onRemove={(id) => onRemoveField(section, id)}
                      onUpdate={(id, val) => onUpdateField(section, id, val)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors mt-1"
          >
            <Plus size={14} /> Add Field
          </button>
        </div>
      )}

      {showModal && (
        <AddFieldModal
          section={section}
          onAdd={onAddField}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
