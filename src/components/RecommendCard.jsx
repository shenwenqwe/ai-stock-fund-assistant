import { Star, ChevronRight, Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const riskMap = { low: { label: '低风险', cls: 'tag-risk-low' }, mid: { label: '中风险', cls: 'tag-risk-mid' }, high: { label: '高风险', cls: 'tag-risk-high' } }

export default function RecommendCard({ item, onAddFavorite }) {
  const navigate = useNavigate()
  const isUp = item.type === 'stock' ? true : item.dayChange >= 0
  const risk = riskMap[item.riskLevel] || riskMap.mid

  return (
    <div className="card mb-3">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{item.name}</span>
            <span className="text-xs text-gray-400">{item.code}</span>
            <span className="tag-ai">AI</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{item.industry}</div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${item.change >= 0 || item.type === 'fund' ? 'rise' : 'fall'}`}>
            {item.type === 'fund' ? item.price.toFixed(4) : item.price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 my-3 text-center">
        <div className="bg-red-50 rounded-lg py-2">
          <div className="text-xs text-gray-400">入手参考价</div>
          <div className="text-sm font-bold text-rise">{item.type === 'fund' ? item.buyPrice.toFixed(4) : item.buyPrice.toFixed(2)}</div>
        </div>
        <div className="bg-green-50 rounded-lg py-2">
          <div className="text-xs text-gray-400">出手参考价</div>
          <div className="text-sm font-bold text-fall">{item.type === 'fund' ? item.sellPrice.toFixed(4) : item.sellPrice.toFixed(2)}</div>
        </div>
        <div className="bg-blue-50 rounded-lg py-2">
          <div className="text-xs text-gray-400">AI评分</div>
          <div className="text-sm font-bold text-primary">{item.aiScore}分</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className={risk.cls}>{risk.label}</span>
        <span className="tag-ai">胜率{item.winRate}%</span>
        <span className="tag">今日准确率{item.todayAccuracy}%</span>
      </div>

      <div className="text-xs text-gray-500 space-y-0.5 mb-3">
        {item.reasons.map((r, i) => (
          <div key={i} className="flex items-start gap-1">
            <span className="text-primary mt-0.5">•</span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAddFavorite(item)}
          className="btn-outline flex items-center gap-1 flex-1 justify-center"
        >
          <Star size={14} /> 加入自选
        </button>
        <button
          onClick={() => navigate('/ai-recommend', { state: { selectedId: item.id } })}
          className="btn-primary flex items-center gap-1 flex-1 justify-center"
        >
          <Brain size={14} /> 详细分析
        </button>
      </div>
    </div>
  )
}
