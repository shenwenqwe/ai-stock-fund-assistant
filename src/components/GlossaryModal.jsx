import { X } from 'lucide-react'
import { glossary } from '../data/mockData'

export default function GlossaryModal({ term, onClose }) {
  const explanation = glossary[term]
  if (!explanation) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 mx-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">{term}</h3>
          <button onClick={onClose} className="text-gray-400 p-1"><X size={18} /></button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
      </div>
    </div>
  )
}
