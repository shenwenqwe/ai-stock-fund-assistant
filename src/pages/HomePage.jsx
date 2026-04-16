import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Filter, Star, Shield, RefreshCw } from 'lucide-react'
import { hotIndustries, hotFunds } from '../data/mockData'
import { fetchIndices, fetchSectors, fetchStocks, fetchFunds } from '../api/client'
import IndexBar from '../components/IndexBar'

export default function HomePage() {
  const navigate = useNavigate()
  const [tabType, setTabType] = useState('stock')
  const [favorites, setFavorites] = useState([])
  const [toast, setToast] = useState('')
  const [indices, setIndices] = useState(null)
  const [sectors, setSectors] = useState(null)
  const [topStocks, setTopStocks] = useState(null)
  const [topFunds, setTopFunds] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRealData()
    const timer = setInterval(loadRealData, 30000)
    return () => clearInterval(timer)
  }, [])

  async function loadRealData() {
    setLoading(true)
    const [idx, sec, stk, fnd] = await Promise.all([
      fetchIndices(),
      fetchSectors(),
      fetchStocks({ size: 10, sort: 'f3', order: '0' }),
      fetchFunds({ size: 10 }),
    ])
    if (idx) setIndices(idx)
    if (sec) setSectors(sec)
    if (stk) setTopStocks(stk)
    if (fnd) setTopFunds(fnd)
    setLoading(false)
  }

  const addFavorite = (item) => {
    if (!favorites.find(f => f.id === item.id)) {
      setFavorites(prev => [...prev, item])
      showToast('已加入自选')
    } else {
      showToast('已在自选中')
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">AI</div>
          <span className="font-bold text-gray-900">智能选股决策助手</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-400"><Search size={20} /></button>
          <button className="text-gray-400 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rise rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Market Indices */}
      <IndexBar data={indices} />

      {/* Today's Top Gainers */}
      <div className="card mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-gray-800">🤖 今日涨幅排行 TOP10（实时）</div>
          <button onClick={loadRealData} className="text-xs text-accent flex items-center gap-1">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> 刷新
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTabType('stock')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              tabType === 'stock' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >股票</button>
          <button
            onClick={() => setTabType('fund')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              tabType === 'fund' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >基金</button>
        </div>

        {tabType === 'stock' ? (
          topStocks ? topStocks.map(s => (
            <div key={s.code} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-400">{s.code}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{Number(s.price).toFixed(2)}</div>
                <div className={`text-xs font-bold ${Number(s.changePercent) >= 0 ? 'rise' : 'fall'}`}>
                  {Number(s.changePercent) >= 0 ? '+' : ''}{Number(s.changePercent).toFixed(2)}%
                </div>
              </div>
            </div>
          )) : <div className="text-center text-gray-400 text-xs py-4">加载中...</div>
        ) : (
          topFunds ? topFunds.map(f => (
            <div key={f.code} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{f.name}</div>
                <div className="text-xs text-gray-400">{f.code}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${Number(f.dayChange) >= 0 ? 'rise' : 'fall'}`}>
                  {Number(f.dayChange) >= 0 ? '+' : ''}{Number(f.dayChange).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-400">近1月 {Number(f.monthChange) >= 0 ? '+' : ''}{Number(f.monthChange).toFixed(2)}%</div>
              </div>
            </div>
          )) : <div className="text-center text-gray-400 text-xs py-4">加载中...</div>
        )}
      </div>

      {/* Hot Industries */}
      <div className="card mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-bold text-gray-800">🔥 实时热点板块</div>
          <button onClick={loadRealData} className="text-xs text-accent flex items-center gap-1">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> 刷新
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-1">
          <span>行业</span><span>涨幅</span><span>领涨股</span>
        </div>
        {(sectors || hotIndustries).slice(0, 5).map(ind => (
          <div
            key={ind.name}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer"
            onClick={() => navigate('/screening', { state: { industry: ind.name } })}
          >
            <span className="text-sm text-gray-800 w-16">{ind.name}</span>
            <span className={`text-sm font-bold ${ind.changePercent >= 0 ? 'rise' : 'fall'}`}>
              {ind.changePercent >= 0 ? '+' : ''}{Number(ind.changePercent).toFixed(2)}%
            </span>
            <span className="text-xs text-gray-500">{ind.leadStock || '--'}
              {ind.leadChange > 0 && <span className="rise ml-1">+{Number(ind.leadChange).toFixed(2)}%</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Hot Funds */}
      <div className="card mb-3">
        <div className="text-sm font-bold text-gray-800 mb-2">📈 基金热销榜 TOP5</div>
        {(topFunds || hotFunds).slice(0, 5).map(f => (
          <div
            key={f.code}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer"
            onClick={() => navigate('/market', { state: { tab: 'fund' } })}
          >
            <div>
              <div className="text-sm text-gray-800">{f.name}</div>
              <div className="text-xs text-gray-400">{f.fundType || f.type}</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-bold ${(f.dayChange || 0) >= 0 ? 'rise' : 'fall'}`}>
                {f.dayChange >= 0 ? '+' : ''}{Number(f.dayChange).toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400">近1月 {f.monthChange >= 0 ? '+' : ''}{Number(f.monthChange).toFixed(2)}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button onClick={() => navigate('/screening')} className="card flex flex-col items-center py-3 active:bg-gray-50">
          <Filter size={20} className="text-primary mb-1" />
          <span className="text-xs text-gray-600">快速筛选</span>
        </button>
        <button onClick={() => navigate('/my')} className="card flex flex-col items-center py-3 active:bg-gray-50">
          <Star size={20} className="text-yellow-500 mb-1" />
          <span className="text-xs text-gray-600">我的收藏</span>
        </button>
        <button onClick={() => navigate('/my')} className="card flex flex-col items-center py-3 active:bg-gray-50">
          <Shield size={20} className="text-rise mb-1" />
          <span className="text-xs text-gray-600">风险中心</span>
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-sm px-6 py-3 rounded-lg z-[200]">
          {toast}
        </div>
      )}
    </div>
  )
}
