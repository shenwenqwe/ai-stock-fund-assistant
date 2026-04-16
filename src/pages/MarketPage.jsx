import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, ArrowUpDown, RefreshCw } from 'lucide-react'
import { stockList, fundList } from '../data/mockData'
import { fetchStocks, fetchFunds, searchStock } from '../api/client'

const stockTabs = ['沪深A股', '科创板', '创业板', '行业板块']
const fundTabs = ['股票型', '混合型', '指数型', '债券型']
const sortOptions = [
  { key: 'changePercent', label: '涨幅' },
  { key: 'price', label: '价格' },
  { key: 'volume', label: '成交量' },
]
const sortFieldMap = { changePercent: 'f3', price: 'f2', volume: 'f5' }
const fundTypeMap = { 0: '', 1: '1', 2: '2', 3: '3', 4: '4' }

export default function MarketPage() {
  const location = useLocation()
  const initialTab = location.state?.tab || 'stock'
  const [mainTab, setMainTab] = useState(initialTab)
  const [subTab, setSubTab] = useState(0)
  const [sortBy, setSortBy] = useState('changePercent')
  const [sortAsc, setSortAsc] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [realStocks, setRealStocks] = useState(null)
  const [realFunds, setRealFunds] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadStocks = useCallback(async () => {
    setLoading(true)
    const data = await fetchStocks({ size: 30, sort: sortFieldMap[sortBy] || 'f3', order: sortAsc ? '1' : '0' })
    if (data) setRealStocks(data)
    setLoading(false)
  }, [sortBy, sortAsc])

  const loadFunds = useCallback(async () => {
    setLoading(true)
    const data = await fetchFunds({ size: 30, type: fundTypeMap[subTab] || '' })
    if (data) setRealFunds(data)
    setLoading(false)
  }, [subTab])

  useEffect(() => {
    if (mainTab === 'stock') loadStocks()
    else loadFunds()
  }, [mainTab, loadStocks, loadFunds])

  useEffect(() => {
    const timer = setInterval(() => {
      if (mainTab === 'stock') loadStocks()
      else loadFunds()
    }, 30000)
    return () => clearInterval(timer)
  }, [mainTab, loadStocks, loadFunds])

  const handleSort = (key) => {
    if (sortBy === key) setSortAsc(!sortAsc)
    else { setSortBy(key); setSortAsc(false) }
  }

  const stocks = (realStocks || stockList)
    .filter(s => !searchTerm || s.name.includes(searchTerm) || s.code.includes(searchTerm))

  const funds = (realFunds || fundList)
    .filter(f => !searchTerm || f.name.includes(searchTerm) || f.code.includes(searchTerm))

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="搜索股票/基金名称或代码"
            className="flex-1 text-sm outline-none bg-transparent"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Tab */}
      <div className="flex gap-4 mb-3">
        <button
          onClick={() => setMainTab('stock')}
          className={`text-sm font-bold pb-1 border-b-2 ${
            mainTab === 'stock' ? 'text-primary border-primary' : 'text-gray-400 border-transparent'
          }`}
        >股票行情</button>
        <button
          onClick={() => setMainTab('fund')}
          className={`text-sm font-bold pb-1 border-b-2 ${
            mainTab === 'fund' ? 'text-primary border-primary' : 'text-gray-400 border-transparent'
          }`}
        >基金行情</button>
      </div>

      {mainTab === 'stock' ? (
        <>
          {/* Sub Tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {stockTabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setSubTab(i)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                  subTab === i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >{t}</button>
            ))}
          </div>

          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              {sortOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleSort(opt.key)}
                  className={`flex items-center gap-0.5 ${sortBy === opt.key ? 'text-primary font-bold' : ''}`}
                >
                  {opt.label}
                  <ArrowUpDown size={10} />
                </button>
              ))}
            </div>
            <button onClick={loadStocks} className="text-accent flex items-center gap-1">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> 刷新
            </button>
          </div>

          {/* Stock List */}
          <div className="card">
            <div className="grid grid-cols-12 text-xs text-gray-400 pb-2 border-b border-gray-100">
              <span className="col-span-4">名称/代码</span>
              <span className="col-span-3 text-right">最新价</span>
              <span className="col-span-3 text-right">涨跌幅</span>
              <span className="col-span-2 text-right">成交量</span>
            </div>
            {stocks.map(s => (
              <div key={s.code} className="grid grid-cols-12 items-center py-2.5 border-b border-gray-50 last:border-0">
                <div className="col-span-4">
                  <div className="text-sm text-gray-900 font-medium">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.code}</div>
                </div>
                <div className={`col-span-3 text-right text-sm font-bold ${Number(s.changePercent) >= 0 ? 'rise' : 'fall'}`}>
                  {Number(s.price).toFixed(2)}
                </div>
                <div className={`col-span-3 text-right text-sm font-bold ${Number(s.changePercent) >= 0 ? 'rise' : 'fall'}`}>
                  {Number(s.changePercent) >= 0 ? '+' : ''}{Number(s.changePercent).toFixed(2)}%
                </div>
                <div className="col-span-2 text-right text-xs text-gray-400">{s.volume}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Fund Sub Tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {['全部', ...fundTabs].map((t, i) => (
              <button
                key={t}
                onClick={() => setSubTab(i)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                  subTab === i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >{t}</button>
            ))}
          </div>

          {/* Fund List */}
          <div className="card">
            <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-100">
              <span>基金名称/净值</span>
              <div className="flex gap-4">
                <span>日涨幅</span><span>近1周</span><span>近1月</span>
              </div>
            </div>
            {funds.map(f => (
              <div key={f.code} className="py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-900 font-medium truncate max-w-[140px]">{f.name}</div>
                    <div className="text-xs text-gray-400">{f.code} · {f.fundType || f.type}</div>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div className={`text-sm font-bold ${Number(f.dayChange) >= 0 ? 'rise' : 'fall'}`}>
                      {Number(f.dayChange) >= 0 ? '+' : ''}{Number(f.dayChange).toFixed(2)}%
                    </div>
                    <div className={`text-xs ${Number(f.weekChange) >= 0 ? 'rise' : 'fall'} w-12`}>
                      {Number(f.weekChange) >= 0 ? '+' : ''}{Number(f.weekChange).toFixed(2)}%
                    </div>
                    <div className={`text-xs ${Number(f.monthChange) >= 0 ? 'rise' : 'fall'} w-12`}>
                      {Number(f.monthChange) >= 0 ? '+' : ''}{Number(f.monthChange).toFixed(2)}%
                    </div>
                  </div>
                </div>
                {/* Top Holdings */}
                {f.topHoldings && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-400">重仓:</span>
                    {f.topHoldings.slice(0, 3).map((h, i) => (
                      <span key={i} className="text-xs text-primary bg-blue-50 px-1.5 py-0.5 rounded">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
