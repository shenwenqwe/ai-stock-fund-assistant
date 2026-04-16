import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SlidersHorizontal, Sparkles, Download, Star } from 'lucide-react'
import { stockList, fundList } from '../data/mockData'
import { fetchStocks, fetchFunds } from '../api/client'

const quickTemplates = [
  { label: '高胜率AI推荐', desc: 'AI评分>80，胜率>75%', filter: s => s.aiScore > 80 },
  { label: '低风险稳健', desc: '低风险，适合长线', filter: s => s.riskLevel === 'low' },
  { label: '热点行业强势', desc: '当日涨幅>2%', filter: s => s.changePercent > 2 },
  { label: '短期上涨潜力', desc: '近3日持续上涨', filter: s => s.changePercent > 1 },
]

const industries = ['全部', '新能源', '半导体', '消费', '金融', '医药', '军工', '光伏', '人工智能', '消费电子', '房地产', '新能源车']
const priceRanges = ['不限', '0-20', '20-50', '50-100', '100-500', '500+']
const marketCaps = ['不限', '小盘(<200亿)', '中盘(200-1000亿)', '大盘(>1000亿)']
const riskLevels = ['不限', '低风险', '中风险', '高风险']
const fundTypes = ['全部', '股票型', '混合型', '指数型', '债券型']
const returnPeriods = ['近1月', '近3月', '近1年']

