import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Filter, Star, Shield, RefreshCw, TrendingUp, Clock } from 'lucide-react'
import { fetchIndices, fetchSectors, fetchStocks, fetchFunds } from '../api/client'
import IndexBar from '../components/IndexBar'
import MiniTrendChart from '../components/MiniTrendChart'

export default function HomePage() {
  const navigate = useNavigate()
  const [tabType, setTabType] = useState('stock')
  const [toast, setToast] = useState('')
  const [indices, setIndices] = useState(null)
  const [sectors, setSectors] = useState(null)
  const [topStocks, setTopStocks] = useState(null)
  const [topFunds, setTopFunds] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedCode, setExpandedCode] = useState(null)
  const [lastUpdate, setLastUpdate] = useState('')

  function getMarketStatus() {
    const now = new Date()
    const h = now.getHours(), m = now.getMinutes()
    const t = h * 100 + m
    if (t >= 930 && t < 1130) return 'open'
    if (t >= 1300 && t < 1500) return 'open'
    if (t >= 1130 && t < 1300) return 'break'
    return 'closed'
  }

  const marketStatus = getMarketStatus()
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日`

  useEffect(() => {
    loadRealData()
    const interval = marketStatus === 'open' ? 10000 : 60000
    const timer = setInterval(loadRealData, interval)
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
    const now = new Date()
    setLastUpdate(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`)
    setLoading(false)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  const toggleChart = (code) => {
    setExpandedCode(prev => prev === code ? null : code)
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

      {/* Daily AI Recommendations */}
      <div className="card mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <TrendingUp size={16} className="text-primary" />
            <span className="text-sm font-bold text-gray-800">每日精选推荐 TOP10</span>
          </div>
          <button onClick={loadRealData} className="text-xs text-accent flex items-center gap-1">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> 刷新
          </button>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Clock size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">{dateStr} {marketStatus === 'open' ? '🟢 交易中' : marketStatus === 'break' ? '🟡 午间休市' : '🔴 已收盘'}</span>
          </div>
          <div className="flex items-center gap-1">
            {marketStatus === 'open' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
            <span className="text-xs text-gray-400">更新 {lastUpdate || '--:--:--'}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setTabType('stock'); setExpandedCode(null) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              tabType === 'stock' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >📊 股票 TOP10</button>
          <button
            onClick={() => { setTabType('fund'); setExpandedCode(null) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              tabType === 'fund' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >📈 基金 TOP10</button>
        </div>

        {tabType === 'stock' ? (
          topStocks ? topStocks.map((s, i) => (
            <div key={s.code} className="border-b border-gray-50 last:border-0">
              <div
                className="flex items-center justify-between py-2.5 cursor-pointer active:bg-gray-50"
                onClick={() => toggleChart(s.code)}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? 'bg-rise text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{i+1}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.code}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{Number(s.price).toFixed(2)}</div>
                  <div className={`text-xs font-bold ${Number(s.changePercent) >= 0 ? 'rise' : 'fall'}`}>
                    {Number(s.changePercent) >= 0 ? '+' : ''}{Number(s.changePercent).toFixed(2)}%
                  </div>
                </div>
              </div>
              {expandedCode === s.code && (
                <div className="pb-2 px-1">
                  <div className="text-xs text-gray-400 mb-1">📈 今日分时走势</div>
                  <MiniTrendChart code={s.code} type="stock" height={100} />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>开 {Number(s.open).toFixed(2)}</span>
                    <span>高 {Number(s.high).toFixed(2)}</span>
                    <span>低 {Number(s.low).toFixed(2)}</span>
                    <span>量 {s.volume}</span>
                  </div>
                </div>
              )}
            </div>
          )) : <div className="text-center text-gray-400 text-xs py-6">
            <RefreshCw size={16} className="animate-spin mx-auto mb-1" />加载实时数据中...
          </div>
        ) : (
          topFunds ? topFunds.map((f, i) => (
            <div key={f.code} className="border-b border-gray-50 last:border-0">
              <div
                className="flex items-center justify-between py-2.5 cursor-pointer active:bg-gray-50"
                onClick={() => toggleChart(f.code)}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{i+1}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{f.name}</div>
                    <div className="text-xs text-gray-400">{f.code}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${Number(f.dayChange) >= 0 ? 'rise' : 'fall'}`}>
                    {Number(f.dayChange) >= 0 ? '+' : ''}{Number(f.dayChange).toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400">近1月 {Number(f.monthChange) >= 0 ? '+' : ''}{Number(f.monthChange).toFixed(2)}%</div>
                </div>
              </div>
              {expandedCode === f.code && (
                <div className="pb-2 px-1">
                  <div className="text-xs text-gray-400 mb-1">📈 近30日净值走势</div>
                  <MiniTrendChart code={f.code} type="fund" height={100} />
                </div>
              )}
            </div>
          )) : <div className="text-center text-gray-400 text-xs py-6">
            <RefreshCw size={16} className="animate-spin mx-auto mb-1" />加载实时数据中...
          </div>
        )}

        <div className="text-center mt-2">
          <span className="text-xs text-gray-300">点击任一行展开查看走势图</span>
        </div>
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
        {sectors ? sectors.slice(0, 5).map(ind => (
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
        )) : <div className="text-center text-gray-400 text-xs py-4">加载中...</div>}
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
