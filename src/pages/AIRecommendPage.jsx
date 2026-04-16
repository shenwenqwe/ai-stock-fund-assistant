import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TrendingUp, TrendingDown, ThumbsUp, ThumbsDown, Brain, Shield, BarChart3 } from 'lucide-react'
import { aiRecommendations, glossary } from '../data/mockData'
import GlossaryModal from '../components/GlossaryModal'

const riskMap = { low: { label: '低风险', cls: 'tag-risk-low' }, mid: { label: '中风险', cls: 'tag-risk-mid' }, high: { label: '高风险', cls: 'tag-risk-high' } }
const scoreLabels = [
  { key: 'data', label: '数据维度', max: 30 },
  { key: 'trend', label: '趋势维度', max: 25 },
  { key: 'risk', label: '风险维度', max: 20 },
  { key: 'market', label: '市场环境', max: 15 },
  { key: 'accuracy', label: '历史准确率', max: 10 },
]

export default function AIRecommendPage() {
  const location = useLocation()
  const selectedId = location.state?.selectedId
  const [expandedId, setExpandedId] = useState(selectedId || null)
  const [glossaryTerm, setGlossaryTerm] = useState(null)
  const [feedbacks, setFeedbacks] = useState({})

  const sorted = [...aiRecommendations].sort((a, b) => b.aiScore - a.aiScore)

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleFeedback = (id, type) => {
    setFeedbacks(prev => ({ ...prev, [id]: type }))
  }

  const renderGlossaryLink = (term) => (
    <span
      className="text-primary border-b border-dashed border-primary cursor-pointer"
      onClick={(e) => { e.stopPropagation(); setGlossaryTerm(term) }}
    >{term}</span>
  )

  const winRateWeek = 78
  const winRateMonth = 74
  const totalPredictions = 156
  const correctCount = 118

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="text-lg font-bold text-gray-900 mb-3">AI 推荐详情</div>

      {/* RL Stats */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Brain size={18} className="text-primary" />
          <span className="text-sm font-bold text-gray-800">强化学习 & 评分机制</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 rounded-lg py-2">
            <div className="text-lg font-bold text-primary">{winRateWeek}%</div>
            <div className="text-xs text-gray-400">本周胜率</div>
          </div>
          <div className="bg-green-50 rounded-lg py-2">
            <div className="text-lg font-bold text-green-600">{winRateMonth}%</div>
            <div className="text-xs text-gray-400">本月胜率</div>
          </div>
          <div className="bg-purple-50 rounded-lg py-2">
            <div className="text-lg font-bold text-purple-600">{totalPredictions}</div>
            <div className="text-xs text-gray-400">累计预测</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          系统每日自动复盘昨日推荐，正确{correctCount}次，错误{totalPredictions - correctCount}次，算法权重持续优化中
        </div>
      </div>

      {/* Recommendation List */}
      <div className="text-sm font-bold text-gray-800 mb-2">今日推荐榜单（按AI评分排序）</div>

      {sorted.map((item, idx) => {
        const risk = riskMap[item.riskLevel] || riskMap.mid
        const isExpanded = expandedId === item.id
        const feedback = feedbacks[item.id]

        return (
          <div key={item.id} className="card mb-3">
            {/* Header */}
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(item.id)}>
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx < 3 ? 'bg-rise text-white' : 'bg-gray-100 text-gray-500'
                }`}>{idx + 1}</span>
                <div>
                  <div className="text-sm font-bold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.code} · {item.industry}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${item.historyResult === 'correct' ? 'rise' : 'fall'}`}>
                  {item.type === 'fund' ? item.price.toFixed(4) : item.price.toFixed(2)}
                </span>
                <span className="text-primary text-sm font-bold">{item.aiScore}分</span>
              </div>
            </div>

            {/* Expanded Detail */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {/* Buy/Sell Prices */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-red-50 rounded-lg py-2">
                    <div className="text-xs text-gray-400">入手参考价</div>
                    <div className="text-sm font-bold text-rise">
                      {item.type === 'fund' ? item.buyPrice.toFixed(4) : item.buyPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg py-2">
                    <div className="text-xs text-gray-400">止盈参考价</div>
                    <div className="text-sm font-bold text-fall">
                      {item.type === 'fund' ? item.sellPrice.toFixed(4) : item.sellPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg py-2">
                    <div className="text-xs text-gray-400">止损参考价</div>
                    <div className="text-sm font-bold text-orange-500">
                      {item.type === 'fund' ? item.stopLossPrice.toFixed(4) : item.stopLossPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Hold Period & Risk */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={risk.cls}>{risk.label}</span>
                  <span className="tag-ai">建议持有 {item.holdPeriod}</span>
                  <span className="tag">胜率{item.winRate}%</span>
                </div>

                {/* Reasons */}
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <div className="font-bold text-gray-700 mb-1">推荐依据：</div>
                  {item.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Score Breakdown */}
                <div className="mb-3">
                  <div className="text-xs font-bold text-gray-700 mb-1">评分拆解（满分100）：</div>
                  {scoreLabels.map(sl => (
                    <div key={sl.key} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 w-20">{sl.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${(item.scoreDetail[sl.key] / sl.max) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-8">{item.scoreDetail[sl.key]}/{sl.max}</span>
                    </div>
                  ))}
                </div>

                {/* Yesterday Result */}
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                  {item.historyResult === 'correct' ? (
                    <><TrendingUp size={16} className="rise" /><span className="text-xs rise">昨日推荐正确 — 上涨达标</span></>
                  ) : (
                    <><TrendingDown size={16} className="fall" /><span className="text-xs fall">昨日推荐错误 — 未达预期</span></>
                  )}
                </div>

                {/* Fund Holdings */}
                {item.topHoldings && (
                  <div className="mb-3">
                    <div className="text-xs font-bold text-gray-700 mb-1">重仓持仓：</div>
                    <div className="flex flex-wrap gap-1">
                      {item.topHoldings.map((h, i) => (
                        <span key={i} className="text-xs text-primary bg-blue-50 px-2 py-0.5 rounded">{h}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Glossary Links */}
                <div className="text-xs text-gray-400 mb-3">
                  相关术语：{renderGlossaryLink('止盈价')} · {renderGlossaryLink('止损价')} · {renderGlossaryLink('胜率')} · {renderGlossaryLink('AI评分')}
                </div>

                {/* User Feedback */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">本次推荐是否有用？</span>
                  <button
                    onClick={() => handleFeedback(item.id, 'useful')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs ${
                      feedback === 'useful' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ThumbsUp size={12} /> 有用
                  </button>
                  <button
                    onClick={() => handleFeedback(item.id, 'useless')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs ${
                      feedback === 'useless' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ThumbsDown size={12} /> 无用
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Glossary Modal */}
      {glossaryTerm && (
        <GlossaryModal term={glossaryTerm} onClose={() => setGlossaryTerm(null)} />
      )}
    </div>
  )
}