export default function ScreeningPage() {
  const location = useLocation()
  const [mode, setMode] = useState('quick') // quick | custom
  const [targetType, setTargetType] = useState('stock') // stock | fund
  const [industry, setIndustry] = useState(location.state?.industry || '全部')
  const [priceRange, setPriceRange] = useState('不限')
  const [marketCap, setMarketCap] = useState('不限')
  const [riskLevel, setRiskLevel] = useState('不限')
  const [fundType, setFundType] = useState('全部')
  const [aiPriority, setAiPriority] = useState(false)
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [toast, setToast] = useState('')

  const doSearch = async () => {
    let list = []

    if (targetType === 'stock') {
      // Try real API first
      const apiData = await fetchStocks({ size: 50, sort: 'f3', order: '0' })
      list = apiData || [...stockList]

      if (industry !== '全部') list = list.filter(s => (s.industry || '').includes(industry))
      if (priceRange !== '不限') {
        const nums = priceRange.replace('+', '').split('-').map(Number)
        const min = nums[0]
        const max = nums[1] || Infinity
        list = list.filter(s => Number(s.price) >= min && Number(s.price) <= max)
      }
      if (aiPriority) list = list.filter(s => Number(s.changePercent) > 1).sort((a, b) => Number(b.changePercent) - Number(a.changePercent))
      else list.sort((a, b) => Number(b.changePercent) - Number(a.changePercent))
    } else {
      const fundTypeNumMap = { '全部': '', '股票型': '1', '混合型': '2', '指数型': '3', '债券型': '4' }
      const apiData = await fetchFunds({ size: 50, type: fundTypeNumMap[fundType] || '' })
      list = apiData || [...fundList]

      if (fundType !== '全部' && !apiData) list = list.filter(f => (f.fundType || f.type) === fundType)
      const riskMap = { '低风险': 'low', '中风险': 'mid', '高风险': 'high' }
      if (riskLevel !== '不限') list = list.filter(f => f.riskLevel === riskMap[riskLevel])
      list.sort((a, b) => Number(b.dayChange) - Number(a.dayChange))
    }

    setResults(list)
    setSearched(true)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="text-lg font-bold text-gray-900 mb-3">智能筛选</div>

      {/* Mode Switch */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setMode('quick')}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${
            mode === 'quick' ? 'bg-primary text-white' : 'bg-white text-gray-600'
          }`}
        >
          <Sparkles size={14} /> 一键筛选
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${
            mode === 'custom' ? 'bg-primary text-white' : 'bg-white text-gray-600'
          }`}
        >
          <SlidersHorizontal size={14} /> 自定义筛选
        </button>
      </div>

      {/* Target Type */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => { setTargetType('stock'); setSearched(false) }}
          className={`px-4 py-1.5 rounded-full text-sm ${targetType === 'stock' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
        >筛选股票</button>
        <button
          onClick={() => { setTargetType('fund'); setSearched(false) }}
          className={`px-4 py-1.5 rounded-full text-sm ${targetType === 'fund' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
        >筛选基金</button>
      </div>

      {mode === 'quick' ? (
        /* Quick Templates */
        <div className="space-y-2 mb-4">
          {quickTemplates.map((t, i) => (
            <button
              key={i}
              onClick={() => {
                let list = targetType === 'stock' ? stockList.filter(t.filter) : fundList.slice(0, 5)
                setResults(list)
                setSearched(true)
              }}
              className="card w-full text-left active:bg-gray-50"
            >
              <div className="text-sm font-bold text-gray-800">{t.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      ) : (
        /* Custom Filters */
        <div className="card mb-4">
          {targetType === 'stock' ? (
            <>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">行业</div>
                <div className="flex flex-wrap gap-1.5">
                  {industries.map(ind => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`px-2.5 py-1 rounded text-xs ${industry === ind ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >{ind}</button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">股价区间</div>
                <div className="flex flex-wrap gap-1.5">
                  {priceRanges.map(p => (
                    <button
                      key={p}
                      onClick={() => setPriceRange(p)}
                      className={`px-2.5 py-1 rounded text-xs ${priceRange === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >{p}</button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">市值规模</div>
                <div className="flex flex-wrap gap-1.5">
                  {marketCaps.map(m => (
                    <button
                      key={m}
                      onClick={() => setMarketCap(m)}
                      className={`px-2.5 py-1 rounded text-xs ${marketCap === m ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >{m}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setAiPriority(!aiPriority)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                    aiPriority ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Sparkles size={12} /> AI推荐优先
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">基金类型</div>
                <div className="flex flex-wrap gap-1.5">
                  {fundTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setFundType(t)}
                      className={`px-2.5 py-1 rounded text-xs ${fundType === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">风险等级</div>
                <div className="flex flex-wrap gap-1.5">
                  {riskLevels.map(r => (
                    <button
                      key={r}
                      onClick={() => setRiskLevel(r)}
                      className={`px-2.5 py-1 rounded text-xs ${riskLevel === r ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                    >{r}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button onClick={doSearch} className="btn-primary w-full mt-2">开始筛选</button>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-800">筛选结果 ({results.length}支)</span>
            <button className="text-xs text-accent flex items-center gap-1">
              <Download size={12} /> 导出
            </button>
          </div>
          {results.length === 0 ? (
            <div className="card text-center py-8 text-gray-400 text-sm">暂无符合条件的标的</div>
          ) : targetType === 'stock' ? (
            <div className="card">
              {results.map(s => (
                <div key={s.code} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.code} · {s.industry || '--'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{Number(s.price).toFixed(2)}</div>
                    <div className={`text-xs font-bold ${Number(s.changePercent) >= 0 ? 'rise' : 'fall'}`}>
                      {Number(s.changePercent) >= 0 ? '+' : ''}{Number(s.changePercent).toFixed(2)}%
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('已加入自选')}
                    className="ml-2 text-accent"
                  ><Star size={16} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              {results.map(f => (
                <div key={f.code} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{f.name}</div>
                    <div className="text-xs text-gray-400">{f.code} · {f.fundType || f.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-800">{f.nav ? Number(f.nav).toFixed(4) : '--'}</div>
                    <div className={`text-xs font-bold ${Number(f.dayChange) >= 0 ? 'rise' : 'fall'}`}>
                      {Number(f.dayChange) >= 0 ? '+' : ''}{Number(f.dayChange).toFixed(2)}%
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('已加入自选')}
                    className="ml-2 text-accent"
                  ><Star size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-sm px-6 py-3 rounded-lg z-[200]">
          {toast}
        </div>
      )}
    </div>
  )
}
